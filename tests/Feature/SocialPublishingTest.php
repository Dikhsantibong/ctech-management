<?php

namespace Tests\Feature;

use App\Jobs\PublishContentPlanJob;
use App\Models\ContentPlan;
use App\Models\SocialAccount;
use App\Models\SocialPost;
use App\Models\User;
use App\Services\Social\SocialPublishingService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SocialPublishingTest extends TestCase
{
    use DatabaseTransactions;

    private function actor(): User
    {
        try {
            $user = User::first();
        } catch (\Throwable $e) {
            $this->markTestSkipped('Database belum tersedia: ' . $e->getMessage());
        }

        if (! $user) {
            $this->markTestSkipped('Tidak ada data user untuk diuji.');
        }

        $user->forceFill(['role' => 'marketing'])->save();
        app(\App\Services\MenuAccess::class)->forget();

        return $user;
    }

    private function enableAccount(string $platform, array $credentials = []): SocialAccount
    {
        return SocialAccount::updateOrCreate(
            ['platform' => $platform],
            ['is_enabled' => true, 'credentials' => $credentials, 'display_name' => $platform],
        );
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Konten uji sosial',
            'platform' => 'Instagram',
            'content_type' => 'Post',
            'status' => 'Draft',
        ], $overrides);
    }

    /** Sakelar utama mati = tidak ada apa pun yang dikirim, konten tetap tersimpan. */
    public function test_nothing_is_dispatched_when_feature_is_disabled(): void
    {
        config(['social.enabled' => false]);
        Queue::fake();

        $user = $this->actor();
        $this->enableAccount('facebook', ['page_id' => '1', 'access_token' => 'x']);

        $this->actingAs($user)
            ->post('/content-plans', $this->payload(['status' => 'Published', 'auto_publish' => true]))
            ->assertRedirect();

        Queue::assertNothingPushed();
        $this->assertNotNull(ContentPlan::latest('id')->first(), 'Konten harus tetap tersimpan');
    }

    /** Tanpa auto_publish, mengubah status jadi Tayang tidak mengirim apa pun. */
    public function test_auto_publish_off_does_not_dispatch(): void
    {
        config(['social.enabled' => true]);
        Queue::fake();

        $user = $this->actor();
        $this->enableAccount('facebook', ['page_id' => '1', 'access_token' => 'x']);

        $this->actingAs($user)
            ->post('/content-plans', $this->payload(['status' => 'Published', 'auto_publish' => false]))
            ->assertRedirect();

        Queue::assertNothingPushed();
    }

    public function test_auto_publish_queues_one_job_per_platform(): void
    {
        config(['social.enabled' => true]);
        Queue::fake();

        $user = $this->actor();
        $this->enableAccount('facebook', ['page_id' => '1', 'access_token' => 'x']);
        $this->enableAccount('linkedin', ['organization_id' => '9', 'access_token' => 'x']);

        $this->actingAs($user)
            ->post('/content-plans', $this->payload([
                'status' => 'Published',
                'auto_publish' => true,
                'publish_targets' => ['facebook', 'linkedin'],
            ]))
            ->assertRedirect();

        Queue::assertPushed(PublishContentPlanJob::class, 2);

        $plan = ContentPlan::latest('id')->first();
        $this->assertSame(2, SocialPost::where('content_plan_id', $plan->id)->count());
    }

    /** Menyunting konten yang sudah tayang tidak boleh memposting ulang. */
    public function test_editing_an_already_published_plan_does_not_repost(): void
    {
        config(['social.enabled' => true]);
        $user = $this->actor();
        $this->enableAccount('facebook', ['page_id' => '1', 'access_token' => 'x']);

        $plan = ContentPlan::create([
            'title' => 'Sudah tayang',
            'platform' => 'Instagram',
            'content_type' => 'Post',
            'status' => 'Published',
            'auto_publish' => true,
            'created_by' => $user->id,
        ]);

        Queue::fake();

        $this->actingAs($user)
            ->put("/content-plans/{$plan->id}", $this->payload([
                'title' => 'Sudah tayang (revisi caption)',
                'status' => 'Published',
                'auto_publish' => true,
            ]))
            ->assertRedirect();

        Queue::assertNothingPushed();
    }

    /** Mode simulasi menjalankan alur penuh tanpa memanggil API mana pun. */
    public function test_simulation_marks_post_as_published_without_calling_any_api(): void
    {
        config(['social.enabled' => true, 'social.simulate' => true]);

        $user = $this->actor();
        $this->enableAccount('facebook');

        $plan = ContentPlan::create([
            'title' => 'Konten simulasi',
            'description' => 'Caption',
            'platform' => 'Facebook',
            'content_type' => 'Post',
            'status' => 'Draft',
            'created_by' => $user->id,
        ]);

        $post = SocialPost::create([
            'content_plan_id' => $plan->id,
            'platform' => 'facebook',
            'status' => SocialPost::STATUS_PENDING,
        ]);

        (new PublishContentPlanJob($post->id))->handle(app(SocialPublishingService::class));

        $post->refresh();

        $this->assertSame(SocialPost::STATUS_PUBLISHED, $post->status);
        $this->assertTrue($post->simulated, 'Harus ditandai sebagai simulasi');
        $this->assertStringStartsWith('sim_', (string) $post->external_post_id);
    }

    /** Kredensial tidak lengkap otomatis jatuh ke simulasi, bukan memanggil API yang pasti gagal. */
    public function test_incomplete_credentials_fall_back_to_simulation(): void
    {
        config(['social.enabled' => true, 'social.simulate' => false]);

        $account = $this->enableAccount('facebook', ['page_id' => '123']); // token kosong

        $publisher = app(SocialPublishingService::class)->resolvePublisher($account);

        $this->assertInstanceOf(\App\Services\Social\Publishers\SimulationPublisher::class, $publisher);
    }

    /** Instagram wajib media — kegagalan ini tidak boleh diulang terus-menerus. */
    public function test_instagram_without_media_fails_permanently(): void
    {
        config(['social.enabled' => true, 'social.simulate' => true]);

        $user = $this->actor();
        $this->enableAccount('instagram');

        $plan = ContentPlan::create([
            'title' => 'Tanpa media',
            'platform' => 'Instagram',
            'content_type' => 'Post',
            'status' => 'Draft',
            'created_by' => $user->id,
        ]);

        $post = SocialPost::create([
            'content_plan_id' => $plan->id,
            'platform' => 'instagram',
            'status' => SocialPost::STATUS_PENDING,
        ]);

        (new PublishContentPlanJob($post->id))->handle(app(SocialPublishingService::class));

        $post->refresh();

        $this->assertSame(SocialPost::STATUS_FAILED, $post->status);
        $this->assertStringContainsString('media', mb_strtolower((string) $post->message));
    }

    public function test_media_upload_is_stored_and_exposed_as_public_url(): void
    {
        Storage::fake('public');
        config(['social.enabled' => true]);

        $user = $this->actor();

        $this->actingAs($user)
            ->post('/content-plans', $this->payload([
                'media' => UploadedFile::fake()->image('promo.jpg', 800, 800),
            ]))
            ->assertRedirect();

        $plan = ContentPlan::latest('id')->first();

        $this->assertNotNull($plan->media_path);
        Storage::disk('public')->assertExists($plan->media_path);

        $url = app(SocialPublishingService::class)->mediaUrlFor($plan);
        $this->assertStringStartsWith('http', (string) $url);
    }

    /** Token tidak boleh pernah sampai ke frontend. */
    public function test_credentials_are_never_sent_to_the_browser(): void
    {
        $user = $this->actor();
        $this->enableAccount('facebook', ['page_id' => 'RAHASIA123', 'access_token' => 'TOKEN_RAHASIA']);

        $response = $this->actingAs($user)->get('/social-accounts')->assertStatus(200);

        $response->assertDontSee('TOKEN_RAHASIA');
        $response->assertDontSee('RAHASIA123');

        $props = $response->viewData('page')['props'];
        foreach ($props['platforms'] as $platform) {
            $this->assertArrayNotHasKey('credentials', $platform);
        }
    }

    /** Kredensial disimpan terenkripsi di database. */
    public function test_credentials_are_encrypted_at_rest(): void
    {
        $this->enableAccount('facebook', ['page_id' => '1', 'access_token' => 'TOKEN_RAHASIA']);

        $raw = \DB::table('social_accounts')->where('platform', 'facebook')->value('credentials');

        $this->assertStringNotContainsString('TOKEN_RAHASIA', (string) $raw);
    }

    /** Kegagalan menjadwalkan tidak boleh menggagalkan penyimpanan konten. */
    public function test_dispatch_never_throws(): void
    {
        config(['social.enabled' => true]);

        $user = $this->actor();
        $plan = ContentPlan::create([
            'title' => 'Tanpa akun aktif',
            'platform' => 'Instagram',
            'content_type' => 'Post',
            'status' => 'Published',
            'created_by' => $user->id,
        ]);

        SocialAccount::query()->update(['is_enabled' => false]);

        $result = app(SocialPublishingService::class)->dispatchFor($plan, ['facebook']);

        $this->assertSame(0, $result['queued']);
        $this->assertNotEmpty($result['skipped']);
    }
}

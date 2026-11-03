<?php

namespace Tests\Feature;

use App\Models\News;
use App\Models\User;
use App\Services\MenuAccess;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class NewsSocialSharingTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();

        config(['app.url' => 'https://ctechcreative.com']);
        Storage::fake('public');
        $this->withoutVite();
    }

    private function actor(): User
    {
        try {
            $user = User::first() ?? User::factory()->create();
        } catch (\Throwable $e) {
            $this->markTestSkipped('Database belum tersedia: '.$e->getMessage());
        }

        $user->forceFill(['role' => 'direktur_utama'])->save();
        app(MenuAccess::class)->forget();

        return $user;
    }

    private function article(array $overrides = []): News
    {
        $author = $this->actor();

        return News::create(array_merge([
            'title' => 'Transformasi Digital Bersama CTECH',
            'slug' => 'transformasi-digital-bersama-ctech-'.uniqid(),
            'content' => '<p>Isi <strong>artikel</strong> tentang transformasi digital.</p>',
            'category' => 'Berita',
            'status' => 'Published',
            'author_id' => $author->id,
            'published_at' => now(),
        ], $overrides));
    }

    public function test_initial_html_contains_dynamic_open_graph_twitter_and_json_ld(): void
    {
        $news = $this->article([
            'seo_title' => 'Judul SEO Transformasi',
            'seo_description' => 'Deskripsi SEO khusus artikel ini.',
            'image' => UploadedFile::fake()->image('cover.jpg', 1600, 900)->store('news-images', 'public'),
        ]);
        $other = $this->article(['title' => 'Artikel Lain', 'seo_description' => 'Deskripsi artikel lain.']);

        $canonical = "https://ctechcreative.com/berita/{$news->slug}";
        $imageUrl = 'https://ctechcreative.com/storage/'.$news->image;

        $this->get("/berita/{$news->slug}")
            ->assertOk()
            ->assertSee('<meta property="og:type" content="article">', false)
            ->assertSee('<meta property="og:site_name" content="CTECH">', false)
            ->assertSee('<meta property="og:title" content="Judul SEO Transformasi">', false)
            ->assertSee('<meta property="og:description" content="Deskripsi SEO khusus artikel ini.">', false)
            ->assertSee('<meta property="og:url" content="'.$canonical.'">', false)
            ->assertSee('<link rel="canonical" href="'.$canonical.'">', false)
            ->assertSee('<meta property="og:image" content="'.$imageUrl.'">', false)
            ->assertSee('<meta property="og:image:width" content="1600">', false)
            ->assertSee('<meta name="twitter:card" content="summary_large_image">', false)
            ->assertSee('<meta name="twitter:image" content="'.$imageUrl.'">', false)
            ->assertSee('<meta property="article:section" content="Berita">', false)
            ->assertSee('"@type":"NewsArticle"', false)
            ->assertSee('"mainEntityOfPage":{"@type":"WebPage","@id":"'.$canonical.'"}', false)
            ->assertDontSee('content="Deskripsi artikel lain."', false);

        $this->get("/berita/{$other->slug}")
            ->assertSee('<meta property="og:title" content="Artikel Lain">', false)
            ->assertDontSee('content="Judul SEO Transformasi"', false);
    }

    public function test_falls_back_to_content_excerpt_and_default_image(): void
    {
        $news = $this->article(['category' => 'Artikel']);

        $this->get("/berita/{$news->slug}")
            ->assertOk()
            ->assertSee('<meta property="og:description" content="Isi artikel tentang transformasi digital.">', false)
            ->assertSee('<meta property="og:image" content="https://ctechcreative.com/images/og-default.jpg">', false)
            ->assertSee('"@type":"BlogPosting"', false);
    }

    public function test_draft_article_is_not_exposed_publicly(): void
    {
        $news = $this->article(['status' => 'Draft', 'published_at' => null]);

        $this->get("/berita/{$news->slug}")->assertNotFound();
        $this->get("/berita/{$news->slug}/story.jpg")->assertNotFound();
    }

    public function test_upload_generates_1200x630_share_image_and_story_image_is_portrait(): void
    {
        $this->actingAs($this->actor())->post('/news', [
            'title' => 'Artikel Dengan Gambar',
            'content' => '<p>Isi</p>',
            'status' => 'Published',
            'image' => UploadedFile::fake()->image('cover.png', 800, 800),
        ])->assertRedirect();

        $news = News::where('title', 'Artikel Dengan Gambar')->firstOrFail();
        $this->assertNotNull($news->social_image);
        $this->assertSame([1200, 630], array_slice(getimagesize(Storage::disk('public')->path($news->social_image)), 0, 2));

        $story = $this->get("/berita/{$news->slug}/story.jpg")->assertOk();
        $this->assertSame([1080, 1920], array_slice(getimagesize($story->getFile()->getPathname()), 0, 2));
    }

    public function test_slug_stays_stable_after_publication(): void
    {
        $news = $this->article();

        $this->actingAs($this->actor())->post("/news/{$news->id}?_method=PUT", [
            'title' => 'Judul Baru Setelah Terbit',
            'content' => '<p>Isi baru</p>',
            'status' => 'Published',
        ])->assertRedirect();

        $this->assertSame($news->slug, $news->fresh()->slug);
    }

    public function test_share_preview_reports_meta_and_checks(): void
    {
        Http::fake(['*' => Http::response('', 200, ['Content-Type' => 'image/jpeg'])]);
        $news = $this->article(['seo_title' => 'Judul SEO']);

        $this->actingAs($this->actor())
            ->getJson("/news/{$news->id}/share-preview")
            ->assertOk()
            ->assertJsonPath('meta.title', 'Judul SEO')
            ->assertJsonPath('meta.url', "https://ctechcreative.com/berita/{$news->slug}")
            ->assertJsonFragment(['key' => 'image_public', 'status' => 'pass'])
            ->assertJsonFragment(['key' => 'featured_image', 'status' => 'warn']);
    }

    public function test_share_preview_requires_authentication(): void
    {
        $news = $this->article();
        auth()->logout();

        $this->get("/news/{$news->id}/share-preview")->assertRedirect();
    }
}

<?php

namespace Tests\Feature;

use App\Events\ChatMessageSent;
use App\Events\ChatMessagesRead;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Contracts\Broadcasting\Factory as BroadcastFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia;
use RuntimeException;
use Tests\TestCase;

class ChatTest extends TestCase
{
    use RefreshDatabase;

    private User $alice;

    private User $bob;

    private ChatConversation $conversation;

    protected function setUp(): void
    {
        parent::setUp();

        $this->alice = User::factory()->create(['role' => 'operation']);
        $this->bob = User::factory()->create(['role' => 'marketing']);
        $this->conversation = ChatConversation::between($this->alice, $this->bob);
    }

    private function sendAs(User $user, array $data = ['body' => 'Halo, rapat jam 3 ya'])
    {
        return $this->actingAs($user)->postJson("/chat/conversations/{$this->conversation->id}/messages", $data);
    }

    // ===== Privasi: hanya dua peserta =====

    public function test_participants_can_exchange_messages(): void
    {
        $this->sendAs($this->alice)->assertCreated()->assertJsonPath('message.body', 'Halo, rapat jam 3 ya');

        $this->actingAs($this->bob)
            ->getJson("/chat/conversations/{$this->conversation->id}/messages")
            ->assertOk()
            ->assertJsonPath('messages.0.body', 'Halo, rapat jam 3 ya')
            ->assertJsonPath('messages.0.mine', false);
    }

    public function test_nobody_else_can_read_or_write_even_the_director(): void
    {
        $message = ChatMessage::factory()->for($this->conversation, 'conversation')->create(['sender_id' => $this->alice->id]);

        foreach ([User::factory()->create(['role' => 'operation']), User::factory()->create(['role' => 'direktur_utama'])] as $outsider) {
            $this->actingAs($outsider)->getJson("/chat/conversations/{$this->conversation->id}/messages")->assertNotFound();
            $this->actingAs($outsider)->getJson("/chat/sync?conversation={$this->conversation->id}")->assertNotFound();
            $this->actingAs($outsider)->postJson("/chat/conversations/{$this->conversation->id}/messages", ['body' => 'x'])->assertNotFound();
            $this->actingAs($outsider)->postJson("/chat/conversations/{$this->conversation->id}/read")->assertNotFound();
            $this->actingAs($outsider)->postJson("/chat/conversations/{$this->conversation->id}/typing")->assertNotFound();
            $this->actingAs($outsider)->get("/chat/attachments/{$message->id}")->assertNotFound();

            $this->actingAs($outsider)->getJson('/chat/sync')->assertOk()->assertJsonCount(0, 'conversations');
        }

        $this->assertSame(1, ChatMessage::count(), 'Orang luar tidak boleh bisa menambah pesan');
    }

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get('/chat')->assertRedirect(route('login'));
        $this->getJson("/chat/conversations/{$this->conversation->id}/messages")->assertUnauthorized();
    }

    public function test_message_body_is_encrypted_in_the_database(): void
    {
        $this->sendAs($this->alice, ['body' => 'Password wifi kantor: rahasia123'])->assertCreated();

        $raw = DB::table('chat_messages')->value('body');

        $this->assertStringNotContainsString('rahasia123', $raw);
        $this->assertSame('Password wifi kantor: rahasia123', ChatMessage::first()->body);
    }

    public function test_realtime_channel_belongs_only_to_its_owner(): void
    {
        $authorize = Broadcast::driver()->getChannels()->get('chat.user.{id}');

        $this->assertTrue($authorize($this->alice, $this->alice->id));
        $this->assertFalse($authorize($this->bob, $this->alice->id));
    }

    public function test_realtime_event_never_carries_message_content(): void
    {
        Event::fake([ChatMessageSent::class]);

        $this->sendAs($this->alice, ['body' => 'Isi sangat pribadi'])->assertCreated();

        Event::assertDispatched(ChatMessageSent::class, function (ChatMessageSent $event): bool {
            $payload = json_encode($event->broadcastWith());

            return $event->recipientId === $this->bob->id
                && ! str_contains($payload, 'pribadi')
                && array_keys($event->broadcastWith()) === ['conversation_id', 'message_id', 'sender_id'];
        });
    }

    public function test_sending_still_works_when_pusher_is_down(): void
    {
        $this->mock(BroadcastFactory::class)->shouldReceive('queue')->andThrow(new RuntimeException('Pusher tidak bisa dihubungi'));

        $this->sendAs($this->alice)->assertCreated();

        $this->assertSame(1, ChatMessage::count());
    }

    // ===== Lampiran =====

    public function test_attachments_are_encrypted_on_disk_and_only_participants_can_download(): void
    {
        Storage::fake('local');
        $file = UploadedFile::fake()->createWithContent('laporan.pdf', '%PDF-1.4 isi laporan keuangan');

        $this->sendAs($this->alice, ['file' => $file])->assertCreated()->assertJsonPath('message.attachment.name', 'laporan.pdf');

        $message = ChatMessage::firstOrFail();
        $stored = Storage::disk('local')->get($message->attachment_path);

        $this->assertStringNotContainsString('laporan keuangan', $stored, 'Isi file harus terenkripsi di disk');
        $this->assertStringNotContainsString('laporan.pdf', (string) DB::table('chat_messages')->value('attachment_name'));

        $download = $this->actingAs($this->bob)->get("/chat/attachments/{$message->id}");
        $download->assertOk()->assertHeader('X-Content-Type-Options', 'nosniff');
        $this->assertSame('%PDF-1.4 isi laporan keuangan', $download->getContent());
        $this->assertStringContainsString('attachment;', $download->headers->get('Content-Disposition'));
    }

    public function test_unsafe_or_oversized_files_are_rejected(): void
    {
        Storage::fake('local');

        $this->sendAs($this->alice, ['file' => UploadedFile::fake()->createWithContent('x.svg', '<svg onload="alert(1)"></svg>')])
            ->assertUnprocessable()->assertJsonValidationErrors('file');

        $this->sendAs($this->alice, ['file' => UploadedFile::fake()->create('besar.pdf', 11 * 1024, 'application/pdf')])
            ->assertUnprocessable()->assertJsonValidationErrors('file');

        $this->sendAs($this->alice, ['body' => '   '])->assertUnprocessable()->assertJsonValidationErrors('body');

        $this->assertSame(0, ChatMessage::count());
    }

    // ===== Dibaca, mengetik, badge =====

    public function test_reading_marks_only_the_other_persons_messages_and_notifies_the_sender(): void
    {
        Event::fake([ChatMessagesRead::class]);

        $fromAlice = ChatMessage::factory()->for($this->conversation, 'conversation')->create(['sender_id' => $this->alice->id]);
        $fromBob = ChatMessage::factory()->for($this->conversation, 'conversation')->create(['sender_id' => $this->bob->id]);

        $this->actingAs($this->bob)->getJson('/chat/unread')->assertJsonPath('unread', 1);

        $this->actingAs($this->bob)
            ->postJson("/chat/conversations/{$this->conversation->id}/read")
            ->assertOk()
            ->assertJsonPath('read_up_to', $fromAlice->id)
            ->assertJsonPath('unread', 0);

        $this->assertNotNull($fromAlice->fresh()->read_at);
        $this->assertNull($fromBob->fresh()->read_at, 'Pesan sendiri tidak ikut ditandai dibaca');

        Event::assertDispatched(ChatMessagesRead::class, fn (ChatMessagesRead $event): bool => $event->senderId === $this->alice->id);

        $this->actingAs($this->alice)
            ->getJson("/chat/conversations/{$this->conversation->id}/messages")
            ->assertJsonPath('other_read_up_to', $fromAlice->id);
    }

    public function test_sync_returns_new_messages_and_typing_state(): void
    {
        $first = ChatMessage::factory()->for($this->conversation, 'conversation')->create(['sender_id' => $this->alice->id]);

        $this->actingAs($this->alice)->postJson("/chat/conversations/{$this->conversation->id}/typing")->assertNoContent();
        $second = ChatMessage::factory()->for($this->conversation, 'conversation')->create(['sender_id' => $this->alice->id, 'body' => 'Pesan kedua']);

        $this->actingAs($this->bob)
            ->getJson("/chat/sync?conversation={$this->conversation->id}&after={$first->id}")
            ->assertOk()
            ->assertJsonCount(1, 'thread.messages')
            ->assertJsonPath('thread.messages.0.id', $second->id)
            ->assertJsonPath('thread.typing', true)
            ->assertJsonPath('unread', 2);
    }

    public function test_unread_badge_is_shared_with_every_page(): void
    {
        ChatMessage::factory()->for($this->conversation, 'conversation')->count(3)->create(['sender_id' => $this->alice->id]);

        $this->actingAs($this->bob)
            ->get('/chat')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('chat/index')
                ->where('chatState.unread', 3)
                ->has('contacts', 1)
                ->has('conversations', 1));
    }

    // ===== Memulai percakapan =====

    public function test_starting_a_conversation_reuses_the_existing_pair(): void
    {
        $this->actingAs($this->bob)
            ->postJson('/chat/conversations', ['user_id' => $this->alice->id])
            ->assertOk()
            ->assertJsonPath('conversation.id', $this->conversation->id)
            ->assertJsonPath('conversation.other.id', $this->alice->id);

        $this->assertSame(1, ChatConversation::count());
    }

    public function test_every_role_can_open_chat_and_message_anyone(): void
    {
        foreach (['direktur_utama', 'operation', 'marketing', 'administrasi'] as $role) {
            $user = User::factory()->create(['role' => $role]);

            $this->actingAs($user)->get('/chat')->assertOk()
                ->assertInertia(fn (AssertableInertia $page) => $page->component('chat/index')->has('contacts', User::count() - 1));

            $this->actingAs($user)->postJson('/chat/conversations', ['user_id' => $this->alice->id])->assertOk();
            $this->actingAs($user)->postJson('/chat/conversations', ['user_id' => $this->bob->id])->assertOk();
        }
    }

    public function test_cannot_start_a_conversation_with_yourself(): void
    {
        $this->actingAs($this->alice)
            ->postJson('/chat/conversations', ['user_id' => $this->alice->id])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('user_id');
    }
}

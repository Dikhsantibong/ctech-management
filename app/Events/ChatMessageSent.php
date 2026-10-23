<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

/**
 * "Bel" bahwa ada pesan baru. Sengaja hanya membawa id — isi pesan tidak pernah
 * melewati Pusher; browser mengambilnya langsung dari server lewat HTTPS.
 */
class ChatMessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    public function __construct(
        public int $conversationId,
        public int $messageId,
        public int $senderId,
        public int $recipientId,
    ) {}

    /**
     * Penerima, dan pengirim sendiri agar tab lain miliknya ikut ter-update.
     *
     * @return array<int, PrivateChannel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("chat.user.{$this->recipientId}"),
            new PrivateChannel("chat.user.{$this->senderId}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'chat.message';
    }

    /**
     * @return array<string, int>
     */
    public function broadcastWith(): array
    {
        return [
            'conversation_id' => $this->conversationId,
            'message_id' => $this->messageId,
            'sender_id' => $this->senderId,
        ];
    }
}

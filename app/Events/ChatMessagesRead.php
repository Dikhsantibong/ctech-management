<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

/**
 * Memberi tahu pengirim bahwa pesannya sudah dibaca (centang dua).
 */
class ChatMessagesRead implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    public function __construct(
        public int $conversationId,
        public int $readerId,
        public int $upToMessageId,
        public int $senderId,
    ) {}

    /**
     * @return array<int, PrivateChannel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("chat.user.{$this->senderId}"),
            new PrivateChannel("chat.user.{$this->readerId}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'chat.read';
    }

    /**
     * @return array<string, int>
     */
    public function broadcastWith(): array
    {
        return [
            'conversation_id' => $this->conversationId,
            'reader_id' => $this->readerId,
            'up_to_message_id' => $this->upToMessageId,
        ];
    }
}

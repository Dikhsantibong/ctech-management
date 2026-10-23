<?php

namespace Database\Factories;

use App\Models\ChatConversation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ChatConversation>
 */
class ChatConversationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_low_id' => User::factory(),
            'user_high_id' => User::factory(),
            'last_message_at' => now(),
        ];
    }

    /** Percakapan antara dua pengguna tertentu (urutan id dirapikan otomatis). */
    public function between(User $first, User $second): static
    {
        $ids = [$first->id, $second->id];
        sort($ids);

        return $this->state(['user_low_id' => $ids[0], 'user_high_id' => $ids[1]]);
    }
}

<?php

namespace App\Models;

use Database\Factories\ChatConversationFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use InvalidArgumentException;

/**
 * Percakapan pribadi antara dua pengguna. Hanya dua peserta ini yang boleh
 * membaca isinya — tidak ada pengecualian untuk role mana pun.
 */
class ChatConversation extends Model
{
    /** @use HasFactory<ChatConversationFactory> */
    use HasFactory;

    protected $fillable = ['user_low_id', 'user_high_id', 'last_message_at'];

    protected function casts(): array
    {
        return [
            'last_message_at' => 'datetime',
        ];
    }

    /** Ambil percakapan dua pengguna, atau buat bila belum ada. */
    public static function between(User $first, User $second): self
    {
        if ($first->is($second)) {
            throw new InvalidArgumentException('Tidak bisa membuat percakapan dengan diri sendiri.');
        }

        $ids = [$first->id, $second->id];
        sort($ids);

        return self::firstOrCreate(['user_low_id' => $ids[0], 'user_high_id' => $ids[1]]);
    }

    /** @param  Builder<self>  $query */
    public function scopeForUser(Builder $query, User $user): void
    {
        $query->where(fn (Builder $q) => $q->where('user_low_id', $user->id)->orWhere('user_high_id', $user->id));
    }

    public function hasParticipant(?User $user): bool
    {
        return $user !== null && in_array((int) $user->id, [(int) $this->user_low_id, (int) $this->user_high_id], true);
    }

    public function otherParticipantId(User $user): int
    {
        return (int) $this->user_low_id === (int) $user->id ? (int) $this->user_high_id : (int) $this->user_low_id;
    }

    /** @return BelongsTo<User, $this> */
    public function userLow(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_low_id');
    }

    /** @return BelongsTo<User, $this> */
    public function userHigh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_high_id');
    }

    public function otherParticipant(User $user): ?User
    {
        return (int) $this->user_low_id === (int) $user->id ? $this->userHigh : $this->userLow;
    }

    /** @return HasMany<ChatMessage, $this> */
    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class, 'conversation_id');
    }

    /** @return HasOne<ChatMessage, $this> */
    public function latestMessage(): HasOne
    {
        return $this->hasOne(ChatMessage::class, 'conversation_id')->latestOfMany();
    }
}

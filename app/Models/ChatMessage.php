<?php

namespace App\Models;

use Database\Factories\ChatMessageFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * Pesan chat. Isi, nama file, dan lokasi file disimpan terenkripsi AES-256
 * (cast "encrypted" dengan APP_KEY), sedangkan isi file lampirannya sendiri
 * dienkripsi sebelum ditulis ke disk privat.
 */
class ChatMessage extends Model
{
    /** @use HasFactory<ChatMessageFactory> */
    use HasFactory;

    /** Gambar yang aman ditampilkan langsung di browser (SVG sengaja tidak, rawan XSS). */
    public const INLINE_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    protected $fillable = [
        'conversation_id',
        'sender_id',
        'reply_to_id',
        'body',
        'attachment_path',
        'attachment_name',
        'attachment_mime',
        'attachment_size',
        'read_at',
    ];

    protected $hidden = ['attachment_path'];

    protected function casts(): array
    {
        return [
            'body' => 'encrypted',
            'attachment_path' => 'encrypted',
            'attachment_name' => 'encrypted',
            'read_at' => 'datetime',
        ];
    }

    /**
     * Pesan dari orang lain yang belum dibaca pengguna ini.
     *
     * @param  Builder<self>  $query
     */
    public function scopeUnreadFor(Builder $query, User $user): void
    {
        $query->whereNull('read_at')
            ->where('sender_id', '!=', $user->id)
            ->whereHas('conversation', fn (Builder $q) => $q->forUser($user));
    }

    /** @return BelongsTo<ChatConversation, $this> */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(ChatConversation::class, 'conversation_id');
    }

    /** @return BelongsTo<User, $this> */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /** @return BelongsTo<ChatMessage, $this> */
    public function replyTo(): BelongsTo
    {
        return $this->belongsTo(self::class, 'reply_to_id');
    }

    public function hasAttachment(): bool
    {
        return $this->attachment_path !== null;
    }

    public function isInlineImage(): bool
    {
        return $this->hasAttachment() && in_array($this->attachment_mime, self::INLINE_IMAGE_MIMES, true);
    }

    /** Cuplikan untuk daftar percakapan. */
    public function preview(): string
    {
        if (filled($this->body)) {
            return Str::limit((string) $this->body, 80);
        }

        return $this->isInlineImage() ? 'Gambar' : 'Lampiran: '.$this->attachment_name;
    }

    /**
     * Bentuk pesan untuk frontend, dari sudut pandang pembaca.
     *
     * @return array<string, mixed>
     */
    public function toChatArray(User $viewer): array
    {
        return [
            'id' => $this->id,
            'conversation_id' => $this->conversation_id,
            'sender_id' => $this->sender_id,
            'mine' => (int) $this->sender_id === (int) $viewer->id,
            'reply_to' => $this->replyTo ? [
                'id' => $this->replyTo->id,
                'sender_id' => $this->replyTo->sender_id,
                'sender_name' => $this->replyTo->sender?->name ?? 'Pengguna',
                'mine' => (int) $this->replyTo->sender_id === (int) $viewer->id,
                'body' => $this->replyTo->body ? Str::limit((string) $this->replyTo->body, 120) : null,
                'attachment_name' => $this->replyTo->attachment_name,
                'is_image' => $this->replyTo->isInlineImage(),
            ] : null,
            'body' => $this->body,
            'attachment' => $this->hasAttachment() ? [
                'name' => $this->attachment_name,
                'mime' => $this->attachment_mime,
                'size' => $this->attachment_size,
                'is_image' => $this->isInlineImage(),
                'url' => route('chat.attachment', $this),
            ] : null,
            'read_at' => $this->read_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

<?php

namespace App\Http\Controllers;

use App\Events\ChatMessageSent;
use App\Events\ChatMessagesRead;
use App\Events\ChatTyping;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * Chat pribadi antar rekan kerja.
 *
 * Aturan keamanan yang berlaku di setiap endpoint:
 *  - hanya dua peserta percakapan yang bisa membaca/mengirim; selain itu 404,
 *    termasuk direktur utama, supaya keberadaan percakapan pun tidak bocor;
 *  - isi pesan & nama file terenkripsi di database, isi lampiran terenkripsi di disk;
 *  - Pusher hanya menerima id ("ada pesan baru"), tidak pernah isi pesan;
 *  - chat tidak dicatat di Activity Log dan tidak dibuka lewat MCP.
 */
class ChatController extends Controller
{
    private const MESSAGES_PER_PAGE = 40;

    private const TYPING_SECONDS = 6;

    /** Jenis file yang boleh dikirim. */
    private const ALLOWED_FILES = 'jpg,jpeg,png,gif,webp,pdf,doc,docx,xls,xlsx,ppt,pptx,txt,csv,zip';

    public function index(Request $request): InertiaResponse
    {
        $user = $request->user();

        return Inertia::render('chat/index', [
            'conversations' => $this->conversationSummaries($user),
            'contacts' => User::query()
                ->whereKeyNot($user->id)
                ->orderBy('name')
                ->get(['id', 'name', 'role', 'avatar'])
                ->map(fn (User $contact): array => $this->person($contact))
                ->values(),
            'openWith' => $request->integer('with') ?: null,
            'allowedFiles' => self::ALLOWED_FILES,
        ]);
    }

    /** Jumlah pesan belum dibaca, untuk badge di sidebar. */
    public function unread(Request $request): JsonResponse
    {
        return response()->json(['unread' => ChatMessage::unreadFor($request->user())->count()]);
    }

    /**
     * Satu panggilan untuk menyegarkan semua: dipakai saat ada notifikasi realtime
     * maupun sebagai polling cadangan bila Pusher tidak tersedia.
     */
    public function sync(Request $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validate([
            'conversation' => 'nullable|integer',
            'after' => 'nullable|integer|min:0',
        ]);

        $payload = [
            'unread' => ChatMessage::unreadFor($user)->count(),
            'conversations' => $this->conversationSummaries($user),
        ];

        if (! empty($validated['conversation'])) {
            $conversation = $this->findForParticipant($user, (int) $validated['conversation']);

            $payload['thread'] = [
                'conversation_id' => $conversation->id,
                'messages' => $conversation->messages()
                    ->with(['replyTo.sender'])
                    ->where('id', '>', (int) ($validated['after'] ?? 0))
                    ->orderBy('id')
                    ->limit(100)
                    ->get()
                    ->map(fn (ChatMessage $message): array => $message->toChatArray($user))
                    ->values(),
                'other_read_up_to' => $this->otherReadUpTo($conversation, $user),
                'typing' => Cache::has($this->typingKey($conversation, $conversation->otherParticipantId($user))),
            ];
        }

        return response()->json($payload);
    }

    /** Mulai (atau buka kembali) percakapan dengan rekan kerja. */
    public function start(Request $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validate([
            'user_id' => ['required', 'integer', Rule::exists('users', 'id'), Rule::notIn([$user->id])],
        ], [
            'user_id.not_in' => 'Anda tidak bisa mengirim pesan ke diri sendiri.',
        ]);

        $conversation = ChatConversation::between($user, User::findOrFail($validated['user_id']));

        return response()->json(['conversation' => $this->summary($conversation->load(['userLow', 'userHigh', 'latestMessage']), $user)]);
    }

    public function messages(Request $request, int $conversation): JsonResponse
    {
        $user = $request->user();
        $conversation = $this->findForParticipant($user, $conversation);
        $before = $request->integer('before');

        $messages = $conversation->messages()
            ->with(['replyTo.sender'])
            ->when($before > 0, fn ($query) => $query->where('id', '<', $before))
            ->orderByDesc('id')
            ->limit(self::MESSAGES_PER_PAGE + 1)
            ->get();

        $hasMore = $messages->count() > self::MESSAGES_PER_PAGE;

        return response()->json([
            'messages' => $messages->take(self::MESSAGES_PER_PAGE)->reverse()->map(fn (ChatMessage $message): array => $message->toChatArray($user))->values(),
            'has_more' => $hasMore,
            'other_read_up_to' => $this->otherReadUpTo($conversation, $user),
        ]);
    }

    public function send(Request $request, int $conversation): JsonResponse
    {
        $user = $request->user();
        $conversation = $this->findForParticipant($user, $conversation);

        $request->merge(['body' => is_string($request->input('body')) ? trim($request->input('body')) : null]);
        $request->validate([
            'body' => 'nullable|required_without:file|string|max:5000',
            'file' => 'nullable|file|max:10240|mimes:'.self::ALLOWED_FILES,
            'reply_to_id' => 'nullable|integer',
        ], [
            'body.required_without' => 'Tulis pesan atau pilih file untuk dikirim.',
            'file.max' => 'Ukuran file maksimal 10 MB.',
            'file.mimes' => 'Jenis file tidak didukung.',
        ]);

        $replyToId = null;
        if ($request->filled('reply_to_id')) {
            $replyTarget = $conversation->messages()->find((int) $request->input('reply_to_id'));
            if ($replyTarget) {
                $replyToId = $replyTarget->id;
            }
        }

        $attributes = [
            'sender_id' => $user->id,
            'reply_to_id' => $replyToId,
            'body' => filled($request->input('body')) ? $request->input('body') : null,
        ];

        if ($file = $request->file('file')) {
            $path = "chat/{$conversation->id}/".Str::uuid()->toString();

            // Isi file dienkripsi sebelum ditulis: salinan disk/backup tidak bisa dibuka
            Storage::disk('local')->put($path, Crypt::encryptString((string) $file->get()));

            $attributes += [
                'attachment_path' => $path,
                'attachment_name' => Str::limit($file->getClientOriginalName(), 200, ''),
                'attachment_mime' => $file->getMimeType(),
                'attachment_size' => $file->getSize(),
            ];
        }

        $message = $conversation->messages()->create($attributes);
        $message->load('replyTo.sender');
        $conversation->update(['last_message_at' => $message->created_at]);
        Cache::forget($this->typingKey($conversation, $user->id));

        // Gagal menghubungi Pusher tidak boleh menggagalkan pengiriman; polling akan menyusul
        rescue(fn () => event(new ChatMessageSent($conversation->id, $message->id, $user->id, $conversation->otherParticipantId($user))));

        return response()->json(['message' => $message->toChatArray($user)], 201);
    }

    /** Tandai pesan dari lawan bicara sebagai sudah dibaca. */
    public function read(Request $request, int $conversation): JsonResponse
    {
        $user = $request->user();
        $conversation = $this->findForParticipant($user, $conversation);

        $unread = $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at');

        $upTo = (int) (clone $unread)->max('id');

        if ($upTo > 0) {
            $unread->where('id', '<=', $upTo)->update(['read_at' => now()]);

            rescue(fn () => event(new ChatMessagesRead($conversation->id, $user->id, $upTo, $conversation->otherParticipantId($user))));
        }

        return response()->json(['read_up_to' => $upTo, 'unread' => ChatMessage::unreadFor($user)->count()]);
    }

    public function typing(Request $request, int $conversation): Response
    {
        $user = $request->user();
        $conversation = $this->findForParticipant($user, $conversation);

        Cache::put($this->typingKey($conversation, $user->id), true, self::TYPING_SECONDS);

        rescue(fn () => event(new ChatTyping($conversation->id, $user->id, $conversation->otherParticipantId($user))));

        return response()->noContent();
    }

    public function attachment(Request $request, ChatMessage $message): Response
    {
        $conversation = $message->conversation;

        abort_unless($conversation?->hasParticipant($request->user()) && $message->hasAttachment(), 404);

        $encrypted = Storage::disk('local')->get($message->attachment_path);
        abort_if($encrypted === null, 404);

        $inline = $request->boolean('inline') && $message->isInlineImage();
        $filename = str_replace(['"', "\r", "\n"], '', (string) $message->attachment_name);

        return response(Crypt::decryptString($encrypted), 200, [
            'Content-Type' => $inline ? $message->attachment_mime : 'application/octet-stream',
            'Content-Disposition' => ($inline ? 'inline' : 'attachment').'; filename="'.$filename.'"',
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'private, no-store',
        ]);
    }

    /** 404 bagi siapa pun yang bukan peserta — tanpa memandang role. */
    private function findForParticipant(User $user, int $conversationId): ChatConversation
    {
        $conversation = ChatConversation::find($conversationId);

        abort_unless($conversation?->hasParticipant($user), 404);

        return $conversation;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function conversationSummaries(User $user): array
    {
        return ChatConversation::query()
            ->forUser($user)
            ->whereHas('messages')
            ->with(['userLow:id,name,role,avatar', 'userHigh:id,name,role,avatar', 'latestMessage'])
            ->withCount(['messages as unread_count' => fn ($query) => $query->where('sender_id', '!=', $user->id)->whereNull('read_at')])
            ->withMax('messages as latest_message_id', 'id')
            ->orderByDesc('latest_message_id')
            ->limit(100)
            ->get()
            ->map(fn (ChatConversation $conversation): array => $this->summary($conversation, $user))
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function summary(ChatConversation $conversation, User $user): array
    {
        $latest = $conversation->latestMessage;
        $other = $conversation->otherParticipant($user);

        return [
            'id' => $conversation->id,
            'other' => $other ? $this->person($other) : null,
            'last_message' => $latest ? [
                'preview' => $latest->preview(),
                'mine' => (int) $latest->sender_id === (int) $user->id,
                'created_at' => $latest->created_at?->toIso8601String(),
            ] : null,
            'unread_count' => (int) ($conversation->unread_count ?? 0),
            'last_message_at' => $latest?->created_at?->toIso8601String(),
        ];
    }

    /**
     * @return array{id: int, name: string, role: ?string, avatar: ?string}
     */
    private function person(User $user): array
    {
        return ['id' => $user->id, 'name' => $user->name, 'role' => $user->role, 'avatar' => $user->avatar];
    }

    private function otherReadUpTo(ChatConversation $conversation, User $user): int
    {
        return (int) $conversation->messages()->where('sender_id', $user->id)->whereNotNull('read_at')->max('id');
    }

    private function typingKey(ChatConversation $conversation, int $userId): string
    {
        return "chat:typing:{$conversation->id}:{$userId}";
    }
}

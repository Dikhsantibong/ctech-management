import { Head, usePage } from '@inertiajs/react';
import {
    ArrowLeft, Check, CheckCheck, Download, FileText, Loader2, Lock, MessageSquarePlus, Paperclip, Search, Send, X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useInitials } from '@/hooks/use-initials';
import { isRealtimeConnected, listenToChat } from '@/lib/chat-realtime';
import type { ChatState } from '@/lib/chat-realtime';
import { apiFetch } from '@/lib/fetch';
import { cn } from '@/lib/utils';

type Person = { id: number; name: string; role: string | null; avatar: string | null };

type Summary = {
    id: number;
    other: Person | null;
    last_message: { preview: string; mine: boolean; created_at: string | null } | null;
    unread_count: number;
    last_message_at: string | null;
};

type Attachment = { name: string; mime: string | null; size: number | null; is_image: boolean; url: string };

type Message = {
    id: number;
    conversation_id: number;
    sender_id: number;
    mine: boolean;
    body: string | null;
    attachment: Attachment | null;
    read_at: string | null;
    created_at: string | null;
};

interface Props {
    conversations: Summary[];
    contacts: Person[];
    openWith: number | null;
    allowedFiles: string;
}

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const POLL_MS = 3_000;
const SAFETY_SYNC_MS = 20_000;
const TYPING_SEND_MS = 3_000;
const TYPING_SHOW_MS = 6_000;

const ROLE_LABELS: Record<string, string> = {
    direktur_utama: 'Direktur Utama',
    operation: 'Operation',
    marketing: 'Marketing',
    administrasi: 'Administrasi',
};

function roleLabel(role: string | null) {
    return role ? (ROLE_LABELS[role] ?? role) : '';
}

function formatTime(value: string | null) {
    return value ? new Date(value).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';
}

function formatListDate(value: string | null) {
    if (!value) return '';
    const date = new Date(value);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) return formatTime(value);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return 'Kemarin';

    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
}

function dayLabel(value: string | null) {
    if (!value) return '';
    const date = new Date(value);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Hari ini';
    if (date.toDateString() === yesterday.toDateString()) return 'Kemarin';

    return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatSize(bytes: number | null) {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function mergeMessages(current: Message[], incoming: Message[]) {
    if (incoming.length === 0) return current;
    const byId = new Map(current.map((message) => [message.id, message]));
    incoming.forEach((message) => byId.set(message.id, message));

    return [...byId.values()].sort((a, b) => a.id - b.id);
}

function PersonAvatar({ person, className }: { person: Person | null; className?: string }) {
    const getInitials = useInitials();

    return (
        <Avatar className={cn('h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}>
            {person?.avatar && <AvatarImage src={person.avatar} alt={person.name} />}
            <AvatarFallback className="rounded-full bg-neutral-200 text-sm font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-100">
                {getInitials(person?.name ?? '?')}
            </AvatarFallback>
        </Avatar>
    );
}

export default function ChatIndex({ conversations: initialConversations, contacts, openWith, allowedFiles }: Props) {
    const { auth, chatState } = usePage<{ auth: { user: { id: number } }; chatState: ChatState }>().props;
    const me = auth.user.id;
    const realtime = chatState?.realtime ?? null;

    const [conversations, setConversations] = useState<Summary[]>(initialConversations);
    const [active, setActive] = useState<Summary | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [hasMore, setHasMore] = useState(false);
    const [loadingThread, setLoadingThread] = useState(false);
    const [loadingOlder, setLoadingOlder] = useState(false);
    const [otherReadUpTo, setOtherReadUpTo] = useState(0);
    const [otherTyping, setOtherTyping] = useState(false);
    const [draft, setDraft] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [listQuery, setListQuery] = useState('');
    const [pickerOpen, setPickerOpen] = useState(false);
    const [contactQuery, setContactQuery] = useState('');

    const activeRef = useRef<Summary | null>(null);
    const messagesRef = useRef<Message[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const stickToBottom = useRef(true);
    const lastTypingSent = useRef(0);
    const typingTimer = useRef<number | undefined>(undefined);
    const syncTimer = useRef<number | undefined>(undefined);
    const syncing = useRef(false);

    activeRef.current = active;
    messagesRef.current = messages;

    const acceptAttribute = useMemo(() => allowedFiles.split(',').map((ext) => `.${ext}`).join(','), [allowedFiles]);

    const scrollToBottom = useCallback(() => {
        requestAnimationFrame(() => {
            const el = scrollRef.current;
            if (el) el.scrollTop = el.scrollHeight;
        });
    }, []);

    /** Simpan percakapan yang sedang dibuka di daftar walau belum punya pesan. */
    const applySummaries = useCallback((list: Summary[]) => {
        const current = activeRef.current;
        const hasCurrent = current && list.some((item) => item.id === current.id);
        setConversations(hasCurrent || !current ? list : [current, ...list]);
    }, []);

    const markRead = useCallback(async (conversationId: number) => {
        if (document.visibilityState !== 'visible') return;

        const response = await apiFetch(`/chat/conversations/${conversationId}/read`, { method: 'POST' }).catch(() => null);
        if (!response?.ok) return;

        setConversations((list) => list.map((item) => (item.id === conversationId ? { ...item, unread_count: 0 } : item)));
        window.dispatchEvent(new Event('chat:unread-changed'));
    }, []);

    const sync = useCallback(async () => {
        if (syncing.current) return;
        syncing.current = true;

        try {
            const current = activeRef.current;
            const lastId = messagesRef.current.at(-1)?.id ?? 0;
            const params = new URLSearchParams();
            if (current) {
                params.set('conversation', String(current.id));
                params.set('after', String(lastId));
            }

            const response = await apiFetch(`/chat/sync?${params.toString()}`);
            if (!response.ok) return;
            const data = await response.json();

            applySummaries(data.conversations ?? []);

            const thread = data.thread;
            if (thread && activeRef.current?.id === thread.conversation_id) {
                const incoming: Message[] = thread.messages ?? [];
                if (incoming.length > 0) {
                    setMessages((list) => mergeMessages(list, incoming));
                    if (stickToBottom.current || incoming.some((m) => m.mine)) scrollToBottom();
                    if (incoming.some((m) => !m.mine)) {
                        setOtherTyping(false);
                        markRead(thread.conversation_id);
                    }
                }
                setOtherReadUpTo((value) => Math.max(value, thread.other_read_up_to ?? 0));
                if (thread.typing && !isRealtimeConnected()) setOtherTyping(true);
                if (!thread.typing && !isRealtimeConnected()) setOtherTyping(false);
            }
        } catch {
            // Jaringan putus sesaat: percobaan berikutnya akan menyusul
        } finally {
            syncing.current = false;
        }
    }, [applySummaries, markRead, scrollToBottom]);

    const scheduleSync = useCallback(() => {
        window.clearTimeout(syncTimer.current);
        syncTimer.current = window.setTimeout(sync, 150);
    }, [sync]);

    const openConversation = useCallback(async (summary: Summary) => {
        setActive(summary);
        activeRef.current = summary;
        setMessages([]);
        messagesRef.current = [];
        setHasMore(false);
        setOtherReadUpTo(0);
        setOtherTyping(false);
        setError(null);
        setDraft('');
        setFile(null);
        setLoadingThread(true);
        stickToBottom.current = true;

        try {
            const response = await apiFetch(`/chat/conversations/${summary.id}/messages`);
            if (!response.ok) throw new Error();
            const data = await response.json();
            if (activeRef.current?.id !== summary.id) return;

            setMessages(data.messages ?? []);
            setHasMore(Boolean(data.has_more));
            setOtherReadUpTo(data.other_read_up_to ?? 0);
            scrollToBottom();
            if (summary.unread_count > 0 || (data.messages ?? []).some((m: Message) => !m.mine && !m.read_at)) {
                markRead(summary.id);
            }
        } catch {
            setError('Gagal memuat percakapan. Coba lagi.');
        } finally {
            setLoadingThread(false);
        }
    }, [markRead, scrollToBottom]);

    const startWith = useCallback(async (contactId: number) => {
        setPickerOpen(false);
        setContactQuery('');

        const existing = conversations.find((item) => item.other?.id === contactId);
        if (existing) {
            openConversation(existing);
            return;
        }

        const response = await apiFetch('/chat/conversations', { method: 'POST', body: JSON.stringify({ user_id: contactId }) }).catch(() => null);
        if (!response?.ok) {
            setError('Gagal memulai percakapan.');
            return;
        }

        const { conversation } = await response.json();
        setConversations((list) => (list.some((item) => item.id === conversation.id) ? list : [conversation, ...list]));
        openConversation(conversation);
    }, [conversations, openConversation]);

    const loadOlder = useCallback(async () => {
        const current = activeRef.current;
        const first = messagesRef.current[0];
        if (!current || !first || loadingOlder) return;

        setLoadingOlder(true);
        const el = scrollRef.current;
        const previousHeight = el?.scrollHeight ?? 0;

        try {
            const response = await apiFetch(`/chat/conversations/${current.id}/messages?before=${first.id}`);
            if (!response.ok) return;
            const data = await response.json();
            if (activeRef.current?.id !== current.id) return;

            setMessages((list) => mergeMessages(list, data.messages ?? []));
            setHasMore(Boolean(data.has_more));
            requestAnimationFrame(() => {
                if (el) el.scrollTop = el.scrollHeight - previousHeight;
            });
        } finally {
            setLoadingOlder(false);
        }
    }, [loadingOlder]);

    const send = useCallback(async () => {
        const current = activeRef.current;
        const body = draft.trim();
        if (!current || sending || (!body && !file)) return;

        const form = new FormData();
        if (body) form.append('body', body);
        if (file) form.append('file', file);

        setSending(true);
        setError(null);

        try {
            const response = await apiFetch(`/chat/conversations/${current.id}/messages`, { method: 'POST', body: form });
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const firstError = data?.errors ? Object.values(data.errors).flat()[0] : null;
                setError((firstError as string) || data?.message || 'Pesan gagal dikirim.');
                return;
            }

            setDraft('');
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            stickToBottom.current = true;
            setMessages((list) => mergeMessages(list, [data.message]));
            scrollToBottom();
            scheduleSync();
        } catch {
            setError('Koneksi terputus. Pesan belum terkirim.');
        } finally {
            setSending(false);
        }
    }, [draft, file, sending, scrollToBottom, scheduleSync]);

    const notifyTyping = useCallback(() => {
        const current = activeRef.current;
        const now = Date.now();
        if (!current || now - lastTypingSent.current < TYPING_SEND_MS) return;

        lastTypingSent.current = now;
        apiFetch(`/chat/conversations/${current.id}/typing`, { method: 'POST' }).catch(() => {});
    }, []);

    const pickFile = (selected: File | null) => {
        if (selected && selected.size > MAX_FILE_BYTES) {
            setError('Ukuran file maksimal 10 MB.');
            return;
        }
        setError(null);
        setFile(selected);
    };

    // Buka percakapan dari tautan ?with=<id user>
    useEffect(() => {
        if (openWith) startWith(openWith);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Realtime (Pusher): hanya "bel" berisi id; isinya diambil lewat sync()
    useEffect(() => {
        return listenToChat(me, realtime, {
            onMessage: scheduleSync,
            onRead: (event) => {
                if (event.reader_id !== me && activeRef.current?.id === event.conversation_id) {
                    setOtherReadUpTo((value) => Math.max(value, event.up_to_message_id));
                }
            },
            onTyping: (event) => {
                if (event.user_id === me || activeRef.current?.id !== event.conversation_id) return;
                setOtherTyping(true);
                window.clearTimeout(typingTimer.current);
                typingTimer.current = window.setTimeout(() => setOtherTyping(false), TYPING_SHOW_MS);
            },
        });
    }, [me, realtime?.key, scheduleSync]);

    // Polling cepat bila realtime tidak tersambung, plus sinkronisasi pengaman berkala
    useEffect(() => {
        let lastSafety = Date.now();
        const timer = window.setInterval(() => {
            if (document.visibilityState !== 'visible') return;
            const now = Date.now();
            if (!isRealtimeConnected() || now - lastSafety > SAFETY_SYNC_MS) {
                lastSafety = now;
                sync();
            }
        }, POLL_MS);

        const onVisible = () => document.visibilityState === 'visible' && sync();
        document.addEventListener('visibilitychange', onVisible);

        return () => {
            window.clearInterval(timer);
            document.removeEventListener('visibilitychange', onVisible);
        };
    }, [sync]);

    useEffect(() => () => {
        window.clearTimeout(typingTimer.current);
        window.clearTimeout(syncTimer.current);
    }, []);

    const filteredConversations = conversations.filter((item) =>
        !listQuery.trim() || item.other?.name.toLowerCase().includes(listQuery.trim().toLowerCase()),
    );
    const filteredContacts = contacts.filter((contact) =>
        !contactQuery.trim() || contact.name.toLowerCase().includes(contactQuery.trim().toLowerCase()),
    );

    const other = active?.other ?? null;

    return (
        <>
            <Head title="Pesan" />

            <div className="flex h-[calc(100svh-5rem)] min-h-[480px] p-4 pt-0">
                <div className="flex w-full overflow-hidden rounded-lg border bg-background">
                    {/* ===== Daftar percakapan ===== */}
                    <aside className={cn('flex w-full flex-col border-r md:w-80 md:shrink-0', active && 'hidden md:flex')}>
                        <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
                            <div>
                                <h1 className="text-base font-semibold">Pesan</h1>
                                <p className="text-xs text-muted-foreground">Percakapan pribadi dengan rekan kerja</p>
                            </div>
                            <Button size="sm" onClick={() => setPickerOpen(true)}>
                                <MessageSquarePlus className="mr-1.5 h-4 w-4" />
                                Baru
                            </Button>
                        </div>

                        <div className="border-b p-3">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input value={listQuery} onChange={(e) => setListQuery(e.target.value)} placeholder="Cari percakapan" className="pl-8" />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {filteredConversations.length === 0 ? (
                                <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                                    {conversations.length === 0 ? (
                                        <>
                                            <p className="font-medium text-foreground">Belum ada percakapan</p>
                                            <p className="mt-1">Klik "Baru" untuk mengirim pesan ke rekan kerja.</p>
                                        </>
                                    ) : (
                                        'Tidak ada percakapan yang cocok.'
                                    )}
                                </div>
                            ) : (
                                filteredConversations.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => openConversation(item)}
                                        className={cn(
                                            'flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-muted/60',
                                            active?.id === item.id && 'bg-muted',
                                        )}
                                    >
                                        <PersonAvatar person={item.other} />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-baseline justify-between gap-2">
                                                <span className={cn('truncate text-sm', item.unread_count > 0 ? 'font-semibold' : 'font-medium')}>
                                                    {item.other?.name ?? 'Pengguna dihapus'}
                                                </span>
                                                <span className="shrink-0 text-[11px] text-muted-foreground">{formatListDate(item.last_message_at)}</span>
                                            </div>
                                            <div className="mt-0.5 flex items-center justify-between gap-2">
                                                <span className={cn('truncate text-xs', item.unread_count > 0 ? 'text-foreground' : 'text-muted-foreground')}>
                                                    {item.last_message ? `${item.last_message.mine ? 'Anda: ' : ''}${item.last_message.preview}` : 'Belum ada pesan'}
                                                </span>
                                                {item.unread_count > 0 && (
                                                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-medium text-primary-foreground">
                                                        {item.unread_count > 99 ? '99+' : item.unread_count}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </aside>

                    {/* ===== Isi percakapan ===== */}
                    <section className={cn('flex min-w-0 flex-1 flex-col', !active && 'hidden md:flex')}>
                        {!active ? (
                            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
                                <Lock className="h-8 w-8 text-muted-foreground" />
                                <p className="font-medium">Pilih percakapan</p>
                                <p className="max-w-sm text-sm text-muted-foreground">
                                    Pesan tersimpan terenkripsi dan hanya bisa dibaca oleh Anda dan lawan bicara.
                                </p>
                            </div>
                        ) : (
                            <>
                                <header className="flex items-center gap-3 border-b px-4 py-3">
                                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setActive(null)} aria-label="Kembali">
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                    <PersonAvatar person={other} className="h-9 w-9" />
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold">{other?.name ?? 'Pengguna dihapus'}</p>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {otherTyping ? 'sedang mengetik…' : roleLabel(other?.role ?? null)}
                                        </p>
                                    </div>
                                </header>

                                <div
                                    ref={scrollRef}
                                    onScroll={(e) => {
                                        const el = e.currentTarget;
                                        stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
                                    }}
                                    className="flex-1 overflow-y-auto bg-muted/30 px-4 py-4"
                                >
                                    <div className="mx-auto mb-4 flex w-fit max-w-full items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-[11px] text-muted-foreground">
                                        <Lock className="h-3 w-3 shrink-0" />
                                        <span>Pesan terenkripsi. Hanya Anda dan {other?.name ?? 'lawan bicara'} yang dapat membacanya.</span>
                                    </div>

                                    {hasMore && (
                                        <div className="mb-4 text-center">
                                            <Button variant="outline" size="sm" onClick={loadOlder} disabled={loadingOlder}>
                                                {loadingOlder && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                                                Muat pesan sebelumnya
                                            </Button>
                                        </div>
                                    )}

                                    {loadingThread && (
                                        <div className="flex justify-center py-10 text-muted-foreground">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        </div>
                                    )}

                                    {!loadingThread && messages.length === 0 && (
                                        <p className="py-10 text-center text-sm text-muted-foreground">
                                            Mulai percakapan dengan {other?.name ?? 'rekan kerja'}.
                                        </p>
                                    )}

                                    <div className="space-y-1.5">
                                        {messages.map((message, index) => {
                                            const previous = messages[index - 1];
                                            const showDay = !previous || dayLabel(previous.created_at) !== dayLabel(message.created_at);
                                            const read = message.mine && message.id <= otherReadUpTo;

                                            return (
                                                <div key={message.id}>
                                                    {showDay && (
                                                        <div className="my-4 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                                            {dayLabel(message.created_at)}
                                                        </div>
                                                    )}
                                                    <div className={cn('flex', message.mine ? 'justify-end' : 'justify-start')}>
                                                        <div
                                                            className={cn(
                                                                'max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm sm:max-w-[70%]',
                                                                message.mine ? 'bg-primary text-primary-foreground' : 'border bg-background',
                                                            )}
                                                        >
                                                            {message.attachment && (
                                                                message.attachment.is_image ? (
                                                                    <a href={`${message.attachment.url}?inline=1`} target="_blank" rel="noopener noreferrer" className="mb-1 block">
                                                                        <img
                                                                            src={`${message.attachment.url}?inline=1`}
                                                                            alt={message.attachment.name}
                                                                            loading="lazy"
                                                                            className="max-h-64 rounded-md object-contain"
                                                                        />
                                                                    </a>
                                                                ) : (
                                                                    <a
                                                                        href={message.attachment.url}
                                                                        className={cn(
                                                                            'mb-1 flex items-center gap-2 rounded-md border px-2.5 py-2',
                                                                            message.mine ? 'border-primary-foreground/30' : 'bg-muted/40',
                                                                        )}
                                                                    >
                                                                        <FileText className="h-5 w-5 shrink-0" />
                                                                        <span className="min-w-0 flex-1">
                                                                            <span className="block truncate font-medium">{message.attachment.name}</span>
                                                                            <span className="block text-[11px] opacity-75">{formatSize(message.attachment.size)}</span>
                                                                        </span>
                                                                        <Download className="h-4 w-4 shrink-0" />
                                                                    </a>
                                                                )
                                                            )}
                                                            {message.body && <p className="whitespace-pre-wrap break-words">{message.body}</p>}
                                                            <div className={cn('mt-1 flex items-center justify-end gap-1 text-[10px]', message.mine ? 'text-primary-foreground/75' : 'text-muted-foreground')}>
                                                                <span>{formatTime(message.created_at)}</span>
                                                                {message.mine && (read
                                                                    ? <CheckCheck className="h-3.5 w-3.5" aria-label="Dibaca" />
                                                                    : <Check className="h-3.5 w-3.5" aria-label="Terkirim" />)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <footer className="border-t p-3">
                                    {error && <p className="mb-2 text-xs text-destructive">{error}</p>}
                                    {file && (
                                        <div className="mb-2 flex items-center gap-2 rounded-md border bg-muted/40 px-2.5 py-1.5 text-xs">
                                            <Paperclip className="h-3.5 w-3.5 shrink-0" />
                                            <span className="min-w-0 flex-1 truncate">{file.name}</span>
                                            <span className="text-muted-foreground">{formatSize(file.size)}</span>
                                            <button type="button" onClick={() => pickFile(null)} aria-label="Batal lampirkan" className="text-muted-foreground hover:text-foreground">
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex items-end gap-2">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept={acceptAttribute}
                                            className="hidden"
                                            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                                        />
                                        <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} aria-label="Lampirkan file" disabled={sending}>
                                            <Paperclip className="h-4 w-4" />
                                        </Button>
                                        <textarea
                                            value={draft}
                                            onChange={(e) => {
                                                setDraft(e.target.value);
                                                if (e.target.value.trim()) notifyTyping();
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    send();
                                                }
                                            }}
                                            rows={1}
                                            maxLength={5000}
                                            placeholder="Tulis pesan… (Enter kirim, Shift+Enter baris baru)"
                                            className="max-h-32 min-h-9 flex-1 resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        />
                                        <Button size="icon" onClick={send} disabled={sending || (!draft.trim() && !file)} aria-label="Kirim">
                                            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </footer>
                            </>
                        )}
                    </section>
                </div>
            </div>

            {/* ===== Pilih rekan kerja ===== */}
            <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Pesan baru</DialogTitle>
                        <DialogDescription>Pilih rekan kerja yang ingin Anda hubungi secara pribadi.</DialogDescription>
                    </DialogHeader>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input autoFocus value={contactQuery} onChange={(e) => setContactQuery(e.target.value)} placeholder="Cari nama" className="pl-8" />
                    </div>
                    <div className="max-h-80 overflow-y-auto rounded-md border">
                        {filteredContacts.length === 0 ? (
                            <p className="p-6 text-center text-sm text-muted-foreground">Tidak ada rekan kerja yang cocok.</p>
                        ) : (
                            filteredContacts.map((contact) => (
                                <button
                                    key={contact.id}
                                    type="button"
                                    onClick={() => startWith(contact.id)}
                                    className="flex w-full items-center gap-3 border-b px-3 py-2.5 text-left last:border-b-0 hover:bg-muted/60"
                                >
                                    <PersonAvatar person={contact} className="h-9 w-9" />
                                    <span className="min-w-0">
                                        <span className="block truncate text-sm font-medium">{contact.name}</span>
                                        <span className="block truncate text-xs text-muted-foreground">{roleLabel(contact.role)}</span>
                                    </span>
                                </button>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

ChatIndex.layout = {
    breadcrumbs: [{ title: 'Pesan', href: '/chat' }],
};

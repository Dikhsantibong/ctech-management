import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { apiFetch } from '@/lib/fetch';

/**
 * Koneksi realtime chat (Pusher) yang dipakai bersama sidebar dan halaman chat.
 *
 * Pusher hanya menyampaikan "bel" berisi id (ada pesan baru, sudah dibaca,
 * sedang mengetik). Isi pesan selalu diambil dari server lewat HTTPS, sehingga
 * Pusher tidak pernah melihat isi percakapan.
 */

export type RealtimeConfig = { key: string; cluster: string } | null;

export type ChatState = {
    unread: number;
    realtime: RealtimeConfig;
} | null;

export type ChatMessageEvent = { conversation_id: number; message_id: number; sender_id: number };
export type ChatReadEvent = { conversation_id: number; reader_id: number; up_to_message_id: number };
export type ChatTypingEvent = { conversation_id: number; user_id: number };

type Handlers = {
    onMessage?: (event: ChatMessageEvent) => void;
    onRead?: (event: ChatReadEvent) => void;
    onTyping?: (event: ChatTypingEvent) => void;
};

let echo: Echo<'pusher'> | null = null;
let echoKey: string | null = null;

function connect(config: NonNullable<RealtimeConfig>): Echo<'pusher'> | null {
    if (echo && echoKey === config.key) {
        return echo;
    }

    try {
        echo = new Echo({
            broadcaster: 'pusher',
            key: config.key,
            cluster: config.cluster,
            forceTLS: true,
            Pusher,
            channelAuthorization: {
                endpoint: '/broadcasting/auth',
                transport: 'ajax',
                customHandler: (
                    params: { socketId: string; channelName: string },
                    callback: (error: Error | null, data: any) => void,
                ) => {
                    apiFetch('/broadcasting/auth', {
                        method: 'POST',
                        body: JSON.stringify({ socket_id: params.socketId, channel_name: params.channelName }),
                    })
                        .then(async (response) => {
                            if (!response.ok) {
                                throw new Error(`Otorisasi channel ditolak (${response.status})`);
                            }

                            callback(null, await response.json());
                        })
                        .catch((error) => callback(error, null));
                },
            },
        } as any);
        echoKey = config.key;
    } catch {
        echo = null;
    }

    return echo;
}

/** Apakah koneksi realtime sedang tersambung (bila tidak, pemanggil memakai polling). */
export function isRealtimeConnected(): boolean {
    const pusher = (echo?.connector as any)?.pusher;

    return pusher?.connection?.state === 'connected';
}

/**
 * Dengarkan event chat milik pengguna. Mengembalikan fungsi untuk berhenti
 * mendengarkan; channel tidak ditinggalkan karena dipakai bersama komponen lain.
 */
export function listenToChat(userId: number, config: RealtimeConfig, handlers: Handlers): () => void {
    if (!config?.key) {
        return () => {};
    }

    const client = connect(config);

    if (!client) {
        return () => {};
    }

    const channel = client.private(`chat.user.${userId}`);
    const bindings: [string, (payload: any) => void][] = [];

    if (handlers.onMessage) bindings.push(['.chat.message', handlers.onMessage]);
    if (handlers.onRead) bindings.push(['.chat.read', handlers.onRead]);
    if (handlers.onTyping) bindings.push(['.chat.typing', handlers.onTyping]);

    bindings.forEach(([event, callback]) => channel.listen(event, callback));

    return () => bindings.forEach(([event, callback]) => channel.stopListening(event, callback));
}

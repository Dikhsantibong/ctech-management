import { usePage } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { isRealtimeConnected, listenToChat } from '@/lib/chat-realtime';
import type { ChatState } from '@/lib/chat-realtime';
import { apiFetch } from '@/lib/fetch';

/** Polling cadangan untuk badge saat realtime tidak tersambung. */
const FALLBACK_POLL_MS = 30_000;

/**
 * Jumlah pesan chat belum dibaca untuk badge sidebar. Diperbarui seketika lewat
 * Pusher, dengan polling 30 detik sebagai cadangan.
 */
export function useChatUnread(): number {
    const { auth, chatState } = usePage<{ auth: { user?: { id: number } }; chatState: ChatState }>().props;
    const userId = auth?.user?.id;
    const realtime = chatState?.realtime ?? null;
    const [unread, setUnread] = useState<number>(chatState?.unread ?? 0);

    // Nilai dari server ikut berubah setiap navigasi Inertia
    useEffect(() => setUnread(chatState?.unread ?? 0), [chatState?.unread]);

    const refresh = useCallback(() => {
        apiFetch('/chat/unread')
            .then((response) => (response.ok ? response.json() : null))
            .then((data) => {
                if (data && typeof data.unread === 'number') {
                    setUnread(data.unread);
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!userId) {
            return;
        }

        const stop = listenToChat(userId, realtime, { onMessage: refresh, onRead: refresh });

        // Halaman chat sendiri mengirim event ini setelah menandai pesan dibaca
        window.addEventListener('chat:unread-changed', refresh);

        const timer = window.setInterval(() => {
            if (!isRealtimeConnected() && document.visibilityState === 'visible') {
                refresh();
            }
        }, FALLBACK_POLL_MS);

        return () => {
            stop();
            window.removeEventListener('chat:unread-changed', refresh);
            window.clearInterval(timer);
        };
    }, [userId, realtime?.key, refresh]);

    return unread;
}

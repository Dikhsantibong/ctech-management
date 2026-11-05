import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Tone = 'success' | 'info' | 'warning' | 'danger' | 'neutral';

/** Pemetaan status modul CTECH ke warna semantik (design.md §05). */
const TONES: Record<Tone, string[]> = {
    success: ['published', 'completed', 'complete', 'selesai', 'done', 'paid', 'lunas', 'approved', 'disetujui', 'won', 'active', 'aktif', 'diterima', 'final', 'posted'],
    info: ['in progress', 'progress', 'proses', 'terkirim', 'diproses', 'berjalan', 'sent', 'review', 'in review', 'scheduled', 'terjadwal', 'negotiation', 'negosiasi', 'follow up', 'qualified', 'contacted'],
    warning: ['pending', 'menunggu', 'partial', 'sebagian', 'revisi', 'revision', 'on hold', 'proposal', 'due soon', 'medium', 'sedang', 'waiting'],
    danger: ['overdue', 'terlambat', 'cancelled', 'canceled', 'dibatalkan', 'rejected', 'ditolak', 'lost', 'failed', 'gagal', 'expired', 'blocked', 'high', 'critical', 'tinggi', 'urgent'],
    neutral: [],
};

export function statusTone(status: string | null | undefined): Tone {
    const normalized = (status ?? '').toLowerCase().replace(/[_-]+/g, ' ').trim();

    for (const tone of Object.keys(TONES) as Tone[]) {
        if (TONES[tone].includes(normalized)) {
            return tone;
        }
    }

    return 'neutral';
}

/**
 * Satu-satunya cara menampilkan status domain: badge soft + titik status.
 */
export function StatusBadge({ status, label, className }: { status: string | null | undefined; label?: string; className?: string }) {
    const tone = statusTone(status);

    return (
        <Badge variant={tone} className={cn('gap-1.5', className)}>
            <span aria-hidden className="size-1.5 rounded-full bg-current opacity-80" />
            {label ?? status ?? '-'}
        </Badge>
    );
}

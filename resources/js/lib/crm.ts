/**
 * Helper bersama untuk modul CRM: formatter dan pemetaan warna badge
 * yang konsisten dengan design system (semantic soft color, restrained).
 */

export function formatCurrency(amount: number | string | null | undefined): string {
    const value = Number(amount) || 0;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);
}

export function formatCompactCurrency(amount: number | string | null | undefined): string {
    const value = Number(amount) || 0;
    if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)} M`;
    if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)} Jt`;
    if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)} Rb`;
    return formatCurrency(value);
}

export function formatDate(value: string | null | undefined): string {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(value: string | null | undefined): string {
    if (!value) return '-';
    return new Date(value).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const soft = 'border font-medium';

export function stageColor(stage: string): string {
    if (stage === 'Berhasil') return `${soft} bg-emerald-50 text-emerald-700 border-emerald-200`;
    if (stage === 'Tidak Berhasil') return `${soft} bg-rose-50 text-rose-700 border-rose-200`;
    if (stage === 'Negosiasi' || stage === 'Persetujuan' || stage === 'Penawaran')
        return `${soft} bg-blue-50 text-blue-700 border-blue-200`;
    return `${soft} bg-slate-50 text-slate-700 border-slate-200`;
}

export function priorityColor(priority: string): string {
    switch (priority) {
        case 'Tinggi':
            return `${soft} bg-rose-50 text-rose-700 border-rose-200`;
        case 'Sedang':
            return `${soft} bg-amber-50 text-amber-700 border-amber-200`;
        default:
            return `${soft} bg-slate-50 text-slate-600 border-slate-200`;
    }
}

export function statusColor(status: string): string {
    switch (status) {
        case 'Aktif':
            return `${soft} bg-blue-50 text-blue-700 border-blue-200`;
        case 'Berhasil':
        case 'Dikonversi':
            return `${soft} bg-emerald-50 text-emerald-700 border-emerald-200`;
        case 'Tidak Berhasil':
            return `${soft} bg-rose-50 text-rose-700 border-rose-200`;
        default:
            return `${soft} bg-slate-50 text-slate-600 border-slate-200`;
    }
}

export function activityStatusColor(status: string): string {
    switch (status) {
        case 'Selesai':
            return `${soft} bg-emerald-50 text-emerald-700 border-emerald-200`;
        case 'Batal':
            return `${soft} bg-slate-50 text-slate-500 border-slate-200`;
        default:
            return `${soft} bg-amber-50 text-amber-700 border-amber-200`;
    }
}

/** WhatsApp deep link (wa.me) dengan template pesan opsional. */
export function whatsappLink(phone: string | null | undefined, message?: string): string | null {
    if (!phone) return null;
    const normalized = phone.replace(/\D/g, '').replace(/^0/, '62');
    if (!normalized) return null;
    const text = message ? `?text=${encodeURIComponent(message)}` : '';
    return `https://wa.me/${normalized}${text}`;
}

/** Template pesan komunikasi berdasarkan tahap pipeline (konsultatif, tidak agresif). */
export function messageTemplate(stage: string, companyName: string, picName: string): string {
    const greeting = picName ? `Halo Bapak/Ibu ${picName}` : 'Halo';
    switch (stage) {
        case 'Pendekatan':
            return `${greeting}, perkenalkan kami dari CTECH. Kami ingin memperkenalkan solusi teknologi kami. Apakah berkenan jika kami sampaikan informasinya?`;
        case 'Pengenalan Produk':
            return `${greeting}, berikut kami sampaikan informasi produk yang kami rasa relevan untuk ${companyName}. Boleh kami jelaskan lebih lanjut?`;
        case 'Analisis Kebutuhan':
            return `${greeting}, kami ingin memahami kebutuhan ${companyName} lebih dalam agar solusi yang kami tawarkan benar-benar sesuai. Kapan waktu yang tepat untuk berdiskusi?`;
        case 'Demo / Presentasi':
            return `${greeting}, kami ingin menawarkan jadwal demo produk untuk ${companyName}. Kira-kira kapan waktu yang nyaman?`;
        case 'Penawaran':
        case 'Negosiasi':
            return `${greeting}, menindaklanjuti diskusi sebelumnya, kami telah menyiapkan penawaran untuk ${companyName}. Boleh kami sampaikan detailnya?`;
        default:
            return `${greeting}, kami dari CTECH ingin menindaklanjuti komunikasi kita mengenai kebutuhan ${companyName}.`;
    }
}

import { useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { format, differenceInCalendarMonths } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import {
    Plus, Pencil, Trash2, Wallet, CalendarClock, AlertTriangle, CheckCircle2, Layers,
    Search, X, History, PauseCircle, Receipt, TrendingUp,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { formatRupiah } from '@/lib/utils';

/* ============================ Tipe ============================ */

type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    default_monthly_price: string;
    is_active: boolean;
    subscriptions_count: number;
};

type Payment = {
    id: number;
    period_start: string;
    period_end: string;
    months: number;
    amount: string;
    paid_at: string;
    method: string | null;
    reference: string | null;
    note: string | null;
};

type Subscription = {
    id: number;
    app_category_id: number | null;
    category: Category | null;
    client_name: string;
    app_name: string;
    monthly_price: string;
    billing_cycle_months: number;
    status: 'active' | 'paused' | 'ended';
    start_date: string;
    ended_at: string | null;
    notes: string | null;
    payments: Payment[];
    // Nilai turunan dari model
    months_running: number;
    duration_label: string;
    accrued_amount: number;
    total_paid: number;
    months_paid: number;
    outstanding_amount: number;
    paid_through: string | null;
    next_due_date: string | null;
    days_until_due: number | null;
    cycle_amount: number;
    payment_state: 'lunas' | 'jatuh_tempo' | 'menunggak' | 'belum_mulai' | 'berhenti';
};

type Summary = {
    total_subscriptions: number;
    active_subscriptions: number;
    monthly_recurring: number;
    total_paid: number;
    total_accrued: number;
    total_outstanding: number;
    due_soon: number;
};

/* ============================ Konstanta ============================ */

const STATE_META: Record<string, { label: string; chip: string }> = {
    lunas: {
        label: 'Lunas',
        chip: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300',
    },
    jatuh_tempo: {
        label: 'Segera Jatuh Tempo',
        chip: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300',
    },
    menunggak: {
        label: 'Menunggak',
        chip: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300',
    },
    belum_mulai: {
        label: 'Belum Mulai',
        chip: 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300',
    },
    berhenti: {
        label: 'Berhenti',
        chip: 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300',
    },
};

const STATUS_LABEL: Record<string, string> = {
    active: 'Aktif',
    paused: 'Dijeda',
    ended: 'Berhenti',
};

const CYCLE_LABEL: Record<number, string> = {
    1: 'Bulanan',
    3: 'Per 3 bulan',
    6: 'Per 6 bulan',
    12: 'Tahunan',
};

const fmtDate = (value?: string | null) =>
    value ? format(new Date(`${String(value).split('T')[0]}T00:00:00`), 'd MMM yyyy', { locale: localeId }) : '—';

const emptySubForm = {
    app_category_id: '',
    client_name: '',
    app_name: '',
    monthly_price: '',
    billing_cycle_months: '1',
    status: 'active',
    start_date: '',
    ended_at: '',
    notes: '',
    prepaid_months: '0',
};

const emptyCategoryForm = {
    name: '',
    description: '',
    default_monthly_price: '',
    is_active: true,
};

/* ============================ Halaman ============================ */

export default function AppSubscriptionsIndex({
    subscriptions,
    categories,
    billingCycles,
    summary,
}: {
    subscriptions: Subscription[];
    categories: Category[];
    billingCycles: number[];
    summary: Summary;
}) {
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [stateFilter, setStateFilter] = useState('all');

    const [subDialog, setSubDialog] = useState<'create' | 'edit' | null>(null);
    const [subForm, setSubForm] = useState({ ...emptySubForm });
    const [selected, setSelected] = useState<Subscription | null>(null);

    const [payDialog, setPayDialog] = useState(false);
    const [payForm, setPayForm] = useState({ months: '1', amount: '', paid_at: '', method: '', reference: '', note: '' });

    const [historyFor, setHistoryFor] = useState<Subscription | null>(null);
    const [deleteSub, setDeleteSub] = useState<Subscription | null>(null);

    const [catDialog, setCatDialog] = useState<'create' | 'edit' | null>(null);
    const [catForm, setCatForm] = useState({ ...emptyCategoryForm });
    const [selectedCat, setSelectedCat] = useState<Category | null>(null);
    const [deleteCat, setDeleteCat] = useState<Category | null>(null);

    const [busy, setBusy] = useState(false);

    /* ---------- Daftar tersaring ---------- */
    const visible = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return subscriptions.filter((s) => {
            if (categoryFilter !== 'all' && String(s.app_category_id) !== categoryFilter) return false;
            if (stateFilter !== 'all' && s.payment_state !== stateFilter) return false;
            if (keyword) {
                const hay = `${s.client_name} ${s.app_name} ${s.category?.name ?? ''}`.toLowerCase();
                if (!hay.includes(keyword)) return false;
            }
            return true;
        });
    }, [subscriptions, search, categoryFilter, stateFilter]);

    const hasFilter = search !== '' || categoryFilter !== 'all' || stateFilter !== 'all';

    /* ---------- Aksi langganan ---------- */
    const openCreateSub = () => {
        setSelected(null);
        setSubForm({ ...emptySubForm, start_date: format(new Date(), 'yyyy-MM-dd') });
        setSubDialog('create');
    };

    const openEditSub = (sub: Subscription) => {
        setSelected(sub);
        setSubForm({
            app_category_id: sub.app_category_id ? String(sub.app_category_id) : '',
            client_name: sub.client_name,
            app_name: sub.app_name,
            monthly_price: String(Math.round(Number(sub.monthly_price))),
            billing_cycle_months: String(sub.billing_cycle_months),
            status: sub.status,
            start_date: String(sub.start_date).split('T')[0],
            ended_at: sub.ended_at ? String(sub.ended_at).split('T')[0] : '',
            notes: sub.notes ?? '',
            prepaid_months: '0',
        });
        setSubDialog('edit');
    };

    /** Kategori dipilih → harga bawaannya diisikan bila kolom masih kosong. */
    const pickCategory = (value: string) => {
        const cat = categories.find((c) => String(c.id) === value);
        setSubForm((prev) => ({
            ...prev,
            app_category_id: value,
            monthly_price:
                prev.monthly_price || !cat || Number(cat.default_monthly_price) <= 0
                    ? prev.monthly_price
                    : String(Math.round(Number(cat.default_monthly_price))),
        }));
    };

    const submitSub = (e: React.FormEvent) => {
        e.preventDefault();
        setBusy(true);

        const payload = {
            ...subForm,
            monthly_price: Number(subForm.monthly_price || 0),
            billing_cycle_months: Number(subForm.billing_cycle_months),
            ended_at: subForm.status === 'ended' ? subForm.ended_at || null : null,
            prepaid_months: Number(subForm.prepaid_months || 0),
        };

        const done = { onSuccess: () => setSubDialog(null), onFinish: () => setBusy(false), preserveScroll: true };

        if (subDialog === 'edit' && selected) {
            router.put(`/app-subscriptions/${selected.id}`, payload, done);
        } else {
            router.post('/app-subscriptions', payload, done);
        }
    };

    const openPayment = (sub: Subscription) => {
        setSelected(sub);
        setPayForm({
            months: String(sub.billing_cycle_months),
            amount: String(Math.round(sub.cycle_amount)),
            paid_at: format(new Date(), 'yyyy-MM-dd'),
            method: 'Transfer Bank',
            reference: '',
            note: '',
        });
        setPayDialog(true);
    };

    /** Nominal menyesuaikan jumlah bulan agar tidak perlu hitung manual. */
    const changePayMonths = (value: string) => {
        const months = Number(value || 0);
        const monthly = selected ? Number(selected.monthly_price) : 0;
        setPayForm((prev) => ({
            ...prev,
            months: value,
            amount: months > 0 && monthly > 0 ? String(Math.round(monthly * months)) : prev.amount,
        }));
    };

    const submitPayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected) return;
        setBusy(true);

        router.post(
            `/app-subscriptions/${selected.id}/payments`,
            { ...payForm, months: Number(payForm.months), amount: Number(payForm.amount || 0) },
            { preserveScroll: true, onSuccess: () => setPayDialog(false), onFinish: () => setBusy(false) },
        );
    };

    /* ---------- Aksi kategori ---------- */
    const openCreateCat = () => {
        setSelectedCat(null);
        setCatForm({ ...emptyCategoryForm });
        setCatDialog('create');
    };

    const openEditCat = (cat: Category) => {
        setSelectedCat(cat);
        setCatForm({
            name: cat.name,
            description: cat.description ?? '',
            default_monthly_price: String(Math.round(Number(cat.default_monthly_price))),
            is_active: cat.is_active,
        });
        setCatDialog('edit');
    };

    const submitCat = (e: React.FormEvent) => {
        e.preventDefault();
        setBusy(true);

        const payload = { ...catForm, default_monthly_price: Number(catForm.default_monthly_price || 0) };
        const done = { onSuccess: () => setCatDialog(null), onFinish: () => setBusy(false), preserveScroll: true };

        if (catDialog === 'edit' && selectedCat) {
            router.put(`/app-categories/${selectedCat.id}`, payload, done);
        } else {
            router.post('/app-categories', payload, done);
        }
    };

    /* ============================ Render ============================ */

    const stats = [
        { label: 'Langganan Aktif', value: String(summary.active_subscriptions), hint: `dari ${summary.total_subscriptions} total`, icon: Layers, tone: 'text-foreground' },
        { label: 'Pendapatan / Bulan', value: formatRupiah(summary.monthly_recurring), hint: 'nilai berulang bulanan', icon: TrendingUp, tone: 'text-foreground' },
        { label: 'Total Diterima', value: formatRupiah(summary.total_paid), hint: 'dari pembayaran tercatat', icon: Wallet, tone: 'text-emerald-600 dark:text-emerald-400' },
        {
            label: 'Tunggakan',
            value: formatRupiah(summary.total_outstanding),
            hint: summary.due_soon > 0 ? `${summary.due_soon} langganan perlu ditagih` : 'semua terbayar',
            icon: AlertTriangle,
            tone: summary.total_outstanding > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-foreground',
        },
    ];

    return (
        <>
            <Head title="Langganan Aplikasi" />

            <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Langganan Aplikasi</h2>
                        <p className="text-sm text-muted-foreground">
                            Kelola langganan POS App dan Photobooth App: lama berlangganan, pembayaran yang masuk, dan tunggakan.
                        </p>
                    </div>
                </div>

                {/* Ringkasan */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {stats.map((s) => (
                        <div key={s.label} className="rounded-xl border bg-card p-3.5 shadow-sm">
                            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                <s.icon className="h-3.5 w-3.5" />
                                {s.label}
                            </p>
                            <p className={`mt-1.5 text-xl font-bold leading-none ${s.tone}`}>{s.value}</p>
                            <p className="mt-1.5 text-xs text-muted-foreground">{s.hint}</p>
                        </div>
                    ))}
                </div>

                <Tabs defaultValue="langganan">
                    <TabsList className="mb-4">
                        <TabsTrigger value="langganan" className="gap-1.5">
                            <Receipt className="h-4 w-4" /> Langganan
                            <span className="ml-0.5 rounded-full bg-muted px-1.5 text-[11px] font-semibold text-muted-foreground">
                                {subscriptions.length}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="kategori" className="gap-1.5">
                            <Layers className="h-4 w-4" /> Kategori Aplikasi
                            <span className="ml-0.5 rounded-full bg-muted px-1.5 text-[11px] font-semibold text-muted-foreground">
                                {categories.length}
                            </span>
                        </TabsTrigger>
                    </TabsList>

                    {/* ==================== TAB LANGGANAN ==================== */}
                    <TabsContent value="langganan" className="space-y-4">
                        <div className="flex flex-col gap-2 rounded-xl border bg-card p-3 shadow-sm lg:flex-row lg:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari klien atau nama aplikasi…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-9 pl-9"
                                />
                            </div>

                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="h-9 w-full lg:w-48"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua kategori</SelectItem>
                                    {categories.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={stateFilter} onValueChange={setStateFilter}>
                                <SelectTrigger className="h-9 w-full lg:w-48"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua kondisi</SelectItem>
                                    {Object.entries(STATE_META).map(([key, meta]) => (
                                        <SelectItem key={key} value={key}>{meta.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {hasFilter && (
                                <Button variant="ghost" className="h-9 shrink-0" onClick={() => { setSearch(''); setCategoryFilter('all'); setStateFilter('all'); }}>
                                    <X className="mr-1.5 h-4 w-4" /> Reset
                                </Button>
                            )}

                            <Button onClick={openCreateSub} className="h-9 shrink-0">
                                <Plus className="mr-1.5 h-4 w-4" /> Tambah Langganan
                            </Button>
                        </div>

                        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-muted/30">
                                        <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                                            <th className="px-4 py-2.5 font-medium">Klien & Aplikasi</th>
                                            <th className="px-4 py-2.5 font-medium">Lama Langganan</th>
                                            <th className="px-4 py-2.5 text-right font-medium">Harga / Bulan</th>
                                            <th className="px-4 py-2.5 text-right font-medium">Sudah Dibayar</th>
                                            <th className="px-4 py-2.5 text-right font-medium">Tunggakan</th>
                                            <th className="px-4 py-2.5 font-medium">Jatuh Tempo</th>
                                            <th className="px-4 py-2.5 text-right font-medium">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {visible.map((sub) => {
                                            const state = STATE_META[sub.payment_state] ?? STATE_META.lunas;

                                            return (
                                                <tr key={sub.id} className="transition-colors hover:bg-muted/30">
                                                    <td className="px-4 py-3">
                                                        <p className="font-medium">{sub.client_name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {sub.app_name}
                                                            {sub.category ? ` · ${sub.category.name}` : ''}
                                                        </p>
                                                        <span className={`mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium ${state.chip}`}>
                                                            {state.label}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <p className="font-medium">{sub.duration_label}</p>
                                                        <p className="text-xs text-muted-foreground">sejak {fmtDate(sub.start_date)}</p>
                                                        {sub.status !== 'active' && (
                                                            <p className="mt-0.5 text-xs text-muted-foreground">{STATUS_LABEL[sub.status]}</p>
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3 text-right">
                                                        <p className="font-medium tabular-nums">{formatRupiah(Number(sub.monthly_price))}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {CYCLE_LABEL[sub.billing_cycle_months] ?? `${sub.billing_cycle_months} bulan`}
                                                            {' · '}
                                                            {formatRupiah(sub.cycle_amount)}
                                                        </p>
                                                    </td>

                                                    <td className="px-4 py-3 text-right">
                                                        <p className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                                                            {formatRupiah(sub.total_paid)}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {sub.months_paid} bulan · terakru {formatRupiah(sub.accrued_amount)}
                                                        </p>
                                                    </td>

                                                    <td className="px-4 py-3 text-right">
                                                        {sub.outstanding_amount > 0 ? (
                                                            <p className="font-semibold tabular-nums text-rose-600 dark:text-rose-400">
                                                                {formatRupiah(sub.outstanding_amount)}
                                                            </p>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                                                                <CheckCircle2 className="h-3.5 w-3.5" /> Lunas
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        {sub.next_due_date ? (
                                                            <>
                                                                <p className="flex items-center gap-1 text-sm">
                                                                    <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
                                                                    {fmtDate(sub.next_due_date)}
                                                                </p>
                                                                {sub.days_until_due !== null && (
                                                                    <p className={`text-xs ${sub.days_until_due < 0 ? 'font-medium text-rose-600 dark:text-rose-400' : 'text-muted-foreground'}`}>
                                                                        {sub.days_until_due < 0
                                                                            ? `Lewat ${Math.abs(sub.days_until_due)} hari`
                                                                            : `${sub.days_until_due} hari lagi`}
                                                                    </p>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">—</span>
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <div className="flex justify-end gap-1">
                                                            {sub.status !== 'ended' && (
                                                                <Button size="sm" className="h-8" onClick={() => openPayment(sub)}>
                                                                    <Wallet className="mr-1.5 h-3.5 w-3.5" /> Catat Bayar
                                                                </Button>
                                                            )}
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Riwayat pembayaran" onClick={() => setHistoryFor(sub)}>
                                                                <History className="h-4 w-4 text-muted-foreground" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={() => openEditSub(sub)}>
                                                                <Pencil className="h-4 w-4 text-muted-foreground" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" title="Hapus" onClick={() => setDeleteSub(sub)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}

                                        {visible.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                                                    {hasFilter ? 'Tidak ada langganan yang cocok dengan filter.' : 'Belum ada langganan tercatat.'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            <strong>Terakru</strong> adalah nilai yang seharusnya sudah dibayar sampai hari ini (bulan penuh berjalan ×
                            harga per bulan). <strong>Sudah dibayar</strong> berasal dari pembayaran yang benar-benar dicatat.
                            Selisih keduanya menjadi tunggakan.
                        </p>
                    </TabsContent>

                    {/* ==================== TAB KATEGORI ==================== */}
                    <TabsContent value="kategori" className="space-y-4">
                        <div className="flex items-center justify-between rounded-xl border bg-card p-3 shadow-sm">
                            <p className="text-sm text-muted-foreground">
                                Kategori menentukan jenis aplikasi yang dilanggan dan harga bawaannya.
                            </p>
                            <Button onClick={openCreateCat} className="h-9">
                                <Plus className="mr-1.5 h-4 w-4" /> Tambah Kategori
                            </Button>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {categories.map((cat) => (
                                <div key={cat.id} className="flex flex-col rounded-xl border bg-card shadow-sm">
                                    <div className="flex items-start justify-between gap-3 border-b p-4">
                                        <div className="min-w-0">
                                            <h3 className="font-semibold">{cat.name}</h3>
                                            <p className="text-xs text-muted-foreground">{cat.subscriptions_count} langganan</p>
                                        </div>
                                        <span
                                            className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                                                cat.is_active
                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
                                                    : 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300'
                                            }`}
                                        >
                                            {cat.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </div>

                                    <div className="flex-1 space-y-2 p-4">
                                        {cat.description && <p className="text-sm text-muted-foreground">{cat.description}</p>}
                                        <p className="text-sm">
                                            <span className="text-muted-foreground">Harga bawaan: </span>
                                            <span className="font-medium">
                                                {Number(cat.default_monthly_price) > 0
                                                    ? `${formatRupiah(Number(cat.default_monthly_price))} / bulan`
                                                    : 'belum diatur'}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="flex justify-end gap-1 border-t p-3">
                                        <Button variant="ghost" size="sm" onClick={() => openEditCat(cat)}>
                                            <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="hover:text-destructive"
                                            onClick={() => setDeleteCat(cat)}
                                            disabled={cat.subscriptions_count > 0}
                                            title={cat.subscriptions_count > 0 ? 'Masih dipakai langganan' : 'Hapus kategori'}
                                        >
                                            <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Hapus
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {categories.length === 0 && (
                                <div className="col-span-full rounded-xl border border-dashed py-12 text-center text-muted-foreground">
                                    Belum ada kategori aplikasi.
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* ==================== Dialog langganan ==================== */}
            <Dialog open={subDialog !== null} onOpenChange={(open) => !open && setSubDialog(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{subDialog === 'edit' ? 'Edit Langganan' : 'Tambah Langganan'}</DialogTitle>
                        <DialogDescription>
                            Masukkan <strong>harga per bulan</strong>. Siklus tagihan hanya mengatur seberapa sering ditagih —
                            nominal sekali tagih dihitung otomatis.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitSub} className="max-h-[65vh] space-y-4 overflow-y-auto pr-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Kategori Aplikasi</Label>
                                <Select value={subForm.app_category_id} onValueChange={pickCategory}>
                                    <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                                    <SelectContent>
                                        {categories.filter((c) => c.is_active || String(c.id) === subForm.app_category_id).map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Nama Klien</Label>
                                <Input value={subForm.client_name} onChange={(e) => setSubForm({ ...subForm, client_name: e.target.value })} required />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Nama / Label Aplikasi</Label>
                            <Input
                                placeholder="Contoh: Photobooth Clicksy — Cabang Kendari"
                                value={subForm.app_name}
                                onChange={(e) => setSubForm({ ...subForm, app_name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Harga per Bulan (Rp)</Label>
                                <Input
                                    inputMode="numeric"
                                    value={subForm.monthly_price ? new Intl.NumberFormat('id-ID').format(Number(subForm.monthly_price)) : ''}
                                    onChange={(e) => setSubForm({ ...subForm, monthly_price: e.target.value.replace(/\D/g, '') })}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Siklus Tagihan</Label>
                                <Select value={subForm.billing_cycle_months} onValueChange={(v) => setSubForm({ ...subForm, billing_cycle_months: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {billingCycles.map((c) => (
                                            <SelectItem key={c} value={String(c)}>{CYCLE_LABEL[c] ?? `${c} bulan`}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {Number(subForm.monthly_price) > 0 && (
                            <p className="rounded-lg border bg-muted/30 p-3 text-sm">
                                Sekali tagih:{' '}
                                <strong>
                                    {formatRupiah(Number(subForm.monthly_price) * Number(subForm.billing_cycle_months || 1))}
                                </strong>{' '}
                                setiap {subForm.billing_cycle_months} bulan.
                            </p>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Tanggal Mulai Langganan</Label>
                                <Input type="date" value={subForm.start_date} onChange={(e) => setSubForm({ ...subForm, start_date: e.target.value })} required />
                                <p className="text-[11px] text-muted-foreground">Isi tanggal aslinya, walau sudah berjalan lama.</p>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Status</Label>
                                <Select value={subForm.status} onValueChange={(v) => setSubForm({ ...subForm, status: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(STATUS_LABEL).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {subForm.status === 'ended' && (
                            <div className="space-y-1.5">
                                <Label>Tanggal Berhenti</Label>
                                <Input type="date" min={subForm.start_date} value={subForm.ended_at} onChange={(e) => setSubForm({ ...subForm, ended_at: e.target.value })} />
                            </div>
                        )}

                        {subDialog === 'create' && (
                            <div className="space-y-1.5 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/30">
                                <Label>Sudah Dibayar Berapa Bulan?</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    max={120}
                                    value={subForm.prepaid_months}
                                    onChange={(e) => setSubForm({ ...subForm, prepaid_months: e.target.value })}
                                />
                                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                                    Untuk langganan yang sudah berjalan sebelum dicatat di sistem. Isi berapa bulan yang sudah
                                    dibayar klien, dan sistem akan mencatatnya sebagai saldo awal. Isi 0 bila langganan baru mulai.
                                </p>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label>Catatan</Label>
                            <Textarea rows={2} value={subForm.notes} onChange={(e) => setSubForm({ ...subForm, notes: e.target.value })} />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setSubDialog(null)}>Batal</Button>
                            <Button type="submit" disabled={busy}>Simpan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ==================== Dialog pembayaran ==================== */}
            <Dialog open={payDialog} onOpenChange={setPayDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Catat Pembayaran</DialogTitle>
                        <DialogDescription>
                            {selected?.client_name} — {selected?.app_name}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitPayment} className="space-y-4">
                        {selected && (
                            <div className="space-y-1 rounded-lg border bg-muted/30 p-3 text-sm">
                                <p className="flex justify-between">
                                    <span className="text-muted-foreground">Terbayar sampai</span>
                                    <span className="font-medium">{fmtDate(selected.paid_through)}</span>
                                </p>
                                {selected.outstanding_amount > 0 && (
                                    <p className="flex justify-between">
                                        <span className="text-muted-foreground">Tunggakan berjalan</span>
                                        <span className="font-medium text-rose-600 dark:text-rose-400">
                                            {formatRupiah(selected.outstanding_amount)}
                                        </span>
                                    </p>
                                )}
                                <p className="flex justify-between">
                                    <span className="text-muted-foreground">Harga per bulan</span>
                                    <span className="font-medium">{formatRupiah(Number(selected.monthly_price))}</span>
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Jumlah Bulan Dibayar</Label>
                                <Input type="number" min={1} max={60} value={payForm.months} onChange={(e) => changePayMonths(e.target.value)} required />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Nominal Diterima (Rp)</Label>
                                <Input
                                    inputMode="numeric"
                                    value={payForm.amount ? new Intl.NumberFormat('id-ID').format(Number(payForm.amount)) : ''}
                                    onChange={(e) => setPayForm({ ...payForm, amount: e.target.value.replace(/\D/g, '') })}
                                    required
                                />
                                <p className="text-[11px] text-muted-foreground">Ubah bila ada potongan atau pembulatan.</p>
                            </div>
                        </div>

                        {selected && Number(payForm.months) > 0 && (
                            <p className="rounded-lg border bg-muted/30 p-3 text-sm">
                                Masa aktif diperpanjang sampai{' '}
                                <strong>
                                    {(() => {
                                        const base = selected.paid_through ?? selected.start_date;
                                        const d = new Date(`${String(base).split('T')[0]}T00:00:00`);
                                        d.setMonth(d.getMonth() + Number(payForm.months));
                                        return format(d, 'd MMMM yyyy', { locale: localeId });
                                    })()}
                                </strong>
                                .
                            </p>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Tanggal Terima</Label>
                                <Input type="date" value={payForm.paid_at} onChange={(e) => setPayForm({ ...payForm, paid_at: e.target.value })} required />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Metode</Label>
                                <Input value={payForm.method} onChange={(e) => setPayForm({ ...payForm, method: e.target.value })} placeholder="Transfer Bank / Tunai" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Referensi / Catatan</Label>
                            <Input value={payForm.reference} onChange={(e) => setPayForm({ ...payForm, reference: e.target.value })} placeholder="Nomor bukti transfer (opsional)" />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setPayDialog(false)}>Batal</Button>
                            <Button type="submit" disabled={busy}>Simpan Pembayaran</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ==================== Riwayat pembayaran ==================== */}
            <Dialog open={historyFor !== null} onOpenChange={(open) => !open && setHistoryFor(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Riwayat Pembayaran</DialogTitle>
                        <DialogDescription>
                            {historyFor?.client_name} — {historyFor?.app_name}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="max-h-[60vh] space-y-2 overflow-y-auto">
                        {historyFor?.payments?.length ? (
                            historyFor.payments.map((p) => (
                                <div key={p.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                                    <div className="min-w-0">
                                        <p className="font-medium">
                                            {formatRupiah(Number(p.amount))}
                                            <span className="ml-2 text-xs font-normal text-muted-foreground">{p.months} bulan</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Periode {fmtDate(p.period_start)} – {fmtDate(p.period_end)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Diterima {fmtDate(p.paid_at)}
                                            {p.method ? ` · ${p.method}` : ''}
                                            {p.reference ? ` · ${p.reference}` : ''}
                                        </p>
                                        {p.note && <p className="mt-1 text-xs italic text-muted-foreground">{p.note}</p>}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 shrink-0 hover:text-destructive"
                                        title="Hapus catatan ini"
                                        onClick={() => {
                                            router.delete(`/app-subscriptions/${historyFor.id}/payments/${p.id}`, {
                                                preserveScroll: true,
                                                onSuccess: () => setHistoryFor(null),
                                            });
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center text-sm text-muted-foreground">
                                Belum ada pembayaran tercatat.
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setHistoryFor(null)}>Tutup</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ==================== Dialog kategori ==================== */}
            <Dialog open={catDialog !== null} onOpenChange={(open) => !open && setCatDialog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{catDialog === 'edit' ? 'Edit Kategori' : 'Tambah Kategori Aplikasi'}</DialogTitle>
                        <DialogDescription>Kategori dipakai untuk mengelompokkan langganan dan mengisi harga bawaan.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitCat} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label>Nama Kategori</Label>
                            <Input placeholder="Contoh: POS App" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} required />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Keterangan</Label>
                            <Textarea rows={2} value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Harga Bawaan per Bulan (Rp)</Label>
                            <Input
                                inputMode="numeric"
                                value={catForm.default_monthly_price ? new Intl.NumberFormat('id-ID').format(Number(catForm.default_monthly_price)) : ''}
                                onChange={(e) => setCatForm({ ...catForm, default_monthly_price: e.target.value.replace(/\D/g, '') })}
                            />
                            <p className="text-[11px] text-muted-foreground">Terisi otomatis saat kategori ini dipilih, dan masih bisa diubah per langganan.</p>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                                <Label>Kategori Aktif</Label>
                                <p className="text-[11px] text-muted-foreground">Kategori nonaktif tidak muncul saat menambah langganan baru.</p>
                            </div>
                            <Switch checked={catForm.is_active} onCheckedChange={(v) => setCatForm({ ...catForm, is_active: v })} />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setCatDialog(null)}>Batal</Button>
                            <Button type="submit" disabled={busy}>Simpan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ==================== Konfirmasi hapus ==================== */}
            <Dialog open={deleteSub !== null} onOpenChange={(open) => !open && setDeleteSub(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Langganan</DialogTitle>
                        <DialogDescription>
                            Hapus langganan <strong>{deleteSub?.app_name}</strong> milik <strong>{deleteSub?.client_name}</strong>?
                            Seluruh riwayat pembayarannya ({deleteSub?.payments?.length ?? 0} catatan) ikut terhapus permanen.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteSub(null)}>Batal</Button>
                        <Button
                            variant="destructive"
                            disabled={busy}
                            onClick={() => {
                                setBusy(true);
                                router.delete(`/app-subscriptions/${deleteSub?.id}`, {
                                    preserveScroll: true,
                                    onSuccess: () => setDeleteSub(null),
                                    onFinish: () => setBusy(false),
                                });
                            }}
                        >
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteCat !== null} onOpenChange={(open) => !open && setDeleteCat(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Kategori</DialogTitle>
                        <DialogDescription>Hapus kategori <strong>{deleteCat?.name}</strong>?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteCat(null)}>Batal</Button>
                        <Button
                            variant="destructive"
                            disabled={busy}
                            onClick={() => {
                                setBusy(true);
                                router.delete(`/app-categories/${deleteCat?.id}`, {
                                    preserveScroll: true,
                                    onSuccess: () => setDeleteCat(null),
                                    onFinish: () => setBusy(false),
                                });
                            }}
                        >
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

AppSubscriptionsIndex.layout = {
    breadcrumbs: [{ title: 'Langganan Aplikasi', href: '/app-subscriptions' }],
};

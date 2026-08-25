import { Head, useForm, router, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    Plus, MoreVertical, Edit2, Trash2, LayoutGrid, List, BarChart3, Search, X, CalendarClock,
    AlertTriangle, CheckCircle2, User as UserIcon, Megaphone, Target, Link2, Share2, Send, ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { avatarColor } from '@/lib/project-colors';

const PLATFORMS = ['Instagram', 'Facebook', 'Twitter/X', 'TikTok', 'LinkedIn', 'YouTube', 'Website/Blog'];
const CONTENT_TYPES = ['Post', 'Story', 'Reel', 'Video', 'Article', 'Carousel', 'Thread'];
const STATUSES = ['Draft', 'Scheduled', 'Published', 'Cancelled'] as const;

/** Nilai tersimpan berupa slug; tampilkan nama yang terbaca manusia. */
const GOALS: Record<string, string> = {
    ctechagency: 'C-Tech Agency',
    officialperusahaan: 'Official Perusahaan',
    ctechpaylo: 'C-Tech Paylo',
    ctechbooth: 'C-Tech Booth',
};

const STATUS_META: Record<string, { label: string; dot: string; rule: string; chip: string }> = {
    Draft: {
        label: 'Draft',
        dot: 'bg-slate-400',
        rule: 'bg-slate-300 dark:bg-slate-600',
        chip: 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300',
    },
    Scheduled: {
        label: 'Terjadwal',
        dot: 'bg-blue-500',
        rule: 'bg-blue-500',
        chip: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300',
    },
    Published: {
        label: 'Tayang',
        dot: 'bg-emerald-500',
        rule: 'bg-emerald-500',
        chip: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300',
    },
    Cancelled: {
        label: 'Dibatalkan',
        dot: 'bg-rose-500',
        rule: 'bg-rose-500',
        chip: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300',
    },
};

const PLATFORM_CHIP: Record<string, string> = {
    Instagram: 'border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-900 dark:bg-pink-950/40 dark:text-pink-300',
    Facebook: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300',
    'Twitter/X': 'border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200',
    TikTok: 'border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200',
    LinkedIn: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300',
    YouTube: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300',
    'Website/Blog': 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300',
};

const todayKey = () => new Date().toISOString().slice(0, 10);

const dateOnly = (value?: string | null) => (value ? String(value).split('T')[0] : '');

const formatDate = (value?: string | null) =>
    value
        ? new Date(`${dateOnly(value)}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        : null;

const initials = (name?: string) => (name ? name.trim().charAt(0).toUpperCase() : '?');

const emptyForm = {
    media: null as File | null,
    remove_media: false as boolean,
    auto_publish: false as boolean,
    publish_targets: [] as string[],
    title: '',
    description: '',
    platform: 'Instagram',
    content_type: 'Post',
    status: 'Draft',
    scheduled_date: '',
    published_date: '',
    notes: '',
    campaign_name: '',
    brief: '',
    visual: '',
    reference_links: '',
    visual_assets_url: '',
    target_audience: '',
    keywords: '',
    tujuan_konten: '',
    assigned_to: '',
};

type SocialConfig = {
    enabled: boolean;
    simulation: boolean;
    platforms: { platform: string; label: string; media: string }[];
    ready: string[];
};

export default function ContentPlansIndex({
    contentPlans,
    staffUsers,
    canAssign,
    social,
}: {
    contentPlans: any[];
    staffUsers: any[];
    userRole: string;
    canAssign: boolean;
    social: SocialConfig;
}) {
    const [viewMode, setViewMode] = useState<'kanban' | 'tabel'>('kanban');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [draggedPlan, setDraggedPlan] = useState<any>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

    const [search, setSearch] = useState('');
    const [platformFilter, setPlatformFilter] = useState('all');
    const [goalFilter, setGoalFilter] = useState('all');
    const [assigneeFilter, setAssigneeFilter] = useState('all');

    const { data, setData, post, put, processing, errors, reset } = useForm({ ...emptyForm });

    /** Relasi assignedTo diserialisasi sebagai objek pada kunci `assigned_to`. */
    const assigneeOf = (plan: any) => (plan?.assigned_to && typeof plan.assigned_to === 'object' ? plan.assigned_to : null);

    const openCreate = (status?: string) => {
        reset();
        setData({ ...emptyForm, status: status ?? 'Draft' });
        setIsCreateOpen(true);
    };

    const openEdit = (plan: any) => {
        setSelectedPlan(plan);
        setData({
            title: plan.title ?? '',
            description: plan.description ?? '',
            platform: plan.platform ?? 'Instagram',
            content_type: plan.content_type ?? 'Post',
            status: plan.status ?? 'Draft',
            scheduled_date: dateOnly(plan.scheduled_date),
            published_date: dateOnly(plan.published_date),
            notes: plan.notes ?? '',
            campaign_name: plan.campaign_name ?? '',
            brief: plan.brief ?? '',
            visual: plan.visual ?? '',
            reference_links: plan.reference_links ?? '',
            visual_assets_url: plan.visual_assets_url ?? '',
            target_audience: plan.target_audience ?? '',
            keywords: plan.keywords ?? '',
            tujuan_konten: plan.tujuan_konten ?? '',
            assigned_to: assigneeOf(plan)?.id ? String(assigneeOf(plan).id) : '',
            media: null,
            remove_media: false,
            auto_publish: Boolean(plan.auto_publish),
            publish_targets: plan.publish_targets ?? [],
        });
        setIsEditOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/content-plans', { forceFormData: true, onSuccess: () => { setIsCreateOpen(false); reset(); } });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        // Inertia tidak mendukung PUT dengan FormData, jadi disamarkan lewat POST + _method
        router.post(
            `/content-plans/${selectedPlan?.id}`,
            { _method: 'put', ...data } as any,
            { forceFormData: true, onSuccess: () => { setIsEditOpen(false); reset(); } },
        );
    };

    const publishNow = (plan: any) => {
        router.post(`/content-plans/${plan.id}/publish`, {}, { preserveScroll: true });
    };

    const togglePublishTarget = (platform: string) => {
        const current = data.publish_targets ?? [];
        setData(
            'publish_targets',
            current.includes(platform) ? current.filter((p: string) => p !== platform) : [...current, platform],
        );
    };

    const submitDelete = (e: React.FormEvent) => {
        e.preventDefault();
        router.delete(`/content-plans/${selectedPlan?.id}`, { onSuccess: () => setIsDeleteOpen(false) });
    };

    const changeStatus = (plan: any, status: string) => {
        // Endpoint khusus status — tidak mengirim ulang seluruh isi form
        router.put(`/content-plans/${plan.id}/status`, { status }, { preserveScroll: true });
    };

    const handleDrop = (e: React.DragEvent, status: string) => {
        e.preventDefault();
        setDragOverColumn(null);
        if (draggedPlan && draggedPlan.status !== status) changeStatus(draggedPlan, status);
        setDraggedPlan(null);
    };

    const isOverdue = (plan: any) =>
        plan.scheduled_date &&
        !['Published', 'Cancelled'].includes(plan.status) &&
        dateOnly(plan.scheduled_date) < todayKey();

    const visiblePlans = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return contentPlans.filter((plan) => {
            if (platformFilter !== 'all' && plan.platform !== platformFilter) return false;
            if (goalFilter !== 'all' && plan.tujuan_konten !== goalFilter) return false;

            if (assigneeFilter === 'unassigned' && assigneeOf(plan)) return false;
            if (assigneeFilter !== 'all' && assigneeFilter !== 'unassigned') {
                if (String(assigneeOf(plan)?.id ?? '') !== assigneeFilter) return false;
            }

            if (keyword) {
                const haystack = `${plan.title ?? ''} ${plan.description ?? ''} ${plan.campaign_name ?? ''} ${plan.keywords ?? ''}`.toLowerCase();
                if (!haystack.includes(keyword)) return false;
            }
            return true;
        });
    }, [contentPlans, search, platformFilter, goalFilter, assigneeFilter]);

    const stats = useMemo(() => {
        const overdue = visiblePlans.filter(isOverdue).length;
        const scheduledSoon = visiblePlans.filter((p) => {
            if (p.status !== 'Scheduled' || !p.scheduled_date) return false;
            const date = dateOnly(p.scheduled_date);
            const in7 = new Date();
            in7.setDate(in7.getDate() + 7);
            return date >= todayKey() && date <= in7.toISOString().slice(0, 10);
        }).length;

        return {
            total: visiblePlans.length,
            published: visiblePlans.filter((p) => p.status === 'Published').length,
            scheduledSoon,
            overdue,
        };
    }, [visiblePlans]);

    const hasFilter = search !== '' || platformFilter !== 'all' || goalFilter !== 'all' || assigneeFilter !== 'all';

    const clearFilters = () => {
        setSearch('');
        setPlatformFilter('all');
        setGoalFilter('all');
        setAssigneeFilter('all');
    };

    /* ============================ Form ============================ */
    const formFields = (
        <div className="grid max-h-[65vh] grid-cols-1 gap-6 overflow-y-auto pr-1 md:grid-cols-2">
            <div className="space-y-4">
                <h4 className="border-b pb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Informasi Konten
                </h4>

                <div className="space-y-1.5">
                    <Label>Judul Konten</Label>
                    <Input
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="Contoh: Tips memilih vendor photobooth"
                        required
                    />
                    {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label>Platform</Label>
                        <Select value={data.platform} onValueChange={(v) => setData('platform', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Format</Label>
                        <Select value={data.content_type} onValueChange={(v) => setData('content_type', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {CONTENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label>Caption / Deskripsi</Label>
                    <Textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Naskah caption yang akan diunggah."
                        className="min-h-[90px]"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label>Status</Label>
                        <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_META[s].label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Tujuan Konten</Label>
                        <Select value={data.tujuan_konten} onValueChange={(v) => setData('tujuan_konten', v)}>
                            <SelectTrigger><SelectValue placeholder="Pilih tujuan" /></SelectTrigger>
                            <SelectContent>
                                {Object.entries(GOALS).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label>Tanggal Tayang (Rencana)</Label>
                        <Input type="date" value={data.scheduled_date} onChange={(e) => setData('scheduled_date', e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Tanggal Tayang (Aktual)</Label>
                        <Input type="date" value={data.published_date} onChange={(e) => setData('published_date', e.target.value)} />
                        <p className="text-[11px] text-muted-foreground">Terisi otomatis saat status Tayang.</p>
                    </div>
                </div>

                {canAssign && (
                    <div className="space-y-1.5">
                        <Label>Penanggung Jawab</Label>
                        <Select value={data.assigned_to} onValueChange={(v) => setData('assigned_to', v)}>
                            <SelectTrigger><SelectValue placeholder="Belum ditugaskan" /></SelectTrigger>
                            <SelectContent>
                                {staffUsers.map((user: any) => (
                                    <SelectItem key={user.id} value={String(user.id)}>{user.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Media untuk diposting */}
                <div className="space-y-1.5">
                    <Label>Gambar / Video</Label>
                    <Input
                        type="file"
                        accept="image/jpeg,image/png,video/mp4,video/quicktime"
                        onChange={(e) => setData('media', e.target.files?.[0] ?? null)}
                    />
                    <p className="text-[11px] text-muted-foreground">
                        JPG, PNG, MP4, atau MOV — maksimal 50MB. Wajib bila ingin posting ke Instagram atau TikTok.
                    </p>
                    {errors.media && <p className="text-xs text-destructive">{errors.media}</p>}

                    {selectedPlan?.media_path && !data.media && (
                        <label className="flex cursor-pointer items-center gap-2 text-[11px] text-muted-foreground">
                            <input
                                type="checkbox"
                                checked={data.remove_media}
                                onChange={(e) => setData('remove_media', e.target.checked)}
                                className="rounded border-input"
                            />
                            Hapus media yang tersimpan
                        </label>
                    )}
                </div>

                {/* Posting otomatis */}
                {social?.enabled && (
                    <div className="space-y-2 rounded-lg border p-3">
                        <label className="flex items-start justify-between gap-3">
                            <span>
                                <span className="text-sm font-medium">Posting otomatis ke media sosial</span>
                                <span className="mt-0.5 block text-[11px] text-muted-foreground">
                                    Dikirim saat status berubah menjadi Tayang.
                                    {social.simulation && ' Mode simulasi aktif — belum ada yang benar-benar terkirim.'}
                                </span>
                            </span>
                            <Switch
                                checked={data.auto_publish}
                                onCheckedChange={(checked) => setData('auto_publish', checked)}
                            />
                        </label>

                        {data.auto_publish && (
                            <div className="flex flex-wrap gap-1.5 border-t pt-2">
                                {social.platforms.map((p) => {
                                    const active = (data.publish_targets ?? []).includes(p.platform);
                                    const ready = social.ready.includes(p.platform);

                                    return (
                                        <button
                                            key={p.platform}
                                            type="button"
                                            onClick={() => togglePublishTarget(p.platform)}
                                            className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                                                active
                                                    ? 'border-primary bg-primary text-primary-foreground'
                                                    : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted'
                                            }`}
                                            title={ready ? p.label : `${p.label} — akun belum aktif/kredensial belum lengkap`}
                                        >
                                            {p.label}
                                            {!ready && ' ⚠'}
                                        </button>
                                    );
                                })}
                                <p className="w-full text-[11px] text-muted-foreground">
                                    Tanpa memilih platform, konten dikirim ke semua akun yang aktif.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <h4 className="border-b pb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Strategi & Materi
                </h4>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label>Nama Campaign</Label>
                        <Input
                            value={data.campaign_name}
                            onChange={(e) => setData('campaign_name', e.target.value)}
                            placeholder="Promo Ramadhan"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Target Audiens</Label>
                        <Input
                            value={data.target_audience}
                            onChange={(e) => setData('target_audience', e.target.value)}
                            placeholder="Mahasiswa 18–24 th"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label>Brief</Label>
                    <Textarea
                        value={data.brief}
                        onChange={(e) => setData('brief', e.target.value)}
                        placeholder="Pesan utama, tone, dan hal yang wajib ada."
                        className="min-h-[80px]"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label>Konsep Visual</Label>
                    <Textarea
                        value={data.visual}
                        onChange={(e) => setData('visual', e.target.value)}
                        placeholder="Deskripsi visual, warna, atau storyboard singkat."
                        className="min-h-[70px]"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label>Link Aset Visual</Label>
                    <Input
                        type="url"
                        value={data.visual_assets_url}
                        onChange={(e) => setData('visual_assets_url', e.target.value)}
                        placeholder="https://drive.google.com/..."
                    />
                </div>

                <div className="space-y-1.5">
                    <Label>Link Referensi</Label>
                    <Textarea
                        value={data.reference_links}
                        onChange={(e) => setData('reference_links', e.target.value)}
                        placeholder="Satu link per baris."
                        className="min-h-[60px]"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label>Kata Kunci / Hashtag</Label>
                    <Input
                        value={data.keywords}
                        onChange={(e) => setData('keywords', e.target.value)}
                        placeholder="#photobooth, #kendari"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label>Catatan Internal</Label>
                    <Textarea
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                        placeholder="Catatan yang tidak ikut tayang."
                        className="min-h-[60px]"
                    />
                </div>
            </div>
        </div>
    );

    /* ============================ Kartu ============================ */
    const PlanCard = ({ plan }: { plan: any }) => {
        const assignee = assigneeOf(plan);
        const overdue = isOverdue(plan);
        const scheduled = formatDate(plan.scheduled_date);

        return (
            <div
                draggable
                onDragStart={() => setDraggedPlan(plan)}
                onDragEnd={() => { setDraggedPlan(null); setDragOverColumn(null); }}
                className={`group cursor-grab rounded-lg border bg-card p-3  transition-shadow hover: active:cursor-grabbing ${
                    draggedPlan?.id === plan.id ? 'opacity-40' : ''
                }`}
            >
                <div className="mb-2 flex items-start justify-between gap-2">
                    <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                            PLATFORM_CHIP[plan.platform] ?? 'border-border bg-muted text-muted-foreground'
                        }`}
                    >
                        {plan.platform}
                    </span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="-mr-1 -mt-1 h-7 w-7 shrink-0 p-0 opacity-0 transition-opacity group-hover:opacity-100">
                                <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(plan)}>
                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            {social?.enabled && (
                                <DropdownMenuItem onClick={() => publishNow(plan)}>
                                    <Send className="mr-2 h-4 w-4" /> Kirim ke media sosial
                                </DropdownMenuItem>
                            )}
                            {STATUSES.filter((s) => s !== plan.status).map((s) => (
                                <DropdownMenuItem key={s} onClick={() => changeStatus(plan, s)}>
                                    <span className={`mr-2 h-2 w-2 rounded-full ${STATUS_META[s].dot}`} />
                                    Pindah ke {STATUS_META[s].label}
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuItem
                                onClick={() => { setSelectedPlan(plan); setIsDeleteOpen(true); }}
                                className="text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <button
                    type="button"
                    onClick={() => openEdit(plan)}
                    className="mb-1 block w-full text-left text-sm font-semibold leading-snug hover:underline"
                >
                    {plan.title}
                </button>

                <p className="mb-2 text-[11px] text-muted-foreground">
                    {plan.content_type}
                    {plan.campaign_name ? ` · ${plan.campaign_name}` : ''}
                </p>

                {plan.description && (
                    <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{plan.description}</p>
                )}

                <div className="mb-2 flex flex-wrap gap-1">
                    {plan.tujuan_konten && (
                        <span className="inline-flex items-center gap-1 rounded border bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            <Target className="h-3 w-3" />
                            {GOALS[plan.tujuan_konten] ?? plan.tujuan_konten}
                        </span>
                    )}
                    {plan.media_path && (
                        <span className="inline-flex items-center gap-1 rounded border bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            <ImageIcon className="h-3 w-3" /> Media siap
                        </span>
                    )}
                    {plan.auto_publish && (
                        <span className="inline-flex items-center gap-1 rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                            <Share2 className="h-3 w-3" /> Auto-post
                        </span>
                    )}
                </div>

                {/* Status pengiriman per platform */}
                {plan.social_posts?.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                        {plan.social_posts.map((sp: any) => {
                            const tone =
                                sp.status === 'published'
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
                                    : sp.status === 'failed'
                                        ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300'
                                        : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300';

                            return (
                                <span
                                    key={sp.id}
                                    className={`rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${tone}`}
                                    title={sp.message ?? sp.status}
                                >
                                    {sp.platform}
                                    {sp.simulated ? ' (sim)' : ''}
                                </span>
                            );
                        })}
                    </div>
                )}

                <div className="flex items-center justify-between gap-2 border-t pt-2">
                    <div className="flex min-w-0 items-center gap-2">
                        {assignee ? (
                            <span
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${avatarColor(assignee.name)}`}
                                title={assignee.name}
                            >
                                {initials(assignee.name)}
                            </span>
                        ) : (
                            <span className="text-[11px] italic text-muted-foreground">Belum ditugaskan</span>
                        )}
                        {plan.visual_assets_url && (
                            <a
                                href={plan.visual_assets_url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-muted-foreground hover:text-foreground"
                                title="Buka aset visual"
                            >
                                <Link2 className="h-3.5 w-3.5" />
                            </a>
                        )}
                    </div>

                    {scheduled && (
                        <span
                            className={`flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-[11px] ${
                                overdue
                                    ? 'bg-rose-50 font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                                    : 'text-muted-foreground'
                            }`}
                            title={overdue ? 'Lewat jadwal tayang' : 'Jadwal tayang'}
                        >
                            <CalendarClock className="h-3.5 w-3.5" />
                            {scheduled}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <Head title="Content Planning" />
            <div className="flex flex-1 flex-col gap-4 p-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Content Planning</h2>
                        <p className="text-sm text-muted-foreground">
                            Rencanakan, jadwalkan, dan pantau konten di seluruh platform.
                        </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/content-plans/report">
                                <BarChart3 className="mr-2 h-4 w-4" /> Laporan
                            </Link>
                        </Button>
                        <Button onClick={() => openCreate()}>
                            <Plus className="mr-2 h-4 w-4" /> Konten Baru
                        </Button>
                    </div>
                </div>

                {/* Ringkasan */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                        { label: 'Total Konten', value: stats.total, icon: Megaphone, tone: 'text-foreground' },
                        { label: 'Tayang 7 Hari Lagi', value: stats.scheduledSoon, icon: CalendarClock, tone: 'text-foreground' },
                        { label: 'Sudah Tayang', value: stats.published, icon: CheckCircle2, tone: 'text-emerald-600 dark:text-emerald-400' },
                        {
                            label: 'Lewat Jadwal',
                            value: stats.overdue,
                            icon: AlertTriangle,
                            tone: stats.overdue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-foreground',
                        },
                    ].map((stat) => (
                        <div key={stat.label} className="rounded-lg border bg-card p-3.5">
                            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                <stat.icon className="h-3.5 w-3.5" />
                                {stat.label}
                            </p>
                            <p className={`mt-1 text-2xl font-bold leading-none ${stat.tone}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Filter */}
                <div className="flex flex-col gap-2 rounded-lg border bg-card p-3 lg:flex-row lg:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari judul, caption, campaign, atau hashtag…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-9 pl-9"
                        />
                    </div>

                    <Select value={platformFilter} onValueChange={setPlatformFilter}>
                        <SelectTrigger className="h-9 w-full lg:w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua platform</SelectItem>
                            {PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                    </Select>

                    <Select value={goalFilter} onValueChange={setGoalFilter}>
                        <SelectTrigger className="h-9 w-full lg:w-44"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua tujuan</SelectItem>
                            {Object.entries(GOALS).map(([value, label]) => (
                                <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                        <SelectTrigger className="h-9 w-full lg:w-44"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua PIC</SelectItem>
                            <SelectItem value="unassigned">Belum ditugaskan</SelectItem>
                            {staffUsers.map((u: any) => (
                                <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {hasFilter && (
                        <Button variant="ghost" className="h-9 shrink-0" onClick={clearFilters}>
                            <X className="mr-1.5 h-4 w-4" /> Reset
                        </Button>
                    )}

                    <div className="inline-flex shrink-0 rounded-lg border bg-muted/40 p-0.5">
                        {(['kanban', 'tabel'] as const).map((mode) => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => setViewMode(mode)}
                                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium capitalize transition-colors ${
                                    viewMode === mode ? 'bg-background ' : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {mode === 'kanban' ? <LayoutGrid className="h-3.5 w-3.5" /> : <List className="h-3.5 w-3.5" />}
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Isi */}
                {viewMode === 'kanban' ? (
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {STATUSES.map((status) => {
                            const meta = STATUS_META[status];
                            const columnPlans = visiblePlans.filter((p) => p.status === status);
                            const isOver = dragOverColumn === status;

                            return (
                                <div
                                    key={status}
                                    onDragOver={(e) => { e.preventDefault(); setDragOverColumn(status); }}
                                    onDragLeave={() => setDragOverColumn(null)}
                                    onDrop={(e) => handleDrop(e, status)}
                                    className={`flex min-w-[300px] flex-1 flex-col rounded-lg border bg-muted/20 transition-colors ${
                                        isOver ? 'border-primary bg-primary/5' : ''
                                    }`}
                                >
                                    <div className={`h-1 rounded-t-xl ${meta.rule}`} />
                                    <div className="flex items-center justify-between px-3 py-2.5">
                                        <span className="flex items-center gap-2">
                                            <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                                            <h3 className="text-sm font-semibold">{meta.label}</h3>
                                            <span className="rounded bg-background px-1.5 text-xs font-medium text-muted-foreground">
                                                {columnPlans.length}
                                            </span>
                                        </span>
                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openCreate(status)}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="flex min-h-[220px] flex-col gap-2.5 p-2.5 pt-0">
                                        {columnPlans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}

                                        {columnPlans.length === 0 && (
                                            <button
                                                type="button"
                                                onClick={() => openCreate(status)}
                                                className="flex min-h-[90px] w-full items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                                            >
                                                {hasFilter ? 'Tidak ada yang cocok' : '+ Tambah konten'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-lg border bg-card">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/30">
                                    <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                                        <th className="px-4 py-2.5 font-medium">Konten</th>
                                        <th className="px-4 py-2.5 font-medium">Platform</th>
                                        <th className="px-4 py-2.5 font-medium">Tujuan</th>
                                        <th className="px-4 py-2.5 font-medium">Jadwal</th>
                                        <th className="px-4 py-2.5 font-medium">PIC</th>
                                        <th className="px-4 py-2.5 font-medium">Status</th>
                                        <th className="px-4 py-2.5 text-right font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {visiblePlans.map((plan) => {
                                        const assignee = assigneeOf(plan);
                                        const overdue = isOverdue(plan);

                                        return (
                                            <tr key={plan.id} className="transition-colors hover:bg-muted/30">
                                                <td className="max-w-[280px] px-4 py-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEdit(plan)}
                                                        className="block truncate text-left font-medium hover:underline"
                                                    >
                                                        {plan.title}
                                                    </button>
                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {plan.content_type}
                                                        {plan.campaign_name ? ` · ${plan.campaign_name}` : ''}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                                                            PLATFORM_CHIP[plan.platform] ?? 'border-border bg-muted text-muted-foreground'
                                                        }`}
                                                    >
                                                        {plan.platform}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                                    {plan.tujuan_konten ? (GOALS[plan.tujuan_konten] ?? plan.tujuan_konten) : '—'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {formatDate(plan.scheduled_date) ? (
                                                        <span
                                                            className={`flex items-center gap-1 text-xs ${
                                                                overdue ? 'font-medium text-rose-600 dark:text-rose-400' : 'text-muted-foreground'
                                                            }`}
                                                        >
                                                            <CalendarClock className="h-3.5 w-3.5" />
                                                            {formatDate(plan.scheduled_date)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">—</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {assignee ? (
                                                        <span className="flex items-center gap-1.5 text-xs">
                                                            <span
                                                                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${avatarColor(assignee.name)}`}
                                                            >
                                                                {initials(assignee.name)}
                                                            </span>
                                                            <span className="truncate">{assignee.name}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-xs italic text-muted-foreground">
                                                            <UserIcon className="h-3.5 w-3.5" /> Belum ada
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Select value={plan.status} onValueChange={(v) => changeStatus(plan, v)}>
                                                        <SelectTrigger className={`h-7 w-[130px] border text-xs font-medium ${STATUS_META[plan.status]?.chip ?? ''}`}>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {STATUSES.map((s) => (
                                                                <SelectItem key={s} value={s}>{STATUS_META[s].label}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => openEdit(plan)}>
                                                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => { setSelectedPlan(plan); setIsDeleteOpen(true); }}
                                                                className="text-destructive"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {visiblePlans.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                                                {hasFilter ? 'Tidak ada konten yang cocok dengan filter.' : 'Belum ada konten yang direncanakan.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal buat */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Konten Baru</DialogTitle>
                        <DialogDescription>Hanya judul, platform, dan format yang wajib diisi.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate}>
                        {formFields}
                        <DialogFooter className="mt-4 border-t pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing}>Simpan Konten</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal edit */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Edit Konten</DialogTitle>
                        <DialogDescription>Perbarui detail {selectedPlan?.title}.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit}>
                        {formFields}
                        <DialogFooter className="mt-4 border-t pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing}>Simpan Perubahan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal hapus */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Konten</DialogTitle>
                        <DialogDescription>
                            Yakin ingin menghapus <span className="font-semibold">{selectedPlan?.title}</span>? Tindakan ini tidak bisa dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitDelete}>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
                            <Button type="submit" variant="destructive" disabled={processing}>Hapus</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

ContentPlansIndex.layout = {
    breadcrumbs: [{ title: 'Content Planning', href: '/content-plans' }],
};

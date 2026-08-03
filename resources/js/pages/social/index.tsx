import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Share2, CheckCircle2, AlertTriangle, ExternalLink, FlaskConical, Unplug, KeyRound, Info, Clock, XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

type Platform = {
    platform: string;
    label: string;
    media: 'required' | 'optional' | 'video';
    docs: string | null;
    setup_hint: string | null;
    credential_fields: Record<string, string>;
    is_enabled: boolean;
    display_name: string | null;
    filled: Record<string, boolean>;
    has_credentials: boolean;
    last_error: string | null;
    updated_at: string | null;
};

type Post = {
    id: number;
    platform: string;
    platform_label: string;
    title: string;
    status: string;
    simulated: boolean;
    message: string | null;
    permalink: string | null;
    attempts: number;
    published_at: string | null;
    created_at: string | null;
};

const MEDIA_NOTE: Record<string, string> = {
    required: 'Wajib ada gambar atau video',
    optional: 'Gambar opsional',
    video: 'Hanya menerima video',
};

const STATUS_META: Record<string, { label: string; chip: string; icon: any }> = {
    published: {
        label: 'Terkirim',
        chip: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300',
        icon: CheckCircle2,
    },
    pending: {
        label: 'Menunggu',
        chip: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300',
        icon: Clock,
    },
    processing: {
        label: 'Diproses',
        chip: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300',
        icon: Clock,
    },
    failed: {
        label: 'Gagal',
        chip: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300',
        icon: XCircle,
    },
    skipped: {
        label: 'Dilewati',
        chip: 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300',
        icon: Info,
    },
};

export default function SocialAccountsIndex({
    platforms,
    featureEnabled,
    simulationMode,
    recentPosts,
}: {
    platforms: Platform[];
    featureEnabled: boolean;
    simulationMode: boolean;
    recentPosts: Post[];
}) {
    const [editing, setEditing] = useState<Platform | null>(null);
    const [form, setForm] = useState<Record<string, string>>({});
    const [displayName, setDisplayName] = useState('');
    const [saving, setSaving] = useState(false);

    const openEditor = (platform: Platform) => {
        setEditing(platform);
        setDisplayName(platform.display_name ?? platform.label);
        setForm(Object.fromEntries(Object.keys(platform.credential_fields).map((k) => [k, ''])));
    };

    const toggleEnabled = (platform: Platform, enabled: boolean) => {
        router.put(
            `/social-accounts/${platform.platform}`,
            { is_enabled: enabled, display_name: platform.display_name ?? platform.label, credentials: {} },
            { preserveScroll: true },
        );
    };

    const saveCredentials = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;

        setSaving(true);
        router.put(
            `/social-accounts/${editing.platform}`,
            { is_enabled: editing.is_enabled, display_name: displayName, credentials: form },
            {
                preserveScroll: true,
                onSuccess: () => setEditing(null),
                onFinish: () => setSaving(false),
            },
        );
    };

    const disconnect = (platform: Platform) => {
        router.delete(`/social-accounts/${platform.platform}`, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Akun Media Sosial" />
            <div className="flex flex-1 flex-col gap-5 p-6">
                <div>
                    <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                        <Share2 className="h-6 w-6 text-muted-foreground" /> Akun Media Sosial
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Sambungkan akun agar konten dari Content Planning bisa diposting otomatis saat statusnya menjadi Tayang.
                    </p>
                </div>

                {/* Status sistem */}
                {!featureEnabled ? (
                    <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm dark:border-rose-900 dark:bg-rose-950/40">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                        <div>
                            <p className="font-medium text-rose-800 dark:text-rose-300">Fitur posting otomatis sedang dimatikan</p>
                            <p className="text-rose-700 dark:text-rose-400">
                                Tidak ada data yang dikirim ke platform mana pun. Aktifkan lewat <code>SOCIAL_PUBLISHING_ENABLED=true</code> pada file .env.
                            </p>
                        </div>
                    </div>
                ) : simulationMode ? (
                    <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-950/40">
                        <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                        <div>
                            <p className="font-medium text-amber-800 dark:text-amber-300">Mode simulasi aktif</p>
                            <p className="text-amber-700 dark:text-amber-400">
                                Seluruh alur berjalan normal dan riwayat tercatat, tetapi <strong>tidak ada</strong> yang benar-benar
                                dikirim ke media sosial. Aman untuk mencoba. Setelah kredensial siap, ubah{' '}
                                <code>SOCIAL_PUBLISHING_SIMULATE=false</code> pada file .env.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm dark:border-emerald-900 dark:bg-emerald-950/40">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <p className="text-emerald-800 dark:text-emerald-300">
                            Mode aktif — konten akan benar-benar diposting ke platform yang kredensialnya lengkap dan sakelarnya menyala.
                        </p>
                    </div>
                )}

                {/* Daftar platform */}
                <div className="grid gap-4 md:grid-cols-2">
                    {platforms.map((platform) => {
                        const ready = platform.has_credentials;

                        return (
                            <div key={platform.platform} className="flex flex-col rounded-xl border bg-card shadow-sm">
                                <div className="flex items-start justify-between gap-3 border-b p-4">
                                    <div className="min-w-0">
                                        <h3 className="font-semibold">{platform.display_name ?? platform.label}</h3>
                                        <p className="text-xs text-muted-foreground">{MEDIA_NOTE[platform.media]}</p>
                                    </div>
                                    <Switch
                                        checked={platform.is_enabled}
                                        onCheckedChange={(checked) => toggleEnabled(platform, checked)}
                                        title={platform.is_enabled ? 'Nonaktifkan' : 'Aktifkan'}
                                    />
                                </div>

                                <div className="flex-1 space-y-3 p-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span
                                            className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                                                ready
                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
                                                    : 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300'
                                            }`}
                                        >
                                            {ready ? 'Kredensial lengkap' : 'Kredensial belum diisi'}
                                        </span>
                                        <span
                                            className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                                                platform.is_enabled
                                                    ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300'
                                                    : 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300'
                                            }`}
                                        >
                                            {platform.is_enabled ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </div>

                                    {platform.setup_hint && (
                                        <p className="rounded-lg border bg-muted/30 p-2.5 text-[11px] leading-relaxed text-muted-foreground">
                                            {platform.setup_hint}
                                        </p>
                                    )}

                                    {platform.last_error && (
                                        <p className="rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-[11px] text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
                                            {platform.last_error}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between gap-2 border-t p-3">
                                    {platform.docs ? (
                                        <a
                                            href={platform.docs}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground hover:underline"
                                        >
                                            Dokumentasi <ExternalLink className="h-3 w-3" />
                                        </a>
                                    ) : (
                                        <span />
                                    )}
                                    <div className="flex gap-2">
                                        {ready && (
                                            <Button variant="ghost" size="sm" onClick={() => disconnect(platform)}>
                                                <Unplug className="mr-1.5 h-3.5 w-3.5" /> Putuskan
                                            </Button>
                                        )}
                                        <Button size="sm" onClick={() => openEditor(platform)}>
                                            <KeyRound className="mr-1.5 h-3.5 w-3.5" /> {ready ? 'Ubah' : 'Isi'} Kredensial
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Riwayat pengiriman */}
                <div className="rounded-xl border bg-card shadow-sm">
                    <div className="border-b p-4">
                        <h3 className="font-semibold">Riwayat Pengiriman</h3>
                        <p className="text-xs text-muted-foreground">20 pengiriman terakhir ke media sosial.</p>
                    </div>

                    {recentPosts.length === 0 ? (
                        <div className="py-12 text-center">
                            <Share2 className="mx-auto mb-2 h-9 w-9 text-muted-foreground/25" />
                            <p className="text-sm text-muted-foreground">Belum ada konten yang dikirim.</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {recentPosts.map((post) => {
                                const meta = STATUS_META[post.status] ?? STATUS_META.pending;
                                const Icon = meta.icon;

                                return (
                                    <div key={post.id} className="flex items-start justify-between gap-3 p-3.5">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">{post.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {post.platform_label}
                                                {post.attempts > 1 ? ` · percobaan ke-${post.attempts}` : ''}
                                                {post.published_at ? ` · ${post.published_at}` : ''}
                                            </p>
                                            {post.message && (
                                                <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">{post.message}</p>
                                            )}
                                        </div>
                                        <div className="flex shrink-0 items-center gap-2">
                                            {post.simulated && (
                                                <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                                                    Simulasi
                                                </span>
                                            )}
                                            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${meta.chip}`}>
                                                <Icon className="h-3 w-3" />
                                                {meta.label}
                                            </span>
                                            {post.permalink && (
                                                <a href={post.permalink} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Form kredensial */}
            <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Kredensial {editing?.label}</DialogTitle>
                        <DialogDescription>
                            Nilai disimpan terenkripsi dan tidak pernah ditampilkan kembali. Kosongkan kolom bila tidak ingin mengubahnya.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={saveCredentials} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label>Nama Tampilan</Label>
                            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder={editing?.label} />
                        </div>

                        {editing &&
                            Object.entries(editing.credential_fields).map(([key, label]) => (
                                <div key={key} className="space-y-1.5">
                                    <Label>
                                        {label}
                                        {editing.filled[key] && (
                                            <span className="ml-2 text-[11px] font-normal text-emerald-600 dark:text-emerald-400">
                                                sudah terisi
                                            </span>
                                        )}
                                    </Label>
                                    <Input
                                        type="password"
                                        autoComplete="off"
                                        value={form[key] ?? ''}
                                        onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                                        placeholder={editing.filled[key] ? '•••••• (biarkan kosong bila tidak diubah)' : 'Tempel nilai di sini'}
                                    />
                                </div>
                            ))}

                        {editing?.setup_hint && (
                            <p className="rounded-lg border bg-muted/30 p-2.5 text-[11px] leading-relaxed text-muted-foreground">
                                {editing.setup_hint}
                            </p>
                        )}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditing(null)}>Batal</Button>
                            <Button type="submit" disabled={saving}>Simpan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

SocialAccountsIndex.layout = {
    breadcrumbs: [{ title: 'Akun Media Sosial', href: '/social-accounts' }],
};

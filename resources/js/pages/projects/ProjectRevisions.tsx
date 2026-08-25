import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GitCommit, Plus, CheckCircle, Clock, AlertCircle, User } from 'lucide-react';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useForm, router } from '@inertiajs/react';

const STATUSES = ['Pending', 'In Progress', 'Completed'] as const;

const STATUS_META: Record<string, { label: string; chip: string; accent: string }> = {
    Pending: {
        label: 'Menunggu',
        chip: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300',
        accent: 'border-l-amber-400',
    },
    'In Progress': {
        label: 'Dikerjakan',
        chip: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300',
        accent: 'border-l-blue-400',
    },
    Completed: {
        label: 'Selesai',
        chip: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300',
        accent: 'border-l-emerald-400',
    },
};

const CATEGORY_PRESETS = ['Bug Fix', 'Fitur Baru', 'Perubahan Desain', 'Permintaan Klien', 'Optimasi', 'Lainnya'];

export default function ProjectRevisions({ project }: { project: any }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [busyId, setBusyId] = useState<number | null>(null);

    const revisions: any[] = project.revisions ?? [];

    const { data, setData, post, processing, reset, errors } = useForm({
        version_tag: '',
        title: '',
        category: '',
        description: '',
        status: 'Pending',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/projects/${project.id}/revisions`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Revisi berhasil dicatat');
                setIsCreateOpen(false);
                reset();
            },
            onError: () => toast.error('Gagal menyimpan revisi. Periksa isian Anda.'),
        });
    };

    const changeStatus = (revision: any, status: string) => {
        setBusyId(revision.id);
        router.put(
            `/projects/${project.id}/revisions/${revision.id}/status`,
            { status },
            {
                preserveScroll: true,
                onSuccess: () => toast.success(`Status diubah ke ${STATUS_META[status].label}`),
                onError: () => toast.error('Gagal mengubah status'),
                onFinish: () => setBusyId(null),
            },
        );
    };

    const getStatusIcon = (status: string) => {
        if (status === 'Completed') return <CheckCircle className="h-4 w-4 text-emerald-500" />;
        if (status === 'In Progress') return <Clock className="h-4 w-4 text-blue-500" />;
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
    };

    const counts = STATUSES.map((s) => ({ status: s, total: revisions.filter((r) => r.status === s).length }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                        <GitCommit className="h-5 w-5 text-muted-foreground" /> Riwayat Revisi
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Catat setiap perubahan lingkup atau perbaikan agar riwayat proyek jelas.
                    </p>
                    {revisions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {counts.map(({ status, total }) => (
                                <span key={status} className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_META[status].chip}`}>
                                    {STATUS_META[status].label}: {total}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="shrink-0">
                            <Plus className="mr-2 h-4 w-4" /> Catat Revisi
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Catat Revisi Baru</DialogTitle>
                            <DialogDescription>
                                Gunakan versi berurutan (v1.0, v1.1) agar mudah dilacak saat serah terima.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label>Versi</Label>
                                    <Input
                                        required
                                        placeholder="v1.1"
                                        value={data.version_tag}
                                        onChange={(e) => setData('version_tag', e.target.value)}
                                    />
                                    {errors.version_tag && <p className="text-xs text-destructive">{errors.version_tag}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Kategori</Label>
                                    <Select value={data.category} onValueChange={(val) => setData('category', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORY_PRESETS.map((c) => (
                                                <SelectItem key={c} value={c}>
                                                    {c}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label>Judul Revisi</Label>
                                <Input
                                    required
                                    placeholder="Contoh: Tambah fitur pembayaran"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>Detail Perubahan</Label>
                                <Textarea
                                    rows={4}
                                    placeholder="Apa yang berubah, alasannya, dan dampaknya terhadap timeline/biaya."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Status</Label>
                                <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STATUSES.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {STATUS_META[s].label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Simpan Revisi
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                {revisions.map((rev: any) => {
                    const meta = STATUS_META[rev.status] ?? STATUS_META.Pending;

                    return (
                        <Card
                            key={rev.id}
                            className={`overflow-hidden transition-shadow hover: ${busyId === rev.id ? 'opacity-60' : ''}`}
                        >
                            <div className={`flex flex-col gap-4 border-l-4 p-4 md:flex-row md:items-start md:justify-between ${meta.accent}`}>
                                <div className="min-w-0 flex-1 space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                            {rev.version_tag}
                                        </span>
                                        {rev.category && (
                                            <span className="rounded-md border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground">
                                                {rev.category}
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="text-base font-bold">{rev.title}</h4>
                                    {rev.description && (
                                        <p className="whitespace-pre-wrap text-sm text-muted-foreground">{rev.description}</p>
                                    )}
                                </div>

                                <div className="flex shrink-0 flex-col items-start gap-2 md:items-end md:border-l md:pl-4">
                                    {/* Status kini bisa diubah langsung, bukan lagi label mati */}
                                    <Select value={rev.status} onValueChange={(val) => changeStatus(rev, val)} disabled={busyId === rev.id}>
                                        <SelectTrigger className={`h-8 w-[150px] border text-xs font-medium ${meta.chip}`}>
                                            <span className="flex items-center gap-1.5">
                                                {getStatusIcon(rev.status)}
                                                <SelectValue />
                                            </span>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUSES.map((s) => (
                                                <SelectItem key={s} value={s}>
                                                    {STATUS_META[s].label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <div className="text-xs text-muted-foreground md:text-right">
                                        <p className="flex items-center gap-1 md:justify-end">
                                            <User className="h-3 w-3" />
                                            {rev.requester?.name ?? 'Sistem'}
                                        </p>
                                        <p>
                                            {new Date(rev.created_at).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                })}

                {revisions.length === 0 && (
                    <div className="rounded-lg border-2 border-dashed py-12 text-center">
                        <GitCommit className="mx-auto mb-3 h-12 w-12 text-muted-foreground/25" />
                        <h3 className="mb-1 text-lg font-semibold">Belum ada revisi</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Catat revisi pertama agar perubahan lingkup proyek terdokumentasi.
                        </p>
                        <Button onClick={() => setIsCreateOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Catat Revisi
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CheckSquare, Clock, Target, Trash2, Edit2, ListChecks, RefreshCw } from 'lucide-react';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { MoreVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { apiFetch } from '@/lib/fetch';

const STATUSES = ['Not Started', 'In Progress', 'Review', 'Completed', 'Delayed'] as const;

/** Label Indonesia + warna kolom yang lembut (aman di light & dark) */
const STATUS_META: Record<string, { label: string; dot: string; bar: string; head: string }> = {
    'Not Started': {
        label: 'Belum Mulai',
        dot: 'bg-slate-400',
        bar: 'bg-slate-400',
        head: 'border-slate-200 dark:border-slate-700',
    },
    'In Progress': {
        label: 'Dikerjakan',
        dot: 'bg-blue-500',
        bar: 'bg-blue-500',
        head: 'border-blue-200 dark:border-blue-900',
    },
    Review: {
        label: 'Review',
        dot: 'bg-amber-500',
        bar: 'bg-amber-500',
        head: 'border-amber-200 dark:border-amber-900',
    },
    Completed: {
        label: 'Selesai',
        dot: 'bg-emerald-500',
        bar: 'bg-emerald-500',
        head: 'border-emerald-200 dark:border-emerald-900',
    },
    Delayed: {
        label: 'Terlambat',
        dot: 'bg-rose-500',
        bar: 'bg-rose-500',
        head: 'border-rose-200 dark:border-rose-900',
    },
};

/** Enum status task: Todo / Progress / Review / Done */
const TASK_DOT: Record<string, string> = {
    Done: 'bg-emerald-500',
    Review: 'bg-amber-500',
    Progress: 'bg-blue-500',
    Todo: 'bg-slate-400',
};

const emptyForm = {
    name: '',
    description: '',
    pic_user_id: '',
    start_date: '',
    end_date: '',
    status: 'Not Started',
};

export default function ProjectMilestones({ project }: { project: any }) {
    const { users } = usePage().props as any;
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<any>(null);
    const [busyId, setBusyId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ ...emptyForm });

    const milestones: any[] = project.milestones ?? [];

    const openCreate = () => {
        setEditingId(null);
        setFormData({ ...emptyForm });
        setIsFormOpen(true);
    };

    const openEdit = (milestone: any) => {
        setEditingId(milestone.id);
        setFormData({
            name: milestone.name ?? '',
            description: milestone.description ?? '',
            pic_user_id: milestone.pic_user_id ? String(milestone.pic_user_id) : '',
            start_date: milestone.start_date ? String(milestone.start_date).split('T')[0] : '',
            end_date: milestone.end_date ? String(milestone.end_date).split('T')[0] : '',
            status: milestone.status ?? 'Not Started',
        });
        setIsFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Kirim null, bukan string kosong, agar validasi date/exists di server tidak gagal
        const payload = {
            ...formData,
            pic_user_id: formData.pic_user_id || null,
            start_date: formData.start_date || null,
            end_date: formData.end_date || null,
            description: formData.description || null,
        };

        try {
            const res = editingId
                ? await apiFetch(`/api/v1/milestones/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) })
                : await apiFetch(`/api/v1/projects/${project.id}/milestones`, { method: 'POST', body: JSON.stringify(payload) });

            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                toast.success(editingId ? 'Milestone diperbarui' : 'Milestone dibuat');
                setIsFormOpen(false);
                setFormData({ ...emptyForm });
                setEditingId(null);
                router.reload({ only: ['project'] });
            } else {
                // Tampilkan pesan validasi asli dari server, bukan pesan generik
                const firstError = data?.errors ? (Object.values(data.errors)[0] as string[])?.[0] : null;
                toast.error(firstError || data?.message || 'Gagal menyimpan milestone');
            }
        } catch {
            toast.error('Gagal terhubung ke server');
        } finally {
            setSaving(false);
        }
    };

    const updateStatus = async (milestoneId: number, newStatus: string) => {
        setBusyId(milestoneId);
        try {
            const res = await apiFetch(`/api/v1/milestones/${milestoneId}`, {
                method: 'PUT',
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                toast.success(`Status diubah ke ${STATUS_META[newStatus]?.label ?? newStatus}`);
                router.reload({ only: ['project'] });
            } else {
                toast.error(data?.message || 'Gagal mengubah status');
            }
        } catch {
            toast.error('Gagal terhubung ke server');
        } finally {
            setBusyId(null);
        }
    };

    const updateProgress = async (milestoneId: number, progress: number) => {
        setBusyId(milestoneId);
        try {
            const res = await apiFetch(`/api/v1/milestones/${milestoneId}/progress`, {
                method: 'PUT',
                body: JSON.stringify({ progress }),
            });
            if (res.ok) {
                toast.success(`Progress diatur ke ${progress}%`);
                router.reload({ only: ['project'] });
            } else {
                toast.error('Gagal mengubah progress');
            }
        } catch {
            toast.error('Gagal terhubung ke server');
        } finally {
            setBusyId(null);
        }
    };

    const recalcProgress = async (milestoneId: number) => {
        setBusyId(milestoneId);
        try {
            const res = await apiFetch(`/api/v1/milestones/${milestoneId}/calculate-progress`, { method: 'POST' });
            if (res.ok) {
                toast.success('Progress dihitung ulang dari task');
                router.reload({ only: ['project'] });
            } else {
                toast.error('Gagal menghitung progress');
            }
        } catch {
            toast.error('Gagal terhubung ke server');
        } finally {
            setBusyId(null);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setBusyId(deleteTarget.id);
        try {
            const res = await apiFetch(`/api/v1/milestones/${deleteTarget.id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Milestone dihapus');
                setDeleteTarget(null);
                router.reload({ only: ['project'] });
            } else {
                toast.error('Gagal menghapus milestone');
            }
        } catch {
            toast.error('Gagal terhubung ke server');
        } finally {
            setBusyId(null);
        }
    };

    const formatDate = (value?: string | null) =>
        value ? new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : null;

    const isLate = (milestone: any) => {
        if (!milestone.end_date || milestone.status === 'Completed') return false;
        const end = new Date(milestone.end_date);
        end.setHours(23, 59, 59, 999);
        return end.getTime() < Date.now();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                        <Target className="h-5 w-5 text-muted-foreground" /> Milestone & Timeline
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Bagi proyek menjadi tahapan. Geser status lewat menu titik tiga pada tiap kartu.
                    </p>
                </div>
                <Button onClick={openCreate} className="shrink-0">
                    <Plus className="mr-2 h-4 w-4" /> Tambah Milestone
                </Button>
            </div>

            {milestones.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed p-12 text-center">
                    <CheckSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
                    <h3 className="mb-1 text-lg font-semibold">Belum ada milestone</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Buat milestone pertama untuk mulai melacak progress proyek ini.
                    </p>
                    <Button onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Milestone
                    </Button>
                </div>
            ) : (
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {STATUSES.map((status) => {
                        const meta = STATUS_META[status];
                        const items = milestones.filter((m) => m.status === status);

                        return (
                            <div key={status} className="min-w-[300px] flex-1 rounded-lg bg-muted/30 p-3">
                                <div className={`mb-3 flex items-center justify-between border-b-2 pb-2 ${meta.head}`}>
                                    <span className="flex items-center gap-2 text-sm font-semibold">
                                        <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                                        {meta.label}
                                    </span>
                                    <span className="rounded-full bg-background px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                                        {items.length}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {items.length === 0 && (
                                        <p className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                                            Kosong
                                        </p>
                                    )}

                                    {items.map((milestone: any) => {
                                        const progress = Number(milestone.progress) || 0;
                                        const checklists: any[] = milestone.checklists ?? [];
                                        const doneChecklist = checklists.filter((c: any) => c.is_completed || c.completed).length;
                                        const late = isLate(milestone);

                                        return (
                                            <Card
                                                key={milestone.id}
                                                className={`transition-shadow hover: ${busyId === milestone.id ? 'opacity-60' : ''}`}
                                            >
                                                <CardContent className="space-y-3 p-4">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h5 className="text-sm font-semibold leading-tight">{milestone.name}</h5>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="-mr-2 -mt-1 h-8 w-8 shrink-0 p-0">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-52">
                                                                <DropdownMenuLabel>Pindahkan ke</DropdownMenuLabel>
                                                                {STATUSES.map((s) => (
                                                                    <DropdownMenuItem
                                                                        key={s}
                                                                        onClick={() => updateStatus(milestone.id, s)}
                                                                        disabled={busyId === milestone.id || milestone.status === s}
                                                                    >
                                                                        <span className={`mr-2 h-2 w-2 rounded-full ${STATUS_META[s].dot}`} />
                                                                        {STATUS_META[s].label}
                                                                    </DropdownMenuItem>
                                                                ))}
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuLabel>Progress</DropdownMenuLabel>
                                                                <div className="flex gap-1 px-2 pb-1.5">
                                                                    {[0, 25, 50, 75, 100].map((p) => (
                                                                        <button
                                                                            key={p}
                                                                            type="button"
                                                                            onClick={() => updateProgress(milestone.id, p)}
                                                                            className={`flex-1 rounded border py-1 text-[11px] font-medium transition-colors hover:bg-muted ${
                                                                                progress === p ? 'border-primary bg-primary/10 text-primary' : ''
                                                                            }`}
                                                                        >
                                                                            {p}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                                {milestone.tasks?.length > 0 && (
                                                                    <DropdownMenuItem onClick={() => recalcProgress(milestone.id)}>
                                                                        <RefreshCw className="mr-2 h-4 w-4" /> Hitung dari task
                                                                    </DropdownMenuItem>
                                                                )}
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onClick={() => openEdit(milestone)}>
                                                                    <Edit2 className="mr-2 h-4 w-4" /> Edit detail
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => setDeleteTarget(milestone)} className="text-destructive">
                                                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>

                                                    {milestone.description && (
                                                        <p className="line-clamp-2 text-xs text-muted-foreground">{milestone.description}</p>
                                                    )}

                                                    {/* Progress */}
                                                    <div>
                                                        <div className="mb-1 flex items-center justify-between text-[11px]">
                                                            <span className="text-muted-foreground">Progress</span>
                                                            <span className="font-semibold">{progress}%</span>
                                                        </div>
                                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-500 ${meta.bar}`}
                                                                style={{ width: `${progress}%` }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                                        {milestone.end_date && (
                                                            <span
                                                                className={`flex items-center gap-1 ${
                                                                    late ? 'font-medium text-rose-600 dark:text-rose-400' : ''
                                                                }`}
                                                            >
                                                                <Clock className="h-3 w-3" />
                                                                {formatDate(milestone.end_date)}
                                                                {late && ' (lewat)'}
                                                            </span>
                                                        )}
                                                        {milestone.pic && (
                                                            <span className="flex items-center gap-1">
                                                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                                                                    {milestone.pic.name.charAt(0).toUpperCase()}
                                                                </span>
                                                                {milestone.pic.name}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Checklist */}
                                                    {checklists.length > 0 && (
                                                        <div className="flex items-center gap-1.5 rounded-md bg-muted/50 px-2 py-1 text-[11px] text-muted-foreground">
                                                            <ListChecks className="h-3 w-3" />
                                                            Checklist {doneChecklist}/{checklists.length}
                                                        </div>
                                                    )}

                                                    {/* Task terkait */}
                                                    {milestone.tasks?.length > 0 && (
                                                        <div className="border-t pt-3">
                                                            <p className="mb-2 text-[11px] font-semibold text-muted-foreground">
                                                                Task Terkait ({milestone.tasks.length})
                                                            </p>
                                                            <div className="space-y-1">
                                                                {milestone.tasks.slice(0, 3).map((task: any) => (
                                                                    <div key={task.id} className="flex items-center gap-2 text-xs">
                                                                        <span className={`h-2 w-2 shrink-0 rounded-full ${TASK_DOT[task.status] ?? 'bg-slate-400'}`} />
                                                                        <span className="truncate text-muted-foreground">{task.title}</span>
                                                                    </div>
                                                                ))}
                                                                {milestone.tasks.length > 3 && (
                                                                    <p className="text-xs text-muted-foreground">
                                                                        +{milestone.tasks.length - 3} task lainnya
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Form buat / edit */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit Milestone' : 'Buat Milestone'}</DialogTitle>
                        <DialogDescription>
                            Hanya nama yang wajib diisi. Tanggal dan penanggung jawab bisa dilengkapi belakangan.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
                        <div className="space-y-1.5">
                            <Label>Nama Milestone</Label>
                            <Input
                                required
                                placeholder="Contoh: Fase 1 — Desain UI/UX"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Deskripsi</Label>
                            <Textarea
                                rows={3}
                                placeholder="Deliverable apa saja yang harus selesai pada tahap ini?"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Tanggal Mulai</Label>
                                <Input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Target Selesai</Label>
                                <Input
                                    type="date"
                                    min={formData.start_date || undefined}
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Penanggung Jawab</Label>
                                <Select
                                    value={formData.pic_user_id}
                                    onValueChange={(val) => setFormData({ ...formData, pic_user_id: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih anggota tim" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users?.map((u: any) => (
                                            <SelectItem key={u.id} value={u.id.toString()}>
                                                {u.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Status</Label>
                                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
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
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={saving}>
                                {editingId ? 'Simpan Perubahan' : 'Buat Milestone'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Konfirmasi hapus */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Milestone</DialogTitle>
                        <DialogDescription>
                            Yakin ingin menghapus <span className="font-semibold">{deleteTarget?.name}</span>? Tindakan ini tidak bisa dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)}>
                            Batal
                        </Button>
                        <Button type="button" variant="destructive" onClick={confirmDelete} disabled={busyId === deleteTarget?.id}>
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

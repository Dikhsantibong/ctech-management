import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus, ArrowRight, Paperclip, CheckCircle2 } from 'lucide-react';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useForm, router } from '@inertiajs/react';

const STATUSES = ['Open', 'Review', 'Development', 'Testing', 'Completed'] as const;

const STATUS_META: Record<string, { label: string; chip: string }> = {
    Open: {
        label: 'Terbuka',
        chip: 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300',
    },
    Review: {
        label: 'Ditinjau',
        chip: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300',
    },
    Development: {
        label: 'Dikerjakan',
        chip: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300',
    },
    Testing: {
        label: 'Pengujian',
        chip: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300',
    },
    Completed: {
        label: 'Selesai',
        chip: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300',
    },
};

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'] as const;

const PRIORITY_META: Record<string, { label: string; chip: string; accent: string }> = {
    Low: {
        label: 'Rendah',
        chip: 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400',
        accent: 'border-l-slate-300 dark:border-l-slate-700',
    },
    Medium: {
        label: 'Sedang',
        chip: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300',
        accent: 'border-l-sky-400',
    },
    High: {
        label: 'Tinggi',
        chip: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-300',
        accent: 'border-l-orange-400',
    },
    Urgent: {
        label: 'Mendesak',
        chip: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300',
        accent: 'border-l-rose-500',
    },
};

export default function ClientFeedback({ project }: { project: any }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [convertTarget, setConvertTarget] = useState<any>(null);
    const [busyId, setBusyId] = useState<number | null>(null);

    const feedbacks: any[] = project.feedbacks ?? [];

    const { data, setData, post, processing, reset, errors } = useForm({
        subject: '',
        message: '',
        priority: 'Medium',
        status: 'Open',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/projects/${project.id}/feedbacks`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Feedback tersimpan');
                setIsCreateOpen(false);
                reset();
            },
            onError: () => toast.error('Gagal menyimpan feedback.'),
        });
    };

    const changeStatus = (feedback: any, status: string) => {
        setBusyId(feedback.id);
        router.put(
            `/projects/${project.id}/feedbacks/${feedback.id}/status`,
            { status },
            {
                preserveScroll: true,
                onSuccess: () => toast.success(`Status diubah ke ${STATUS_META[status].label}`),
                onError: () => toast.error('Gagal mengubah status'),
                onFinish: () => setBusyId(null),
            },
        );
    };

    const confirmConvert = () => {
        if (!convertTarget) return;
        setBusyId(convertTarget.id);
        router.post(
            `/projects/${project.id}/feedbacks/${convertTarget.id}/convert-to-task`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Feedback berhasil dijadikan task');
                    setConvertTarget(null);
                },
                onError: () => toast.error('Gagal mengubah feedback menjadi task'),
                onFinish: () => setBusyId(null),
            },
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                        <MessageSquare className="h-5 w-5 text-muted-foreground" /> Feedback Klien
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Catat masukan klien, atur prioritasnya, lalu ubah menjadi task bila perlu dikerjakan.
                    </p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="shrink-0">
                            <Plus className="mr-2 h-4 w-4" /> Tambah Feedback
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Catat Feedback Klien</DialogTitle>
                            <DialogDescription>
                                Tulis sespesifik mungkin — feedback ini bisa langsung dikonversi menjadi task.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
                            <div className="space-y-1.5">
                                <Label>Judul</Label>
                                <Input
                                    required
                                    placeholder="Contoh: Layout tombol rusak di tampilan mobile"
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                />
                                {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>Detail</Label>
                                <Textarea
                                    rows={4}
                                    required
                                    placeholder="Jelaskan masalah atau permintaan, langkah reproduksinya, dan harapan klien."
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                />
                                {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label>Prioritas</Label>
                                    <Select value={data.priority} onValueChange={(val) => setData('priority', val)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PRIORITIES.map((p) => (
                                                <SelectItem key={p} value={p}>
                                                    {PRIORITY_META[p].label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Simpan Feedback
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {feedbacks.map((fb: any) => {
                    const priority = PRIORITY_META[fb.priority] ?? PRIORITY_META.Medium;
                    const status = STATUS_META[fb.status] ?? STATUS_META.Open;
                    const alreadyTask = fb.status === 'Development' || fb.status === 'Testing' || fb.status === 'Completed';

                    return (
                        <Card
                            key={fb.id}
                            className={`flex flex-col border-l-4 transition-shadow hover:shadow-md ${priority.accent} ${
                                busyId === fb.id ? 'opacity-60' : ''
                            }`}
                        >
                            <CardHeader className="pb-3">
                                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${priority.chip}`}>
                                        Prioritas {priority.label}
                                    </span>
                                    {/* Status kini bisa diubah tanpa harus membuat feedback baru */}
                                    <Select value={fb.status} onValueChange={(val) => changeStatus(fb, val)} disabled={busyId === fb.id}>
                                        <SelectTrigger className={`h-7 w-[130px] border text-xs font-medium ${status.chip}`}>
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
                                <CardTitle className="text-base leading-tight">{fb.subject}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col">
                                <p className="mb-4 line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">{fb.message}</p>

                                <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3">
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(fb.created_at).toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </p>
                                    <div className="flex gap-2">
                                        {fb.attachment_path && (
                                            <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                                                <a href={`/storage/${fb.attachment_path}`} target="_blank" rel="noreferrer">
                                                    <Paperclip className="mr-1 h-3.5 w-3.5" /> Lampiran
                                                </a>
                                            </Button>
                                        )}
                                        {alreadyTask ? (
                                            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                                <CheckCircle2 className="h-3.5 w-3.5" /> Sudah ditindaklanjuti
                                            </span>
                                        ) : (
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="h-8 text-xs"
                                                onClick={() => setConvertTarget(fb)}
                                                disabled={busyId === fb.id}
                                            >
                                                Jadikan Task <ArrowRight className="ml-1 h-3 w-3" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

                {feedbacks.length === 0 && (
                    <div className="rounded-xl border-2 border-dashed py-12 text-center md:col-span-2">
                        <MessageSquare className="mx-auto mb-3 h-12 w-12 text-muted-foreground/25" />
                        <h3 className="mb-1 text-lg font-semibold">Belum ada feedback</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Masukan dari klien akan tampil di sini setelah dicatat.
                        </p>
                        <Button onClick={() => setIsCreateOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Feedback
                        </Button>
                    </div>
                )}
            </div>

            {/* Konfirmasi konversi ke task */}
            <Dialog open={!!convertTarget} onOpenChange={(open) => !open && setConvertTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Jadikan Task</DialogTitle>
                        <DialogDescription>
                            Feedback <span className="font-semibold">{convertTarget?.subject}</span> akan dibuat menjadi task baru pada
                            proyek ini, dan statusnya berubah menjadi "Dikerjakan".
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setConvertTarget(null)}>
                            Batal
                        </Button>
                        <Button type="button" onClick={confirmConvert} disabled={busyId === convertTarget?.id}>
                            Ya, Jadikan Task
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

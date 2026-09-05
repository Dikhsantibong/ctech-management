import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft, Calendar, Users, Briefcase, FileText, Globe, Github, Figma, Server, Code, Edit, Plus,
    Target, ListChecks, RefreshCw, MessageSquare, CalendarClock, LayoutDashboard, Clock, AlertTriangle,
    CheckCircle2, TrendingUp, Link2, ExternalLink, Workflow, Database, Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ProjectMilestones from './ProjectMilestones';
import ProjectDocuments from './ProjectDocuments';
import ProjectMeetings from './ProjectMeetings';
import ProjectActivity from './ProjectActivity';
import ProjectRevisions from './ProjectRevisions';
import ClientFeedback from './ClientFeedback';
import React from 'react';

/** Warna lembut per status supaya informatif tanpa mencolok */
const STATUS_STYLES: Record<string, { chip: string; bar: string; label: string }> = {
    Planning: {
        chip: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700',
        bar: 'bg-slate-400',
        label: 'Perencanaan',
    },
    Progress: {
        chip: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900',
        bar: 'bg-blue-500',
        label: 'Dikerjakan',
    },
    Review: {
        chip: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
        bar: 'bg-amber-500',
        label: 'Review',
    },
    Completed: {
        chip: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
        bar: 'bg-emerald-500',
        label: 'Selesai',
    },
};

const TASK_STATUS_STYLES: Record<string, string> = {
    Todo: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700',
    Progress: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900',
    Review: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
    Done: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
};

const PRIORITY_STYLES: Record<string, string> = {
    Low: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400',
    Medium: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
    High: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
};

const formatDate = (value?: string | null) =>
    value ? new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

/** Kartu ringkasan angka dengan aksen warna lembut */
function StatCard({
    icon: Icon,
    label,
    value,
    hint,
    tone,
}: {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
    hint?: string;
    tone: 'blue' | 'emerald' | 'amber' | 'violet';
}) {
    const tones = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300',
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300',
        amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300',
        violet: 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300',
    };

    return (
        <div className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-colors hover:border-primary/30">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="text-xl font-bold leading-tight">{value}</p>
                {hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
            </div>
        </div>
    );
}

/** Baris link teknis (domain/repo/design) */
function MetaLink({ icon: Icon, label, value, isLink }: { icon: React.ElementType; label: string; value?: string; isLink?: boolean }) {
    return (
        <div className="flex items-start gap-2.5 rounded-lg border bg-background p-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                {value ? (
                    isLink ? (
                        <a
                            href={value}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 break-all text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                        >
                            <span className="truncate">{value.replace(/^https?:\/\//, '')}</span>
                            <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                    ) : (
                        <p className="text-sm font-medium">{value}</p>
                    )
                ) : (
                    <p className="text-sm italic text-muted-foreground">Belum diisi</p>
                )}
            </div>
        </div>
    );
}

export default function ProjectShow({ project }: { project: any }) {
    const { data: metaData, setData: setMetaData, put: putMeta, processing: processingMeta } = useForm({
        tech_stack: project.metadata?.tech_stack || '',
        repo_link: project.metadata?.repo_link || '',
        domain_link: project.metadata?.domain_link || '',
        design_link: project.metadata?.design_link || '',
        structure_notes: project.metadata?.structure_notes || '',
    });

    const [isMetaOpen, setIsMetaOpen] = React.useState(false);

    const handleMetaSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        putMeta(`/projects/${project.id}/metadata`, {
            onSuccess: () => setIsMetaOpen(false),
        });
    };

    const milestones: any[] = project.milestones ?? [];
    const tasks: any[] = project.tasks ?? [];
    const revisions: any[] = project.revisions ?? [];
    const feedbacks: any[] = project.feedbacks ?? [];
    const meetings: any[] = project.meetings ?? [];
    const documents: any[] = project.documents ?? [];

    const doneMilestones = milestones.filter((m) => m.status === 'Completed').length;
    const doneTasks = tasks.filter((t) => t.status === 'Done').length;
    const openRevisions = revisions.filter((r) => r.status !== 'Completed').length;

    // Progress proyek: rata-rata progress milestone, fallback ke rasio task selesai
    const progress = React.useMemo(() => {
        if (project.status === 'Completed') return 100;
        if (milestones.length > 0) {
            const total = milestones.reduce((sum, m) => sum + (Number(m.progress) || 0), 0);
            return Math.round(total / milestones.length);
        }
        if (tasks.length > 0) return Math.round((doneTasks / tasks.length) * 100);
        return 0;
    }, [milestones, tasks, doneTasks, project.status]);

    // Sisa hari menuju deadline
    const daysLeft = React.useMemo(() => {
        if (!project.deadline) return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const end = new Date(project.deadline);
        end.setHours(0, 0, 0, 0);
        return Math.round((end.getTime() - today.getTime()) / 86400000);
    }, [project.deadline]);

    const isOverdue = daysLeft !== null && daysLeft < 0 && project.status !== 'Completed';
    const isDueSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7 && project.status !== 'Completed';

    const deadlineHint =
        daysLeft === null
            ? '-'
            : project.status === 'Completed'
                ? 'Proyek selesai'
                : isOverdue
                    ? `Terlambat ${Math.abs(daysLeft)} hari`
                    : daysLeft === 0
                        ? 'Jatuh tempo hari ini'
                        : `${daysLeft} hari lagi`;

    const statusStyle = STATUS_STYLES[project.status] ?? STATUS_STYLES.Planning;

    const tabs = [
        { value: 'overview', label: 'Ringkasan', icon: LayoutDashboard, count: null },
        { value: 'milestones', label: 'Milestone', icon: Target, count: milestones.length },
        { value: 'documents', label: 'Dokumen', icon: FileText, count: documents.length },
        { value: 'canvas', label: 'Canvas', icon: Workflow, count: null },
        { value: 'meetings', label: 'Meeting', icon: CalendarClock, count: meetings.length },
        { value: 'activity', label: 'Aktivitas', icon: TrendingUp, count: null },
        { value: 'revisions', label: 'Revisi', icon: RefreshCw, count: revisions.length },
        { value: 'feedback', label: 'Feedback', icon: MessageSquare, count: feedbacks.length },
    ];

    return (
        <>
            <Head title={project.project_name} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* ===== Header ===== */}
                <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                        <Button variant="outline" size="icon" asChild className="shrink-0">
                            <Link href="/projects">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="truncate text-xl font-bold tracking-tight">{project.project_name}</h2>
                                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyle.chip}`}>
                                    {statusStyle.label}
                                </span>
                                {project.project_type && (
                                    <span className="hidden rounded-full border bg-muted/60 px-2.5 py-0.5 text-xs text-muted-foreground sm:inline">
                                        {project.project_type}
                                    </span>
                                )}
                            </div>
                            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Briefcase className="h-3.5 w-3.5" /> {project.client_name}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:shrink-0">
                        {(isOverdue || isDueSoon) && (
                            <div
                                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium ${
                                    isOverdue
                                        ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300'
                                        : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300'
                                }`}
                            >
                                {isOverdue ? <AlertTriangle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                                {deadlineHint}
                            </div>
                        )}
                        <div className="min-w-[132px]">
                            <div className="mb-1 flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-semibold">{progress}%</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${statusStyle.bar}`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== Tabs ===== */}
                <Tabs defaultValue="overview" className="w-full">
                    <div className="sticky top-0 z-20 -mx-6 mb-4 border-b bg-background px-6 pb-2 pt-1">
                    <TabsList className="h-auto flex-wrap gap-1 bg-muted/50 p-1">
                        {tabs.map((tab) => (
                            <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 rounded-md data-[state=active]:">
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                                {tab.count !== null && tab.count > 0 && (
                                    <span className="ml-0.5 rounded-full bg-muted px-1.5 text-[11px] font-semibold text-muted-foreground">
                                        {tab.count}
                                    </span>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    </div>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                icon={Target}
                                label="Milestone"
                                value={`${doneMilestones}/${milestones.length}`}
                                hint="milestone selesai"
                                tone="blue"
                            />
                            <StatCard
                                icon={ListChecks}
                                label="Task"
                                value={`${doneTasks}/${tasks.length}`}
                                hint="task selesai"
                                tone="emerald"
                            />
                            <StatCard
                                icon={RefreshCw}
                                label="Revisi Terbuka"
                                value={openRevisions}
                                hint={`dari ${revisions.length} total revisi`}
                                tone="amber"
                            />
                            <StatCard
                                icon={Calendar}
                                label="Deadline"
                                value={<span className="text-base">{formatDate(project.deadline)}</span>}
                                hint={deadlineHint}
                                tone="violet"
                            />
                        </div>
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="space-y-6 md:col-span-2">
                                {/* Deskripsi */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            <FileText className="h-4 w-4 text-muted-foreground" /> Deskripsi Proyek
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {project.description ? (
                                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{project.description}</p>
                                        ) : (
                                            <p className="text-sm italic text-muted-foreground">Belum ada deskripsi untuk proyek ini.</p>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Info teknis */}
                                <Card>
                                    <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
                                        <div>
                                            <CardTitle className="flex items-center gap-2 text-base">
                                                <Server className="h-4 w-4 text-muted-foreground" /> Informasi Teknis
                                            </CardTitle>
                                            <CardDescription>Tech stack, domain, repository, dan catatan arsitektur.</CardDescription>
                                        </div>
                                        <Dialog open={isMetaOpen} onOpenChange={setIsMetaOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="shrink-0">
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[560px]">
                                                <DialogHeader>
                                                    <DialogTitle>Edit Informasi Teknis</DialogTitle>
                                                    <DialogDescription>
                                                        Semua kolom bersifat opsional — isi seperlunya. Kosongkan jika belum tersedia.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <form onSubmit={handleMetaSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
                                                    <div className="space-y-1.5">
                                                        <Label className="flex items-center gap-1.5">
                                                            <Code className="h-3.5 w-3.5 text-muted-foreground" /> Tech Stack
                                                        </Label>
                                                        <Input
                                                            placeholder="Laravel, React, Tailwind, MySQL"
                                                            value={metaData.tech_stack}
                                                            onChange={(e) => setMetaData('tech_stack', e.target.value)}
                                                        />
                                                        <p className="text-xs text-muted-foreground">Pisahkan dengan koma.</p>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="flex items-center gap-1.5">
                                                            <Globe className="h-3.5 w-3.5 text-muted-foreground" /> Domain / URL Live
                                                        </Label>
                                                        <Input
                                                            type="url"
                                                            placeholder="https://namaproject.com"
                                                            value={metaData.domain_link}
                                                            onChange={(e) => setMetaData('domain_link', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="flex items-center gap-1.5">
                                                            <Github className="h-3.5 w-3.5 text-muted-foreground" /> Repository
                                                        </Label>
                                                        <Input
                                                            type="url"
                                                            placeholder="https://github.com/user/repo"
                                                            value={metaData.repo_link}
                                                            onChange={(e) => setMetaData('repo_link', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="flex items-center gap-1.5">
                                                            <Figma className="h-3.5 w-3.5 text-muted-foreground" /> Desain / UI
                                                        </Label>
                                                        <Input
                                                            type="url"
                                                            placeholder="https://figma.com/file/..."
                                                            value={metaData.design_link}
                                                            onChange={(e) => setMetaData('design_link', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="flex items-center gap-1.5">
                                                            <Server className="h-3.5 w-3.5 text-muted-foreground" /> Catatan Arsitektur & Server
                                                        </Label>
                                                        <Textarea
                                                            rows={4}
                                                            placeholder="Struktur database, spesifikasi server, kredensial deployment (jangan tulis password), dsb."
                                                            value={metaData.structure_notes}
                                                            onChange={(e) => setMetaData('structure_notes', e.target.value)}
                                                        />
                                                    </div>
                                                    <DialogFooter>
                                                        <Button type="button" variant="outline" onClick={() => setIsMetaOpen(false)}>
                                                            Batal
                                                        </Button>
                                                        <Button type="submit" disabled={processingMeta}>
                                                            Simpan Perubahan
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <MetaLink icon={Code} label="Tech Stack" value={project.metadata?.tech_stack} />
                                            <MetaLink icon={Globe} label="Domain" value={project.metadata?.domain_link} isLink />
                                            <MetaLink icon={Github} label="Repository" value={project.metadata?.repo_link} isLink />
                                            <MetaLink icon={Figma} label="Desain / UI" value={project.metadata?.design_link} isLink />
                                        </div>
                                        <div>
                                            <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                                <Link2 className="h-3.5 w-3.5" /> Catatan Arsitektur & Server
                                            </p>
                                            <div className="rounded-lg border bg-muted/30 p-3">
                                                {project.metadata?.structure_notes ? (
                                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{project.metadata.structure_notes}</p>
                                                ) : (
                                                    <p className="text-sm italic text-muted-foreground">Belum ada catatan arsitektur.</p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Tasks */}
                                <Card>
                                    <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
                                        <div>
                                            <CardTitle className="flex items-center gap-2 text-base">
                                                <ListChecks className="h-4 w-4 text-muted-foreground" /> Task
                                            </CardTitle>
                                            <CardDescription>
                                                {tasks.length > 0 ? `${doneTasks} dari ${tasks.length} task selesai.` : 'Belum ada task pada proyek ini.'}
                                            </CardDescription>
                                        </div>
                                        <Button variant="outline" size="sm" asChild className="shrink-0">
                                            <Link href={`/tasks?project_id=${project.id}`}>
                                                <Plus className="mr-2 h-4 w-4" /> Kelola Task
                                            </Link>
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        {tasks.length > 0 ? (
                                            <div className="divide-y rounded-lg border">
                                                {tasks.slice(0, 6).map((task) => (
                                                    <div key={task.id} className="flex items-center justify-between gap-3 p-3">
                                                        <div className="flex min-w-0 items-center gap-2.5">
                                                            <CheckCircle2
                                                                className={`h-4 w-4 shrink-0 ${
                                                                    task.status === 'Done' ? 'text-emerald-500' : 'text-muted-foreground/40'
                                                                }`}
                                                            />
                                                            <div className="min-w-0">
                                                                <p className={`truncate text-sm font-medium ${task.status === 'Done' ? 'text-muted-foreground line-through' : ''}`}>
                                                                    {task.title}
                                                                </p>
                                                                {task.deadline && (
                                                                    <p className="text-xs text-muted-foreground">Deadline {formatDate(task.deadline)}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex shrink-0 items-center gap-1.5">
                                                            {task.priority && (
                                                                <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${PRIORITY_STYLES[task.priority] ?? ''}`}>
                                                                    {task.priority}
                                                                </span>
                                                            )}
                                                            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${TASK_STATUS_STYLES[task.status] ?? ''}`}>
                                                                {task.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {tasks.length > 6 && (
                                                    <div className="p-2 text-center">
                                                        <Link
                                                            href={`/tasks?project_id=${project.id}`}
                                                            className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                                                        >
                                                            Lihat {tasks.length - 6} task lainnya
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="rounded-lg border border-dashed p-8 text-center">
                                                <ListChecks className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
                                                <h3 className="font-semibold">Belum ada task</h3>
                                                <p className="mb-4 text-sm text-muted-foreground">Pecah pekerjaan proyek menjadi task agar mudah dipantau.</p>
                                                <Button asChild size="sm">
                                                    <Link href={`/tasks?project_id=${project.id}`}>
                                                        <Plus className="mr-2 h-4 w-4" /> Buat Task
                                                    </Link>
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* ===== Sidebar ===== */}
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            <Calendar className="h-4 w-4 text-muted-foreground" /> Jadwal
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="rounded-lg border bg-muted/20 p-3">
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Tanggal Mulai</p>
                                            <p className="text-sm font-medium">{formatDate(project.start_date)}</p>
                                        </div>
                                        <div
                                            className={`rounded-lg border p-3 ${
                                                isOverdue
                                                    ? 'border-rose-200 bg-rose-50/60 dark:border-rose-900 dark:bg-rose-950/30'
                                                    : isDueSoon
                                                        ? 'border-amber-200 bg-amber-50/60 dark:border-amber-900 dark:bg-amber-950/30'
                                                        : 'bg-muted/20'
                                            }`}
                                        >
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Deadline</p>
                                            <p className="text-sm font-medium">{formatDate(project.deadline)}</p>
                                            <p
                                                className={`mt-0.5 text-xs font-medium ${
                                                    isOverdue
                                                        ? 'text-rose-600 dark:text-rose-400'
                                                        : isDueSoon
                                                            ? 'text-amber-600 dark:text-amber-400'
                                                            : 'text-muted-foreground'
                                                }`}
                                            >
                                                {deadlineHint}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            <Users className="h-4 w-4 text-muted-foreground" /> Tim Proyek
                                        </CardTitle>
                                        <CardDescription>
                                            {project.members?.length > 0 ? `${project.members.length} anggota terlibat.` : 'Belum ada anggota.'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {project.members && project.members.length > 0 ? (
                                                project.members.map((member: any) => (
                                                    <div key={member.id} className="flex items-center gap-3 rounded-lg border bg-muted/20 p-2.5">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                                            {member.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-medium">{member.name}</p>
                                                            <p className="truncate text-xs capitalize text-muted-foreground">
                                                                {String(member.role ?? '').replace(/_/g, ' ')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="rounded-lg border border-dashed p-6 text-center">
                                                    <Users className="mx-auto mb-2 h-7 w-7 text-muted-foreground/40" />
                                                    <p className="text-sm text-muted-foreground">Belum ada anggota tim yang ditugaskan.</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Ringkasan cepat */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base">Ringkasan Cepat</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-sm">
                                        {[
                                            { label: 'Dokumen', value: documents.length, icon: FileText },
                                            { label: 'Meeting', value: meetings.length, icon: CalendarClock },
                                            { label: 'Revisi', value: revisions.length, icon: RefreshCw },
                                            { label: 'Feedback Klien', value: feedbacks.length, icon: MessageSquare },
                                        ].map((item) => (
                                            <div key={item.label} className="flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-2">
                                                <span className="flex items-center gap-2 text-muted-foreground">
                                                    <item.icon className="h-3.5 w-3.5" /> {item.label}
                                                </span>
                                                <span className="font-semibold">{item.value}</span>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="milestones">
                        <ProjectMilestones project={project} />
                    </TabsContent>

                    <TabsContent value="documents">
                        <ProjectDocuments project={project} />
                    </TabsContent>

                    <TabsContent value="canvas">
                        <Card>
                            <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Workflow className="h-7 w-7" />
                                </div>
                                <div className="max-w-lg">
                                    <h3 className="text-lg font-semibold">Project Canvas</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Ruang dokumentasi visual untuk project ini — business process, application flow, module structure,
                                        ERD database, hingga system architecture dalam satu infinite canvas.
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                                    <span className="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-2.5 py-1"><Workflow className="h-3.5 w-3.5" /> Flowchart</span>
                                    <span className="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-2.5 py-1"><Database className="h-3.5 w-3.5" /> ERD / Schema</span>
                                    <span className="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-2.5 py-1"><Share2 className="h-3.5 w-3.5" /> Import Markdown</span>
                                </div>
                                <Button asChild className="mt-2">
                                    <Link href={`/projects/${project.id}/canvas`}>
                                        <Workflow className="mr-2 h-4 w-4" /> Buka Canvas
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="meetings">
                        <ProjectMeetings project={project} />
                    </TabsContent>

                    <TabsContent value="activity">
                        <ProjectActivity project={project} />
                    </TabsContent>

                    <TabsContent value="revisions">
                        <ProjectRevisions project={project} />
                    </TabsContent>

                    <TabsContent value="feedback">
                        <ClientFeedback project={project} />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}

ProjectShow.layout = {
    breadcrumbs: [
        {
            title: 'Projects',
            href: '/projects',
        },
        {
            title: 'Project Details',
            href: '#',
        },
    ],
};

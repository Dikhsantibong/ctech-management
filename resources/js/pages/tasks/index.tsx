import { Head, useForm, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    Plus, MoreVertical, Edit2, Trash2, CheckSquare, Paperclip, Clock, Trash, Search, X, ListFilter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { projectColor, avatarColor } from '@/lib/project-colors';

const STATUS_COLUMNS = ['Todo', 'Progress', 'Review', 'Done'] as const;

const STATUS_META: Record<string, { label: string; dot: string; rule: string }> = {
    Todo: { label: 'Belum Dikerjakan', dot: 'bg-slate-400', rule: 'bg-slate-300 dark:bg-slate-600' },
    Progress: { label: 'Sedang Dikerjakan', dot: 'bg-blue-500', rule: 'bg-blue-500' },
    Review: { label: 'Menunggu Review', dot: 'bg-amber-500', rule: 'bg-amber-500' },
    Done: { label: 'Selesai', dot: 'bg-emerald-500', rule: 'bg-emerald-500' },
};

const PRIORITY_META: Record<string, { label: string; dot: string; text: string }> = {
    Low: { label: 'Rendah', dot: 'bg-slate-400', text: 'text-muted-foreground' },
    Medium: { label: 'Sedang', dot: 'bg-sky-500', text: 'text-muted-foreground' },
    High: { label: 'Tinggi', dot: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400 font-medium' },
};

const initials = (name?: string) => (name ? name.trim().charAt(0).toUpperCase() : '?');

export default function TasksIndex({
    tasks,
    projects,
    users,
    milestones,
    feedbacks,
    meetings,
    filters,
}: {
    tasks: any[];
    projects: any[];
    users: any[];
    milestones: any[];
    feedbacks: any[];
    meetings: any[];
    filters: any;
}) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [draggedTask, setDraggedTask] = useState<any>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
    const [checklistInput, setChecklistInput] = useState('');

    // Filter sisi klien — tidak perlu bolak-balik ke server
    const [search, setSearch] = useState('');
    const [projectFilter, setProjectFilter] = useState<string>(filters?.project_id ? String(filters.project_id) : 'all');
    const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

    const { data, setData, post, processing, errors, reset } = useForm({
        project_id: filters?.project_id || (projects.length > 0 ? projects[0].id.toString() : ''),
        project_milestone_id: '',
        client_feedback_id: '',
        meeting_id: '',
        user_id: '',
        title: '',
        description: '',
        status: 'Todo',
        priority: 'Medium',
        start_date: '',
        deadline: '',
        metadata: {
            task_type: '',
            reminder: 'None',
            collaborators: [] as number[],
            checklist: [] as { id: number; text: string; is_completed: boolean }[],
            attachments: [] as any[],
        } as any,
        new_attachments: [] as File[],
    });

    const openCreateModal = (status?: string) => {
        reset();
        if (status) setData('status', status);
        setIsCreateModalOpen(true);
    };

    const openEditModal = (task: any) => {
        setSelectedTask(task);
        setData({
            project_id: task.project_id?.toString() || '',
            project_milestone_id: task.project_milestone_id?.toString() || '',
            client_feedback_id: task.client_feedback_id?.toString() || '',
            meeting_id: task.meeting_id?.toString() || '',
            user_id: task.user_id?.toString() || '',
            title: task.title,
            description: task.description || '',
            status: task.status,
            priority: task.priority,
            start_date: task.start_date || '',
            deadline: task.deadline || '',
            metadata: {
                task_type: task.metadata?.task_type || '',
                reminder: task.metadata?.reminder || 'None',
                collaborators: task.metadata?.collaborators || [],
                checklist: task.metadata?.checklist || [],
                attachments: task.metadata?.attachments || [],
            },
            new_attachments: [],
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (task: any) => {
        setSelectedTask(task);
        setIsDeleteModalOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/tasks', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
            forceFormData: true,
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        // Inertia tidak mendukung PUT dengan FormData, jadi disamarkan lewat POST + _method
        router.post(
            `/tasks/${selectedTask?.id}`,
            { _method: 'put', ...data } as any,
            {
                onSuccess: () => {
                    setIsEditModalOpen(false);
                    reset();
                },
                forceFormData: true,
            },
        );
    };

    const submitDelete = (e: React.FormEvent) => {
        e.preventDefault();
        router.delete(`/tasks/${selectedTask?.id}`, {
            onSuccess: () => setIsDeleteModalOpen(false),
        });
    };

    const updateTaskStatus = (task: any, newStatus: string) => {
        // Kirim hanya kolom yang divalidasi controller — menyertakan objek relasi
        // (project, assignee, dll) hanya memperbesar payload tanpa guna.
        router.post(
            `/tasks/${task.id}`,
            {
                _method: 'put',
                project_id: task.project_id,
                project_milestone_id: task.project_milestone_id,
                client_feedback_id: task.client_feedback_id,
                meeting_id: task.meeting_id,
                user_id: task.user_id,
                title: task.title,
                description: task.description,
                status: newStatus,
                priority: task.priority,
                start_date: task.start_date,
                deadline: task.deadline,
                metadata: task.metadata,
            },
            { preserveScroll: true },
        );
    };

    const handleMetaChange = (key: string, value: any) => {
        setData('metadata', { ...data.metadata, [key]: value });
    };

    const addChecklistItem = () => {
        if (checklistInput.trim() === '') return;
        const current = Array.isArray(data.metadata?.checklist) ? data.metadata.checklist : [];
        handleMetaChange('checklist', [...current, { id: Date.now(), text: checklistInput, is_completed: false }]);
        setChecklistInput('');
    };

    const toggleChecklist = (id: number) => {
        const current = Array.isArray(data.metadata?.checklist) ? data.metadata.checklist : [];
        handleMetaChange('checklist', current.map((item: any) => (item.id === id ? { ...item, is_completed: !item.is_completed } : item)));
    };

    const removeChecklist = (id: number) => {
        const current = Array.isArray(data.metadata?.checklist) ? data.metadata.checklist : [];
        handleMetaChange('checklist', current.filter((item: any) => item.id !== id));
    };

    // Drag & drop
    const handleDragStart = (e: React.DragEvent, task: any) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', task.id.toString());
    };

    const handleDragEnd = () => {
        setDraggedTask(null);
        setDragOverColumn(null);
    };

    const handleDragOver = (e: React.DragEvent, status: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverColumn(status);
    };

    const handleDrop = (e: React.DragEvent, newStatus: string) => {
        e.preventDefault();
        setDragOverColumn(null);
        if (draggedTask && draggedTask.status !== newStatus) {
            updateTaskStatus(draggedTask, newStatus);
        }
    };

    const visibleTasks = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return tasks.filter((task) => {
            if (projectFilter !== 'all' && String(task.project_id) !== projectFilter) return false;
            if (assigneeFilter === 'unassigned' && task.user_id) return false;
            if (assigneeFilter !== 'all' && assigneeFilter !== 'unassigned' && String(task.user_id) !== assigneeFilter) return false;
            if (keyword) {
                const haystack = `${task.title} ${task.description ?? ''} ${task.project?.project_name ?? ''}`.toLowerCase();
                if (!haystack.includes(keyword)) return false;
            }
            return true;
        });
    }, [tasks, search, projectFilter, assigneeFilter]);

    const projectCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const task of tasks) {
            const key = String(task.project_id ?? 'none');
            counts[key] = (counts[key] || 0) + 1;
        }
        return counts;
    }, [tasks]);

    const overdueCount = useMemo(
        () =>
            visibleTasks.filter(
                (t) => t.deadline && t.status !== 'Done' && new Date(t.deadline) < new Date(new Date().toDateString()),
            ).length,
        [visibleTasks],
    );

    const hasActiveFilter = search !== '' || projectFilter !== 'all' || assigneeFilter !== 'all';

    const clearFilters = () => {
        setSearch('');
        setProjectFilter('all');
        setAssigneeFilter('all');
    };

    const checklistProgress = (checklist: any[]) => {
        if (!checklist || checklist.length === 0) return null;
        const done = checklist.filter((c) => c.is_completed).length;
        return { done, total: checklist.length, percent: Math.round((done / checklist.length) * 100) };
    };

    const isOverdue = (task: any) =>
        task.deadline && task.status !== 'Done' && new Date(task.deadline) < new Date(new Date().toDateString());

    const renderFormContent = () => (
        <ScrollArea className="max-h-[70vh] px-1">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Kolom 1 — Informasi dasar */}
                <div className="space-y-4">
                    <h3 className="border-b pb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Informasi Task
                    </h3>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Judul Task</Label>
                        <Input
                            className="h-9"
                            placeholder="Contoh: Perbaiki layout halaman checkout"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        {errors.title && <p className="text-[11px] text-destructive">{errors.title}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Deskripsi</Label>
                        <Textarea
                            className="min-h-[90px]"
                            placeholder="Apa yang perlu dikerjakan dan kriteria selesainya."
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Status</Label>
                            <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUS_COLUMNS.map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {STATUS_META[s].label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Prioritas</Label>
                            <Select value={data.priority} onValueChange={(val) => setData('priority', val)}>
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(PRIORITY_META).map((p) => (
                                        <SelectItem key={p} value={p}>
                                            {PRIORITY_META[p].label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Jenis Task</Label>
                        <Input
                            className="h-9"
                            placeholder="Bug, Fitur, Hotfix, Riset…"
                            value={data.metadata?.task_type || ''}
                            onChange={(e) => handleMetaChange('task_type', e.target.value)}
                        />
                    </div>
                </div>

                {/* Kolom 2 — Penugasan & keterkaitan */}
                <div className="space-y-4">
                    <h3 className="border-b pb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Penugasan & Keterkaitan
                    </h3>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Project</Label>
                        <Select value={data.project_id || 'none'} onValueChange={(val) => setData('project_id', val === 'none' ? '' : val)}>
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder="Pilih project" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Belum dipilih</SelectItem>
                                {projects.map((p: any) => (
                                    <SelectItem key={p.id} value={p.id.toString()}>
                                        <span className="flex items-center gap-2">
                                            <span className={`h-2 w-2 rounded-full ${projectColor(p.id).dot}`} />
                                            {p.project_name}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.project_id && <p className="text-[11px] text-destructive">{errors.project_id}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Milestone</Label>
                        <Select
                            value={data.project_milestone_id || 'none'}
                            onValueChange={(val) => setData('project_milestone_id', val === 'none' ? '' : val)}
                        >
                            <SelectTrigger className="h-9 [&>span]:line-clamp-1">
                                <SelectValue placeholder="Tanpa milestone" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Tanpa milestone</SelectItem>
                                {milestones
                                    .filter((m: any) => String(m.project_id) === data.project_id)
                                    .map((m: any) => (
                                        <SelectItem key={m.id} value={m.id.toString()}>
                                            {m.name}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                        <p className="text-[11px] text-muted-foreground">Pilihan menyesuaikan project yang dipilih.</p>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Feedback Terkait</Label>
                        <Select
                            value={data.client_feedback_id || 'none'}
                            onValueChange={(val) => setData('client_feedback_id', val === 'none' ? '' : val)}
                        >
                            <SelectTrigger className="h-9 [&>span]:line-clamp-1">
                                <SelectValue placeholder="Tanpa feedback" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Tanpa feedback</SelectItem>
                                {feedbacks
                                    .filter((f: any) => String(f.project_id) === data.project_id)
                                    .map((f: any) => (
                                        // Kolomnya bernama "subject", bukan "title"
                                        <SelectItem key={f.id} value={f.id.toString()}>
                                            {f.subject}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Meeting Terkait</Label>
                        <Select value={data.meeting_id || 'none'} onValueChange={(val) => setData('meeting_id', val === 'none' ? '' : val)}>
                            <SelectTrigger className="h-9 [&>span]:line-clamp-1">
                                <SelectValue placeholder="Tanpa meeting" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Tanpa meeting</SelectItem>
                                {meetings
                                    .filter((m: any) => String(m.project_id) === data.project_id)
                                    .map((m: any) => (
                                        <SelectItem key={m.id} value={m.id.toString()}>
                                            {m.title}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Penanggung Jawab</Label>
                        <Select value={data.user_id || 'none'} onValueChange={(val) => setData('user_id', val === 'none' ? '' : val)}>
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder="Belum ditugaskan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Belum ditugaskan</SelectItem>
                                {users.map((u: any) => (
                                    <SelectItem key={u.id} value={u.id.toString()}>
                                        {u.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Kolaborator</Label>
                        <div className="max-h-24 space-y-0.5 overflow-y-auto rounded-md border p-2">
                            {users.map((u: any) => {
                                const collabs = data.metadata?.collaborators || [];
                                return (
                                    <label
                                        key={u.id}
                                        className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-xs hover:bg-muted"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={collabs.includes(u.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) handleMetaChange('collaborators', [...collabs, u.id]);
                                                else handleMetaChange('collaborators', collabs.filter((id: number) => id !== u.id));
                                            }}
                                            className="rounded border-input"
                                        />
                                        <span>{u.name}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Kolom 3 — Jadwal & lampiran */}
                <div className="space-y-4">
                    <h3 className="border-b pb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Jadwal & Rincian
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Mulai</Label>
                            <Input
                                type="date"
                                className="h-9 text-xs"
                                value={data.start_date || ''}
                                onChange={(e) => setData('start_date', e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Tenggat</Label>
                            <Input
                                type="date"
                                className="h-9 text-xs"
                                min={data.start_date || undefined}
                                value={data.deadline || ''}
                                onChange={(e) => setData('deadline', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Pengingat</Label>
                        <Select value={data.metadata?.reminder || 'None'} onValueChange={(val) => handleMetaChange('reminder', val)}>
                            <SelectTrigger className="h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="None">Tanpa pengingat</SelectItem>
                                <SelectItem value="H-7">7 hari sebelum tenggat</SelectItem>
                                <SelectItem value="H-3">3 hari sebelum tenggat</SelectItem>
                                <SelectItem value="H-1">1 hari sebelum tenggat</SelectItem>
                                <SelectItem value="Due Date">Tepat di hari tenggat</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs">Checklist</Label>
                        <div className="flex gap-2">
                            <Input
                                value={checklistInput}
                                onChange={(e) => setChecklistInput(e.target.value)}
                                placeholder="Tambah sub-task…"
                                className="h-8 text-xs"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addChecklistItem();
                                    }
                                }}
                            />
                            <Button type="button" onClick={addChecklistItem} variant="secondary" size="sm" className="h-8">
                                Tambah
                            </Button>
                        </div>
                        <div className="max-h-28 space-y-1 overflow-y-auto">
                            {(data.metadata?.checklist || []).map((item: any) => (
                                <div key={item.id} className="flex items-center justify-between rounded border bg-card p-1.5 text-xs">
                                    <label className="flex cursor-pointer items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={item.is_completed}
                                            onChange={() => toggleChecklist(item.id)}
                                            className="rounded border-input"
                                        />
                                        <span className={item.is_completed ? 'text-muted-foreground line-through' : ''}>{item.text}</span>
                                    </label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-5 w-5 p-0"
                                        onClick={() => removeChecklist(item.id)}
                                    >
                                        <Trash className="h-3 w-3 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                            {(data.metadata?.checklist || []).length === 0 && (
                                <p className="py-1 text-[11px] italic text-muted-foreground">Belum ada sub-task.</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs">Lampiran</Label>
                        <Input
                            type="file"
                            multiple
                            accept=".pdf,.png,.jpg,.jpeg,.zip"
                            onChange={(e) => setData('new_attachments', Array.from(e.target.files || []))}
                            className="text-xs file:h-8"
                        />
                        {data.metadata?.attachments?.length > 0 && (
                            <p className="text-[11px] text-muted-foreground">
                                {data.metadata.attachments.length} lampiran tersimpan sebelumnya.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </ScrollArea>
    );

    return (
        <>
            <Head title="Task" />
            <div className="flex flex-1 flex-col gap-4 p-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Task</h2>
                        <p className="text-sm text-muted-foreground">
                            {visibleTasks.length} task ditampilkan
                            {hasActiveFilter ? ` dari ${tasks.length} total` : ''}
                            {overdueCount > 0 && (
                                <span className="text-rose-600 dark:text-rose-400"> · {overdueCount} lewat tenggat</span>
                            )}
                        </p>
                    </div>
                    <Button onClick={() => openCreateModal()} className="shrink-0">
                        <Plus className="mr-2 h-4 w-4" /> Task Baru
                    </Button>
                </div>

                {/* Filter */}
                <div className="space-y-3 rounded-xl border bg-card p-3">
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Cari judul, deskripsi, atau nama project…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-9 pl-9"
                            />
                        </div>
                        <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                            <SelectTrigger className="h-9 w-full sm:w-56">
                                <span className="flex items-center gap-2">
                                    <ListFilter className="h-3.5 w-3.5 text-muted-foreground" />
                                    <SelectValue />
                                </span>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua penanggung jawab</SelectItem>
                                <SelectItem value="unassigned">Belum ditugaskan</SelectItem>
                                {users.map((u: any) => (
                                    <SelectItem key={u.id} value={u.id.toString()}>
                                        {u.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {hasActiveFilter && (
                            <Button variant="ghost" onClick={clearFilters} className="h-9 shrink-0">
                                <X className="mr-1.5 h-4 w-4" /> Reset
                            </Button>
                        )}
                    </div>

                    {/* Chip project — sekaligus jadi legenda warna */}
                    <div className="flex flex-wrap gap-1.5">
                        <button
                            type="button"
                            onClick={() => setProjectFilter('all')}
                            className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                                projectFilter === 'all'
                                    ? 'border-foreground bg-foreground text-background'
                                    : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted'
                            }`}
                        >
                            Semua Project ({tasks.length})
                        </button>
                        {projects.map((p: any) => {
                            const color = projectColor(p.id);
                            const active = projectFilter === String(p.id);
                            const count = projectCounts[String(p.id)] || 0;

                            return (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setProjectFilter(active ? 'all' : String(p.id))}
                                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                                        active ? color.chipActive : `${color.chip} hover:brightness-95`
                                    }`}
                                    title={p.project_name}
                                >
                                    <span className={`h-2 w-2 rounded-full ${active ? 'bg-white/80' : color.dot}`} />
                                    <span className="max-w-[160px] truncate">{p.project_name}</span>
                                    <span className={active ? 'text-white/70' : 'opacity-60'}>{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Papan kanban */}
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {STATUS_COLUMNS.map((status) => {
                        const columnTasks = visibleTasks.filter((t) => t.status === status);
                        const isOver = dragOverColumn === status;
                        const meta = STATUS_META[status];

                        return (
                            <div
                                key={status}
                                className={`flex min-w-[340px] flex-1 flex-col rounded-xl border bg-muted/20 transition-colors ${
                                    isOver ? 'border-primary bg-primary/5' : ''
                                }`}
                                onDragOver={(e) => handleDragOver(e, status)}
                                onDragLeave={() => setDragOverColumn(null)}
                                onDrop={(e) => handleDrop(e, status)}
                            >
                                <div className={`h-1 rounded-t-xl ${meta.rule}`} />
                                <div className="flex items-center justify-between px-3 py-2.5">
                                    <div className="flex items-center gap-2">
                                        <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                                        <h3 className="text-sm font-semibold">{meta.label}</h3>
                                        <span className="rounded bg-background px-1.5 text-xs font-medium text-muted-foreground">
                                            {columnTasks.length}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0"
                                        onClick={() => openCreateModal(status)}
                                        title={`Tambah task ke ${meta.label}`}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex min-h-[240px] flex-col gap-2.5 p-2.5 pt-0">
                                    {columnTasks.map((task) => {
                                        const color = projectColor(task.project_id);
                                        const progress = checklistProgress(task.metadata?.checklist);
                                        const overdue = isOverdue(task);
                                        const priority = PRIORITY_META[task.priority] ?? PRIORITY_META.Medium;
                                        // Relasi diserialisasi snake_case oleh Laravel
                                        const milestone = task.project_milestone;

                                        return (
                                            <div
                                                key={task.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, task)}
                                                onDragEnd={handleDragEnd}
                                                className={`group relative cursor-grab overflow-hidden rounded-lg border bg-card pl-4 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing ${
                                                    draggedTask?.id === task.id ? 'opacity-40' : ''
                                                }`}
                                            >
                                                {/* Garis warna identitas project */}
                                                <span className={`absolute inset-y-0 left-0 w-1.5 ${color.bar}`} aria-hidden />

                                                <div className="p-3.5 pl-2.5">
                                                    {/* Baris project */}
                                                    <div className="mb-2 flex items-start justify-between gap-2">
                                                        <span className="flex min-w-0 items-center gap-1.5">
                                                            <span className={`h-2 w-2 shrink-0 rounded-full ${color.dot}`} />
                                                            <span className="truncate text-xs font-medium text-muted-foreground">
                                                                {task.project?.project_name ?? 'Tanpa project'}
                                                            </span>
                                                        </span>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    className="-mr-1 -mt-1 h-7 w-7 shrink-0 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                                                                >
                                                                    <MoreVertical className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => openEditModal(task)}>
                                                                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => openDeleteModal(task)}
                                                                    className="text-destructive"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>

                                                    {/* Judul */}
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(task)}
                                                        className="mb-1.5 block w-full text-left text-[15px] font-semibold leading-snug hover:underline"
                                                    >
                                                        {task.title}
                                                    </button>

                                                    {/* Deskripsi singkat */}
                                                    {task.description && (
                                                        <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                                            {task.description}
                                                        </p>
                                                    )}

                                                    {/* Milestone & jenis */}
                                                    {(milestone || task.metadata?.task_type) && (
                                                        <div className="mb-2 flex flex-wrap gap-1.5">
                                                            {milestone && (
                                                                <span className="rounded border bg-muted/50 px-2 py-0.5 text-[11px] text-muted-foreground">
                                                                    {milestone.name}
                                                                </span>
                                                            )}
                                                            {task.metadata?.task_type && (
                                                                <span className="rounded border bg-muted/50 px-2 py-0.5 text-[11px] text-muted-foreground">
                                                                    {task.metadata.task_type}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Progress checklist */}
                                                    {progress && (
                                                        <div className="mb-2.5 flex items-center gap-2">
                                                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                                                                <div
                                                                    className={`h-full rounded-full ${
                                                                        progress.percent === 100 ? 'bg-emerald-500' : color.bar
                                                                    }`}
                                                                    style={{ width: `${progress.percent}%` }}
                                                                />
                                                            </div>
                                                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                                <CheckSquare className="h-3.5 w-3.5" />
                                                                {progress.done}/{progress.total}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Footer */}
                                                    <div className="flex items-center justify-between gap-2 border-t pt-2.5">
                                                        <div className="flex min-w-0 items-center gap-2">
                                                            {task.assignee ? (
                                                                <span
                                                                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${avatarColor(
                                                                        task.assignee.name,
                                                                    )}`}
                                                                    title={task.assignee.name}
                                                                >
                                                                    {initials(task.assignee.name)}
                                                                </span>
                                                            ) : (
                                                                <span className="text-[11px] italic text-muted-foreground">
                                                                    Belum ditugaskan
                                                                </span>
                                                            )}
                                                            <span
                                                                className={`flex items-center gap-1 text-[11px] ${priority.text}`}
                                                                title={`Prioritas ${priority.label}`}
                                                            >
                                                                <span className={`h-2 w-2 rounded-full ${priority.dot}`} />
                                                                {priority.label}
                                                            </span>
                                                            {task.metadata?.attachments?.length > 0 && (
                                                                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                                    <Paperclip className="h-3.5 w-3.5" />
                                                                    {task.metadata.attachments.length}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {task.deadline && (
                                                            <span
                                                                className={`flex shrink-0 items-center gap-1 rounded px-2 py-1 text-[11px] ${
                                                                    overdue
                                                                        ? 'bg-rose-50 font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                                                                        : 'text-muted-foreground'
                                                                }`}
                                                                title={overdue ? 'Lewat tenggat' : 'Tenggat'}
                                                            >
                                                                <Clock className="h-3.5 w-3.5" />
                                                                {new Date(task.deadline).toLocaleDateString('id-ID', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                })}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {columnTasks.length === 0 && (
                                        <button
                                            type="button"
                                            onClick={() => openCreateModal(status)}
                                            className="flex min-h-[96px] w-full items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                                        >
                                            {hasActiveFilter ? 'Tidak ada task yang cocok' : '+ Tambah task'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal buat */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Task Baru</DialogTitle>
                        <DialogDescription>Buat task dan kaitkan dengan project, milestone, atau feedback klien.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate}>
                        {renderFormContent()}
                        <DialogFooter className="mt-4 border-t pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Simpan Task
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal edit */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                        <DialogDescription>Perbarui detail {selectedTask?.title}.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit}>
                        {renderFormContent()}
                        <DialogFooter className="mt-4 border-t pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Simpan Perubahan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal hapus */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Task</DialogTitle>
                        <DialogDescription>
                            Yakin ingin menghapus <span className="font-semibold">{selectedTask?.title}</span>? Tindakan ini tidak bisa
                            dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitDelete}>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" variant="destructive" disabled={processing}>
                                Hapus
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

TasksIndex.layout = {
    breadcrumbs: [{ title: 'Task', href: '/tasks' }],
};

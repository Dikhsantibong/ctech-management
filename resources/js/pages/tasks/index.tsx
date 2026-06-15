import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, MoreVertical, Edit2, Trash2, LayoutGrid, List, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function TasksIndex({ tasks, projects, users, filters }: { tasks: any[], projects: any[], users: any[], filters: any }) {
    const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [draggedTask, setDraggedTask] = useState<any>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        project_id: filters.project_id || (projects.length > 0 ? projects[0].id.toString() : ''),
        user_id: '',
        title: '',
        description: '',
        status: 'Todo',
        priority: 'Medium',
        deadline: '',
        metadata: {} as any,
    });

    const getSelectedProjectType = (projectId: string) => {
        const project = projects.find(p => p.id.toString() === projectId);
        return project ? project.project_type : 'Lainnya';
    };

    const handleMetaChange = (key: string, value: string) => {
        setData('metadata', { ...data.metadata, [key]: value });
    };

    const renderDynamicFields = () => {
        const type = getSelectedProjectType(data.project_id);
        if (type === 'Aplikasi') {
            return (
                <>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Platform (Web/Mobile)</Label>
                        <Input value={data.metadata?.platform || ''} onChange={e => handleMetaChange('platform', e.target.value)} placeholder="e.g. Web App" />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Tipe Tugas (Bug/Fitur)</Label>
                        <Input value={data.metadata?.task_type || ''} onChange={e => handleMetaChange('task_type', e.target.value)} placeholder="e.g. Bug Fix, New Feature" />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label>Environment</Label>
                        <Input value={data.metadata?.environment || ''} onChange={e => handleMetaChange('environment', e.target.value)} placeholder="e.g. Production, Staging" />
                    </div>
                </>
            );
        } else if (type === 'Video/Animasi') {
            return (
                <>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Scene/Durasi</Label>
                        <Input value={data.metadata?.scene || ''} onChange={e => handleMetaChange('scene', e.target.value)} placeholder="e.g. Scene 1 / 00:30" />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Kebutuhan Aset</Label>
                        <Input value={data.metadata?.assets_needed || ''} onChange={e => handleMetaChange('assets_needed', e.target.value)} placeholder="e.g. Voice Over, B-Roll" />
                    </div>
                </>
            );
        } else if (type === 'Desain') {
            return (
                <>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Dimensi/Resolusi</Label>
                        <Input value={data.metadata?.dimensions || ''} onChange={e => handleMetaChange('dimensions', e.target.value)} placeholder="e.g. 1080x1080px" />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Format File</Label>
                        <Input value={data.metadata?.file_format || ''} onChange={e => handleMetaChange('file_format', e.target.value)} placeholder="e.g. PNG, PDF, AI" />
                    </div>
                </>
            );
        }
        return null;
    };

    const openCreateModal = () => {
        reset();
        const defaultProjectId = filters.project_id || (projects.length > 0 ? projects[0].id.toString() : '');
        setData({
            project_id: defaultProjectId,
            user_id: '',
            title: '',
            description: '',
            status: 'Todo',
            priority: 'Medium',
            deadline: '',
            metadata: {},
        });
        setIsCreateModalOpen(true);
    };

    const openEditModal = (task: any) => {
        setSelectedTask(task);
        setData({
            project_id: task.project_id.toString(),
            user_id: task.user_id ? task.user_id.toString() : '',
            title: task.title,
            description: task.description || '',
            status: task.status,
            priority: task.priority,
            deadline: task.deadline || '',
            metadata: task.metadata || {},
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
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/tasks/${selectedTask?.id}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
            },
        });
    };

    const submitDelete = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(`/tasks/${selectedTask?.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
            },
        });
    };

    const handleProjectFilter = (projectId: string) => {
        router.get('/tasks', projectId && projectId !== 'all' ? { project_id: projectId } : {}, { preserveState: true });
    };

    const updateTaskStatus = (task: any, newStatus: string) => {
        router.put(`/tasks/${task.id}`, {
            project_id: task.project_id,
            user_id: task.user_id || null,
            title: task.title,
            description: task.description || '',
            status: newStatus,
            priority: task.priority,
            deadline: task.deadline || null,
            metadata: task.metadata || {},
        }, { preserveScroll: true });
    };

    // Drag & Drop handlers
    const handleDragStart = (e: React.DragEvent, task: any) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', task.id.toString());
        const target = e.target as HTMLElement;
        setTimeout(() => target.style.opacity = '0.5', 0);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        const target = e.target as HTMLElement;
        target.style.opacity = '1';
        setDraggedTask(null);
        setDragOverColumn(null);
    };

    const handleDragOver = (e: React.DragEvent, status: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverColumn(status);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        const relatedTarget = e.relatedTarget as HTMLElement;
        const currentTarget = e.currentTarget as HTMLElement;
        if (!currentTarget.contains(relatedTarget)) {
            setDragOverColumn(null);
        }
    };

    const handleDrop = (e: React.DragEvent, newStatus: string) => {
        e.preventDefault();
        setDragOverColumn(null);

        if (draggedTask && draggedTask.status !== newStatus) {
            updateTaskStatus(draggedTask, newStatus);
        }
        setDraggedTask(null);
    };

    const priorityBadgeColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'destructive';
            case 'Medium': return 'secondary';
            default: return 'outline';
        }
    };

    const statusColumns = ['Todo', 'Progress', 'Review', 'Done'];

    const statusColumnColors: Record<string, string> = {
        'Todo': 'border-t-zinc-400',
        'Progress': 'border-t-blue-500',
        'Review': 'border-t-yellow-500',
        'Done': 'border-t-emerald-500',
    };

    return (
        <>
            <Head title="Tasks" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
                        <p className="text-muted-foreground">Manage tasks and track progress.</p>
                    </div>
                    
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Select value={filters.project_id || 'all'} onValueChange={handleProjectFilter}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="All Projects" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Projects</SelectItem>
                                {projects.map((p: any) => (
                                    <SelectItem key={p.id} value={p.id.toString()}>{p.project_name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex rounded-md shadow-sm">
                            <Button 
                                variant={viewMode === 'kanban' ? 'default' : 'outline'} 
                                className="rounded-r-none px-3"
                                onClick={() => setViewMode('kanban')}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant={viewMode === 'table' ? 'default' : 'outline'} 
                                className="rounded-l-none px-3"
                                onClick={() => setViewMode('table')}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>

                        <Button onClick={openCreateModal}>
                            <Plus className="mr-2 h-4 w-4" /> New Task
                        </Button>
                    </div>
                </div>

                {viewMode === 'table' ? (
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                        <div className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Project</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Priority</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Assignee</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map((task) => (
                                            <tr key={task.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <td className="p-4 align-middle font-medium">{task.title}</td>
                                                <td className="p-4 align-middle text-muted-foreground">{task.project?.project_name}</td>
                                                <td className="p-4 align-middle">
                                                    <Select value={task.status} onValueChange={(val) => updateTaskStatus(task, val)}>
                                                        <SelectTrigger className="h-8 w-[120px]">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Todo">Todo</SelectItem>
                                                            <SelectItem value="Progress">Progress</SelectItem>
                                                            <SelectItem value="Review">Review</SelectItem>
                                                            <SelectItem value="Done">Done</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <Badge variant={priorityBadgeColor(task.priority)}>
                                                        {task.priority}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    {task.assignee ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs">
                                                                {task.assignee.name.charAt(0)}
                                                            </div>
                                                            <span>{task.assignee.name}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground italic">Unassigned</span>
                                                    )}
                                                </td>
                                                <td className="p-4 align-middle text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => openEditModal(task)}>
                                                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openDeleteModal(task)} className="text-destructive">
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                        {tasks.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                                    No tasks found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {statusColumns.map(status => {
                            const columnTasks = tasks.filter(t => t.status === status);
                            const isOver = dragOverColumn === status;

                            return (
                                <div 
                                    key={status} 
                                    className={`flex min-w-[300px] flex-1 flex-col rounded-xl border-t-4 bg-muted/30 transition-all duration-200 ${statusColumnColors[status] || 'border-t-zinc-400'} ${isOver ? 'ring-2 ring-primary ring-offset-2 bg-primary/5' : ''}`}
                                    onDragOver={(e) => handleDragOver(e, status)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, status)}
                                >
                                    <div className="flex items-center justify-between p-4 pb-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-sm">{status}</h3>
                                            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground">
                                                {columnTasks.length}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0"
                                            onClick={() => {
                                                reset();
                                                setData('status', status);
                                                setIsCreateModalOpen(true);
                                            }}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-col gap-2 p-3 pt-1 min-h-[200px]">
                                        {columnTasks.map(task => (
                                            <div 
                                                key={task.id} 
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, task)}
                                                onDragEnd={handleDragEnd}
                                                className={`group rounded-lg border bg-card p-3 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing active:shadow-lg active:scale-[1.02] ${draggedTask?.id === task.id ? 'opacity-50' : ''}`}
                                            >
                                                <div className="mb-2 flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <Badge variant={priorityBadgeColor(task.priority)} className="text-[10px] px-1.5 py-0">
                                                            {task.priority}
                                                        </Badge>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <MoreVertical className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => openEditModal(task)}>
                                                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openDeleteModal(task)} className="text-destructive">
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                <h4 className="font-medium text-sm mb-1 line-clamp-2 cursor-pointer" onClick={() => openEditModal(task)}>{task.title}</h4>
                                                <div className="mb-2">
                                                    <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary">
                                                        {task.project?.project_name}
                                                    </Badge>
                                                </div>
                                                {task.description && (
                                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{task.description}</p>
                                                )}
                                                
                                                {task.metadata && Object.keys(task.metadata).length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mb-2">
                                                        {Object.values(task.metadata).map((val: any, idx: number) => 
                                                            val ? <span key={idx} className="rounded border bg-muted/30 px-1 py-0.5 text-[9px] text-muted-foreground">{val}</span> : null
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between mt-auto pt-2 border-t border-muted/50">
                                                    {task.assignee ? (
                                                        <div className="flex items-center gap-1" title={task.assignee.name}>
                                                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium border border-background">
                                                                {task.assignee.name.charAt(0)}
                                                            </div>
                                                            <span className="text-[10px] text-muted-foreground truncate max-w-[60px]">{task.assignee.name}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] text-muted-foreground">Unassigned</span>
                                                    )}
                                                    {task.deadline && (
                                                        <span className="text-[10px] text-muted-foreground border rounded px-1.5 py-0.5">
                                                            📅 {new Date(task.deadline).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {columnTasks.length === 0 && (
                                            <div className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors ${isOver ? 'border-primary bg-primary/5' : 'border-muted'}`}>
                                                <p className="text-xs text-muted-foreground">
                                                    {isOver ? 'Lepaskan di sini' : 'Drag task ke sini'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>New Task</DialogTitle>
                        <DialogDescription>Create a new task and assign it to a team member.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="title">Task Title</Label>
                            <Input id="title" value={data.title} onChange={e => setData('title', e.target.value)} required />
                            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label htmlFor="project_id">Project</Label>
                            <Select value={data.project_id} onValueChange={value => setData('project_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select project" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects.map((p: any) => (
                                        <SelectItem key={p.id} value={p.id.toString()}>{p.project_name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.project_id && <p className="text-sm text-destructive">{errors.project_id}</p>}
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label htmlFor="user_id">Assignee</Label>
                            <Select value={data.user_id || 'none'} onValueChange={value => setData('user_id', value === 'none' ? '' : value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Unassigned" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Unassigned</SelectItem>
                                    {users.map((u: any) => (
                                        <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.user_id && <p className="text-sm text-destructive">{errors.user_id}</p>}
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" value={data.description} onChange={e => setData('description', e.target.value)} />
                            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={value => setData('status', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Todo">Todo</SelectItem>
                                    <SelectItem value="Progress">Progress</SelectItem>
                                    <SelectItem value="Review">Review</SelectItem>
                                    <SelectItem value="Done">Done</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label htmlFor="priority">Priority</Label>
                            <Select value={data.priority} onValueChange={value => setData('priority', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.priority && <p className="text-sm text-destructive">{errors.priority}</p>}
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input id="deadline" type="date" value={data.deadline} onChange={e => setData('deadline', e.target.value)} />
                            {errors.deadline && <p className="text-sm text-destructive">{errors.deadline}</p>}
                        </div>
                        
                        {renderDynamicFields()}
                        
                        <div className="col-span-2 flex justify-end space-x-2 mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>Save Task</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                        <DialogDescription>Update details for {selectedTask?.title}.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="edit-title">Task Title</Label>
                            <Input id="edit-title" value={data.title} onChange={e => setData('title', e.target.value)} required />
                            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label htmlFor="edit-project_id">Project</Label>
                            <Select value={data.project_id} onValueChange={value => setData('project_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select project" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects.map((p: any) => (
                                        <SelectItem key={p.id} value={p.id.toString()}>{p.project_name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.project_id && <p className="text-sm text-destructive">{errors.project_id}</p>}
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label htmlFor="edit-user_id">Assignee</Label>
                            <Select value={data.user_id || 'none'} onValueChange={value => setData('user_id', value === 'none' ? '' : value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Unassigned" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Unassigned</SelectItem>
                                    {users.map((u: any) => (
                                        <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.user_id && <p className="text-sm text-destructive">{errors.user_id}</p>}
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea id="edit-description" value={data.description} onChange={e => setData('description', e.target.value)} />
                            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select value={data.status} onValueChange={value => setData('status', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Todo">Todo</SelectItem>
                                    <SelectItem value="Progress">Progress</SelectItem>
                                    <SelectItem value="Review">Review</SelectItem>
                                    <SelectItem value="Done">Done</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label htmlFor="edit-priority">Priority</Label>
                            <Select value={data.priority} onValueChange={value => setData('priority', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.priority && <p className="text-sm text-destructive">{errors.priority}</p>}
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label htmlFor="edit-deadline">Deadline</Label>
                            <Input id="edit-deadline" type="date" value={data.deadline} onChange={e => setData('deadline', e.target.value)} />
                            {errors.deadline && <p className="text-sm text-destructive">{errors.deadline}</p>}
                        </div>
                        
                        {renderDynamicFields()}
                        
                        <div className="col-span-2 flex justify-end space-x-2 mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>Update Task</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Task</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-semibold">{selectedTask?.title}</span>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitDelete}>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                            <Button type="submit" variant="destructive" disabled={processing}>Delete</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

TasksIndex.layout = {
    breadcrumbs: [
        {
            title: 'Tasks',
            href: '/tasks',
        },
    ],
};

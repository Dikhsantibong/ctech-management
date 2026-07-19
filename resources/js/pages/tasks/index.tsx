import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, MoreVertical, Edit2, Trash2, GripVertical, CheckSquare, Paperclip, Clock, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function TasksIndex({ tasks, projects, users, milestones, feedbacks, meetings, filters }: { tasks: any[], projects: any[], users: any[], milestones: any[], feedbacks: any[], meetings: any[], filters: any }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [draggedTask, setDraggedTask] = useState<any>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
    const [checklistInput, setChecklistInput] = useState('');

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        project_id: filters.project_id || (projects.length > 0 ? projects[0].id.toString() : ''),
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
            checklist: [] as { id: number, text: string, is_completed: boolean }[],
            attachments: [] as any[]
        } as any,
        new_attachments: [] as File[],
    });

    const openCreateModal = () => {
        reset();
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
                attachments: task.metadata?.attachments || []
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
        // Inertia doesn't support PUT with FormData, spoof it with POST _method
        router.post(`/tasks/${selectedTask?.id}`, {
            _method: 'put',
            ...data,
        } as any, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
            },
            forceFormData: true,
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

    const updateTaskStatus = (task: any, newStatus: string) => {
        router.post(`/tasks/${task.id}`, {
            _method: 'put',
            ...task,
            status: newStatus,
        }, { preserveScroll: true });
    };

    const handleMetaChange = (key: string, value: any) => {
        setData('metadata', { ...data.metadata, [key]: value });
    };

    // Checklist handlers
    const addChecklistItem = () => {
        if (checklistInput.trim() !== '') {
            const currentChecklist = Array.isArray(data.metadata?.checklist) ? data.metadata.checklist : [];
            handleMetaChange('checklist', [
                ...currentChecklist,
                { id: Date.now(), text: checklistInput, is_completed: false }
            ]);
            setChecklistInput('');
        }
    };

    const toggleChecklist = (id: number) => {
        const currentChecklist = Array.isArray(data.metadata?.checklist) ? data.metadata.checklist : [];
        handleMetaChange('checklist', currentChecklist.map((item: any) => 
            item.id === id ? { ...item, is_completed: !item.is_completed } : item
        ));
    };

    const removeChecklist = (id: number) => {
        const currentChecklist = Array.isArray(data.metadata?.checklist) ? data.metadata.checklist : [];
        handleMetaChange('checklist', currentChecklist.filter((item: any) => item.id !== id));
    };

    // Drag & Drop
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

    const handleDrop = (e: React.DragEvent, newStatus: string) => {
        e.preventDefault();
        setDragOverColumn(null);
        if (draggedTask && draggedTask.status !== newStatus) {
            updateTaskStatus(draggedTask, newStatus);
        }
    };

    const statusColumns = ['Todo', 'Progress', 'Review', 'Done'];
    const statusColors: Record<string, string> = { 'Todo': 'border-t-zinc-400', 'Progress': 'border-t-blue-500', 'Review': 'border-t-yellow-500', 'Done': 'border-t-emerald-500' };
    
    const getProgress = (checklist: any[]) => {
        if (!checklist || checklist.length === 0) return null;
        const completed = checklist.filter(c => c.is_completed).length;
        return `${completed}/${checklist.length}`;
    };

    const renderFormContent = () => (
        <ScrollArea className="max-h-[80vh] px-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* COLUMN 1: Basic Info */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-sm border-b pb-1.5">Basic Information</h3>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Task Title</Label>
                        <Input className="h-9" value={data.title} onChange={e => setData('title', e.target.value)} required />
                        {errors.title && <p className="text-[10px] text-destructive">{errors.title}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Description</Label>
                        <Textarea className="min-h-[80px]" value={data.description} onChange={e => setData('description', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Status</Label>
                            <Select value={data.status} onValueChange={val => setData('status', val)}>
                                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {statusColumns.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Priority</Label>
                            <Select value={data.priority} onValueChange={val => setData('priority', val)}>
                                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Task Type (Bug/Feature)</Label>
                        <Input className="h-9" placeholder="e.g. Bug, Feature, Hotfix" value={data.metadata?.task_type || ''} onChange={e => handleMetaChange('task_type', e.target.value)} />
                    </div>
                </div>

                {/* COLUMN 2: Relations */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-sm border-b pb-1.5">Assignment & Relations</h3>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Project</Label>
                        <Select value={data.project_id || 'none'} onValueChange={val => setData('project_id', val === 'none' ? '' : val)}>
                            <SelectTrigger className="h-9"><SelectValue placeholder="Select Project" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {projects.map((p: any) => <SelectItem key={p.id} value={p.id.toString()}>{p.project_name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {errors.project_id && <p className="text-[10px] text-destructive">{errors.project_id}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Project Milestone</Label>
                        <Select value={data.project_milestone_id || 'none'} onValueChange={val => setData('project_milestone_id', val === 'none' ? '' : val)}>
                            <SelectTrigger className="h-9 [&>span]:line-clamp-1"><SelectValue placeholder="No Milestone" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">No Milestone</SelectItem>
                                {milestones.filter((m:any) => m.project_id.toString() === data.project_id).map((m: any) => 
                                    <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-3 pt-1">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Related Feedback</Label>
                            <Select value={data.client_feedback_id || 'none'} onValueChange={val => setData('client_feedback_id', val === 'none' ? '' : val)}>
                                <SelectTrigger className="h-9 [&>span]:line-clamp-1"><SelectValue placeholder="No Feedback" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No Feedback</SelectItem>
                                    {feedbacks.filter((f:any) => f.project_id.toString() === data.project_id).map((f: any) => 
                                        <SelectItem key={f.id} value={f.id.toString()}>{f.title}</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Related Meeting</Label>
                            <Select value={data.meeting_id || 'none'} onValueChange={val => setData('meeting_id', val === 'none' ? '' : val)}>
                                <SelectTrigger className="h-9 [&>span]:line-clamp-1"><SelectValue placeholder="No Meeting" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No Meeting</SelectItem>
                                    {meetings.filter((m:any) => m.project_id.toString() === data.project_id).map((m: any) => 
                                        <SelectItem key={m.id} value={m.id.toString()}>{m.title}</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-1.5 pt-2">
                        <Label className="text-xs">Assignee</Label>
                        <Select value={data.user_id || 'none'} onValueChange={val => setData('user_id', val === 'none' ? '' : val)}>
                            <SelectTrigger className="h-9"><SelectValue placeholder="Unassigned" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Unassigned</SelectItem>
                                {users.map((u: any) => <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Collaborators</Label>
                        <div className="max-h-20 overflow-y-auto border rounded p-2 space-y-1">
                            {users.map((u: any) => {
                                const collabs = data.metadata?.collaborators || [];
                                return (
                                <label key={u.id} className="flex items-center space-x-2 text-xs">
                                    <input
                                        type="checkbox"
                                        checked={collabs.includes(u.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) handleMetaChange('collaborators', [...collabs, u.id]);
                                            else handleMetaChange('collaborators', collabs.filter((id:number) => id !== u.id));
                                        }}
                                        className="rounded border-gray-300 text-primary"
                                    />
                                    <span>{u.name}</span>
                                </label>
                            )})}
                        </div>
                    </div>
                </div>

                {/* COLUMN 3: Schedule & Attachments */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-sm border-b pb-1.5">Schedule & Extras</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Start Date</Label>
                            <Input type="date" className="h-9 text-xs" value={data.start_date || ''} onChange={e => setData('start_date', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Due Date</Label>
                            <Input type="date" className="h-9 text-xs" value={data.deadline || ''} onChange={e => setData('deadline', e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-1.5 pt-1">
                        <Label className="text-xs">Reminder (System)</Label>
                        <Select value={data.metadata?.reminder || 'None'} onValueChange={val => handleMetaChange('reminder', val)}>
                            <SelectTrigger className="h-9"><SelectValue placeholder="None" /></SelectTrigger>
                            <SelectContent>
                                {['None', 'H-7', 'H-3', 'H-1', 'Due Date'].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 pt-2">
                        <Label className="text-xs">Checklist</Label>
                        <div className="flex gap-2">
                            <Input
                                value={checklistInput}
                                onChange={e => setChecklistInput(e.target.value)}
                                placeholder="Add sub-task..."
                                className="h-8 text-xs"
                                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
                            />
                            <Button type="button" onClick={addChecklistItem} variant="secondary" size="sm" className="h-8">Add</Button>
                        </div>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                            {(data.metadata?.checklist || []).map((item: any) => (
                                <div key={item.id} className="flex items-center justify-between p-1.5 border rounded text-xs bg-card">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" checked={item.is_completed} onChange={() => toggleChecklist(item.id)} className="rounded" />
                                        <span className={item.is_completed ? 'line-through text-muted-foreground' : ''}>{item.text}</span>
                                    </div>
                                    <Button type="button" variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => removeChecklist(item.id)}>
                                        <Trash className="h-3 w-3 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <Label className="text-xs">Attachments</Label>
                        <Input
                            type="file"
                            multiple
                            accept=".pdf,.png,.jpg,.jpeg,.zip"
                            onChange={e => setData('new_attachments', Array.from(e.target.files || []))}
                            className="text-xs file:h-8"
                        />
                        {selectedTask?.metadata?.attachments && selectedTask.metadata.attachments.length > 0 && (
                            <div className="text-xs text-muted-foreground mt-1">
                                {selectedTask.metadata.attachments.length} existing attachment(s).
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ScrollArea>
    );

    return (
        <>
            <Head title="Tasks" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Tasks Management</h2>
                        <p className="text-muted-foreground">Manage project tasks, checklists, and timelines.</p>
                    </div>
                    <Button onClick={openCreateModal}>
                        <Plus className="mr-2 h-4 w-4" /> New Task
                    </Button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4">
                    {statusColumns.map(status => {
                        const columnTasks = tasks.filter(t => t.status === status);
                        const isOver = dragOverColumn === status;
                        return (
                            <div 
                                key={status} 
                                className={`flex min-w-[320px] flex-1 flex-col rounded-xl border-t-4 bg-muted/30 transition-all duration-200 ${statusColors[status]} ${isOver ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                                onDragOver={(e) => handleDragOver(e, status)}
                                onDragLeave={() => setDragOverColumn(null)}
                                onDrop={(e) => handleDrop(e, status)}
                            >
                                <div className="flex items-center justify-between p-4 pb-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-sm">{status}</h3>
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">{columnTasks.length}</span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { reset(); setData('status', status); setIsCreateModalOpen(true); }}><Plus className="h-4 w-4" /></Button>
                                </div>
                                <div className="flex flex-col gap-3 p-3 pt-1 min-h-[200px]">
                                    {columnTasks.map(task => {
                                        const progress = getProgress(task.metadata?.checklist);
                                        return (
                                        <div 
                                            key={task.id} 
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, task)}
                                            onDragEnd={handleDragEnd}
                                            className={`group rounded-lg border bg-card p-3 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing ${draggedTask?.id === task.id ? 'opacity-50' : ''}`}
                                        >
                                            <div className="mb-2 flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100" />
                                                    <Badge variant={task.priority === 'High' ? 'destructive' : 'secondary'} className="text-[10px] px-1.5 py-0">
                                                        {task.priority}
                                                    </Badge>
                                                    {task.metadata?.task_type && (
                                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-blue-600 bg-blue-50 border-blue-200">
                                                            {task.metadata.task_type}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"><MoreVertical className="h-3.5 w-3.5" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEditModal(task)}><Edit2 className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openDeleteModal(task)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <h4 className="font-medium text-sm mb-1 leading-snug cursor-pointer" onClick={() => openEditModal(task)}>{task.title}</h4>
                                            
                                            <div className="mb-2 flex flex-wrap gap-1">
                                                <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                                                    Project: {task.project?.project_name}
                                                </Badge>
                                                {task.projectMilestone && (
                                                    <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200">
                                                        Milestone: {task.projectMilestone.name}
                                                    </Badge>
                                                )}
                                            </div>

                                            {task.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{task.description}</p>}
                                            
                                            <div className="flex items-center gap-3 mb-3">
                                                {progress && (
                                                    <div className="flex items-center text-[10px] text-muted-foreground gap-1" title="Checklist Progress">
                                                        <CheckSquare className="h-3 w-3" /> {progress}
                                                    </div>
                                                )}
                                                {task.metadata?.attachments?.length > 0 && (
                                                    <div className="flex items-center text-[10px] text-muted-foreground gap-1" title="Attachments">
                                                        <Paperclip className="h-3 w-3" /> {task.metadata.attachments.length}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between mt-auto pt-2 border-t border-muted/50">
                                                {task.assignee ? (
                                                    <div className="flex items-center gap-1" title={task.assignee.name}>
                                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium border border-background">{task.assignee.name.charAt(0)}</div>
                                                        <span className="text-[10px] text-muted-foreground truncate max-w-[60px]">{task.assignee.name}</span>
                                                    </div>
                                                ) : <span className="text-[10px] text-muted-foreground">Unassigned</span>}
                                                
                                                {task.deadline && (
                                                    <span className={`text-[10px] flex items-center gap-1 border rounded px-1.5 py-0.5 ${new Date(task.deadline) < new Date() && task.status !== 'Done' ? 'text-destructive border-destructive bg-destructive/10' : 'text-muted-foreground'}`}>
                                                        <Clock className="h-3 w-3" /> {new Date(task.deadline).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )})}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>New Task</DialogTitle>
                        <DialogDescription>Create a new task and associate it with project milestones.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate}>
                        {renderFormContent()}
                        <DialogFooter className="mt-4 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>Save Task</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                        <DialogDescription>Update details for {selectedTask?.title}.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit}>
                        {renderFormContent()}
                        <DialogFooter className="mt-4 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>Update Task</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Task</DialogTitle>
                        <DialogDescription>Are you sure you want to delete <span className="font-semibold">{selectedTask?.title}</span>? This action cannot be undone.</DialogDescription>
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
        { title: 'Tasks', href: '/tasks' }
    ],
};

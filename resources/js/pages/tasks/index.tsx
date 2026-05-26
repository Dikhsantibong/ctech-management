import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, MoreVertical, Edit2, Trash2, LayoutGrid, List } from 'lucide-react';
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

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        project_id: filters.project_id || (projects.length > 0 ? projects[0].id.toString() : ''),
        user_id: '',
        title: '',
        description: '',
        status: 'Todo',
        priority: 'Medium',
        deadline: '',
    });

    const openCreateModal = () => {
        reset();
        setData('project_id', filters.project_id || (projects.length > 0 ? projects[0].id.toString() : ''));
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
        router.put(`/tasks/${task.id}`, { ...task, status: newStatus }, { preserveScroll: true });
    };

    const priorityBadgeColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'destructive';
            case 'Medium': return 'secondary';
            default: return 'outline';
        }
    };

    const statusColumns = ['Todo', 'Progress', 'Review', 'Done'];

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
                        {statusColumns.map(status => (
                            <div key={status} className="flex min-w-[300px] flex-col rounded-lg bg-muted/50 p-4">
                                <h3 className="mb-4 font-semibold flex items-center justify-between">
                                    {status} 
                                    <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">
                                        {tasks.filter(t => t.status === status).length}
                                    </span>
                                </h3>
                                <div className="flex flex-col gap-3">
                                    {tasks.filter(t => t.status === status).map(task => (
                                        <div key={task.id} className="rounded-lg border bg-card p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => openEditModal(task)}>
                                            <div className="mb-2 flex items-center justify-between">
                                                <Badge variant={priorityBadgeColor(task.priority)} className="text-[10px] px-1.5 py-0">
                                                    {task.priority}
                                                </Badge>
                                                <div className="text-xs text-muted-foreground truncate max-w-[120px]" title={task.project?.project_name}>
                                                    {task.project?.project_name}
                                                </div>
                                            </div>
                                            <h4 className="font-medium mb-1 line-clamp-2">{task.title}</h4>
                                            <div className="mt-3 flex items-center justify-between">
                                                {task.assignee ? (
                                                    <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs border border-background" title={task.assignee.name}>
                                                        {task.assignee.name.charAt(0)}
                                                    </div>
                                                ) : (
                                                    <div className="h-6 w-6"></div>
                                                )}
                                                {task.deadline && (
                                                    <span className="text-xs text-muted-foreground border rounded px-1">
                                                        {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
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
                            <Select value={data.user_id} onValueChange={value => setData('user_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Unassigned" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Unassigned</SelectItem>
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
                            <Select value={data.user_id} onValueChange={value => setData('user_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Unassigned" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Unassigned</SelectItem>
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

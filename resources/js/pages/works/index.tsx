import { Head, useForm, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { Plus, MoreVertical, Edit2, Trash2, LayoutGrid, List, GripVertical, Paperclip, CheckSquare, Search, BarChart3, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

export default function WorksIndex({ works, projects, clients, users, filters }: { works: any[], projects: any[], clients: any[], users: any[], filters: any }) {
    const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedWork, setSelectedWork] = useState<any>(null);
    const [draggedWork, setDraggedWork] = useState<any>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        category: 'General',
        priority: 'Medium',
        user_id: '',
        collaborators: [] as number[],
        start_date: '',
        due_date: '',
        estimated_duration: '',
        client_id: '',
        project_id: '',
        description: '',
        checklist: [] as { id: number, text: string, is_completed: boolean }[],
        reminder: 'None',
        is_recurring: false,
        recurring_frequency: '',
        status: 'Inbox',
        new_attachments: [] as File[],
    });

    const [checklistInput, setChecklistInput] = useState('');

    const openCreateModal = () => {
        reset();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (work: any) => {
        setSelectedWork(work);
        setData({
            title: work.title,
            category: work.category,
            priority: work.priority,
            user_id: work.user_id ? work.user_id.toString() : '',
            collaborators: work.collaborators ? work.collaborators.map((c: any) => c.id) : [],
            start_date: work.start_date ? work.start_date.split('T')[0] : '',
            due_date: work.due_date ? work.due_date.split('T')[0] : '',
            estimated_duration: work.estimated_duration || '',
            client_id: work.client_id ? work.client_id.toString() : '',
            project_id: work.project_id ? work.project_id.toString() : '',
            description: work.description || '',
            checklist: work.checklist || [],
            reminder: work.reminder || 'None',
            is_recurring: work.is_recurring,
            recurring_frequency: work.recurring_frequency || '',
            status: work.status,
            new_attachments: [],
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (work: any) => {
        setSelectedWork(work);
        setIsDeleteModalOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/works', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Use router.post with _method PUT to support file uploads in Laravel Inertia
        router.post(`/works/${selectedWork?.id}`, {
            _method: 'put',
            ...data,
        }, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
            },
            forceFormData: true
        });
    };

    const submitDelete = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(`/works/${selectedWork?.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
            },
        });
    };

    const handleFilter = (category: string) => {
        router.get('/works', { category: category !== 'all' ? category : undefined, search: searchQuery }, { preserveState: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/works', { category: filters.category, search: searchQuery }, { preserveState: true });
    };

    const updateWorkStatus = (work: any, newStatus: string) => {
        router.put(`/works/${work.id}`, {
            ...work,
            status: newStatus,
        }, { preserveScroll: true });
    };

    // Drag & Drop handlers
    const handleDragStart = (e: React.DragEvent, work: any) => {
        setDraggedWork(work);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', work.id.toString());
        const target = e.target as HTMLElement;
        setTimeout(() => target.style.opacity = '0.5', 0);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        const target = e.target as HTMLElement;
        target.style.opacity = '1';
        setDraggedWork(null);
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

        if (draggedWork && draggedWork.status !== newStatus) {
            updateWorkStatus(draggedWork, newStatus);
        }
        setDraggedWork(null);
    };

    const addChecklistItem = () => {
        if (checklistInput.trim() !== '') {
            setData('checklist', [
                ...data.checklist,
                { id: Date.now(), text: checklistInput, is_completed: false }
            ]);
            setChecklistInput('');
        }
    };

    const toggleChecklist = (id: number) => {
        setData('checklist', data.checklist.map(item => 
            item.id === id ? { ...item, is_completed: !item.is_completed } : item
        ));
    };

    const removeChecklist = (id: number) => {
        setData('checklist', data.checklist.filter(item => item.id !== id));
    };

    const priorityBadgeColor = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'destructive';
            case 'High': return 'destructive';
            case 'Medium': return 'secondary';
            default: return 'outline';
        }
    };

    const statusColumns = ['Inbox', 'Todo', 'In Progress', 'Waiting', 'Review', 'Done'];

    const categories = ['Administration', 'Marketing', 'Sales', 'Strategy', 'Meeting', 'Finance', 'HR', 'Legal', 'Procurement', 'Business Development', 'General'];

    const getProgress = (checklist: any[]) => {
        if (!checklist || checklist.length === 0) return null;
        const completed = checklist.filter(c => c.is_completed).length;
        return `${completed}/${checklist.length}`;
    };

    const renderFormContent = () => (
        <div className="grid grid-cols-3 gap-x-6 gap-y-4 py-2">
            {/* ── COLUMN 1: Basic Info + Relation ── */}
            <div className="space-y-4">
                <h3 className="font-semibold text-sm border-b pb-1.5">Basic Information</h3>
                <div className="space-y-1.5">
                    <Label htmlFor="title">Work Title <span className="text-destructive">*</span></Label>
                    <Input id="title" value={data.title} onChange={e => setData('title', e.target.value)} required />
                    {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Category <span className="text-destructive">*</span></Label>
                        <Select value={data.category} onValueChange={val => setData('category', val)}>
                            <SelectTrigger className="h-9"><SelectValue placeholder="Category" /></SelectTrigger>
                            <SelectContent>
                                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Priority</Label>
                        <Select value={data.priority} onValueChange={val => setData('priority', val)}>
                            <SelectTrigger className="h-9"><SelectValue placeholder="Priority" /></SelectTrigger>
                            <SelectContent>
                                {['Low', 'Medium', 'High', 'Critical'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Status</Label>
                        <Select value={data.status} onValueChange={val => setData('status', val)}>
                            <SelectTrigger className="h-9"><SelectValue placeholder="Status" /></SelectTrigger>
                            <SelectContent>
                                {statusColumns.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Est. Duration</Label>
                        <Select value={data.estimated_duration || 'none'} onValueChange={val => setData('estimated_duration', val === 'none' ? '' : val)}>
                            <SelectTrigger className="h-9"><SelectValue placeholder="None" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {['1 Hour', '2 Hours', '4 Hours', '1 Day', '3 Days', '1 Week', '2 Weeks', '1 Month'].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <h3 className="font-semibold text-sm border-b pb-1.5 pt-2">Relation</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Client</Label>
                        <Select value={data.client_id || 'none'} onValueChange={val => setData('client_id', val === 'none' ? '' : val)}>
                            <SelectTrigger className="h-9"><SelectValue placeholder="None" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {clients.map((c: any) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Project</Label>
                        <Select value={data.project_id || 'none'} onValueChange={val => setData('project_id', val === 'none' ? '' : val)}>
                            <SelectTrigger className="h-9"><SelectValue placeholder="None" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {projects.map((p: any) => <SelectItem key={p.id} value={p.id.toString()}>{p.project_name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* ── COLUMN 2: Assignment + Schedule + Settings ── */}
            <div className="space-y-4">
                <h3 className="font-semibold text-sm border-b pb-1.5">Assignment</h3>
                <div className="space-y-1.5">
                    <Label className="text-xs">Assigned To</Label>
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
                        {users.map((u: any) => (
                            <label key={u.id} className="flex items-center space-x-2 text-xs">
                                <input
                                    type="checkbox"
                                    checked={data.collaborators.includes(u.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setData('collaborators', [...data.collaborators, u.id]);
                                        } else {
                                            setData('collaborators', data.collaborators.filter(id => id !== u.id));
                                        }
                                    }}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span>{u.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <h3 className="font-semibold text-sm border-b pb-1.5 pt-2">Schedule</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Start Date</Label>
                        <Input type="date" className="h-9" value={data.start_date} onChange={e => setData('start_date', e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Due Date</Label>
                        <Input type="date" className="h-9" value={data.due_date} onChange={e => setData('due_date', e.target.value)} />
                    </div>
                </div>

                <h3 className="font-semibold text-sm border-b pb-1.5 pt-2">Settings</h3>
                <div className="space-y-1.5">
                    <Label className="text-xs">Reminder</Label>
                    <Select value={data.reminder || 'None'} onValueChange={val => setData('reminder', val)}>
                        <SelectTrigger className="h-9"><SelectValue placeholder="None" /></SelectTrigger>
                        <SelectContent>
                            {['None', '1 Hour Before', '1 Day Before', '3 Days Before', 'Custom'].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center justify-between border rounded p-2.5">
                    <Label className="text-xs">Repeat Work</Label>
                    <Switch checked={data.is_recurring} onCheckedChange={(checked) => setData('is_recurring', checked)} />
                </div>
                {data.is_recurring && (
                    <div className="space-y-1.5">
                        <Label className="text-xs">Frequency</Label>
                        <Select value={data.recurring_frequency || 'Daily'} onValueChange={val => setData('recurring_frequency', val)}>
                            <SelectTrigger className="h-9"><SelectValue placeholder="Frequency" /></SelectTrigger>
                            <SelectContent>
                                {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {/* ── COLUMN 3: Description + Checklist + Attachments ── */}
            <div className="space-y-4">
                <h3 className="font-semibold text-sm border-b pb-1.5">Description</h3>
                <Textarea
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Describe the work in detail..."
                    rows={4}
                    className="text-sm"
                />

                <h3 className="font-semibold text-sm border-b pb-1.5 pt-1">Checklist</h3>
                <div className="flex gap-2">
                    <Input
                        value={checklistInput}
                        onChange={e => setChecklistInput(e.target.value)}
                        placeholder="Add item..."
                        className="h-9 text-sm"
                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
                    />
                    <Button type="button" onClick={addChecklistItem} variant="secondary" size="sm">Add</Button>
                </div>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                    {data.checklist.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-1.5 border rounded text-sm">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={item.is_completed} onChange={() => toggleChecklist(item.id)} className="rounded" />
                                <span className={item.is_completed ? 'line-through text-muted-foreground' : ''}>{item.text}</span>
                            </div>
                            <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeChecklist(item.id)}>
                                <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                        </div>
                    ))}
                </div>

                <h3 className="font-semibold text-sm border-b pb-1.5 pt-1">Attachments</h3>
                <Input
                    type="file"
                    multiple
                    accept=".pdf,.docx,.pptx,.xlsx,.png,.jpg,.jpeg,.zip"
                    onChange={e => setData('new_attachments', Array.from(e.target.files || []))}
                    className="text-sm"
                />
                {selectedWork?.attachments && selectedWork.attachments.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                        {selectedWork.attachments.length} existing attachment(s).
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <Head title="Work Management" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Work Management</h2>
                        <p className="text-muted-foreground">Manage operational, administrative, and strategic works.</p>
                    </div>
                    
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <form onSubmit={handleSearch} className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                type="search" 
                                placeholder="Search works or clients..." 
                                className="pl-8" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>

                        <Select value={filters.category || 'all'} onValueChange={handleFilter}>
                            <SelectTrigger className="w-[180px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="All Works" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Works</SelectItem>
                                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
                        
                        <Button variant="outline" onClick={() => router.get('/works/report')}>
                            <BarChart3 className="mr-2 h-4 w-4" /> Reporting
                        </Button>

                        <Button onClick={openCreateModal}>
                            <Plus className="mr-2 h-4 w-4" /> New Work
                        </Button>
                    </div>
                </div>

                {viewMode === 'table' ? (
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                        {/* Table View Implementation similar to Tasks */}
                        <div className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b transition-colors hover:bg-muted/50">
                                            <th className="h-12 px-4 text-left font-medium text-muted-foreground">Title</th>
                                            <th className="h-12 px-4 text-left font-medium text-muted-foreground">Category</th>
                                            <th className="h-12 px-4 text-left font-medium text-muted-foreground">Status</th>
                                            <th className="h-12 px-4 text-left font-medium text-muted-foreground">Priority</th>
                                            <th className="h-12 px-4 text-left font-medium text-muted-foreground">Assignee</th>
                                            <th className="h-12 px-4 text-right font-medium text-muted-foreground">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {works.map((work) => (
                                            <tr key={work.id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4">{work.title}</td>
                                                <td className="p-4 text-muted-foreground">{work.category}</td>
                                                <td className="p-4">
                                                    <Badge variant="outline">{work.status}</Badge>
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant={priorityBadgeColor(work.priority)}>{work.priority}</Badge>
                                                </td>
                                                <td className="p-4">
                                                    {work.assignee ? work.assignee.name : 'Unassigned'}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => openEditModal(work)}>
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => openDeleteModal(work)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {works.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                                    No works found.
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
                            const columnWorks = works.filter(w => w.status === status);
                            const isOver = dragOverColumn === status;

                            return (
                                <div 
                                    key={status} 
                                    className={`flex min-w-[300px] flex-1 flex-col rounded-xl border-t-4 bg-muted/30 transition-all duration-200 border-t-zinc-400 ${isOver ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                                    onDragOver={(e) => handleDragOver(e, status)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, status)}
                                >
                                    <div className="flex items-center justify-between p-4 pb-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-sm">{status}</h3>
                                            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground">
                                                {columnWorks.length}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 p-3 pt-1 min-h-[200px]">
                                        {columnWorks.map(work => (
                                            <div 
                                                key={work.id} 
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, work)}
                                                onDragEnd={handleDragEnd}
                                                className={`group rounded-lg border bg-card p-3 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${draggedWork?.id === work.id ? 'opacity-50' : ''}`}
                                            >
                                                <div className="mb-2 flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100" />
                                                        <Badge variant={priorityBadgeColor(work.priority)} className="text-[10px] px-1.5 py-0">
                                                            {work.priority}
                                                        </Badge>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                                                                <MoreVertical className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => openEditModal(work)}>
                                                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openDeleteModal(work)} className="text-destructive">
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                <h4 className="font-medium text-sm mb-1 line-clamp-2 cursor-pointer" onClick={() => openEditModal(work)}>{work.title}</h4>
                                                
                                                {work.client?.name && (
                                                    <div className="text-xs text-muted-foreground truncate mb-2">
                                                        🏢 {work.client.name}
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                                                    {getProgress(work.checklist) && (
                                                        <div className="flex items-center gap-1">
                                                            <CheckSquare className="h-3 w-3" /> {getProgress(work.checklist)}
                                                        </div>
                                                    )}
                                                    {work.attachments && work.attachments.length > 0 && (
                                                        <div className="flex items-center gap-1">
                                                            <Paperclip className="h-3 w-3" /> {work.attachments.length}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between mt-auto">
                                                    {work.assignee ? (
                                                        <div className="flex items-center gap-1.5" title={work.assignee.name}>
                                                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-semibold border border-background">
                                                                {work.assignee.name.charAt(0)}
                                                            </div>
                                                        </div>
                                                    ) : <div className="h-6 w-6"></div>}
                                                    {work.due_date && (
                                                        <span className="text-[10px] text-muted-foreground border rounded px-1.5 py-0.5">
                                                            📅 {new Date(work.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="max-w-6xl">
                    <DialogHeader>
                        <DialogTitle>New Work</DialogTitle>
                        <DialogDescription>Create a new work item.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate}>
                        {renderFormContent()}
                        <DialogFooter className="mt-4 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>Save Work</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-6xl">
                    <DialogHeader>
                        <DialogTitle>Edit Work</DialogTitle>
                        <DialogDescription>Update details for {selectedWork?.title}.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit}>
                        {renderFormContent()}
                        <DialogFooter className="mt-4 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>Update Work</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Work</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-semibold">{selectedWork?.title}</span>? This action cannot be undone.
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

WorksIndex.layout = {
    breadcrumbs: [
        {
            title: 'Works',
            href: '/works',
        },
    ],
};

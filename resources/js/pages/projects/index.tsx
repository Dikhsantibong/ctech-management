import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
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

export default function ProjectsIndex({ projects, users }: { projects: any[], users: any[] }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        project_name: '',
        client_name: '',
        description: '',
        start_date: '',
        deadline: '',
        status: 'Planning',
        members: [] as number[],
    });

    const openCreateModal = () => {
        reset();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (project: any) => {
        setSelectedProject(project);
        setData({
            project_name: project.project_name,
            client_name: project.client_name,
            description: project.description || '',
            start_date: project.start_date,
            deadline: project.deadline,
            status: project.status,
            members: project.members ? project.members.map((m: any) => m.id) : [],
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (project: any) => {
        setSelectedProject(project);
        setIsDeleteModalOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/projects', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/projects/${selectedProject?.id}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
            },
        });
    };

    const submitDelete = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(`/projects/${selectedProject?.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
            },
        });
    };

    const statusBadgeColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'default'; // standard dark bg
            case 'Progress': return 'secondary';
            case 'Review': return 'outline';
            default: return 'outline'; // Planning
        }
    };

    const toggleMember = (userId: number) => {
        if (data.members.includes(userId)) {
            setData('members', data.members.filter(id => id !== userId));
        } else {
            setData('members', [...data.members, userId]);
        }
    };

    return (
        <>
            <Head title="Projects" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
                        <p className="text-muted-foreground">Manage your startup projects and clients.</p>
                    </div>
                    <Button onClick={openCreateModal}>
                        <Plus className="mr-2 h-4 w-4" /> New Project
                    </Button>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Project Name</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Client</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Deadline</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Team</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map((project) => (
                                        <tr key={project.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">
                                                <Link href={`/projects/${project.id}`} className="hover:underline">
                                                    {project.project_name}
                                                </Link>
                                            </td>
                                            <td className="p-4 align-middle">{project.client_name}</td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={statusBadgeColor(project.status)}>
                                                    {project.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {new Date(project.deadline).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex -space-x-2 overflow-hidden">
                                                    {project.members?.map((member: any) => (
                                                        <div key={member.id} title={member.name} className="inline-block h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                                                            {member.name.charAt(0)}
                                                        </div>
                                                    ))}
                                                </div>
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
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/projects/${project.id}`} className="cursor-pointer">
                                                                <Eye className="mr-2 h-4 w-4" /> View
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openEditModal(project)}>
                                                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openDeleteModal(project)} className="text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                    {projects.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                                No projects found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>New Project</DialogTitle>
                        <DialogDescription>Create a new project and assign team members.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label htmlFor="project_name">Project Name</Label>
                            <Input id="project_name" value={data.project_name} onChange={e => setData('project_name', e.target.value)} required />
                            {errors.project_name && <p className="text-sm text-destructive">{errors.project_name}</p>}
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label htmlFor="client_name">Client Name</Label>
                            <Input id="client_name" value={data.client_name} onChange={e => setData('client_name', e.target.value)} required />
                            {errors.client_name && <p className="text-sm text-destructive">{errors.client_name}</p>}
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" value={data.description} onChange={e => setData('description', e.target.value)} />
                            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label htmlFor="start_date">Start Date</Label>
                            <Input id="start_date" type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} required />
                            {errors.start_date && <p className="text-sm text-destructive">{errors.start_date}</p>}
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input id="deadline" type="date" value={data.deadline} onChange={e => setData('deadline', e.target.value)} required />
                            {errors.deadline && <p className="text-sm text-destructive">{errors.deadline}</p>}
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={value => setData('status', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Planning">Planning</SelectItem>
                                    <SelectItem value="Progress">Progress</SelectItem>
                                    <SelectItem value="Review">Review</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label>Assign Members</Label>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {users.map(user => (
                                    <Button
                                        key={user.id}
                                        type="button"
                                        variant={data.members.includes(user.id) ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => toggleMember(user.id)}
                                        className="h-8"
                                    >
                                        {user.name}
                                    </Button>
                                ))}
                            </div>
                            {errors.members && <p className="text-sm text-destructive">{errors.members}</p>}
                        </div>
                        
                        <div className="col-span-2 flex justify-end space-x-2 mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>Save Project</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                        <DialogDescription>Update details for {selectedProject?.project_name}.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label htmlFor="edit-project_name">Project Name</Label>
                            <Input id="edit-project_name" value={data.project_name} onChange={e => setData('project_name', e.target.value)} required />
                            {errors.project_name && <p className="text-sm text-destructive">{errors.project_name}</p>}
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label htmlFor="edit-client_name">Client Name</Label>
                            <Input id="edit-client_name" value={data.client_name} onChange={e => setData('client_name', e.target.value)} required />
                            {errors.client_name && <p className="text-sm text-destructive">{errors.client_name}</p>}
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea id="edit-description" value={data.description} onChange={e => setData('description', e.target.value)} />
                            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label htmlFor="edit-start_date">Start Date</Label>
                            <Input id="edit-start_date" type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} required />
                            {errors.start_date && <p className="text-sm text-destructive">{errors.start_date}</p>}
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label htmlFor="edit-deadline">Deadline</Label>
                            <Input id="edit-deadline" type="date" value={data.deadline} onChange={e => setData('deadline', e.target.value)} required />
                            {errors.deadline && <p className="text-sm text-destructive">{errors.deadline}</p>}
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select value={data.status} onValueChange={value => setData('status', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Planning">Planning</SelectItem>
                                    <SelectItem value="Progress">Progress</SelectItem>
                                    <SelectItem value="Review">Review</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label>Assign Members</Label>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {users.map(user => (
                                    <Button
                                        key={user.id}
                                        type="button"
                                        variant={data.members.includes(user.id) ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => toggleMember(user.id)}
                                        className="h-8"
                                    >
                                        {user.name}
                                    </Button>
                                ))}
                            </div>
                            {errors.members && <p className="text-sm text-destructive">{errors.members}</p>}
                        </div>
                        
                        <div className="col-span-2 flex justify-end space-x-2 mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>Update Project</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Project</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-semibold">{selectedProject?.project_name}</span>? This action cannot be undone.
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

ProjectsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Projects',
            href: '/projects',
        },
    ],
};

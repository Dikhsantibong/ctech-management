import { Head, useForm, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Plus, MoreVertical, Edit2, Trash2, Eye, LayoutTemplate, MonitorPlay, PenTool, LayoutGrid } from 'lucide-react';
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

const projectTypes = ['Aplikasi', 'Video/Animasi', 'Desain', 'Lainnya'];

export default function ProjectsIndex({ projects, users, filters }: { projects: any, users: any[], filters?: any }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery !== (filters?.search || '')) {
                router.get('/projects', { search: searchQuery }, { preserveState: true, replace: true, preserveScroll: true });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        project_name: '',
        client_name: '',
        description: '',
        start_date: '',
        deadline: '',
        status: 'Planning',
        project_type: 'Aplikasi',
        metadata: {} as Record<string, any>,
        members: [] as number[],
    });

    // Initialize metadata when project_type changes (only for new projects to avoid overwriting edits)
    useEffect(() => {
        if (!selectedProject) {
            if (data.project_type === 'Aplikasi') {
                setData('metadata', { platform: '', tech_stack: '', repo_url: '', development_stage: 'Planning' });
            } else if (data.project_type === 'Video/Animasi') {
                setData('metadata', { duration: '', resolution: '', drive_url: '', production_stage: 'Pre-production' });
            } else if (data.project_type === 'Desain') {
                setData('metadata', { design_type: '', asset_url: '', revision_count: '0', stage: 'Drafting' });
            } else {
                setData('metadata', { notes: '' });
            }
        }
    }, [data.project_type, selectedProject]);

    const openCreateModal = () => {
        reset();
        setSelectedProject(null);
        setData('metadata', { platform: '', tech_stack: '', repo_url: '', development_stage: 'Planning' }); // Default to Aplikasi
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
            project_type: project.project_type || 'Lainnya',
            metadata: project.metadata || {},
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
            case 'Completed': return 'default';
            case 'Progress': return 'secondary';
            case 'Review': return 'outline';
            default: return 'outline';
        }
    };

    const typeIcon = (type: string) => {
        switch (type) {
            case 'Aplikasi': return <LayoutTemplate className="h-4 w-4 mr-1 text-blue-500" />;
            case 'Video/Animasi': return <MonitorPlay className="h-4 w-4 mr-1 text-red-500" />;
            case 'Desain': return <PenTool className="h-4 w-4 mr-1 text-purple-500" />;
            default: return <LayoutGrid className="h-4 w-4 mr-1 text-gray-500" />;
        }
    };

    const toggleMember = (userId: number) => {
        if (data.members.includes(userId)) {
            setData('members', data.members.filter(id => id !== userId));
        } else {
            setData('members', [...data.members, userId]);
        }
    };

    const handleMetaChange = (key: string, value: string) => {
        setData('metadata', { ...data.metadata, [key]: value });
    };

    const renderMetadataFields = () => {
        if (data.project_type === 'Aplikasi') {
            return (
                <>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Platform (Web/Mobile/Desktop)</Label>
                        <Input value={data.metadata.platform || ''} onChange={e => handleMetaChange('platform', e.target.value)} placeholder="e.g. Mobile iOS & Android" />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Tech Stack</Label>
                        <Input value={data.metadata.tech_stack || ''} onChange={e => handleMetaChange('tech_stack', e.target.value)} placeholder="e.g. React Native, Laravel" />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Repository / Figma URL</Label>
                        <Input value={data.metadata.repo_url || ''} onChange={e => handleMetaChange('repo_url', e.target.value)} placeholder="https://github.com/..." />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Development Stage</Label>
                        <Select value={data.metadata.development_stage || 'Planning'} onValueChange={value => handleMetaChange('development_stage', value)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Planning">1. Planning & Requirement</SelectItem>
                                <SelectItem value="Design">2. UI/UX Design</SelectItem>
                                <SelectItem value="Development">3. Development</SelectItem>
                                <SelectItem value="Testing">4. Testing / QA</SelectItem>
                                <SelectItem value="Deployment">5. Deployment</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </>
            );
        }

        if (data.project_type === 'Video/Animasi') {
            return (
                <>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Durasi</Label>
                        <Input value={data.metadata.duration || ''} onChange={e => handleMetaChange('duration', e.target.value)} placeholder="e.g. 60 detik" />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Resolusi & Format</Label>
                        <Input value={data.metadata.resolution || ''} onChange={e => handleMetaChange('resolution', e.target.value)} placeholder="e.g. 1080x1920 (9:16) MP4" />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Raw Assets / Drive URL</Label>
                        <Input value={data.metadata.drive_url || ''} onChange={e => handleMetaChange('drive_url', e.target.value)} placeholder="https://drive.google.com/..." />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Production Stage</Label>
                        <Select value={data.metadata.production_stage || 'Pre-production'} onValueChange={value => handleMetaChange('production_stage', value)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pre-production">1. Pre-production (Script/Board)</SelectItem>
                                <SelectItem value="Production">2. Production (Shooting/Anim)</SelectItem>
                                <SelectItem value="Post-production">3. Post-production (Editing)</SelectItem>
                                <SelectItem value="Rendering">4. Rendering & Final Review</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </>
            );
        }

        if (data.project_type === 'Desain') {
            return (
                <>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Tipe Desain</Label>
                        <Input value={data.metadata.design_type || ''} onChange={e => handleMetaChange('design_type', e.target.value)} placeholder="e.g. Logo, UI/UX, Print, Branding" />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Batas Revisi</Label>
                        <Input type="number" value={data.metadata.revision_count || ''} onChange={e => handleMetaChange('revision_count', e.target.value)} placeholder="e.g. 3" />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Assets Link</Label>
                        <Input value={data.metadata.asset_url || ''} onChange={e => handleMetaChange('asset_url', e.target.value)} placeholder="https://..." />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Stage</Label>
                        <Select value={data.metadata.stage || 'Drafting'} onValueChange={value => handleMetaChange('stage', value)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Briefing">1. Briefing & Brainstorming</SelectItem>
                                <SelectItem value="Drafting">2. Drafting</SelectItem>
                                <SelectItem value="Review">3. Client Review</SelectItem>
                                <SelectItem value="Finalizing">4. Finalizing & Handover</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </>
            );
        }

        return (
            <div className="space-y-2 col-span-2">
                <Label>Notes / Custom Info</Label>
                <Textarea value={data.metadata.notes || ''} onChange={e => handleMetaChange('notes', e.target.value)} placeholder="Detail spesifik..." className="h-[80px] resize-none" />
            </div>
        );
    };

    const formFields = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* Left Column: General Info */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold border-b pb-2">Informasi Umum</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                        <Label>Tipe Project</Label>
                        <Select value={data.project_type} onValueChange={value => {
                            setData('project_type', value);
                            setSelectedProject(null); // Clear selected to force metadata reset in useEffect
                        }}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {projectTypes.map(pt => <SelectItem key={pt} value={pt}>{pt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {errors.project_type && <p className="text-sm text-destructive">{errors.project_type}</p>}
                    </div>

                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Nama Project</Label>
                        <Input value={data.project_name} onChange={e => setData('project_name', e.target.value)} required />
                        {errors.project_name && <p className="text-sm text-destructive">{errors.project_name}</p>}
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Klien</Label>
                        <Input value={data.client_name} onChange={e => setData('client_name', e.target.value)} required />
                        {errors.client_name && <p className="text-sm text-destructive">{errors.client_name}</p>}
                    </div>
                    
                    <div className="space-y-2 col-span-2">
                        <Label>Deskripsi Singkat</Label>
                        <Textarea value={data.description} onChange={e => setData('description', e.target.value)} className="h-[80px] resize-none" />
                        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>

                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Tanggal Mulai</Label>
                        <Input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} required />
                        {errors.start_date && <p className="text-sm text-destructive">{errors.start_date}</p>}
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Deadline</Label>
                        <Input type="date" value={data.deadline} onChange={e => setData('deadline', e.target.value)} required />
                        {errors.deadline && <p className="text-sm text-destructive">{errors.deadline}</p>}
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label>Status Umum</Label>
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
                </div>
            </div>

            {/* Right Column: Dynamic Metadata & Team */}
            <div className="space-y-6">
                <div className="space-y-4">
                    <h4 className="text-sm font-semibold border-b pb-2 flex items-center">
                        Spesifikasi Khusus: {data.project_type}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        {renderMetadataFields()}
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-semibold border-b pb-2">Assign Members</h4>
                    <div className="flex flex-wrap gap-2">
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
            </div>
        </div>
    );

    return (
        <>
            <Head title="Projects" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
                        <p className="text-muted-foreground">Manage your startup projects and clients.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Input 
                            placeholder="Cari project..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-[250px]"
                        />
                        <Button onClick={openCreateModal}>
                            <Plus className="mr-2 h-4 w-4" /> New Project
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Project Name</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Client</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Deadline</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Team</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(projects.data || projects).map((project: any) => (
                                        <tr key={project.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center text-muted-foreground text-xs font-medium">
                                                    {typeIcon(project.project_type || 'Lainnya')}
                                                    <span className="hidden sm:inline">{project.project_type || 'Lainnya'}</span>
                                                </div>
                                            </td>
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
                                                {new Date(project.deadline).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex -space-x-2 overflow-hidden">
                                                    {project.members?.map((member: any) => (
                                                        <div key={member.id} title={member.name} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
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
                                    {(projects.data || projects).length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="p-4 text-center text-muted-foreground">
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
                <DialogContent className="w-[95vw] sm:max-w-[95vw] max-h-[95vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Buat Project Baru</DialogTitle>
                        <DialogDescription>Pilih tipe project dan lengkapi detailnya.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="flex flex-col gap-4">
                        {formFields}
                        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing}>Simpan Project</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="w-[95vw] sm:max-w-[95vw] max-h-[95vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                        <DialogDescription>Update detail project: {selectedProject?.project_name}.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="flex flex-col gap-4">
                        {formFields}
                        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing}>Update Project</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Project</DialogTitle>
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

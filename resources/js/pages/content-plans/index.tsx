import { Head, useForm, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { Plus, MoreVertical, Edit2, Trash2, Calendar, Kanban, List, GripVertical } from 'lucide-react';
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

const platforms = ['Instagram', 'Facebook', 'Twitter/X', 'TikTok', 'LinkedIn', 'YouTube', 'Website/Blog'];
const contentTypes = ['Post', 'Story', 'Reel', 'Video', 'Article', 'Carousel', 'Thread'];
const statusList = ['Draft', 'Scheduled', 'Published', 'Cancelled'];
const tujuanKontenOptions = ['ctechagency', 'officialperusahaan', 'ctechpaylo', 'ctechbooth'];

const platformColors: Record<string, string> = {
    'Instagram': 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    'Facebook': 'bg-blue-600 text-white',
    'Twitter/X': 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900',
    'TikTok': 'bg-black text-white dark:bg-zinc-200 dark:text-zinc-900',
    'LinkedIn': 'bg-blue-700 text-white',
    'YouTube': 'bg-red-600 text-white',
    'Website/Blog': 'bg-emerald-600 text-white',
};

const statusColumnColors: Record<string, string> = {
    'Draft': 'border-t-zinc-400',
    'Scheduled': 'border-t-blue-500',
    'Published': 'border-t-emerald-500',
    'Cancelled': 'border-t-red-500',
};

export default function ContentPlansIndex({ contentPlans, staffUsers, userRole }: { contentPlans: any[], staffUsers: any[], userRole: string }) {
    const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [draggedPlan, setDraggedPlan] = useState<any>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [expandedColumns, setExpandedColumns] = useState<Record<string, boolean>>({});

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        description: '',
        platform: 'Instagram',
        content_type: 'Post',
        status: 'Draft',
        scheduled_date: '',
        published_date: '',
        notes: '',
        campaign_name: '',
        brief: '',
        reference_links: '',
        visual_assets_url: '',
        target_audience: '',
        keywords: '',
        tujuan_konten: '',
        assigned_to: '',
    });

    const openCreateModal = () => {
        reset();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (plan: any) => {
        setSelectedPlan(plan);
        setData({
            title: plan.title,
            description: plan.description || '',
            platform: plan.platform,
            content_type: plan.content_type,
            status: plan.status,
            scheduled_date: plan.scheduled_date ? plan.scheduled_date.split('T')[0] : '',
            published_date: plan.published_date ? plan.published_date.split('T')[0] : '',
            notes: plan.notes || '',
            campaign_name: plan.campaign_name || '',
            brief: plan.brief || '',
            reference_links: plan.reference_links || '',
            visual_assets_url: plan.visual_assets_url || '',
            target_audience: plan.target_audience || '',
            keywords: plan.keywords || '',
            tujuan_konten: plan.tujuan_konten || '',
            assigned_to: plan.assigned_to?.id ? plan.assigned_to.id.toString() : '',
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (plan: any) => {
        setSelectedPlan(plan);
        setIsDeleteModalOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/content-plans', {
            onSuccess: () => { setIsCreateModalOpen(false); reset(); },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/content-plans/${selectedPlan?.id}`, {
            onSuccess: () => { setIsEditModalOpen(false); reset(); },
        });
    };

    const submitDelete = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(`/content-plans/${selectedPlan?.id}`, {
            onSuccess: () => { setIsDeleteModalOpen(false); },
        });
    };

    // Drag & Drop handlers
    const handleDragStart = (e: React.DragEvent, plan: any) => {
        setDraggedPlan(plan);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', plan.id.toString());
        // Make the drag image slightly transparent
        const target = e.target as HTMLElement;
        setTimeout(() => target.style.opacity = '0.5', 0);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        const target = e.target as HTMLElement;
        target.style.opacity = '1';
        setDraggedPlan(null);
        setDragOverColumn(null);
    };

    const handleDragOver = (e: React.DragEvent, status: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverColumn(status);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        // Only reset if leaving the column entirely
        const relatedTarget = e.relatedTarget as HTMLElement;
        const currentTarget = e.currentTarget as HTMLElement;
        if (!currentTarget.contains(relatedTarget)) {
            setDragOverColumn(null);
        }
    };

    const handleDrop = (e: React.DragEvent, newStatus: string) => {
        e.preventDefault();
        setDragOverColumn(null);

        if (draggedPlan && draggedPlan.status !== newStatus) {
            // Update status via Inertia
            router.put(`/content-plans/${draggedPlan.id}`, {
                title: draggedPlan.title,
                description: draggedPlan.description || '',
                platform: draggedPlan.platform,
                content_type: draggedPlan.content_type,
                status: newStatus,
                scheduled_date: draggedPlan.scheduled_date ? draggedPlan.scheduled_date.split('T')[0] : '',
                published_date: draggedPlan.published_date ? draggedPlan.published_date.split('T')[0] : '',
                notes: draggedPlan.notes || '',
                campaign_name: draggedPlan.campaign_name || '',
                brief: draggedPlan.brief || '',
                reference_links: draggedPlan.reference_links || '',
                visual_assets_url: draggedPlan.visual_assets_url || '',
                target_audience: draggedPlan.target_audience || '',
                keywords: draggedPlan.keywords || '',
                tujuan_konten: draggedPlan.tujuan_konten || '',
                assigned_to: draggedPlan.assigned_to?.id ? draggedPlan.assigned_to.id.toString() : '',
            }, {
                preserveScroll: true,
            });
        }
        setDraggedPlan(null);
    };

    const statusBadge = (status: string) => {
        switch (status) {
            case 'Draft': return 'secondary';
            case 'Scheduled': return 'default';
            case 'Published': return 'default';
            case 'Cancelled': return 'destructive';
            default: return 'outline';
        }
    };

    const statusCounts = {
        Draft: contentPlans.filter(p => p.status === 'Draft').length,
        Scheduled: contentPlans.filter(p => p.status === 'Scheduled').length,
        Published: contentPlans.filter(p => p.status === 'Published').length,
        Cancelled: contentPlans.filter(p => p.status === 'Cancelled').length,
    };

    // Pagination logic for table mode
    const totalPages = Math.ceil(contentPlans.length / itemsPerPage);
    const paginatedPlans = contentPlans.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleViewModeChange = (mode: 'kanban' | 'table') => {
        setViewMode(mode);
        setCurrentPage(1); // Reset to first page when switching modes
    };

    const toggleColumnExpansion = (status: string) => {
        setExpandedColumns(prev => ({
            ...prev,
            [status]: !prev[status]
        }));
    };

    const ITEMS_PER_COLUMN = 10;

    const formFields = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Left Column: General Info */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold border-b pb-2">Informasi Umum</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                        <Label>Judul Konten</Label>
                        <Input value={data.title} onChange={e => setData('title', e.target.value)} placeholder="Judul konten..." required />
                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Platform</Label>
                        <Select value={data.platform} onValueChange={value => setData('platform', value)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {platforms.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Tipe Konten</Label>
                        <Select value={data.content_type} onValueChange={value => setData('content_type', value)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {contentTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label>Deskripsi / Caption</Label>
                        <Textarea value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Tulis deskripsi atau caption konten..." className="h-[80px] resize-none" />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Status</Label>
                        <Select value={data.status} onValueChange={value => setData('status', value)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {statusList.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Tgl Dijadwalkan</Label>
                        <Input type="date" value={data.scheduled_date} onChange={e => setData('scheduled_date', e.target.value)} />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Tgl Dipublikasi</Label>
                        <Input type="date" value={data.published_date} onChange={e => setData('published_date', e.target.value)} />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Catatan Tambahan</Label>
                        <Textarea value={data.notes} onChange={e => setData('notes', e.target.value)} placeholder="Catatan internal..." className="h-[40px] resize-none" />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Tujuan Konten</Label>
                        <Select value={data.tujuan_konten} onValueChange={value => setData('tujuan_konten', value)}>
                            <SelectTrigger><SelectValue placeholder="Pilih tujuan" /></SelectTrigger>
                            <SelectContent>
                                {tujuanKontenOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    {(userRole === 'direktur_utama' || userRole === 'direktur_operasional') && (
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label>Assigned To</Label>
                            <Select value={data.assigned_to} onValueChange={value => setData('assigned_to', value)}>
                                <SelectTrigger><SelectValue placeholder="Pilih staff" /></SelectTrigger>
                                <SelectContent>
                                    {staffUsers.map(user => (
                                        <SelectItem key={user.id} value={user.id.toString()}>{user.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Marketing Strategy */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold border-b pb-2">Marketing & Strategy</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Campaign Name</Label>
                        <Input value={data.campaign_name} onChange={e => setData('campaign_name', e.target.value)} placeholder="Misal: Promo Ramadhan" />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Target Audience</Label>
                        <Input value={data.target_audience} onChange={e => setData('target_audience', e.target.value)} placeholder="Misal: Mahasiswa 18-24 thn" />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Keywords / Hashtags</Label>
                        <Input value={data.keywords} onChange={e => setData('keywords', e.target.value)} placeholder="Misal: #Diskon, #Promo" />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Visual Assets URL (Drive)</Label>
                        <Input value={data.visual_assets_url} onChange={e => setData('visual_assets_url', e.target.value)} placeholder="https://..." />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label>Briefing / Detail Tugas</Label>
                        <Textarea value={data.brief} onChange={e => setData('brief', e.target.value)} placeholder="Tuliskan arahan visual, copywriting angle, dll..." className="h-[80px] resize-none" />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label>Reference Links</Label>
                        <Textarea value={data.reference_links} onChange={e => setData('reference_links', e.target.value)} placeholder="Tulis link referensi desain atau konten..." className="h-[60px] resize-none" />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Content Planning" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Content Planning</h2>
                        <p className="text-muted-foreground">Rencanakan dan kelola konten marketing di berbagai platform.</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="flex rounded-md shadow-sm">
                            <Button
                                variant={viewMode === 'kanban' ? 'default' : 'outline'}
                                className="rounded-r-none px-3"
                                onClick={() => handleViewModeChange('kanban')}
                            >
                                <Kanban className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'table' ? 'default' : 'outline'}
                                className="rounded-l-none px-3"
                                onClick={() => handleViewModeChange('table')}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button onClick={openCreateModal}>
                            <Plus className="mr-2 h-4 w-4" /> Buat Konten
                        </Button>
                    </div>
                </div>

                {viewMode === 'table' ? (
                    /* Table View */
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                        <div className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b transition-colors hover:bg-muted/50">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Judul</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Platform</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tipe</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tujuan</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Jadwal</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Assigned To</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedPlans.map((plan) => (
                                            <tr key={plan.id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4 align-middle font-medium">{plan.title}</td>
                                                <td className="p-4 align-middle">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${platformColors[plan.platform] || 'bg-muted text-foreground'}`}>
                                                        {plan.platform}
                                                    </span>
                                                </td>
                                                <td className="p-4 align-middle text-muted-foreground">{plan.content_type}</td>
                                                <td className="p-4 align-middle">
                                                    <Badge variant={statusBadge(plan.status)}>
                                                        {plan.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    {plan.tujuan_konten ? (
                                                        <Badge variant="outline" className="bg-primary/5 text-primary">
                                                            {plan.tujuan_konten}
                                                        </Badge>
                                                    ) : '-'}
                                                </td>
                                                <td className="p-4 align-middle text-muted-foreground">
                                                    {plan.scheduled_date ? new Date(plan.scheduled_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                </td>
                                                <td className="p-4 align-middle">{plan.assigned_to?.name || '-'}</td>
                                                <td className="p-4 align-middle text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => openEditModal(plan)}>
                                                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openDeleteModal(plan)} className="text-destructive">
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                        {contentPlans.length === 0 && (
                                            <tr>
                                                <td colSpan={8} className="p-4 text-center text-muted-foreground">
                                                    Belum ada content plan. Klik "Buat Konten" untuk memulai.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Pagination Controls */}
                        {contentPlans.length > 0 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {((currentPage - 1) * itemsPerPage) + 1} sampai {Math.min(currentPage * itemsPerPage, contentPlans.length)} dari {contentPlans.length} item
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handlePageChange(page)}
                                            className="w-8 h-8 p-0"
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Kanban Board View */
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {statusList.map(status => {
                            const columnPlans = contentPlans.filter(p => p.status === status);
                            const isExpanded = expandedColumns[status];
                            const displayedPlans = isExpanded ? columnPlans : columnPlans.slice(0, ITEMS_PER_COLUMN);
                            const hasMoreItems = columnPlans.length > ITEMS_PER_COLUMN;
                            const isOver = dragOverColumn === status;

                            return (
                                <div
                                    key={status}
                                    className={`flex min-w-[300px] flex-1 flex-col rounded-xl border-t-4 bg-muted/30 transition-all duration-200 ${statusColumnColors[status]} ${isOver ? 'ring-2 ring-primary ring-offset-2 bg-primary/5' : ''}`}
                                    onDragOver={(e) => handleDragOver(e, status)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, status)}
                                >
                                    {/* Column Header */}
                                    <div className="flex items-center justify-between p-4 pb-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-sm">{status}</h3>
                                            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground">
                                                {columnPlans.length}
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

                                    {/* Cards */}
                                    <div className="flex flex-col gap-2 p-3 pt-1 min-h-[200px]">
                                        {displayedPlans.map(plan => (
                                            <div
                                                key={plan.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, plan)}
                                                onDragEnd={handleDragEnd}
                                                className={`group rounded-lg border bg-card p-3 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing active:shadow-lg active:scale-[1.02] ${draggedPlan?.id === plan.id ? 'opacity-50' : ''}`}
                                            >
                                                {/* Drag handle + Platform + Tujuan */}
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-1.5">
                                                        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${platformColors[plan.platform] || 'bg-muted text-foreground'}`}>
                                                            {plan.platform}
                                                        </span>
                                                        {plan.tujuan_konten && (
                                                            <Badge variant="outline" className="text-[10px] bg-secondary">
                                                                {plan.tujuan_konten}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <MoreVertical className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => openEditModal(plan)}>
                                                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openDeleteModal(plan)} className="text-destructive">
                                                                <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                {/* Title */}
                                                <h4 className="font-medium text-sm mb-1 line-clamp-2 cursor-pointer" onClick={() => openEditModal(plan)}>
                                                    {plan.title}
                                                </h4>
                                                {plan.campaign_name && (
                                                    <div className="mb-2">
                                                        <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary">
                                                            {plan.campaign_name}
                                                        </Badge>
                                                    </div>
                                                )}

                                                {/* Description */}
                                                {plan.description && (
                                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{plan.description}</p>
                                                )}

                                                {/* Footer: Type + Schedule + Avatar */}
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground">{plan.content_type}</span>
                                                        {plan.scheduled_date && (
                                                            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                                                <Calendar className="h-3 w-3" />
                                                                {new Date(plan.scheduled_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {plan.assigned_to && (
                                                        <div className="flex items-center gap-1">
                                                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium" title={plan.assigned_to.name}>
                                                                {plan.assigned_to.name.charAt(0)}
                                                            </div>
                                                            <span className="text-[10px] text-muted-foreground truncate max-w-[60px]">{plan.assigned_to.name}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Load More Button */}
                                        {hasMoreItems && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleColumnExpansion(status)}
                                                className="w-full mt-2 text-xs"
                                            >
                                                {isExpanded ? 'Show Less' : `Load More (${columnPlans.length - ITEMS_PER_COLUMN} more)`}
                                            </Button>
                                        )}

                                        {/* Empty state */}
                                        {columnPlans.length === 0 && (
                                            <div className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors ${isOver ? 'border-primary bg-primary/5' : 'border-muted'}`}>
                                                <p className="text-xs text-muted-foreground">
                                                    {isOver ? 'Lepaskan di sini' : 'Drag konten ke sini'}
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
                <DialogContent className="w-[95vw] sm:max-w-[95vw] max-h-[95vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Buat Content Plan</DialogTitle>
                        <DialogDescription>Rencanakan konten baru untuk platform marketing Anda.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="flex flex-col gap-4">
                        {formFields}
                        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing}>Simpan</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="w-[95vw] sm:max-w-[95vw] max-h-[95vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Content Plan</DialogTitle>
                        <DialogDescription>Update detail konten: {selectedPlan?.title}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="flex flex-col gap-4">
                        {formFields}
                        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing}>Update</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Content Plan</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus <span className="font-semibold">{selectedPlan?.title}</span>? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitDelete}>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
                            <Button type="submit" variant="destructive" disabled={processing}>Hapus</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

ContentPlansIndex.layout = {
    breadcrumbs: [
        {
            title: 'Content Planning',
            href: '/content-plans',
        },
    ],
};

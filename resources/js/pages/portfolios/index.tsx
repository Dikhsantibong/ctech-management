import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, MoreVertical, Trash2, Edit2, Image as ImageIcon, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

export default function PortfoliosIndex({ portfolios }: { portfolios: any[] }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null);

    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        category: '',
        description: '',
        link: '',
        image: null as File | null,
    });

    const openCreateModal = () => {
        reset();
        setData({
            title: '',
            category: 'Web App',
            description: '',
            link: '',
            image: null,
        });
        setIsCreateModalOpen(true);
    };

    const openEditModal = (item: any) => {
        setSelectedPortfolio(item);
        setData({
            title: item.title,
            category: item.category || '',
            description: item.description || '',
            link: item.link || '',
            image: null,
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (item: any) => {
        setSelectedPortfolio(item);
        setIsDeleteModalOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/portfolios', {
            forceFormData: true,
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/portfolios/${selectedPortfolio?.id}?_method=PUT`, {
            forceFormData: true,
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
            },
        });
    };

    const submitDelete = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(`/portfolios/${selectedPortfolio?.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
            },
        });
    };

    return (
        <>
            <Head title="Portfolio" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Karya Kami / Portfolio</h2>
                        <p className="text-muted-foreground">Kelola daftar project terselesaikan untuk ditampilkan di halaman depan.</p>
                    </div>
                    <Button onClick={openCreateModal}>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Portfolio
                    </Button>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground">
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Preview</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Judul Project</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Kategori</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Link</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {portfolios.map((item) => (
                                        <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle">
                                                {item.image ? (
                                                    <img src={`/storage/${item.image}`} alt={item.title} className="h-12 w-20 object-cover rounded border" />
                                                ) : (
                                                    <div className="h-12 w-20 bg-muted rounded border flex items-center justify-center text-muted-foreground">
                                                        <ImageIcon className="h-5 w-5" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle font-medium max-w-[250px] truncate" title={item.title}>
                                                {item.title}
                                            </td>
                                            <td className="p-4 align-middle">{item.category || '-'}</td>
                                            <td className="p-4 align-middle">
                                                {item.link ? (
                                                    <a href={item.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                                        Buka Link
                                                    </a>
                                                ) : '-'}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Buka menu</span>
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEditModal(item)}>
                                                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openDeleteModal(item)} className="text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                    {portfolios.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                                Belum ada data portfolio.
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
                        <DialogTitle>Tambah Portfolio Baru</DialogTitle>
                        <DialogDescription>Tambahkan project terselesaikan untuk ditampilkan di Landing Page.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="space-y-4">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul Project</Label>
                                <Input id="title" value={data.title} onChange={e => setData('title', e.target.value)} required />
                                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Kategori</Label>
                                    <Input id="category" value={data.category} onChange={e => setData('category', e.target.value)} placeholder="Contoh: Web App, Mobile App, dll" />
                                    {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="link">Link Demo/Web (Opsional)</Label>
                                    <Input id="link" type="url" value={data.link} onChange={e => setData('link', e.target.value)} placeholder="https://..." />
                                    {errors.link && <p className="text-sm text-destructive">{errors.link}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Gambar/Mockup</Label>
                                <Input id="image" type="file" accept="image/*" onChange={e => setData('image', e.target.files?.[0] || null)} />
                                {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi Singkat (Opsional)</Label>
                                <Textarea id="description" className="min-h-[100px]" value={data.description} onChange={e => setData('description', e.target.value)} />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>
                        </div>
                        
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing}>Simpan Portfolio</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Portfolio</DialogTitle>
                        <DialogDescription>Ubah detail informasi portfolio.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="space-y-4">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-title">Judul Project</Label>
                                <Input id="edit-title" value={data.title} onChange={e => setData('title', e.target.value)} required />
                                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-category">Kategori</Label>
                                    <Input id="edit-category" value={data.category} onChange={e => setData('category', e.target.value)} />
                                    {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-link">Link Demo/Web</Label>
                                    <Input id="edit-link" type="url" value={data.link} onChange={e => setData('link', e.target.value)} />
                                    {errors.link && <p className="text-sm text-destructive">{errors.link}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-image">Ganti Gambar (Opsional)</Label>
                                <Input id="edit-image" type="file" accept="image/*" onChange={e => setData('image', e.target.files?.[0] || null)} />
                                {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-description">Deskripsi Singkat</Label>
                                <Textarea id="edit-description" className="min-h-[100px]" value={data.description} onChange={e => setData('description', e.target.value)} />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>
                        </div>
                        
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing}>Update Portfolio</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Portfolio</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus <span className="font-semibold">{selectedPortfolio?.title}</span> dari daftar portfolio?
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

PortfoliosIndex.layout = {
    breadcrumbs: [
        {
            title: 'Portfolio',
            href: '/portfolios',
        },
    ],
};

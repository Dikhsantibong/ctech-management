import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Plus, MoreVertical, Newspaper, Trash2, Edit2, Image as ImageIcon, Share2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { SharePreviewDialog } from '@/components/news/SharePreviewDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
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

export default function NewsIndex({ news, filters }: { news: any, filters?: any }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery !== (filters?.search || '')) {
                router.get('/news', { search: searchQuery }, { preserveState: true, replace: true, preserveScroll: true });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const [previewNewsId, setPreviewNewsId] = useState<number | null>(null);

    const emptySeo = { excerpt: '', seo_title: '', seo_description: '', story_image: null as File | null, remove_story_image: false };

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        content: '',
        category: '',
        status: 'Draft',
        image: null as File | null,
        ...emptySeo,
    });

    const seoFields = (idPrefix: string) => (
        <div className="space-y-4 rounded-lg border p-4">
            <div>
                <p className="text-sm font-semibold">SEO & Social Sharing</p>
                <p className="text-xs text-muted-foreground">Dipakai untuk preview link di WhatsApp, Telegram, Facebook, LinkedIn, dan X. Kosongkan untuk memakai judul & isi artikel.</p>
            </div>
            <div className="space-y-2">
                <Label htmlFor={`${idPrefix}seo_title`}>SEO Title <span className="text-xs text-muted-foreground">({data.seo_title.length}/60)</span></Label>
                <Input id={`${idPrefix}seo_title`} value={data.seo_title} maxLength={90} onChange={e => setData('seo_title', e.target.value)} placeholder={data.title} />
                {errors.seo_title && <p className="text-sm text-destructive">{errors.seo_title}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor={`${idPrefix}seo_description`}>Meta Description <span className="text-xs text-muted-foreground">({data.seo_description.length}/160)</span></Label>
                <Textarea id={`${idPrefix}seo_description`} value={data.seo_description} maxLength={300} rows={2} onChange={e => setData('seo_description', e.target.value)} />
                {errors.seo_description && <p className="text-sm text-destructive">{errors.seo_description}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor={`${idPrefix}excerpt`}>Ringkasan (Excerpt)</Label>
                <Textarea id={`${idPrefix}excerpt`} value={data.excerpt} maxLength={500} rows={2} onChange={e => setData('excerpt', e.target.value)} />
                {errors.excerpt && <p className="text-sm text-destructive">{errors.excerpt}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor={`${idPrefix}story_image`}>Story Image Portrait (Opsional)</Label>
                <Input id={`${idPrefix}story_image`} type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setData('story_image', e.target.files?.[0] || null)} />
                {errors.story_image && <p className="text-sm text-destructive">{errors.story_image}</p>}
                <p className="text-xs text-muted-foreground">Rekomendasi 1080 × 1920 px. Jika kosong, story image dibuat otomatis dari featured image, judul, dan branding CTECH.</p>
                {selectedNews?.story_image && idPrefix === 'edit-' && (
                    <label className="flex items-center gap-2 text-xs">
                        <input type="checkbox" checked={data.remove_story_image} onChange={e => setData('remove_story_image', e.target.checked)} />
                        Hapus story image unggahan (kembali ke versi otomatis)
                    </label>
                )}
            </div>
        </div>
    );

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            [{ 'align': [] }],
            [{ 'color': [] }, { 'background': [] }],
            ['clean']
        ],
    };

    const quillFormats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video',
        'align', 'color', 'background'
    ];

    const openCreateModal = () => {
        reset();
        setData({
            title: '',
            content: '',
            category: 'Pengumuman',
            status: 'Draft',
            image: null,
            ...emptySeo,
        });
        setSelectedNews(null);
        setIsCreateModalOpen(true);
    };

    const openEditModal = (item: any) => {
        setSelectedNews(item);
        setData({
            title: item.title,
            content: item.content,
            category: item.category || '',
            status: item.status,
            image: null, // Don't preset the file input
            excerpt: item.excerpt || '',
            seo_title: item.seo_title || '',
            seo_description: item.seo_description || '',
            story_image: null,
            remove_story_image: false,
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (item: any) => {
        setSelectedNews(item);
        setIsDeleteModalOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        // Since we have a file, Inertia post automatically uses FormData
        post('/news', {
            forceFormData: true,
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        // Inertia put method doesn't support file uploads natively (FormData limitation with PUT/PATCH in PHP).
        // We use a POST request and spoof the PUT method.
        post(`/news/${selectedNews?.id}?_method=PUT`, {
            forceFormData: true,
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
            },
        });
    };

    const submitDelete = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(`/news/${selectedNews?.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
            },
        });
    };

    const statusBadgeColor = (status: string) => {
        switch (status) {
            case 'Published': return 'default';
            default: return 'outline'; // Draft
        }
    };

    return (
        <>
            <Head title="Berita" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Berita & Informasi</h2>
                        <p className="text-muted-foreground">Kelola artikel, berita, dan pengumuman perusahaan.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Input 
                            placeholder="Cari berita..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-[250px]"
                        />
                        <Button onClick={openCreateModal}>
                            <Plus className="mr-2 h-4 w-4" /> Buat Berita
                        </Button>
                    </div>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground">
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Thumbnail</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Judul</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Kategori</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tanggal Dibuat</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(news.data || news).map((item: any) => (
                                        <tr key={item.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
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
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {new Date(item.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={statusBadgeColor(item.status)}>
                                                    {item.status}
                                                </Badge>
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
                                                        <DropdownMenuItem onClick={() => setPreviewNewsId(item.id)}>
                                                            <Share2 className="mr-2 h-4 w-4" /> Preview Sosial Media
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openDeleteModal(item)} className="text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                    {(news.data || news).length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                                Belum ada berita.
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
                        <DialogTitle>Buat Berita Baru</DialogTitle>
                        <DialogDescription>Tulis berita atau pengumuman baru untuk dipublikasikan.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul Berita</Label>
                                <Input id="title" value={data.title} onChange={e => setData('title', e.target.value)} required />
                                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Kategori</Label>
                                    <Input id="category" value={data.category} onChange={e => setData('category', e.target.value)} placeholder="Contoh: Pengumuman, Event, dll" />
                                    {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={data.status} onValueChange={val => setData('status', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Draft">Draft</SelectItem>
                                            <SelectItem value="Published">Published</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Gambar/Thumbnail</Label>
                                <Input id="image" type="file" accept="image/*" onChange={e => setData('image', e.target.files?.[0] || null)} />
                                {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
                                <p className="text-xs text-muted-foreground">JPG, PNG, atau WebP. Maks 5MB. Rekomendasi 1200 × 630 px (1.91:1); thumbnail sosial dibuat otomatis.</p>
                            </div>

                            {seoFields('')}

                            <div className="space-y-2">
                                <Label htmlFor="content">Isi Berita</Label>
                                <div className="bg-white rounded-md border border-input">
                                    <ReactQuill 
                                        theme="snow" 
                                        value={data.content} 
                                        onChange={(content) => setData('content', content)} 
                                        modules={quillModules}
                                        formats={quillFormats}
                                        className="h-[300px] mb-12"
                                    />
                                </div>
                                {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
                            </div>
                        </div>
                        
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing}>Simpan Berita</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Berita</DialogTitle>
                        <DialogDescription>Ubah detail berita atau pengumuman.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-title">Judul Berita</Label>
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
                                    <Label htmlFor="edit-status">Status</Label>
                                    <Select value={data.status} onValueChange={val => setData('status', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Draft">Draft</SelectItem>
                                            <SelectItem value="Published">Published</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-image">Ganti Gambar/Thumbnail (Opsional)</Label>
                                <Input id="edit-image" type="file" accept="image/*" onChange={e => setData('image', e.target.files?.[0] || null)} />
                                {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
                                {selectedNews?.image && (
                                    <p className="text-xs text-muted-foreground mt-1">Biarkan kosong jika tidak ingin mengganti gambar saat ini.</p>
                                )}
                            </div>

                            {seoFields('edit-')}

                            <div className="space-y-2">
                                <Label htmlFor="edit-content">Isi Berita</Label>
                                <div className="bg-white rounded-md border border-input">
                                    <ReactQuill 
                                        theme="snow" 
                                        value={data.content} 
                                        onChange={(content) => setData('content', content)} 
                                        modules={quillModules}
                                        formats={quillFormats}
                                        className="h-[300px] mb-12"
                                    />
                                </div>
                                {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
                            </div>
                        </div>
                        
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing}>Update Berita</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <SharePreviewDialog newsId={previewNewsId} open={previewNewsId !== null} onOpenChange={(open) => !open && setPreviewNewsId(null)} />

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Berita</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus berita <span className="font-semibold">{selectedNews?.title}</span>? Tindakan ini tidak dapat dibatalkan.
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

NewsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Berita',
            href: '/news',
        },
    ],
};

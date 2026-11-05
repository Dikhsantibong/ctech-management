import { Head, Link, router } from '@inertiajs/react';
import { Plus, MoreVertical, Trash2, Edit2, Image as ImageIcon, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SharePreviewDialog } from '@/components/news/SharePreviewDialog';
import { statusTone } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

export default function NewsIndex({ news, filters }: { news: any, filters?: any }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<any>(null);
    const [previewNewsId, setPreviewNewsId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery !== (filters?.search || '')) {
                router.get('/news', { search: searchQuery }, { preserveState: true, replace: true, preserveScroll: true });
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const openDeleteModal = (item: any) => {
        setSelectedNews(item);
        setIsDeleteModalOpen(true);
    };

    const submitDelete = (e: React.FormEvent) => {
        e.preventDefault();
        router.delete(`/news/${selectedNews?.id}`, {
            onStart: () => setDeleting(true),
            onFinish: () => setDeleting(false),
            onSuccess: () => setIsDeleteModalOpen(false),
        });
    };

    const statusBadgeColor = (status: string) => statusTone(status);

    return (
        <>
            <Head title="Berita" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Berita & Informasi</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Kelola artikel, berita, dan pengumuman perusahaan.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Input
                            placeholder="Cari berita..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-[250px]"
                        />
                        <Button asChild>
                            <Link href="/news/create">
                                <Plus className="mr-2 h-4 w-4" /> Buat Berita
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground">
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b transition-colors hover:bg-muted data-[state=selected]:bg-muted">
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
                                        <tr key={item.id} className="border-b transition-colors hover:bg-muted data-[state=selected]:bg-muted">
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
                                                <Link href={`/news/${item.id}/edit`} className="hover:underline">{item.title}</Link>
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
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/news/${item.id}/edit`}>
                                                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                            </Link>
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
                            <Button type="submit" variant="destructive" disabled={deleting}>Hapus</Button>
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

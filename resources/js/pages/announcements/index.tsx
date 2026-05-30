import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, MoreVertical, Edit2, Trash2, Bell, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Link } from '@inertiajs/react';

interface Announcement {
    id: number;
    title: string;
    content: string;
    visible_to_roles: string[];
    type: 'info' | 'warning' | 'success' | 'error';
    is_active: boolean;
    published_at: string | null;
    expires_at: string | null;
    created_at: string;
}

interface Props {
    announcements: Announcement[];
    canManage: boolean;
}

export default function AnnouncementsIndex({ announcements, canManage }: Props) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'info': return <Info className="h-4 w-4" />;
            case 'warning': return <AlertTriangle className="h-4 w-4" />;
            case 'success': return <CheckCircle className="h-4 w-4" />;
            case 'error': return <XCircle className="h-4 w-4" />;
            default: return <Bell className="h-4 w-4" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'info': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'success': return 'bg-green-100 text-green-800 border-green-300';
            case 'error': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const formatRole = (role: string) => {
        return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const openDeleteModal = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setIsDeleteModalOpen(true);
    };

    return (
        <>
            <Head title="Pengumuman" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Pengumuman</h2>
                        <p className="text-muted-foreground">Kelola pengumuman untuk tim Anda.</p>
                    </div>
                    {canManage && (
                        <Link href="/announcements/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Buat Pengumuman
                            </Button>
                        </Link>
                    )}
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Judul</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tipe</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Visible To</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tanggal</th>
                                        {canManage && (
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {announcements.map((announcement) => (
                                        <tr key={announcement.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-shrink-0">
                                                        {getTypeIcon(announcement.type)}
                                                    </div>
                                                    <span className="font-medium">{announcement.title}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant="outline" className={getTypeColor(announcement.type)}>
                                                    {announcement.type}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex flex-wrap gap-1">
                                                    {announcement.visible_to_roles.map((role) => (
                                                        <Badge key={role} variant="secondary" className="text-xs">
                                                            {formatRole(role)}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={announcement.is_active ? 'default' : 'secondary'}>
                                                    {announcement.is_active ? 'Aktif' : 'Nonaktif'}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {new Date(announcement.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                            {canManage && (
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
                                                                <Link href={`/announcements/${announcement.id}`}>
                                                                    <Edit2 className="mr-2 h-4 w-4" /> Lihat Detail
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/announcements/${announcement.id}/edit`}>
                                                                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openDeleteModal(announcement)} className="text-destructive">
                                                                <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                    {announcements.length === 0 && (
                                        <tr>
                                            <td colSpan={canManage ? 6 : 5} className="p-4 text-center text-muted-foreground">
                                                Tidak ada pengumuman.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Pengumuman</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus pengumuman "{selectedAnnouncement?.title}"? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (selectedAnnouncement) {
                                    window.location.href = `/announcements/${selectedAnnouncement.id}`;
                                }
                            }}
                        >
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

AnnouncementsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Pengumuman',
            href: '/announcements',
        },
    ],
};

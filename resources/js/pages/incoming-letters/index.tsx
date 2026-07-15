import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    MailOpen, MoreVertical, Trash2, Eye, Edit2, Search, Plus,
    Download, Paperclip, Calendar, Building2, FileText, Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

type IncomingLetter = {
    id: number;
    agenda_number: string;
    reference_number: string;
    sender: string;
    letter_date: string;
    received_date: string;
    subject: string;
    sifat: string;
    disposition: string | null;
    notes: string | null;
    attachment_path: string | null;
    status: string;
    created_by: number;
    creator?: { id: number; name: string };
    created_at: string;
    updated_at: string;
};

const SIFAT_OPTIONS = ['Biasa', 'Penting', 'Segera', 'Sangat Segera', 'Rahasia'];
const STATUS_OPTIONS = ['Diterima', 'Diproses', 'Selesai', 'Diarsipkan'];

export default function IncomingLettersIndex({
    incomingLetters,
    search: initialSearch,
    statusFilter: initialStatusFilter,
}: {
    incomingLetters: IncomingLetter[];
    search?: string;
    statusFilter?: string;
}) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedLetter, setSelectedLetter] = useState<IncomingLetter | null>(null);
    const [search, setSearch] = useState(initialSearch || '');
    const [statusFilter, setStatusFilter] = useState(initialStatusFilter || '');
    const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
    const [editAttachmentFile, setEditAttachmentFile] = useState<File | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        reference_number: '',
        sender: '',
        letter_date: new Date().toISOString().split('T')[0],
        received_date: new Date().toISOString().split('T')[0],
        subject: '',
        sifat: 'Biasa',
        disposition: '',
        notes: '',
    });

    const {
        data: editData,
        setData: setEditData,
        processing: editProcessing,
        errors: editErrors,
        reset: editReset,
    } = useForm({
        reference_number: '',
        sender: '',
        letter_date: '',
        received_date: '',
        subject: '',
        sifat: 'Biasa',
        disposition: '',
        notes: '',
        status: 'Diterima',
    });

    const openCreateModal = () => {
        reset();
        setAttachmentFile(null);
        setData({
            reference_number: '',
            sender: '',
            letter_date: new Date().toISOString().split('T')[0],
            received_date: new Date().toISOString().split('T')[0],
            subject: '',
            sifat: 'Biasa',
            disposition: '',
            notes: '',
        });
        setIsCreateModalOpen(true);
    };

    const openEditModal = (letter: IncomingLetter) => {
        setSelectedLetter(letter);
        setEditAttachmentFile(null);
        setEditData({
            reference_number: letter.reference_number,
            sender: letter.sender,
            letter_date: letter.letter_date ? letter.letter_date.split('T')[0] : '',
            received_date: letter.received_date ? letter.received_date.split('T')[0] : '',
            subject: letter.subject,
            sifat: letter.sifat || 'Biasa',
            disposition: letter.disposition || '',
            notes: letter.notes || '',
            status: letter.status,
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (letter: IncomingLetter) => {
        setSelectedLetter(letter);
        setIsDeleteModalOpen(true);
    };

    const openDetailModal = (letter: IncomingLetter) => {
        setSelectedLetter(letter);
        setIsDetailModalOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('reference_number', data.reference_number);
        formData.append('sender', data.sender);
        formData.append('letter_date', data.letter_date);
        formData.append('received_date', data.received_date);
        formData.append('subject', data.subject);
        formData.append('sifat', data.sifat);
        formData.append('disposition', data.disposition);
        formData.append('notes', data.notes);
        if (attachmentFile) {
            formData.append('attachment', attachmentFile);
        }

        router.post('/incoming-letters', formData, {
            forceFormData: true,
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
                setAttachmentFile(null);
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLetter) return;

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('reference_number', editData.reference_number);
        formData.append('sender', editData.sender);
        formData.append('letter_date', editData.letter_date);
        formData.append('received_date', editData.received_date);
        formData.append('subject', editData.subject);
        formData.append('sifat', editData.sifat);
        formData.append('disposition', editData.disposition);
        formData.append('notes', editData.notes);
        formData.append('status', editData.status);
        if (editAttachmentFile) {
            formData.append('attachment', editAttachmentFile);
        }

        router.post(`/incoming-letters/${selectedLetter.id}`, formData, {
            forceFormData: true,
            onSuccess: () => {
                setIsEditModalOpen(false);
                editReset();
                setEditAttachmentFile(null);
            },
        });
    };

    const submitDelete = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLetter) return;
        router.delete(`/incoming-letters/${selectedLetter.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
            },
        });
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        const params = new URLSearchParams(window.location.search);
        if (value) {
            params.set('search', value);
        } else {
            params.delete('search');
        }
        router.get(`/incoming-letters?${params.toString()}`, {}, { preserveState: true, replace: true });
    };

    const handleStatusFilter = (value: string) => {
        const filterValue = value === 'all' ? '' : value;
        setStatusFilter(filterValue);
        const params = new URLSearchParams(window.location.search);
        if (filterValue) {
            params.set('status', filterValue);
        } else {
            params.delete('status');
        }
        router.get(`/incoming-letters?${params.toString()}`, {}, { preserveState: true, replace: true });
    };

    const sifatBadgeVariant = (sifat: string) => {
        switch (sifat) {
            case 'Sangat Segera': return 'destructive' as const;
            case 'Segera': return 'default' as const;
            case 'Penting': return 'secondary' as const;
            case 'Rahasia': return 'destructive' as const;
            default: return 'outline' as const;
        }
    };

    const statusBadgeVariant = (status: string) => {
        switch (status) {
            case 'Diterima': return 'outline' as const;
            case 'Diproses': return 'default' as const;
            case 'Selesai': return 'secondary' as const;
            case 'Diarsipkan': return 'outline' as const;
            default: return 'outline' as const;
        }
    };

    const statusDotColor = (status: string) => {
        switch (status) {
            case 'Diterima': return 'bg-blue-500';
            case 'Diproses': return 'bg-amber-500';
            case 'Selesai': return 'bg-emerald-500';
            case 'Diarsipkan': return 'bg-gray-400';
            default: return 'bg-gray-400';
        }
    };

    return (
        <>
            <Head title="Surat Masuk" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Surat Masuk</h2>
                        <p className="text-muted-foreground">Kelola dan catat surat masuk perusahaan.</p>
                    </div>
                    <Button onClick={openCreateModal}>
                        <Plus className="mr-2 h-4 w-4" /> Catat Surat Masuk
                    </Button>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari berdasarkan no. agenda, no. surat, pengirim, perihal..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <Select value={statusFilter || 'all'} onValueChange={handleStatusFilter}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    {STATUS_OPTIONS.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="text-sm text-muted-foreground whitespace-nowrap">
                            {incomingLetters.length} surat
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">No. Agenda</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">No. Surat</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Pengirim</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Perihal</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tgl. Surat</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tgl. Diterima</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Sifat</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {incomingLetters.map((letter) => (
                                        <tr key={letter.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">
                                                <button
                                                    onClick={() => openDetailModal(letter)}
                                                    className="hover:underline flex items-center gap-2 text-left"
                                                >
                                                    <MailOpen className="h-4 w-4 text-muted-foreground" />
                                                    {letter.agenda_number}
                                                </button>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {letter.reference_number}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                                    <span className="truncate max-w-[180px]">{letter.sender}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <span className="flex items-center gap-2">
                                                    <span className="truncate max-w-[220px]">{letter.subject}</span>
                                                    {letter.attachment_path && (
                                                        <Paperclip className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                                    )}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {letter.letter_date ? new Date(letter.letter_date).toLocaleDateString('id-ID') : '-'}
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {letter.received_date ? new Date(letter.received_date).toLocaleDateString('id-ID') : '-'}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={sifatBadgeVariant(letter.sifat)}>
                                                    {letter.sifat || 'Biasa'}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={statusBadgeVariant(letter.status)} className="gap-1.5">
                                                    <span className={`h-1.5 w-1.5 rounded-full ${statusDotColor(letter.status)}`}></span>
                                                    {letter.status}
                                                </Badge>
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
                                                        <DropdownMenuItem onClick={() => openDetailModal(letter)}>
                                                            <Eye className="mr-2 h-4 w-4" /> Detail
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openEditModal(letter)}>
                                                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        {letter.attachment_path && (
                                                            <DropdownMenuItem asChild>
                                                                <a href={`/incoming-letters/${letter.id}/download`} className="cursor-pointer flex items-center">
                                                                    <Download className="mr-2 h-4 w-4" /> Download Lampiran
                                                                </a>
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem onClick={() => openDeleteModal(letter)} className="text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                    {incomingLetters.length === 0 && (
                                        <tr>
                                            <td colSpan={9} className="p-8 text-center text-muted-foreground">
                                                <MailOpen className="mx-auto h-10 w-10 mb-3 text-muted-foreground/40" />
                                                <p className="font-medium">Belum ada surat masuk.</p>
                                                <p className="text-sm mt-1">Klik "Catat Surat Masuk" untuk menambahkan surat baru.</p>
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
                        <DialogTitle>Catat Surat Masuk</DialogTitle>
                        <DialogDescription>Masukkan data surat masuk yang diterima perusahaan.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="reference_number">Nomor Surat</Label>
                                <Input
                                    id="reference_number"
                                    value={data.reference_number}
                                    onChange={e => setData('reference_number', e.target.value)}
                                    placeholder="Nomor surat dari pengirim"
                                    required
                                />
                                {errors.reference_number && <p className="text-sm text-destructive">{errors.reference_number}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sender">Pengirim</Label>
                                <Input
                                    id="sender"
                                    value={data.sender}
                                    onChange={e => setData('sender', e.target.value)}
                                    placeholder="Nama instansi / perusahaan pengirim"
                                    required
                                />
                                {errors.sender && <p className="text-sm text-destructive">{errors.sender}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="letter_date">Tanggal Surat</Label>
                                <Input
                                    id="letter_date"
                                    type="date"
                                    value={data.letter_date}
                                    onChange={e => setData('letter_date', e.target.value)}
                                    required
                                />
                                {errors.letter_date && <p className="text-sm text-destructive">{errors.letter_date}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="received_date">Tanggal Diterima</Label>
                                <Input
                                    id="received_date"
                                    type="date"
                                    value={data.received_date}
                                    onChange={e => setData('received_date', e.target.value)}
                                    required
                                />
                                {errors.received_date && <p className="text-sm text-destructive">{errors.received_date}</p>}
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="subject">Perihal</Label>
                                <Input
                                    id="subject"
                                    value={data.subject}
                                    onChange={e => setData('subject', e.target.value)}
                                    placeholder="Perihal surat"
                                    required
                                />
                                {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sifat">Sifat Surat</Label>
                                <Select value={data.sifat} onValueChange={val => setData('sifat', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih sifat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SIFAT_OPTIONS.map((s) => (
                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.sifat && <p className="text-sm text-destructive">{errors.sifat}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="attachment">Lampiran (Scan Surat)</Label>
                                <Input
                                    id="attachment"
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={e => setAttachmentFile(e.target.files?.[0] || null)}
                                />
                                <p className="text-xs text-muted-foreground">PDF, JPG, PNG. Maks. 10MB</p>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="disposition">Disposisi</Label>
                                <Textarea
                                    id="disposition"
                                    value={data.disposition}
                                    onChange={e => setData('disposition', e.target.value)}
                                    placeholder="Catatan disposisi / instruksi pimpinan (opsional)"
                                    rows={2}
                                />
                                {errors.disposition && <p className="text-sm text-destructive">{errors.disposition}</p>}
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="notes">Catatan</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    placeholder="Catatan tambahan (opsional)"
                                    rows={2}
                                />
                                {errors.notes && <p className="text-sm text-destructive">{errors.notes}</p>}
                            </div>
                        </div>
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing}>Simpan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Surat Masuk</DialogTitle>
                        <DialogDescription>Perbarui data surat masuk.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-reference_number">Nomor Surat</Label>
                                <Input
                                    id="edit-reference_number"
                                    value={editData.reference_number}
                                    onChange={e => setEditData('reference_number', e.target.value)}
                                    required
                                />
                                {editErrors.reference_number && <p className="text-sm text-destructive">{editErrors.reference_number}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-sender">Pengirim</Label>
                                <Input
                                    id="edit-sender"
                                    value={editData.sender}
                                    onChange={e => setEditData('sender', e.target.value)}
                                    required
                                />
                                {editErrors.sender && <p className="text-sm text-destructive">{editErrors.sender}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-letter_date">Tanggal Surat</Label>
                                <Input
                                    id="edit-letter_date"
                                    type="date"
                                    value={editData.letter_date}
                                    onChange={e => setEditData('letter_date', e.target.value)}
                                    required
                                />
                                {editErrors.letter_date && <p className="text-sm text-destructive">{editErrors.letter_date}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-received_date">Tanggal Diterima</Label>
                                <Input
                                    id="edit-received_date"
                                    type="date"
                                    value={editData.received_date}
                                    onChange={e => setEditData('received_date', e.target.value)}
                                    required
                                />
                                {editErrors.received_date && <p className="text-sm text-destructive">{editErrors.received_date}</p>}
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="edit-subject">Perihal</Label>
                                <Input
                                    id="edit-subject"
                                    value={editData.subject}
                                    onChange={e => setEditData('subject', e.target.value)}
                                    required
                                />
                                {editErrors.subject && <p className="text-sm text-destructive">{editErrors.subject}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-sifat">Sifat Surat</Label>
                                <Select value={editData.sifat} onValueChange={val => setEditData('sifat', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih sifat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SIFAT_OPTIONS.map((s) => (
                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editErrors.sifat && <p className="text-sm text-destructive">{editErrors.sifat}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <Select value={editData.status} onValueChange={val => setEditData('status', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STATUS_OPTIONS.map((s) => (
                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editErrors.status && <p className="text-sm text-destructive">{editErrors.status}</p>}
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="edit-attachment">Ganti Lampiran</Label>
                                <Input
                                    id="edit-attachment"
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={e => setEditAttachmentFile(e.target.files?.[0] || null)}
                                />
                                {selectedLetter?.attachment_path && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Paperclip className="h-3 w-3" /> Lampiran saat ini sudah ada. Upload file baru untuk mengganti.
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="edit-disposition">Disposisi</Label>
                                <Textarea
                                    id="edit-disposition"
                                    value={editData.disposition}
                                    onChange={e => setEditData('disposition', e.target.value)}
                                    placeholder="Catatan disposisi / instruksi pimpinan (opsional)"
                                    rows={2}
                                />
                                {editErrors.disposition && <p className="text-sm text-destructive">{editErrors.disposition}</p>}
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="edit-notes">Catatan</Label>
                                <Textarea
                                    id="edit-notes"
                                    value={editData.notes}
                                    onChange={e => setEditData('notes', e.target.value)}
                                    placeholder="Catatan tambahan (opsional)"
                                    rows={2}
                                />
                                {editErrors.notes && <p className="text-sm text-destructive">{editErrors.notes}</p>}
                            </div>
                        </div>
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={editProcessing}>Update</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Detail Modal */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <MailOpen className="h-5 w-5" />
                            Detail Surat Masuk
                        </DialogTitle>
                        <DialogDescription>
                            {selectedLetter?.agenda_number}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedLetter && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">No. Agenda</p>
                                    <p className="text-sm font-semibold">{selectedLetter.agenda_number}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">No. Surat</p>
                                    <p className="text-sm">{selectedLetter.reference_number}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pengirim</p>
                                    <p className="text-sm">{selectedLetter.sender}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Perihal</p>
                                    <p className="text-sm">{selectedLetter.subject}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tanggal Surat</p>
                                    <p className="text-sm flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                        {selectedLetter.letter_date ? new Date(selectedLetter.letter_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tanggal Diterima</p>
                                    <p className="text-sm flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                        {selectedLetter.received_date ? new Date(selectedLetter.received_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sifat</p>
                                    <Badge variant={sifatBadgeVariant(selectedLetter.sifat)}>
                                        {selectedLetter.sifat}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                                    <Badge variant={statusBadgeVariant(selectedLetter.status)} className="gap-1.5">
                                        <span className={`h-1.5 w-1.5 rounded-full ${statusDotColor(selectedLetter.status)}`}></span>
                                        {selectedLetter.status}
                                    </Badge>
                                </div>
                            </div>

                            {selectedLetter.disposition && (
                                <div className="space-y-1 border-t pt-4">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Disposisi</p>
                                    <p className="text-sm whitespace-pre-wrap bg-muted/50 rounded-lg p-3">{selectedLetter.disposition}</p>
                                </div>
                            )}

                            {selectedLetter.notes && (
                                <div className="space-y-1 border-t pt-4">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Catatan</p>
                                    <p className="text-sm whitespace-pre-wrap bg-muted/50 rounded-lg p-3">{selectedLetter.notes}</p>
                                </div>
                            )}

                            {selectedLetter.attachment_path && (
                                <div className="space-y-2 border-t pt-4">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Lampiran</p>
                                    <a
                                        href={`/incoming-letters/${selectedLetter.id}/download`}
                                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline bg-primary/5 rounded-lg px-3 py-2"
                                    >
                                        <FileText className="h-4 w-4" />
                                        Download Lampiran
                                        <Download className="h-3.5 w-3.5" />
                                    </a>
                                </div>
                            )}

                            {selectedLetter.creator && (
                                <div className="space-y-1 border-t pt-4">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Dicatat oleh</p>
                                    <p className="text-sm">{selectedLetter.creator.name}</p>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>Tutup</Button>
                        {selectedLetter && (
                            <Button onClick={() => { setIsDetailModalOpen(false); openEditModal(selectedLetter); }}>
                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Surat Masuk</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus surat masuk <span className="font-semibold">{selectedLetter?.agenda_number}</span>? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitDelete}>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
                            <Button type="submit" variant="destructive">Hapus</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

IncomingLettersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Surat Masuk',
            href: '/incoming-letters',
        },
    ],
};

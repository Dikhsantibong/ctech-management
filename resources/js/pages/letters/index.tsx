import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, MoreVertical, Mail, Trash2, Eye, Download, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

export default function LettersIndex({ letters }: { letters: any[] }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedLetter, setSelectedLetter] = useState<any>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        type: 'Surat Keputusan',
        letter_date: new Date().toISOString().split('T')[0],
        sifat: 'Biasa',
        recipient: '',
        subject: '',
        content: '',
        status: 'Draft',
    });

    const openCreateModal = () => {
        reset();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (letter: any) => {
        setSelectedLetter(letter);
        setData({
            type: letter.type,
            letter_date: letter.letter_date ? letter.letter_date.split('T')[0] : new Date().toISOString().split('T')[0],
            sifat: letter.sifat || 'Biasa',
            recipient: letter.recipient,
            subject: letter.subject,
            content: letter.content || '',
            status: letter.status,
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (letter: any) => {
        setSelectedLetter(letter);
        setIsDeleteModalOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/letters', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/letters/${selectedLetter?.id}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
            },
        });
    };

    const submitDelete = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(`/letters/${selectedLetter?.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
            },
        });
    };

    const statusBadgeColor = (status: string) => {
        switch (status) {
            case 'Final': return 'default';
            default: return 'outline'; // Draft
        }
    };

    return (
        <>
            <Head title="Letters" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Letters</h2>
                        <p className="text-muted-foreground">Manage official company correspondence.</p>
                    </div>
                    <Button onClick={openCreateModal}>
                        <Plus className="mr-2 h-4 w-4" /> Create Letter
                    </Button>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Reference</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Subject</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tanggal</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Sifat</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Recipient</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {letters.map((letter) => (
                                        <tr key={letter.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">
                                                <Link href={`/letters/${letter.id}`} className="hover:underline flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    {letter.reference_number}
                                                </Link>
                                            </td>
                                            <td className="p-4 align-middle">{letter.subject}</td>
                                            <td className="p-4 align-middle">{letter.type}</td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {letter.letter_date ? new Date(letter.letter_date).toLocaleDateString('id-ID') : '-'}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={letter.sifat === 'Sangat Segera' ? 'destructive' : letter.sifat === 'Segera' ? 'default' : letter.sifat === 'Penting' ? 'secondary' : 'outline'}>
                                                    {letter.sifat || 'Biasa'}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">{letter.recipient}</td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={statusBadgeColor(letter.status)}>
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
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/letters/${letter.id}`} className="cursor-pointer">
                                                                <Eye className="mr-2 h-4 w-4" /> View
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openEditModal(letter)}>
                                                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <a href={`/letters/${letter.id}/pdf`} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                                                                <Download className="mr-2 h-4 w-4" /> Download PDF
                                                            </a>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openDeleteModal(letter)} className="text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                    {letters.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="p-4 text-center text-muted-foreground">
                                                No letters found.
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
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Create Official Letter</DialogTitle>
                        <DialogDescription>Draft a new official document for the company.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <Label htmlFor="type">Jenis Surat</Label>
                                <Select value={data.type} onValueChange={val => setData('type', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih jenis surat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Surat Keputusan">Surat Keputusan</SelectItem>
                                        <SelectItem value="Surat Tugas">Surat Tugas</SelectItem>
                                        <SelectItem value="Surat Keterangan">Surat Keterangan</SelectItem>
                                        <SelectItem value="Surat Penawaran">Surat Penawaran</SelectItem>
                                        <SelectItem value="Surat Peringatan">Surat Peringatan</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                            </div>
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <Label htmlFor="letter_date">Tanggal Surat</Label>
                                <Input id="letter_date" type="date" value={data.letter_date} onChange={e => setData('letter_date', e.target.value)} required />
                                {errors.letter_date && <p className="text-sm text-destructive">{errors.letter_date}</p>}
                            </div>
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <Label htmlFor="sifat">Sifat Surat</Label>
                                <Select value={data.sifat} onValueChange={val => setData('sifat', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih sifat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Biasa">Biasa</SelectItem>
                                        <SelectItem value="Penting">Penting</SelectItem>
                                        <SelectItem value="Segera">Segera</SelectItem>
                                        <SelectItem value="Sangat Segera">Sangat Segera</SelectItem>
                                        <SelectItem value="Rahasia">Rahasia</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.sifat && <p className="text-sm text-destructive">{errors.sifat}</p>}
                            </div>
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <Label htmlFor="recipient">Penerima</Label>
                                <Input id="recipient" value={data.recipient} onChange={e => setData('recipient', e.target.value)} required />
                                {errors.recipient && <p className="text-sm text-destructive">{errors.recipient}</p>}
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="subject">Perihal</Label>
                                <Input id="subject" value={data.subject} onChange={e => setData('subject', e.target.value)} required />
                                {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="content">Isi Surat</Label>
                                <Textarea id="content" className="min-h-[200px]" value={data.content} onChange={e => setData('content', e.target.value)} required />
                                {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
                            </div>
                        </div>
                        
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>Draft Letter</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Edit Letter</DialogTitle>
                        <DialogDescription>Update document details.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <Label htmlFor="edit-type">Jenis Surat</Label>
                                <Select value={data.type} onValueChange={val => setData('type', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih jenis surat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Surat Keputusan">Surat Keputusan</SelectItem>
                                        <SelectItem value="Surat Tugas">Surat Tugas</SelectItem>
                                        <SelectItem value="Surat Keterangan">Surat Keterangan</SelectItem>
                                        <SelectItem value="Surat Penawaran">Surat Penawaran</SelectItem>
                                        <SelectItem value="Surat Peringatan">Surat Peringatan</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                            </div>
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <Label htmlFor="edit-letter_date">Tanggal Surat</Label>
                                <Input id="edit-letter_date" type="date" value={data.letter_date} onChange={e => setData('letter_date', e.target.value)} required />
                                {errors.letter_date && <p className="text-sm text-destructive">{errors.letter_date}</p>}
                            </div>
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <Label htmlFor="edit-sifat">Sifat Surat</Label>
                                <Select value={data.sifat} onValueChange={val => setData('sifat', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih sifat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Biasa">Biasa</SelectItem>
                                        <SelectItem value="Penting">Penting</SelectItem>
                                        <SelectItem value="Segera">Segera</SelectItem>
                                        <SelectItem value="Sangat Segera">Sangat Segera</SelectItem>
                                        <SelectItem value="Rahasia">Rahasia</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.sifat && <p className="text-sm text-destructive">{errors.sifat}</p>}
                            </div>
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <Label htmlFor="edit-recipient">Penerima</Label>
                                <Input id="edit-recipient" value={data.recipient} onChange={e => setData('recipient', e.target.value)} required />
                                {errors.recipient && <p className="text-sm text-destructive">{errors.recipient}</p>}
                            </div>
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <Label htmlFor="edit-subject">Perihal</Label>
                                <Input id="edit-subject" value={data.subject} onChange={e => setData('subject', e.target.value)} required />
                                {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
                            </div>
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <Label htmlFor="edit-status">Status</Label>
                                <Select value={data.status} onValueChange={val => setData('status', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Draft">Draft</SelectItem>
                                        <SelectItem value="Final">Final</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="edit-content">Isi Surat</Label>
                                <Textarea id="edit-content" className="min-h-[200px]" value={data.content} onChange={e => setData('content', e.target.value)} required />
                                {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
                            </div>
                        </div>
                        
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>Update Letter</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Letter</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-semibold">{selectedLetter?.reference_number}</span>? This action cannot be undone.
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

LettersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Letters',
            href: '/letters',
        },
    ],
};

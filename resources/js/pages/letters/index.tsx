import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Plus, MoreVertical, Mail, Trash2, Eye, Edit2, Search, Hash, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LetterEditor from '@/components/letter-editor';
import LetterPageSettings from '@/components/letter-page-settings';
import { LETTER_TEMPLATES } from '@/lib/letter-templates';

const DEFAULT_PAGE_SETTINGS = {
    margin_top: 14,
    margin_right: 20,
    margin_bottom: 18,
    margin_left: 20,
    line_spacing: '1.5',
};
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

export default function LettersIndex({ letters, search: initialSearch }: { letters: any[], search?: string }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isNumberModalOpen, setIsNumberModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [selectedLetter, setSelectedLetter] = useState<any>(null);
    const [pdfUrl, setPdfUrl] = useState<string>('');
    const [search, setSearch] = useState(initialSearch || '');

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        type: 'Surat Keputusan',
        letter_date: new Date().toISOString().split('T')[0],
        sifat: 'Biasa',
        recipient: '',
        subject: '',
        content: '',
        status: 'Draft',
        ...DEFAULT_PAGE_SETTINGS,
    });

    const openCreateModal = () => {
        const defaultType = 'Surat Keputusan';
        const template = LETTER_TEMPLATES[defaultType as keyof typeof LETTER_TEMPLATES];
        reset();
        setData({
            type: defaultType,
            letter_date: new Date().toISOString().split('T')[0],
            sifat: 'Biasa',
            recipient: '',
            subject: template.subject,
            content: template.content,
            status: 'Draft',
            ...DEFAULT_PAGE_SETTINGS,
        });
        setIsCreateModalOpen(true);
    };

    // Reservasi nomor surat saja: surat tercatat & bernomor, tanpa isi (tidak bisa dicetak PDF)
    const openNumberModal = () => {
        reset();
        setData({
            type: 'Surat Keputusan',
            letter_date: new Date().toISOString().split('T')[0],
            sifat: 'Biasa',
            recipient: '',
            subject: '',
            content: '',
            status: 'Draft',
            ...DEFAULT_PAGE_SETTINGS,
        });
        setIsNumberModalOpen(true);
    };

    const submitNumberOnly = (e: React.FormEvent) => {
        e.preventDefault();
        post('/letters', {
            onSuccess: () => {
                setIsNumberModalOpen(false);
                reset();
            },
        });
    };

    const handleTypeChange = (newType: string) => {
        setData('type', newType);
        const template = LETTER_TEMPLATES[newType as keyof typeof LETTER_TEMPLATES];
        if (template) {
            setData('subject', template.subject);
            setData('content', template.content);
        }
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
            margin_top: letter.margin_top ?? DEFAULT_PAGE_SETTINGS.margin_top,
            margin_right: letter.margin_right ?? DEFAULT_PAGE_SETTINGS.margin_right,
            margin_bottom: letter.margin_bottom ?? DEFAULT_PAGE_SETTINGS.margin_bottom,
            margin_left: letter.margin_left ?? DEFAULT_PAGE_SETTINGS.margin_left,
            line_spacing: letter.line_spacing ?? DEFAULT_PAGE_SETTINGS.line_spacing,
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (letter: any) => {
        setSelectedLetter(letter);
        setIsDeleteModalOpen(true);
    };

    const openPreviewModal = (letter: any) => {
        setSelectedLetter(letter);
        fetch(`/letters/${letter.id}/pdf`, {
            headers: {
                'Accept': 'application/pdf'
            }
        })
            .then(response => response.blob())
            .then(blob => {
                const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
                setPdfUrl(url);
                setIsPreviewModalOpen(true);
            })
            .catch(error => {
                console.error('Error loading PDF:', error);
                alert('Failed to load PDF');
            });
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

    const handleSearch = (value: string) => {
        setSearch(value);
        const page = new URL(window.location.href);
        if (value) {
            page.searchParams.set('search', value);
        } else {
            page.searchParams.delete('search');
        }
        window.location.href = page.toString();
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

    useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

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
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/letters/verify"><ShieldCheck className="mr-2 h-4 w-4" /> Verifikasi Dokumen</Link>
                        </Button>
                        <Button variant="outline" onClick={openNumberModal}>
                            <Hash className="mr-2 h-4 w-4" /> Generate Nomor Saja
                        </Button>
                        <Button asChild><Link href="/letters/create"><Plus className="mr-2 h-4 w-4" /> Create Letter</Link></Button>
                    </div>
                </div>

                <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search letters by reference, subject, type or recipient..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="text-sm text-muted-foreground">
                        Showing {letters.length} letter{letters.length !== 1 ? 's' : ''}
                    </div>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground">
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
                                            <td className="p-4 align-middle">
                                                <span className="flex items-center gap-2">
                                                    {letter.subject}
                                                    {!letter.content && (
                                                        <Badge variant="outline" className="text-muted-foreground">
                                                            <Hash className="mr-1 h-3 w-3" /> Nomor Saja
                                                        </Badge>
                                                    )}
                                                </span>
                                            </td>
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
                                                        <DropdownMenuItem asChild><Link href={`/letters/${letter.id}/edit`} className="cursor-pointer flex items-center"><Edit2 className="mr-2 h-4 w-4" /> Edit</Link></DropdownMenuItem>
                                                        {letter.content && (
                                                            <DropdownMenuItem asChild>
                                                                <a href={`/letters/${letter.id}/preview`} target="_blank" rel="noreferrer" className="cursor-pointer flex items-center">
                                                                    <Eye className="mr-2 h-4 w-4" /> Preview PDF
                                                                </a>
                                                            </DropdownMenuItem>
                                                        )}
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

            

            

            {/* Generate Number Only Modal */}
            <Dialog open={isNumberModalOpen} onOpenChange={setIsNumberModalOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Generate Nomor Surat</DialogTitle>
                        <DialogDescription>
                            Reservasi nomor surat resmi tanpa membuat isi surat. Nomor tetap tercatat pada agenda surat dan urutannya tidak akan terpakai ganda.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitNumberOnly} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Jenis Surat</Label>
                                <Select value={data.type} onValueChange={val => setData('type', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih jenis surat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(LETTER_TEMPLATES).map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="number-letter_date">Tanggal Surat</Label>
                                <Input id="number-letter_date" type="date" value={data.letter_date} onChange={e => setData('letter_date', e.target.value)} required />
                                {errors.letter_date && <p className="text-sm text-destructive">{errors.letter_date}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Sifat Surat</Label>
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
                            <div className="space-y-2">
                                <Label htmlFor="number-recipient">Penerima / Tujuan</Label>
                                <Input id="number-recipient" value={data.recipient} onChange={e => setData('recipient', e.target.value)} required />
                                {errors.recipient && <p className="text-sm text-destructive">{errors.recipient}</p>}
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="number-subject">Perihal</Label>
                                <Input id="number-subject" placeholder="Untuk keperluan apa nomor ini digunakan" value={data.subject} onChange={e => setData('subject', e.target.value)} required />
                                {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
                            </div>
                        </div>
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsNumberModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>
                                <Hash className="mr-2 h-4 w-4" /> Generate Nomor
                            </Button>
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



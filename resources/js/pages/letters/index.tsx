import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Plus, MoreVertical, Mail, Trash2, Eye, Edit2, Search } from 'lucide-react';
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

const LETTER_TEMPLATES = {
    'Surat Keputusan': {
        subject: 'Keputusan tentang [isi perihal]',
        content: `DENGAN RAHMAT TUHAN YANG MAHA ESA

DIREKTUR UTAMA

Telah mempertimbangkan:
Bahwa dalam rangka [alasan/tujuan], perlu ditetapkan Surat Keputusan ini.

MEMUTUSKAN:

Kesatu  : [Keputusan utama yang diambil]
Kedua   : [Ketentuan tambahan jika ada]
Ketiga  : [Ketentuan lainnya]

Keputusan ini berlaku sejak tanggal ditetapkan.

[Tempat], [Tanggal]

[Nama Direktur]
[Jabatan]`,
    },
    'Surat Tugas': {
        subject: 'Surat Tugas untuk [nama/tujuan]',
        content: `Dasar:
1. [Peraturan/Perundangan yang menjadi dasar]
2. [Ketentuan atau keputusan terkait]

Kami perintahkan kepada:
Nama            : [Nama Pegawai]
Jabatan         : [Jabatan]
Tanggal Lahir   : [Tanggal Lahir]
NIP             : [NIP]

Untuk melaksanakan tugas sebagai berikut:
[Uraian tugas yang harus dilaksanakan]

Waktu pelaksanaan: [Mulai tanggal] s.d. [Tanggal selesai]
Tempat pelaksanaan: [Lokasi]

Biaya operasional ditanggung oleh [Sumber pembiayaan]

Demikian Surat Tugas ini diberikan untuk dijalankan dengan sebaik-baiknya.

[Tempat], [Tanggal]

[Nama Pemberi Tugas]
[Jabatan]`,
    },
    'Surat Keterangan': {
        subject: 'Keterangan tentang [isi perihal]',
        content: `Yang bertanda tangan di bawah ini:

Nama            : [Nama Pemberi Keterangan]
Jabatan         : [Jabatan]
Instansi/Perusahaan : [Nama Instansi/Perusahaan]

Dengan ini menerangkan bahwa:

Nama            : [Nama Penerima Keterangan]
[Identitas lainnya]: [Data]

Telah [uraian keadaan/keterangan yang diberikan]

Keterangan ini diberikan untuk keperluan [tujuan penggunaan].

Demikian surat keterangan ini dibuat dengan sebenarnya dan dapat dipertanggungjawabkan.

[Tempat], [Tanggal]

[Nama Pemberi Keterangan]
[Jabatan]`,
    },
    'Surat Penawaran': {
        subject: 'Penawaran Produk/Layanan [nama produk/layanan]',
        content: `Kepada Yth.
[Nama Penerima]
[Perusahaan/Institusi]
[Alamat]

Assalamu'alaikum Wr. Wb.

Dengan hormat,

Kami dengan ini menawarkan produk/layanan kami sebagai berikut:

1. Deskripsi Produk/Layanan:
   [Jelaskan produk/layanan secara detail]

2. Spesifikasi/Fitur:
   [Sebutkan spesifikasi dan fitur utama]

3. Harga:
   [Rincian harga]

4. Syarat Pembayaran:
   [Metode dan syarat pembayaran]

5. Waktu Pengiriman:
   [Estimasi pengiriman]

Penawaran ini berlaku hingga [tanggal berlaku].

Kami siap memberikan demonstrasi dan informasi lebih lanjut sesuai kebutuhan Anda.

Demikian penawaran ini kami sampaikan. Atas perhatian dan pertimbangan Anda, kami ucapkan terima kasih.

Wassalamu'alaikum Wr. Wb.

[Tempat], [Tanggal]

[Nama Penanda Tangan]
[Jabatan]`,
    },
    'Surat Peringatan': {
        subject: 'Surat Peringatan kepada [nama penerima]',
        content: `Kepada Yth.
[Nama Penerima]
[Jabatan]
[Perusahaan/Institusi]

Dengan hormat,

Berdasarkan laporan dan pengamatan yang telah kami lakukan, kami melihat adanya pelanggaran/ketidaksesuaian dalam hal:

[Jelaskan pelanggaran atau ketidaksesuaian yang dilakukan]

Hal ini bertentangan dengan:
- [Peraturan/Kebijakan yang dilanggar]
- [Kontrak/Perjanjian yang berlaku]

Oleh karena itu, kami memberikan peringatan ini sebagai:
☐ Peringatan Pertama
☐ Peringatan Kedua
☐ Peringatan Ketiga

Kami mengharapkan perbaikan dalam waktu [jumlah hari] hari sejak surat ini diterima.

Apabila dalam waktu yang ditetapkan tidak ada perbaikan, kami akan mengambil tindakan selanjutnya sesuai dengan ketentuan yang berlaku.

Demikian surat peringatan ini kami sampaikan. Atas perhatian Anda, kami ucapkan terima kasih.

[Tempat], [Tanggal]

[Nama Penanda Tangan]
[Jabatan]`,
    },
    'Surat Undangan': {
        subject: 'Undangan [Acara] kepada [Nama Penerima]',
        content: `Kepada Yth.
[Nama Penerima]
[Jabatan]
[Organisasi]

Dengan hormat,

Sehubungan dengan akan diselenggarakannya [Acara] pada:
Hari/Tanggal : [Hari, Tanggal]
Waktu         : [Jam]
Tempat        : [Lokasi]

Kami mengundang Saudara/i untuk hadir dan berpartisipasi dalam acara tersebut.

Demikian undangan ini kami sampaikan. Atas perhatian dan kehadiran Saudara/i, kami ucapkan terima kasih.

[Tempat], [Tanggal]

[Nama]
[Jabatan]`,
    },
    'Surat Izin': {
        subject: 'Permohonan Izin [keperluan] kepada [penerima]',
        content: `Yang bertanda tangan di bawah ini:

Nama    : [Nama Pemohon]
Jabatan : [Jabatan]
Instansi: [Instansi]

Dengan ini mengajukan permohonan izin untuk [uraian izin] pada:
Hari/Tanggal: [Tanggal]
Waktu       : [Jam]
Alasan      : [Alasan izin]

Demikian permohonan ini kami sampaikan. Atas perhatian dan izin yang diberikan, kami ucapkan terima kasih.

[Tempat], [Tanggal]

[Nama Pemohon]
[Jabatan]`,
    },
    'Surat Keterangan Kerja': {
        subject: 'Keterangan Kerja untuk [nama karyawan]',
        content: `Yang bertanda tangan di bawah ini menerangkan bahwa:

Nama    : [Nama Karyawan]
Jabatan : [Jabatan]
NIP     : [NIP]
Perusahaan/Instansi: [Nama Perusahaan]

Adalah benar-benar bekerja pada perusahaan kami sejak [tanggal masuk] sampai dengan [tanggal selesai/present]. Surat keterangan ini dibuat untuk keperluan [tujuan].

Demikian surat keterangan ini dibuat agar dapat dipergunakan sebagaimana mestinya.

[Tempat], [Tanggal]

[Nama Pemberi Keterangan]
[Jabatan]`,
    },
    'Surat Pengantar': {
        subject: 'Surat Pengantar [perihal] kepada [penerima]',
        content: `Dengan hormat,

Bersama surat ini kami sampaikan [dokumen/barang] kepada:

Nama Penerima : [Nama]
Alamat         : [Alamat]

Mohon untuk diterima dan diproses sesuai dengan ketentuan yang berlaku.

Demikian surat pengantar ini kami buat. Terima kasih.

[Tempat], [Tanggal]

[Nama Pengirim]
[Jabatan]`,
    },
    'Surat Pemberitahuan': {
        subject: 'Pemberitahuan tentang [isi pemberitahuan]',
        content: `Kepada Yth.
[Pihak Terkait]

Dengan hormat,

Sehubungan dengan [uraian singkat], kami memberitahukan bahwa [isi pemberitahuan].

Demikian pemberitahuan ini kami sampaikan untuk diketahui.

[Tempat], [Tanggal]

[Nama]
[Jabatan]`,
    },
    'Surat Rekomendasi': {
        subject: 'Surat Rekomendasi untuk [nama]',
        content: `Yang bertanda tangan di bawah ini memberikan rekomendasi kepada:

Nama    : [Nama]
Keterangan singkat mengenai kemampuan/kelayakan yang direkomendasikan.

Rekomendasi ini diberikan untuk keperluan [tujuan].

[Tempat], [Tanggal]

[Nama Pemberi Rekomendasi]
[Jabatan]`,
    },
    'Surat Permohonan': {
        subject: 'Permohonan [jenis permohonan] kepada [penerima]',
        content: `Dengan hormat,

Kami bermaksud mengajukan permohonan [uraian permohonan] kepada [penerima] dengan rincian sebagai berikut:

[Rincian permohonan]

Demikian permohonan ini kami sampaikan. Atas perhatian dan kebijaksanaan Saudara, kami ucapkan terima kasih.

[Tempat], [Tanggal]

[Nama Pemohon]
[Jabatan]`,
    },
    'Surat Kontrak': {
        subject: 'Surat Perjanjian / Kontrak antara [pihak A] dan [pihak B]',
        content: `Pada hari ini [Hari, Tanggal], yang bertanda tangan di bawah ini:

Pihak Pertama  : [Nama / Perusahaan A]
Pihak Kedua    : [Nama / Perusahaan B]

Kedua belah pihak sepakat untuk mengadakan perjanjian dengan ketentuan sebagai berikut:
1. [Ruang lingkup kerja]
2. [Harga dan pembayaran]
3. [Jangka waktu]
4. [Ketentuan lain]

Demikian perjanjian ini dibuat dalam rangkap 2 dan mempunyai kekuatan hukum yang sama.

[Tempat], [Tanggal]

[Nama Pihak Pertama]
[Nama Pihak Kedua]`,
    },
};

export default function LettersIndex({ letters, search: initialSearch }: { letters: any[], search?: string }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
        });
        setIsCreateModalOpen(true);
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
                    <Button onClick={openCreateModal}>
                        <Plus className="mr-2 h-4 w-4" /> Create Letter
                    </Button>
                </div>

                <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
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
                                                            <a href={`/letters/${letter.id}/preview`} target="_blank" rel="noreferrer" className="cursor-pointer flex items-center">
                                                                <Eye className="mr-2 h-4 w-4" /> Preview PDF
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
                                <Select value={data.type} onValueChange={handleTypeChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih jenis surat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Surat Keputusan">Surat Keputusan</SelectItem>
                                        <SelectItem value="Surat Tugas">Surat Tugas</SelectItem>
                                        <SelectItem value="Surat Keterangan">Surat Keterangan</SelectItem>
                                        <SelectItem value="Surat Penawaran">Surat Penawaran</SelectItem>
                                        <SelectItem value="Surat Peringatan">Surat Peringatan</SelectItem>
                                        <SelectItem value="Surat Undangan">Surat Undangan</SelectItem>
                                        <SelectItem value="Surat Izin">Surat Izin</SelectItem>
                                        <SelectItem value="Surat Keterangan Kerja">Surat Keterangan Kerja</SelectItem>
                                        <SelectItem value="Surat Pengantar">Surat Pengantar</SelectItem>
                                        <SelectItem value="Surat Pemberitahuan">Surat Pemberitahuan</SelectItem>
                                        <SelectItem value="Surat Rekomendasi">Surat Rekomendasi</SelectItem>
                                        <SelectItem value="Surat Permohonan">Surat Permohonan</SelectItem>
                                        <SelectItem value="Surat Kontrak">Surat Kontrak</SelectItem>
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
                                <Select value={data.type} onValueChange={handleTypeChange}>
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

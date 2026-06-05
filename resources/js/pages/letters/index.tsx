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
        content: `KEPUTUSAN MANAJEMEN / MANAGEMENT DECREE

Tentang: [Perihal/Topik Keputusan]

Mempertimbangkan:
Bahwa dalam rangka [alasan/tujuan/project], manajemen perlu menetapkan keputusan ini.

MEMUTUSKAN:

1. [Keputusan utama yang diambil]
2. [Ketentuan operasional tambahan]
3. [Hal-hal lain yang terkait]

Keputusan ini mulai berlaku secara efektif sejak tanggal ditetapkan.

[Tempat], [Tanggal]

[Nama Direktur/Manager]
[Posisi/Role]`,
    },
    'Surat Tugas': {
        subject: 'Assignment Letter untuk [nama/tujuan]',
        content: `SURAT TUGAS / ASSIGNMENT LETTER

Project / Klien: [Nama Project atau Klien]
Referensi      : [Kontrak/Brief/Dokumen pendukung]

Kami menugaskan kepada tim berikut:
Nama         : [Nama Anggota Tim]
Posisi/Role  : [Posisi]

Untuk menangani ruang lingkup pekerjaan (Scope of Work):
[Uraian tugas / deliverables yang harus diselesaikan]

Timeline Pelaksanaan:
Mulai        : [Tanggal Mulai]
Selesai      : [Tanggal Selesai]
Lokasi       : [Studio/On-site/Remote]

Semua pengeluaran operasional terkait project ini ditanggung oleh [Sumber Anggaran].

Demikian assignment ini diberikan untuk dijalankan secara profesional.

[Tempat], [Tanggal]

[Nama Penugas]
[Posisi Penugas]`,
    },
    'Surat Keterangan': {
        subject: 'Keterangan tentang [isi perihal]',
        content: `SURAT KETERANGAN / TO WHOM IT MAY CONCERN

Yang bertanda tangan di bawah ini:
Nama         : [Nama Pemberi Keterangan]
Posisi       : [Posisi/Role]
Perusahaan   : [Nama Creative Agency]

Dengan ini menerangkan bahwa:
Nama         : [Nama Pihak/Tim]
[Identitas/Info Lain]: [Data]

Adalah benar [uraian keterangan/status saat ini, misalnya: bagian dari tim kami untuk project X].

Keterangan ini diberikan sebagai dukungan untuk keperluan [tujuan penggunaan, misalnya administrasi/izin lokasi].

Demikian surat ini dibuat dengan sebenarnya.

[Tempat], [Tanggal]

[Nama Pemberi Keterangan]
[Posisi]`,
    },
    'Surat Penawaran': {
        subject: 'Commercial Proposal untuk [Nama Klien]',
        content: `PROPOSAL PENAWARAN KERJA SAMA / COMMERCIAL PROPOSAL

Kepada Yth.
[Nama Klien/Penerima]
[Posisi Penerima]
[Perusahaan Klien]

Halo [Nama Klien],

Terima kasih atas ketertarikan Anda terhadap layanan kami. Bersama ini kami lampirkan penawaran kerja sama (Commercial Proposal) untuk kebutuhan [Nama Project/Campaign]:

1. Scope of Work (Ruang Lingkup):
   - [Deliverable 1]
   - [Deliverable 2]

2. Timeline / Jadwal Pelaksanaan:
   [Estimasi timeline pengerjaan]

3. Investment / Estimasi Biaya:
   [Rincian harga / paket penawaran]

4. Term of Payment (Syarat Pembayaran):
   [Metode dan termin pembayaran, misal DP 50%]

Proposal ini valid hingga [Tanggal Berlaku].

Jika ada penyesuaian terkait scope atau budget, mari kita jadwalkan sesi diskusi (brainstorming) lebih lanjut.

Terima kasih atas kepercayaan Anda. 

Warm regards,

[Tempat], [Tanggal]

[Nama Penanda Tangan]
[Posisi]`,
    },
    'Surat Peringatan': {
        subject: 'Surat Peringatan / Warning Letter untuk [Nama Penerima]',
        content: `SURAT PERINGATAN (WARNING LETTER)

Kepada:
Nama      : [Nama Penerima]
Posisi    : [Posisi/Role]

Berdasarkan evaluasi kinerja dan operasional terbaru, kami menemukan adanya hal yang tidak sejalan dengan standar profesional perusahaan (SOP), yaitu:

[Jelaskan ketidaksesuaian/pelanggaran, misal: keterlambatan deliverable project X, dsb.]

Hal ini sangat memengaruhi kelancaran alur kerja tim dan klien. Oleh karena itu, surat ini diterbitkan sebagai:
[ ] Peringatan Pertama (SP1)
[ ] Peringatan Kedua (SP2)
[ ] Peringatan Ketiga (SP3)

Kami sangat menghargai kontribusi Anda selama ini, namun perbaikan yang signifikan diharapkan dalam waktu [jumlah hari] hari ke depan. 

Jika memerlukan dukungan atau sesi 1-on-1, pintu manajemen selalu terbuka. Apabila tidak ada perbaikan, manajemen akan mengambil langkah sesuai kebijakan perusahaan.

[Tempat], [Tanggal]

[Nama HR/Manajemen]
[Posisi]`,
    },
    'Surat Undangan': {
        subject: 'Invitation: Meeting/Event [Acara]',
        content: `UNDANGAN / INVITATION

Kepada Yth.
[Nama Klien/Penerima]
[Posisi/Perusahaan]

Halo [Nama Penerima],

Kami ingin mengundang Bapak/Ibu/Rekan-rekan untuk berdiskusi lebih lanjut mengenai [Topik Meeting / Project Kick-off / Pitching] yang akan diselenggarakan pada:

Hari/Tanggal : [Hari, Tanggal]
Waktu        : [Jam]
Platform     : [Zoom / Google Meet / Offline Location]
Link/Alamat  : [Tautan atau Alamat]

Agenda utama yang akan kita bahas:
- [Agenda 1]
- [Agenda 2]

Mohon konfirmasi kehadirannya. Jika ada pertanyaan lebih lanjut, silakan balas pesan ini.

Terima kasih dan sampai jumpa!

[Tempat], [Tanggal]

[Nama Pengundang]
[Posisi]`,
    },
    'Surat Izin': {
        subject: 'Permohonan Izin / Leave Request: [Nama Karyawan]',
        content: `FORM PERMOHONAN IZIN (LEAVE REQUEST)

Yang bertanda tangan di bawah ini:
Nama      : [Nama Karyawan]
Posisi    : [Posisi/Role]
Divisi    : [Nama Divisi/Departemen]

Dengan ini mengajukan permohonan izin / cuti untuk keperluan [alasan izin, misal: urusan keluarga, sakit, dsb.] pada:

Mulai Tanggal   : [Tanggal Mulai]
Selesai Tanggal : [Tanggal Selesai]
Total Hari      : [Jumlah Hari]

Pekerjaan / project yang sedang berjalan ([Nama Project]) telah dikoordinasikan dengan [Nama Rekan/Back-up] selama masa izin ini.

Demikian permohonan ini saya ajukan untuk dapat disetujui.

[Tempat], [Tanggal]

[Nama Karyawan]
[Posisi]`,
    },
    'Surat Keterangan Kerja': {
        subject: 'Certificate of Employment untuk [Nama Karyawan]',
        content: `CERTIFICATE OF EMPLOYMENT (SURAT KETERANGAN KERJA)

Hal: Surat Keterangan Pengalaman Kerja

Kami yang bertanda tangan di bawah ini, mewakili manajemen [Nama Agency/Perusahaan], menerangkan bahwa:

Nama      : [Nama Karyawan]
Posisi    : [Posisi Terakhir]
Periode   : [Tanggal Masuk] s.d. [Tanggal Keluar/Saat Ini]

Selama bergabung bersama agensi kami, yang bersangkutan telah menunjukkan kinerja dan kreativitas yang baik dalam menangani berbagai project dan campaign klien.

Surat keterangan ini diberikan atas permintaan yang bersangkutan untuk dipergunakan semestinya (misalnya keperluan administratif atau melamar pekerjaan baru).

Kami mengucapkan terima kasih atas dedikasi yang diberikan dan mendoakan kesuksesan di masa depan.

[Tempat], [Tanggal]

[Nama HR/Manajemen]
[Posisi]`,
    },
    'Surat Pengantar': {
        subject: 'Transmittal / Pengantar [Perihal]',
        content: `SURAT PENGANTAR (COVER LETTER / TRANSMITTAL)

Kepada Yth.
[Nama Klien/Penerima]
[Posisi/Perusahaan]

Halo [Nama Penerima],

Bersama surat ini, kami mengirimkan beberapa dokumen/deliverables terkait [Nama Project/Campaign] untuk dapat direview/diproses lebih lanjut:

1. [Nama Dokumen/File 1] (Jumlah: [Qty])
2. [Nama Dokumen/File 2] (Jumlah: [Qty])

Mohon bantuan Anda untuk memeriksa kelengkapan materi tersebut. Jika ada revisi atau feedback, silakan hubungi tim kami.

Terima kasih atas kerja samanya!

[Tempat], [Tanggal]

[Nama Pengirim]
[Posisi]`,
    },
    'Surat Pemberitahuan': {
        subject: 'Announcement: [Topik Pemberitahuan]',
        content: `PEMBERITAHUAN / ANNOUNCEMENT

Kepada:
[Seluruh Tim / Klien / Vendor]

Halo semuanya,

Melalui memo ini, manajemen bermaksud menginformasikan mengenai [Topik Pemberitahuan, misal: Libur Nasional / Perubahan Jam Operasional Studio / dsb.]:

[Detail Informasi secara jelas dan ringkas]

Ketentuan ini akan mulai diberlakukan pada tanggal [Tanggal Efektif]. 

Jika ada pertanyaan atau butuh penyesuaian jadwal project, mohon hubungi Project Manager masing-masing.

Terima kasih atas perhatiannya.

[Tempat], [Tanggal]

[Nama Manajemen/Pengirim]
[Posisi]`,
    },
    'Surat Rekomendasi': {
        subject: 'Letter of Recommendation untuk [Nama]',
        content: `SURAT REKOMENDASI (LETTER OF RECOMMENDATION)

To Whom It May Concern,

Surat ini ditulis untuk merekomendasikan:

Nama      : [Nama Karyawan/Freelancer]
Posisi    : [Posisi/Role saat di agensi]

Selama masa kerjanya, yang bersangkutan telah berpartisipasi dalam banyak project kreatif dan menunjukkan kemampuan analisis, eksekusi, serta kolaborasi tim yang luar biasa. 

Skill utama yang kami highlight dari yang bersangkutan:
- [Skill 1, misal: Art Direction yang kuat]
- [Skill 2, misal: Mampu bekerja dalam tight deadline]

Kami sangat merekomendasikan yang bersangkutan untuk peluang karier selanjutnya.

[Tempat], [Tanggal]

[Nama Pemberi Rekomendasi]
[Posisi / Hubungan dengan kandidat]`,
    },
    'Surat Permohonan': {
        subject: 'Request Letter: [Tujuan Permohonan]',
        content: `SURAT PERMOHONAN (REQUEST LETTER)

Kepada Yth.
[Nama Penerima/Instansi/Klien]
[Alamat/Lokasi]

Dengan hormat,

Kami dari [Nama Agency] bermaksud mengajukan permohonan [Tujuan Permohonan, misal: Izin Lokasi Syuting / Penggunaan Footage] untuk keperluan project campaign [Nama Project].

Rincian kebutuhan/kegiatan adalah sebagai berikut:
Hari/Tanggal : [Tanggal]
Waktu        : [Jam]
Kebutuhan    : [Detail kebutuhan/aktivitas]
Jumlah Tim   : [Jumlah orang yang akan hadir]

Kami berkomitmen untuk menjaga ketertiban dan mematuhi seluruh peraturan yang berlaku selama proses tersebut. 

Atas perhatian dan kerja sama yang baik, kami ucapkan terima kasih.

[Tempat], [Tanggal]

[Nama Pemohon]
[Posisi]`,
    },
    'Surat Kontrak': {
        subject: 'Agreement / Kontrak Kerja Sama: [Nama Project]',
        content: `AGREEMENT / KONTRAK KERJA SAMA

Pada hari ini [Hari, Tanggal], kami yang bertanda tangan di bawah ini sepakat untuk menjalin kerja sama:

Pihak Pertama (Agency) : [Nama Agency / Perwakilan]
Pihak Kedua (Klien/Vendor) : [Nama Klien / Vendor]

Kedua belah pihak menyetujui ketentuan kerja sama (SOW/SLA) sebagai berikut:

1. Ruang Lingkup (Scope of Work):
   [Detail pekerjaan/deliverables yang disepakati]

2. Nilai Kontrak & Termin Pembayaran:
   [Nominal Total]
   [Termin Pembayaran, misal: DP 50%, Pelunasan 50% setelah final handover]

3. Timeline Pekerjaan:
   [Jadwal mulai hingga selesai]

4. Revisi & Feedback:
   [Batas maksimal revisi, misal: Max 2 kali revisi minor]

5. Hak Cipta (Intellectual Property):
   [Kepemilikan aset akhir setelah pelunasan]

Demikian perjanjian ini dibuat secara sadar dan mengikat kedua belah pihak.

[Tempat], [Tanggal]

Pihak Pertama (Agency)                   Pihak Kedua (Klien/Vendor)

(____________________)                   (____________________)`,
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
                                        {Object.keys(LETTER_TEMPLATES).map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
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
                                        {Object.keys(LETTER_TEMPLATES).map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
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

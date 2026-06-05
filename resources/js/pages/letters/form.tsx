import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const LETTER_TEMPLATES: Record<string, { subject: string; content: string }> = {
    'Surat Keputusan': {
        subject: 'Keputusan tentang [isi perihal]',
        content: `KEPUTUSAN MANAJEMEN / MANAGEMENT DECREE\n\nTentang: [Perihal/Topik Keputusan]\n\nMempertimbangkan:\nBahwa dalam rangka [alasan/tujuan/project], manajemen perlu menetapkan keputusan ini.\n\nMEMUTUSKAN:\n\n1. [Keputusan utama yang diambil]\n2. [Ketentuan operasional tambahan]\n3. [Hal-hal lain yang terkait]\n\nKeputusan ini mulai berlaku secara efektif sejak tanggal ditetapkan.\n\n[Tempat], [Tanggal]\n\n[Nama Direktur/Manager]\n[Posisi/Role]`,
    },
    'Surat Tugas': {
        subject: 'Assignment Letter untuk [nama/tujuan]',
        content: `SURAT TUGAS / ASSIGNMENT LETTER\n\nProject / Klien: [Nama Project atau Klien]\nReferensi      : [Kontrak/Brief/Dokumen pendukung]\n\nKami menugaskan kepada tim berikut:\nNama         : [Nama Anggota Tim]\nPosisi/Role  : [Posisi]\n\nUntuk menangani ruang lingkup pekerjaan (Scope of Work):\n[Uraian tugas / deliverables yang harus diselesaikan]\n\nTimeline Pelaksanaan:\nMulai        : [Tanggal Mulai]\nSelesai      : [Tanggal Selesai]\nLokasi       : [Studio/On-site/Remote]\n\nSemua pengeluaran operasional terkait project ini ditanggung oleh [Sumber Anggaran].\n\nDemikian assignment ini diberikan untuk dijalankan secara profesional.\n\n[Tempat], [Tanggal]\n\n[Nama Penugas]\n[Posisi Penugas]`,
    },
    // keep basic templates; additional templates available in index page
};

export default function LetterForm({ letter }: { letter: any }) {
    const isEdit = Boolean(letter);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        type: letter?.type ?? 'Surat Keputusan',
        letter_date: letter?.letter_date ? letter.letter_date.split('T')[0] : new Date().toISOString().split('T')[0],
        sifat: letter?.sifat ?? 'Biasa',
        recipient: letter?.recipient ?? '',
        subject: letter?.subject ?? '',
        content: letter?.content ?? '',
        status: letter?.status ?? 'Draft',
    });

    useEffect(() => {
        if (letter) {
            setData({
                type: letter.type,
                letter_date: letter.letter_date ? letter.letter_date.split('T')[0] : new Date().toISOString().split('T')[0],
                sifat: letter.sifat ?? 'Biasa',
                recipient: letter.recipient ?? '',
                subject: letter.subject ?? '',
                content: letter.content ?? '',
                status: letter.status ?? 'Draft',
            });
        }
    }, [letter]);

    const handleTypeChange = (newType: string) => {
        setData('type', newType);
        const template = LETTER_TEMPLATES[newType as keyof typeof LETTER_TEMPLATES];
        if (template) {
            setData('subject', template.subject);
            setData('content', template.content);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/letters/${letter.id}`);
        } else {
            post('/letters');
        }
    };

    return (
        <>
            <Head title={isEdit ? `Edit ${letter.reference_number}` : 'Create Letter'} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/letters">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-2xl font-bold">{isEdit ? `Edit ${letter.reference_number}` : 'Create Letter'}</h2>
                            <p className="text-muted-foreground">Use this page to freely edit letter data.</p>
                        </div>
                    </div>
                    <div>
                        <Button onClick={() => window.print()} variant="ghost">Print</Button>
                    </div>
                </div>

                <form onSubmit={submit} className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Jenis Surat</Label>
                                <Select value={data.type} onValueChange={handleTypeChange}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(LETTER_TEMPLATES).map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Tanggal Surat</Label>
                                <Input type="date" value={data.letter_date} onChange={e => setData('letter_date', e.target.value)} />
                            </div>
                            <div>
                                <Label>Sifat</Label>
                                <Select value={data.sifat} onValueChange={(v) => setData('sifat', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Biasa">Biasa</SelectItem>
                                        <SelectItem value="Penting">Penting</SelectItem>
                                        <SelectItem value="Segera">Segera</SelectItem>
                                        <SelectItem value="Sangat Segera">Sangat Segera</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Recipient</Label>
                                <Input value={data.recipient} onChange={e => setData('recipient', e.target.value)} />
                            </div>
                            <div className="col-span-2">
                                <Label>Subject</Label>
                                <Input value={data.subject} onChange={e => setData('subject', e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <Label>Content</Label>
                            <Textarea className="min-h-[320px] font-serif" value={data.content} onChange={e => setData('content', e.target.value)} />
                        </div>

                        <div className="flex items-center gap-3">
                            <Button type="submit" disabled={processing}>{isEdit ? 'Update Letter' : 'Create Letter'}</Button>
                            <Button variant="outline" onClick={() => {
                                reset();
                            }}>Reset</Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-lg border p-4">
                            <Label>Preview</Label>
                            <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap font-serif mt-2">
                                {data.content}
                            </div>
                        </div>

                        <div className="rounded-lg border p-4">
                            <Label>Options</Label>
                            <div className="mt-2 grid gap-2">
                                <Select value={data.status} onValueChange={v => setData('status', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Draft">Draft</SelectItem>
                                        <SelectItem value="Final">Final</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

LetterForm.layout = {
    breadcrumbs: [
        { title: 'Letters', href: '/letters' },
        { title: 'Form', href: '#' },
    ],
};

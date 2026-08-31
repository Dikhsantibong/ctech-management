import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import LetterEditor from '@/components/letter-editor';
import LetterPageSettings from '@/components/letter-page-settings';
import { LETTER_TEMPLATES } from '@/lib/letter-templates';
import { useEffect } from 'react';

const DEFAULT_PAGE_SETTINGS = {
    margin_top: 14,
    margin_right: 20,
    margin_bottom: 18,
    margin_left: 20,
    line_spacing: '1.5',
};

export default function LetterForm({ letter }: { letter: any | null }) {
    const isEdit = !!letter;

    const { data, setData, post, put, processing, errors } = useForm({
        type: letter?.type || 'Surat Keputusan',
        letter_date: letter?.letter_date ? letter.letter_date.split('T')[0] : new Date().toISOString().split('T')[0],
        sifat: letter?.sifat || 'Biasa',
        recipient: letter?.recipient || '',
        subject: letter?.subject || '',
        content: letter?.content || '',
        status: letter?.status || 'Draft',
        margin_top: letter?.margin_top ?? DEFAULT_PAGE_SETTINGS.margin_top,
        margin_right: letter?.margin_right ?? DEFAULT_PAGE_SETTINGS.margin_right,
        margin_bottom: letter?.margin_bottom ?? DEFAULT_PAGE_SETTINGS.margin_bottom,
        margin_left: letter?.margin_left ?? DEFAULT_PAGE_SETTINGS.margin_left,
        line_spacing: letter?.line_spacing ?? DEFAULT_PAGE_SETTINGS.line_spacing,
    });

    const handleTypeChange = (newType: string) => {
        setData('type', newType);
        if (!isEdit) {
            const template = LETTER_TEMPLATES[newType as keyof typeof LETTER_TEMPLATES];
            if (template) {
                setData('subject', template.subject);
                setData('content', template.content);
            }
        }
    };

    useEffect(() => {
        if (!isEdit && !data.subject && !data.content) {
            const template = LETTER_TEMPLATES[data.type as keyof typeof LETTER_TEMPLATES];
            if (template) {
                setData('subject', template.subject);
                setData('content', template.content);
            }
        }
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(/letters/ + letter.id);
        } else {
            post('/letters');
        }
    };

    return (
        <>
            <Head title={isEdit ? "Edit Letter" : "Create Letter"} />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/letters">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{isEdit ? "Edit Letter" : "Create Official Letter"}</h2>
                        <p className="text-muted-foreground">
                            {isEdit ? "Update document details and content." : "Draft a new official document for the company."}
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Metadata Surat</CardTitle>
                                    <CardDescription>Informasi dasar dokumen.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
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
                                    <div className="space-y-2">
                                        <Label htmlFor="letter_date">Tanggal Surat</Label>
                                        <Input id="letter_date" type="date" value={data.letter_date} onChange={e => setData('letter_date', e.target.value)} required />
                                        {errors.letter_date && <p className="text-sm text-destructive">{errors.letter_date}</p>}
                                    </div>
                                    <div className="space-y-2">
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
                                    <div className="space-y-2">
                                        <Label htmlFor="recipient">Penerima</Label>
                                        <Input id="recipient" value={data.recipient} onChange={e => setData('recipient', e.target.value)} required />
                                        {errors.recipient && <p className="text-sm text-destructive">{errors.recipient}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
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
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Page Settings</CardTitle>
                                    <CardDescription>Pengaturan layout PDF surat.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <LetterPageSettings data={data} setData={setData} />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="md:col-span-2 space-y-6">
                            <Card className="h-full flex flex-col">
                                <CardHeader>
                                    <CardTitle>Isi Surat</CardTitle>
                                    <CardDescription>Kop surat, tanggal, penerima, dan tanda tangan otomatis ditambahkan pada PDF.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 flex-1 flex flex-col">
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Perihal</Label>
                                        <Input id="subject" value={data.subject} onChange={e => setData('subject', e.target.value)} required />
                                        {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
                                    </div>
                                    <div className="space-y-2 flex-1 flex flex-col">
                                        <Label htmlFor="content">Dokumen</Label>
                                        <LetterEditor value={data.content} onChange={(value) => setData('content', value)} className="flex-1 min-h-[500px]" />
                                        {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/letters">Batal</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {isEdit ? 'Simpan Perubahan' : 'Buat Surat'}
                                </Button>
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

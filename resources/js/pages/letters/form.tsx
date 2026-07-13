import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LetterEditor from '@/components/letter-editor';
import { LETTER_TEMPLATES } from '@/lib/letter-templates';

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

                        <div className="space-y-1">
                            <Label>Content</Label>
                            <p className="text-xs text-muted-foreground">Kop surat, tanggal, penerima, dan tanda tangan otomatis ditambahkan pada PDF — cukup tulis isi suratnya saja.</p>
                            <LetterEditor value={data.content} onChange={(value) => setData('content', value)} />
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
                            <div
                                className="prose prose-sm max-w-none dark:prose-invert font-serif mt-2"
                                dangerouslySetInnerHTML={{ __html: data.content }}
                            />
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

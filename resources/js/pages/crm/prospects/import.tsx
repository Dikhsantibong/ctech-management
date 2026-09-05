import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Download, Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, Copy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Preview {
    valid: { row_number: number; payload: any }[];
    duplicates: { row_number: number; payload: any; match_type: string; match_reason: string; existing_prospect_id: number | null; existing_client_id: number | null }[];
    errors: { row_number: number; company: string; column: string; reason: string }[];
    summary: { total: number; valid: number; duplicates: number; errors: number };
}

export default function ProspectImport({ preview }: { preview: Preview | null }) {
    const { data, setData, post, processing, errors } = useForm<{ file: File | null }>({ file: null });
    const [dupActions, setDupActions] = useState<Record<number, string>>({});
    const [importing, setImporting] = useState(false);

    const submitFile = (e: React.FormEvent) => {
        e.preventDefault();
        post('/crm/prospek/import/preview', { forceFormData: true });
    };

    const runImport = () => {
        if (!preview) return;
        const rows = [
            ...preview.valid.map((v) => ({ payload: v.payload, action: 'create' as const })),
            ...preview.duplicates.map((d, i) => {
                const choice = dupActions[i] ?? 'skip';
                if (choice === 'update' && d.existing_prospect_id) {
                    return { payload: d.payload, action: 'update' as const, existing_prospect_id: d.existing_prospect_id };
                }
                if (choice === 'use_existing') {
                    return { payload: d.payload, action: 'create' as const, existing_client_id: d.existing_client_id };
                }
                return { payload: d.payload, action: 'skip' as const };
            }),
        ];
        setImporting(true);
        router.post('/crm/prospek/import', { rows }, { onFinish: () => setImporting(false) });
    };

    const downloadErrorReport = () => {
        if (!preview?.errors.length) return;
        const header = 'Baris,Perusahaan,Kolom,Alasan\n';
        const body = preview.errors.map((e) => `${e.row_number},"${e.company}","${e.column}","${e.reason}"`).join('\n');
        const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'error-report-import-prospek.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <Head title="Import Prospek" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-3">
                    <Link href="/crm/prospek" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-5 w-5" /></Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Import Prospek dari Excel</h2>
                        <p className="text-muted-foreground">Unggah → validasi → cek duplikat → preview → konfirmasi.</p>
                    </div>
                </div>

                {/* Step 1: template + upload */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border bg-card p-5">
                        <div className="flex items-center gap-2"><FileSpreadsheet className="h-5 w-5 text-primary" /><h3 className="font-semibold">1. Unduh Template</h3></div>
                        <p className="mt-1 text-sm text-muted-foreground">Template berisi sheet Prospek, Petunjuk Pengisian, dan Referensi (Sales dari data user).</p>
                        <Button variant="outline" className="mt-4" asChild>
                            <a href="/crm/prospek/import/template"><Download className="mr-2 h-4 w-4" /> Download Template Excel</a>
                        </Button>
                    </div>

                    <div className="rounded-lg border bg-card p-5">
                        <div className="flex items-center gap-2"><Upload className="h-5 w-5 text-primary" /><h3 className="font-semibold">2. Unggah File</h3></div>
                        <form onSubmit={submitFile} className="mt-3 space-y-3">
                            <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-input file:bg-background file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-muted"
                            />
                            {errors.file && <p className="text-sm text-destructive">{errors.file}</p>}
                            <Button type="submit" disabled={!data.file || processing}>{processing ? 'Memproses...' : 'Validasi & Preview'}</Button>
                        </form>
                    </div>
                </div>

                {/* Step 3: preview */}
                {preview && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <SummaryCard tone="success" icon={CheckCircle2} label="Data Valid" value={preview.summary.valid} />
                            <SummaryCard tone="warning" icon={Copy} label="Duplikat" value={preview.summary.duplicates} />
                            <SummaryCard tone="danger" icon={AlertTriangle} label="Error" value={preview.summary.errors} />
                        </div>

                        {/* Errors */}
                        {preview.errors.length > 0 && (
                            <div className="rounded-lg border bg-card">
                                <div className="flex items-center justify-between border-b p-4">
                                    <h3 className="font-semibold text-rose-600">Data Error</h3>
                                    <Button variant="outline" size="sm" onClick={downloadErrorReport}><Download className="mr-1.5 h-4 w-4" /> Download Error Report</Button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead><tr className="border-b text-muted-foreground">
                                            <th className="px-4 py-2 text-left font-medium">Baris</th>
                                            <th className="px-4 py-2 text-left font-medium">Perusahaan</th>
                                            <th className="px-4 py-2 text-left font-medium">Kolom</th>
                                            <th className="px-4 py-2 text-left font-medium">Alasan</th>
                                        </tr></thead>
                                        <tbody>
                                            {preview.errors.map((e, i) => (
                                                <tr key={i} className="border-b last:border-0">
                                                    <td className="px-4 py-2">{e.row_number}</td>
                                                    <td className="px-4 py-2">{e.company}</td>
                                                    <td className="px-4 py-2"><Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700">{e.column}</Badge></td>
                                                    <td className="px-4 py-2 text-muted-foreground">{e.reason}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Duplicates */}
                        {preview.duplicates.length > 0 && (
                            <div className="rounded-lg border bg-card">
                                <div className="border-b p-4"><h3 className="font-semibold text-amber-600">Data Duplikat</h3>
                                    <p className="text-sm text-muted-foreground">Pilih tindakan untuk tiap data yang kemungkinan sudah ada.</p></div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead><tr className="border-b text-muted-foreground">
                                            <th className="px-4 py-2 text-left font-medium">Baris</th>
                                            <th className="px-4 py-2 text-left font-medium">Perusahaan</th>
                                            <th className="px-4 py-2 text-left font-medium">Kecocokan</th>
                                            <th className="px-4 py-2 text-left font-medium">Tindakan</th>
                                        </tr></thead>
                                        <tbody>
                                            {preview.duplicates.map((d, i) => (
                                                <tr key={i} className="border-b last:border-0">
                                                    <td className="px-4 py-2">{d.row_number}</td>
                                                    <td className="px-4 py-2 font-medium">{d.payload.company_name}</td>
                                                    <td className="px-4 py-2 text-muted-foreground">{d.match_reason}</td>
                                                    <td className="px-4 py-2">
                                                        <Select value={dupActions[i] ?? 'skip'} onValueChange={(v) => setDupActions((s) => ({ ...s, [i]: v }))}>
                                                            <SelectTrigger size="sm" className="w-44"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="skip">Lewati</SelectItem>
                                                                {d.match_type === 'prospect' && <SelectItem value="update">Perbarui data existing</SelectItem>}
                                                                {d.match_type === 'client' && <SelectItem value="use_existing">Gunakan Customer existing</SelectItem>}
                                                            </SelectContent>
                                                        </Select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Valid preview */}
                        {preview.valid.length > 0 && (
                            <div className="rounded-lg border bg-card">
                                <div className="border-b p-4"><h3 className="font-semibold text-emerald-600">Data Valid ({preview.valid.length})</h3></div>
                                <div className="max-h-80 overflow-auto">
                                    <table className="w-full text-sm">
                                        <thead><tr className="border-b text-muted-foreground">
                                            <th className="px-4 py-2 text-left font-medium">Perusahaan</th>
                                            <th className="px-4 py-2 text-left font-medium">PIC</th>
                                            <th className="px-4 py-2 text-left font-medium">Industri</th>
                                            <th className="px-4 py-2 text-left font-medium">Kota</th>
                                            <th className="px-4 py-2 text-left font-medium">Prioritas</th>
                                        </tr></thead>
                                        <tbody>
                                            {preview.valid.map((v, i) => (
                                                <tr key={i} className="border-b last:border-0">
                                                    <td className="px-4 py-2 font-medium">{v.payload.company_name}</td>
                                                    <td className="px-4 py-2">{v.payload.pic_name ?? '-'}</td>
                                                    <td className="px-4 py-2">{v.payload.industry ?? '-'}</td>
                                                    <td className="px-4 py-2">{v.payload.city ?? '-'}</td>
                                                    <td className="px-4 py-2">{v.payload.priority}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Confirm */}
                        <div className="flex items-center justify-between rounded-lg border bg-card p-4">
                            <Button variant="outline" asChild><Link href="/crm/prospek/import"><RotateCcw className="mr-2 h-4 w-4" /> Unggah Ulang</Link></Button>
                            <Button onClick={runImport} disabled={importing || (preview.summary.valid === 0 && preview.summary.duplicates === 0)}>
                                {importing ? 'Mengimport...' : 'Konfirmasi & Import'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function SummaryCard({ tone, icon: Icon, label, value }: { tone: 'success' | 'warning' | 'danger'; icon: any; label: string; value: number }) {
    const tones = {
        success: 'text-emerald-600',
        warning: 'text-amber-600',
        danger: 'text-rose-600',
    };
    return (
        <div className="rounded-lg border bg-card p-5">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
                <Icon className={`h-4 w-4 ${tones[tone]}`} />
            </div>
            <div className={`mt-2 text-2xl font-semibold ${tones[tone]}`}>{value}</div>
        </div>
    );
}

ProspectImport.layout = {
    breadcrumbs: [{ title: 'CRM', href: '/crm' }, { title: 'Prospek', href: '/crm/prospek' }, { title: 'Import', href: '/crm/prospek/import' }],
};

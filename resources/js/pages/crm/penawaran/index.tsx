import { Head, Link } from '@inertiajs/react';
import { Plus, FileText, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/crm';

export default function CrmPenawaranIndex({ quotations, canCreateQuotation }: { quotations: any[]; canCreateQuotation: boolean }) {
    return (
        <>
            <Head title="Penawaran" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Penawaran</h2>
                        <p className="text-muted-foreground">Penawaran (RAB) yang terhubung dengan proses penjualan CRM.</p>
                    </div>
                    {canCreateQuotation && (
                        <Button asChild><Link href="/quotations/create"><Plus className="mr-2 h-4 w-4" /> Buat Penawaran</Link></Button>
                    )}
                </div>

                <div className="overflow-x-auto rounded-lg border bg-card">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-muted-foreground">
                                <th className="px-4 py-2.5 text-left font-medium">Nomor</th>
                                <th className="px-4 py-2.5 text-left font-medium">Prospek / Klien</th>
                                <th className="px-4 py-2.5 text-left font-medium">Subjek</th>
                                <th className="px-4 py-2.5 text-left font-medium">Tanggal</th>
                                <th className="px-4 py-2.5 text-right font-medium">Nilai</th>
                                <th className="px-4 py-2.5 text-left font-medium">Status</th>
                                <th className="px-4 py-2.5 text-right font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotations.map((q) => (
                                <tr key={q.id} className="border-b last:border-0 hover:bg-muted/50">
                                    <td className="whitespace-nowrap px-4 py-2.5 font-medium">{q.quotation_number}</td>
                                    <td className="px-4 py-2.5">
                                        {q.prospect ? (
                                            <Link href={`/crm/prospek/${q.prospect.id}`} className="hover:underline">{q.prospect.company_name}</Link>
                                        ) : (
                                            <span>{q.client_name}</span>
                                        )}
                                    </td>
                                    <td className="max-w-[240px] truncate px-4 py-2.5" title={q.subject}>{q.subject}</td>
                                    <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">{formatDate(q.quotation_date)}</td>
                                    <td className="whitespace-nowrap px-4 py-2.5 text-right font-medium">{formatCurrency(q.total)}</td>
                                    <td className="px-4 py-2.5"><Badge variant="outline">{q.status}</Badge></td>
                                    <td className="whitespace-nowrap px-4 py-2.5 text-right">
                                        <Button variant="ghost" size="sm" asChild><Link href={`/quotations/${q.id}`}><ExternalLink className="h-4 w-4" /></Link></Button>
                                    </td>
                                </tr>
                            ))}
                            {quotations.length === 0 && (
                                <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                                    <FileText className="mx-auto mb-2 h-6 w-6 opacity-50" />
                                    Belum ada penawaran. Buat dari halaman detail prospek.
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

CrmPenawaranIndex.layout = {
    breadcrumbs: [{ title: 'CRM', href: '/crm' }, { title: 'Penawaran', href: '/crm/penawaran' }],
};

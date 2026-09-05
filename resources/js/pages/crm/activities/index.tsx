import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle2, CalendarClock, CalendarCheck, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDateTime, activityStatusColor } from '@/lib/crm';

function ActivityTable({ items, emptyLabel }: { items: any[]; emptyLabel: string }) {
    const complete = (id: number) => router.put(`/crm/aktivitas/${id}/selesai`, {}, { preserveScroll: true });

    return (
        <div className="overflow-x-auto rounded-lg border bg-card">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b text-muted-foreground">
                        <th className="px-4 py-2.5 text-left font-medium">Aktivitas</th>
                        <th className="px-4 py-2.5 text-left font-medium">Waktu</th>
                        <th className="px-4 py-2.5 text-left font-medium">Perusahaan</th>
                        <th className="px-4 py-2.5 text-left font-medium">PIC</th>
                        <th className="px-4 py-2.5 text-left font-medium">Sales</th>
                        <th className="px-4 py-2.5 text-left font-medium">Status</th>
                        <th className="px-4 py-2.5 text-right font-medium">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((a) => (
                        <tr key={a.id} className="border-b last:border-0 hover:bg-muted/50">
                            <td className="px-4 py-2.5">
                                <span className="font-medium">{a.type}</span>
                                <div className="text-xs text-muted-foreground">{a.subject}</div>
                            </td>
                            <td className="px-4 py-2.5 text-muted-foreground">{formatDateTime(a.scheduled_at)}</td>
                            <td className="px-4 py-2.5">
                                <Link href={`/crm/prospek/${a.prospect?.id}`} className="font-medium hover:underline">{a.prospect?.company_name ?? '-'}</Link>
                            </td>
                            <td className="px-4 py-2.5">{a.prospect?.pic_name ?? '-'}</td>
                            <td className="px-4 py-2.5">{a.user?.name ?? '-'}</td>
                            <td className="px-4 py-2.5"><Badge variant="outline" className={activityStatusColor(a.status)}>{a.status}</Badge></td>
                            <td className="px-4 py-2.5 text-right">
                                {a.status !== 'Selesai' && (
                                    <Button variant="ghost" size="sm" onClick={() => complete(a.id)}>
                                        <CheckCircle2 className="mr-1.5 h-4 w-4 text-emerald-600" /> Selesai
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {items.length === 0 && (
                        <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">{emptyLabel}</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default function ActivitiesIndex({ today, upcoming, overdue }: { today: any[]; upcoming: any[]; overdue: any[]; activityTypes: string[] }) {
    return (
        <>
            <Head title="Aktivitas" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Aktivitas</h2>
                    <p className="text-muted-foreground">Pusat pekerjaan sales: komunikasi, follow-up, dan tugas.</p>
                </div>

                <Tabs defaultValue="today">
                    <TabsList>
                        <TabsTrigger value="today"><CalendarCheck className="mr-1.5 h-4 w-4" /> Hari Ini ({today.length})</TabsTrigger>
                        <TabsTrigger value="upcoming"><CalendarClock className="mr-1.5 h-4 w-4" /> Terjadwal ({upcoming.length})</TabsTrigger>
                        <TabsTrigger value="overdue"><AlertTriangle className="mr-1.5 h-4 w-4" /> Terlambat ({overdue.length})</TabsTrigger>
                    </TabsList>
                    <TabsContent value="today" className="mt-4"><ActivityTable items={today} emptyLabel="Tidak ada aktivitas hari ini." /></TabsContent>
                    <TabsContent value="upcoming" className="mt-4"><ActivityTable items={upcoming} emptyLabel="Tidak ada aktivitas terjadwal." /></TabsContent>
                    <TabsContent value="overdue" className="mt-4"><ActivityTable items={overdue} emptyLabel="Tidak ada aktivitas terlambat." /></TabsContent>
                </Tabs>
            </div>
        </>
    );
}

ActivitiesIndex.layout = {
    breadcrumbs: [{ title: 'CRM', href: '/crm' }, { title: 'Aktivitas', href: '/crm/aktivitas' }],
};

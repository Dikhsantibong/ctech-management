import { Head, Link } from '@inertiajs/react';
import { Users, Activity, AlertTriangle, TrendingUp, FileSpreadsheet, CheckCircle2, XCircle, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCompactCurrency, formatDateTime, stageColor, activityStatusColor } from '@/lib/crm';

interface StageRow { stage: string; count: number; value: number }
interface Stats {
    total_prospects: number; active_prospects: number; today_activities: number; overdue_followups: number;
    active_pipeline: number; active_quotations: number; won: number; lost: number;
    pipeline_value: number; quotation_value: number; closing_value: number;
}

function StatCard({ label, value, icon: Icon, tone = 'default' }: { label: string; value: string | number; icon: any; tone?: 'default' | 'danger' | 'success' }) {
    const toneClass = tone === 'danger' ? 'text-rose-600' : tone === 'success' ? 'text-emerald-600' : 'text-foreground';
    return (
        <div className="rounded-lg border bg-card p-5">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className={`mt-2 text-2xl font-semibold ${toneClass}`}>{value}</div>
        </div>
    );
}

export default function CrmDashboard({ stats, pipeline, todayActivities, overdueFollowUps, sourceBreakdown }: {
    stats: Stats; pipeline: StageRow[]; todayActivities: any[]; overdueFollowUps: any[]; sourceBreakdown: { source: string; count: number }[];
}) {
    const maxSource = Math.max(1, ...sourceBreakdown.map((s) => s.count));

    return (
        <>
            <Head title="CRM Dashboard" />
            <div className="flex flex-1 flex-col gap-8 p-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">CRM Dashboard</h2>
                    <p className="text-muted-foreground">Pusat monitoring aktivitas dan pipeline penjualan.</p>
                </div>

                {/* Ringkasan */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    <StatCard label="Total Prospek" value={stats.total_prospects} icon={Users} />
                    <StatCard label="Prospek Aktif" value={stats.active_prospects} icon={TrendingUp} />
                    <StatCard label="Aktivitas Hari Ini" value={stats.today_activities} icon={Activity} />
                    <StatCard label="Follow-up Terlambat" value={stats.overdue_followups} icon={AlertTriangle} tone={stats.overdue_followups > 0 ? 'danger' : 'default'} />
                    <StatCard label="Pipeline Aktif" value={stats.active_pipeline} icon={TrendingUp} />
                    <StatCard label="Penawaran Aktif" value={stats.active_quotations} icon={FileSpreadsheet} />
                    <StatCard label="Berhasil" value={stats.won} icon={CheckCircle2} tone="success" />
                    <StatCard label="Tidak Berhasil" value={stats.lost} icon={XCircle} />
                    <StatCard label="Nilai Pipeline" value={formatCompactCurrency(stats.pipeline_value)} icon={Wallet} />
                    <StatCard label="Nilai Penawaran" value={formatCompactCurrency(stats.quotation_value)} icon={Wallet} />
                    <StatCard label="Nilai Closing" value={formatCompactCurrency(stats.closing_value)} icon={Wallet} tone="success" />
                </div>

                {/* Pipeline */}
                <div className="rounded-lg border bg-card">
                    <div className="flex items-center justify-between border-b p-4">
                        <h3 className="text-lg font-semibold">Pipeline Penjualan</h3>
                        <Link href="/crm/pipeline" className="text-sm text-primary hover:underline">Lihat Pipeline</Link>
                    </div>
                    <div className="overflow-x-auto p-4">
                        <div className="flex min-w-max items-stretch gap-2">
                            {pipeline.map((col, i) => (
                                <div key={col.stage} className="flex items-center gap-2">
                                    <div className="w-40 rounded-md border bg-background p-3">
                                        <div className="truncate text-xs font-medium text-muted-foreground" title={col.stage}>{col.stage}</div>
                                        <div className="mt-1 text-xl font-semibold">{col.count}</div>
                                        <div className="text-xs text-muted-foreground">{formatCompactCurrency(col.value)}</div>
                                    </div>
                                    {i < pipeline.length - 1 && <span className="text-muted-foreground">›</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Aktivitas Hari Ini */}
                    <div className="rounded-lg border bg-card lg:col-span-2">
                        <div className="flex items-center justify-between border-b p-4">
                            <h3 className="text-lg font-semibold">Aktivitas Hari Ini</h3>
                            <Link href="/crm/aktivitas" className="text-sm text-primary hover:underline">Semua Aktivitas</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-muted-foreground">
                                        <th className="px-4 py-2.5 text-left font-medium">Perusahaan</th>
                                        <th className="px-4 py-2.5 text-left font-medium">Aktivitas</th>
                                        <th className="px-4 py-2.5 text-left font-medium">Waktu</th>
                                        <th className="px-4 py-2.5 text-left font-medium">Sales</th>
                                        <th className="px-4 py-2.5 text-left font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {todayActivities.map((a) => (
                                        <tr key={a.id} className="border-b last:border-0 hover:bg-muted/50">
                                            <td className="px-4 py-2.5">
                                                <Link href={`/crm/prospek/${a.prospect?.id}`} className="font-medium hover:underline">{a.prospect?.company_name ?? '-'}</Link>
                                                <div className="text-xs text-muted-foreground">{a.prospect?.pic_name}</div>
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <span className="font-medium">{a.type}</span>
                                                <div className="text-xs text-muted-foreground">{a.subject}</div>
                                            </td>
                                            <td className="px-4 py-2.5 text-muted-foreground">{formatDateTime(a.scheduled_at)}</td>
                                            <td className="px-4 py-2.5">{a.user?.name ?? '-'}</td>
                                            <td className="px-4 py-2.5"><Badge className={activityStatusColor(a.status)} variant="outline">{a.status}</Badge></td>
                                        </tr>
                                    ))}
                                    {todayActivities.length === 0 && (
                                        <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Tidak ada aktivitas terjadwal hari ini.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Sumber Prospek */}
                    <div className="rounded-lg border bg-card">
                        <div className="border-b p-4"><h3 className="text-lg font-semibold">Sumber Prospek</h3></div>
                        <div className="space-y-3 p-4">
                            {sourceBreakdown.map((s) => (
                                <div key={s.source}>
                                    <div className="mb-1 flex items-center justify-between text-sm">
                                        <span>{s.source}</span>
                                        <span className="text-muted-foreground">{s.count}</span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-muted">
                                        <div className="h-1.5 rounded-full bg-primary" style={{ width: `${(s.count / maxSource) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                            {sourceBreakdown.length === 0 && <p className="text-sm text-muted-foreground">Belum ada data sumber.</p>}
                        </div>
                    </div>
                </div>

                {/* Follow-up Terlambat */}
                <div className="rounded-lg border bg-card">
                    <div className="border-b p-4"><h3 className="text-lg font-semibold">Follow-up Terlambat</h3></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-muted-foreground">
                                    <th className="px-4 py-2.5 text-left font-medium">Perusahaan</th>
                                    <th className="px-4 py-2.5 text-left font-medium">Tahap</th>
                                    <th className="px-4 py-2.5 text-left font-medium">Next Action</th>
                                    <th className="px-4 py-2.5 text-left font-medium">Jadwal</th>
                                    <th className="px-4 py-2.5 text-left font-medium">Sales</th>
                                </tr>
                            </thead>
                            <tbody>
                                {overdueFollowUps.map((p) => (
                                    <tr key={p.id} className="border-b last:border-0 hover:bg-muted/50">
                                        <td className="px-4 py-2.5"><Link href={`/crm/prospek/${p.id}`} className="font-medium hover:underline">{p.company_name}</Link></td>
                                        <td className="px-4 py-2.5"><Badge className={stageColor(p.stage)} variant="outline">{p.stage}</Badge></td>
                                        <td className="px-4 py-2.5 text-muted-foreground">{p.next_action ?? '-'}</td>
                                        <td className="px-4 py-2.5 text-rose-600">{formatDateTime(p.next_follow_up_at)}</td>
                                        <td className="px-4 py-2.5">{p.sales?.name ?? '-'}</td>
                                    </tr>
                                ))}
                                {overdueFollowUps.length === 0 && (
                                    <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Tidak ada follow-up yang terlambat.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

CrmDashboard.layout = {
    breadcrumbs: [{ title: 'CRM', href: '/crm' }],
};

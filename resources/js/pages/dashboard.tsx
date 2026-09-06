import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Briefcase, ListTodo, Users, Bell, AlertTriangle, Megaphone, FolderOpen, CreditCard,
    Building2, Newspaper, Clock, Activity, History, MailOpen, Mail, TrendingUp, TrendingDown,
    Wallet, Info, CheckCircle2, XCircle, ArrowUpRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Line, Pie, Doughnut, Bar } from 'react-chartjs-2';
import KpiPanel from '@/components/kpi-panel';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler);

interface Announcement {
    id: number;
    title: string;
    content: string;
    type: 'info' | 'warning' | 'success' | 'error';
    created_at: string;
}

interface ActivityLog {
    id: number;
    description: string;
    action: string;
    created_at: string;
    user?: {
        name: string;
    };
}

/** Professional, theme-aware chart palette. */
const CHART_COLORS = ['#155EEF', '#12B76A', '#F79009', '#F04438', '#7A5AF8', '#06AED4', '#EE46BC', '#667085'];

const ACCENTS: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-500/10 dark:text-blue-400',
    emerald: 'text-emerald-600 bg-emerald-500/10 dark:text-emerald-400',
    amber: 'text-amber-600 bg-amber-500/10 dark:text-amber-400',
    red: 'text-red-600 bg-red-500/10 dark:text-red-400',
    violet: 'text-violet-600 bg-violet-500/10 dark:text-violet-400',
    slate: 'text-slate-600 bg-slate-500/10 dark:text-slate-300',
};

const rp = (n: number | string | undefined) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');

/** Compact rupiah for chart axes: 1.2 M / 1.2 jt / 12 rb. */
const compactRp = (n: number) => {
    const abs = Math.abs(n);
    if (abs >= 1e9) return 'Rp ' + (n / 1e9).toFixed(1).replace('.', ',') + ' M';
    if (abs >= 1e6) return 'Rp ' + (n / 1e6).toFixed(1).replace('.', ',') + ' jt';
    if (abs >= 1e3) return 'Rp ' + Math.round(n / 1e3) + ' rb';
    return 'Rp ' + n;
};

const sumValues = (obj: any) =>
    obj ? Object.values(obj).reduce((a: number, b: any) => a + Number(b || 0), 0) : 0;

/** Small reusable KPI card so every metric reads consistently. */
function StatCard({
    title, value, icon: Icon, hint, accent = 'blue', valueClass = '', trend,
}: {
    title: string;
    value: React.ReactNode;
    icon: any;
    hint?: string;
    accent?: keyof typeof ACCENTS | string;
    valueClass?: string;
    trend?: { value: number; label?: string };
}) {
    return (
        <Card className="shadow-none">
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium text-muted-foreground">{title}</p>
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${ACCENTS[accent] ?? ACCENTS.blue}`}>
                        <Icon className="h-4 w-4" />
                    </span>
                </div>
                <div className={`mt-2 text-2xl font-semibold tracking-tight ${valueClass}`}>{value}</div>
                <div className="mt-1 flex items-center gap-2">
                    {trend && (
                        <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${trend.value >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                            {trend.value >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {Math.abs(trend.value)}%
                        </span>
                    )}
                    {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
                </div>
            </CardContent>
        </Card>
    );
}

export default function Dashboard({
    user_role,
    kpi,
    stats,
    financials,
    my_tasks,
    milestones_progress,
    upcoming_deadlines,
    announcements,
    recent_contents,
    recent_clients,
    recent_invoices,
    activity_logs,
    project_status_chart,
    revenue_trend_chart,
    task_status_chart,
    content_platform_chart,
    portfolio_category_chart,
    invoice_status_chart,
    document_category_chart,
    team_workload,
    client_overview,
}: any) {
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    const tickColor = isDark ? '#94A3B8' : '#667085';
    const gridColor = isDark ? 'rgba(148,163,184,0.14)' : 'rgba(148,163,184,0.2)';
    const surfaceColor = isDark ? '#0A0A0A' : '#FFFFFF';

    // --- Categorical data (pie / doughnut): multi-color with clean separators ---
    const catData = (dataObj: any, label: string) => {
        if (!dataObj) return { labels: [], datasets: [] };
        return {
            labels: Object.keys(dataObj),
            datasets: [{
                label,
                data: Object.values(dataObj),
                backgroundColor: CHART_COLORS,
                borderColor: surfaceColor,
                borderWidth: 2,
                hoverOffset: 6,
            }],
        };
    };

    // --- Categorical data (bar): single accent color, rounded ---
    const barData = (dataObj: any, label: string, color = CHART_COLORS[0]) => {
        if (!dataObj) return { labels: [], datasets: [] };
        return {
            labels: Object.keys(dataObj),
            datasets: [{
                label,
                data: Object.values(dataObj),
                backgroundColor: color,
                borderRadius: 6,
                maxBarThickness: 42,
            }],
        };
    };

    const legendConfig = {
        position: 'bottom' as const,
        labels: { color: tickColor, usePointStyle: true, pointStyle: 'circle', boxWidth: 8, padding: 14, font: { size: 11 } },
    };

    const percentTooltip = {
        callbacks: {
            label: (ctx: any) => {
                const val = Number(ctx.parsed);
                const total = ctx.dataset.data.reduce((a: number, b: any) => a + Number(b || 0), 0);
                const pct = total ? Math.round((val / total) * 100) : 0;
                return ` ${ctx.label}: ${val} (${pct}%)`;
            },
        },
    };

    const doughnutOptions: any = {
        maintainAspectRatio: false,
        responsive: true,
        cutout: '70%',
        plugins: { legend: legendConfig, tooltip: percentTooltip },
    };

    const pieOptions: any = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: { legend: legendConfig, tooltip: percentTooltip },
    };

    const barOptions: any = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.parsed.y}` } } },
        scales: {
            x: { grid: { display: false }, border: { display: false }, ticks: { color: tickColor, font: { size: 11 } } },
            y: { beginAtZero: true, grid: { color: gridColor }, border: { display: false }, ticks: { color: tickColor, font: { size: 11 }, precision: 0 } },
        },
    };

    const revenueOptions: any = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx: any) => ' ' + rp(ctx.parsed.y) } },
        },
        scales: {
            x: { grid: { display: false }, border: { display: false }, ticks: { color: tickColor, font: { size: 11 } } },
            y: { beginAtZero: true, grid: { color: gridColor }, border: { display: false }, ticks: { color: tickColor, font: { size: 11 }, callback: (v: any) => compactRp(Number(v)) } },
        },
    };

    /** Center-total plugin so a doughnut instantly communicates its accumulated value. */
    const centerTotal = (label: string): any => ({
        id: 'centerTotal-' + label,
        afterDraw(chart: any) {
            const ds = chart.data.datasets?.[0];
            if (!ds) return;
            const total = ds.data.reduce((a: number, b: any) => a + Number(b || 0), 0);
            const { ctx, chartArea } = chart;
            if (!chartArea) return;
            const cx = (chartArea.left + chartArea.right) / 2;
            const cy = (chartArea.top + chartArea.bottom) / 2;
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = isDark ? '#F8FAFC' : '#101828';
            ctx.font = "700 24px ui-sans-serif, system-ui, sans-serif";
            ctx.fillText(String(total), cx, cy - 8);
            ctx.fillStyle = tickColor;
            ctx.font = "500 11px ui-sans-serif, system-ui, sans-serif";
            ctx.fillText(label, cx, cy + 14);
            ctx.restore();
        },
    });

    // --- Revenue trend accumulation summary ---
    const revData: number[] = revenue_trend_chart?.data || [];
    const revTotal = revData.reduce((a, b) => a + Number(b || 0), 0);
    const revLast = revData[revData.length - 1] || 0;
    const revPrev = revData[revData.length - 2] || 0;
    const revDelta = revPrev > 0 ? Math.round(((revLast - revPrev) / revPrev) * 100) : (revLast > 0 ? 100 : 0);

    const announcementIcon = (type: string) => {
        switch (type) {
            case 'success': return { Icon: CheckCircle2, cls: 'text-emerald-500' };
            case 'warning': return { Icon: AlertTriangle, cls: 'text-amber-500' };
            case 'error': return { Icon: XCircle, cls: 'text-destructive' };
            default: return { Icon: Info, cls: 'text-primary' };
        }
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-6 md:p-8 w-full max-w-none">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h2>
                        <p className="text-muted-foreground mt-1 text-sm">Ringkasan operasional yang disesuaikan dengan peran Anda.</p>
                    </div>
                    {user_role && (
                        <Badge variant="secondary" className="capitalize">{String(user_role).replace(/_/g, ' ')}</Badge>
                    )}
                </div>

                {/* --- ANNOUNCEMENTS --- */}
                {announcements && announcements.length > 0 && (
                    <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-3">
                        {announcements.map((announcement: Announcement) => {
                            const { Icon, cls } = announcementIcon(announcement.type);
                            return (
                                <div key={announcement.id} className="flex gap-3 rounded-xl border bg-card p-3.5 shadow-none">
                                    <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${cls}`} />
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-sm line-clamp-1">{announcement.title}</h3>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{announcement.content}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* --- KPI ROLE INI --- */}
                {kpi && kpi.metrics?.length > 0 && (
                    <div className="space-y-2">
                        <KpiPanel kpi={kpi} compact />
                        {user_role === 'direktur_utama' && (
                            <Link
                                href="/kpi"
                                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                            >
                                Lihat KPI seluruh role &rarr;
                            </Link>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Main Content Area */}
                    <div className="xl:col-span-3 space-y-6">
                        {/* --- DIREKTUR UTAMA (CEO) DASHBOARD --- */}
                        {user_role === 'direktur_utama' && (
                            <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <StatCard title="Project Health" value={`${stats?.project_health ?? 100}%`} icon={Activity} accent="emerald" hint="Projects on-track" />
                                    <StatCard title="Active Projects" value={stats?.active_projects || 0} icon={Briefcase} accent="blue" hint="Currently in progress" />
                                    <StatCard title="Delayed Projects" value={stats?.delayed_projects || 0} icon={AlertTriangle} accent="red" valueClass="text-destructive" hint="Behind schedule" />
                                    <StatCard title="Team Members" value={stats?.team_members || 0} icon={Users} accent="violet" hint="Active in the system" />
                                </div>

                                <div className="grid gap-6 lg:grid-cols-3">
                                    <Card className="lg:col-span-2 flex flex-col shadow-none">
                                        <CardHeader className="pb-3">
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <CardTitle className="flex items-center gap-2"><Wallet className="h-4 w-4 text-primary" /> Financial Overview</CardTitle>
                                                    <CardDescription>Revenue dibayar 7 bulan terakhir.</CardDescription>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-semibold tracking-tight">{rp(revTotal)}</p>
                                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${revDelta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                                        {revDelta >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                                                        {Math.abs(revDelta)}% vs bulan lalu
                                                    </span>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-1 flex flex-col">
                                            <div className="grid grid-cols-3 gap-3 rounded-lg border bg-muted/30 p-3 text-center">
                                                <div>
                                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Revenue</p>
                                                    <p className="mt-0.5 text-sm lg:text-base font-semibold">{rp(financials?.total_revenue)}</p>
                                                </div>
                                                <div className="border-l">
                                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Cost</p>
                                                    <p className="mt-0.5 text-sm lg:text-base font-semibold text-destructive">{rp(financials?.total_cost)}</p>
                                                </div>
                                                <div className="border-l">
                                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Profit</p>
                                                    <p className="mt-0.5 text-sm lg:text-base font-semibold text-emerald-600 dark:text-emerald-400">{rp(financials?.total_profit)}</p>
                                                </div>
                                            </div>
                                            <div className="mt-3 grid grid-cols-2 gap-3">
                                                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                                                    <p className="text-[11px] text-muted-foreground">Paid Invoices</p>
                                                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">{rp(stats?.paid_invoices)}</p>
                                                </div>
                                                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                                                    <p className="text-[11px] text-muted-foreground">Unpaid Invoices</p>
                                                    <p className="font-semibold text-destructive">{rp(stats?.unpaid_invoices)}</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex-1 w-full min-h-[200px]">
                                                {revenue_trend_chart && (
                                                    <Line
                                                        data={{
                                                            labels: revenue_trend_chart.labels,
                                                            datasets: [{
                                                                label: 'Revenue',
                                                                data: revenue_trend_chart.data,
                                                                borderColor: CHART_COLORS[0],
                                                                backgroundColor: 'rgba(21, 94, 239, 0.12)',
                                                                fill: true,
                                                                tension: 0.4,
                                                                pointRadius: 3,
                                                                pointBackgroundColor: CHART_COLORS[0],
                                                                borderWidth: 2,
                                                            }],
                                                        }}
                                                        options={revenueOptions}
                                                    />
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="shadow-none">
                                        <CardHeader className="pb-2">
                                            <CardTitle>Project Status</CardTitle>
                                            <CardDescription>{sumValues(project_status_chart)} total projects</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-[240px]">
                                                <Doughnut data={catData(project_status_chart, 'Projects')} options={doughnutOptions} plugins={[centerTotal('Projects')]} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="grid gap-6 lg:grid-cols-3">
                                    <Card className="shadow-none">
                                        <CardHeader className="pb-2">
                                            <CardTitle>Team Workload</CardTitle>
                                            <CardDescription>Active tasks per member</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {(team_workload || []).map((member: any) => {
                                                    const max = Math.max(...(team_workload || []).map((m: any) => m.tasks_count || 0), 1);
                                                    const width = Math.round(((member.tasks_count || 0) / max) * 100);
                                                    return (
                                                        <div key={member.id} className="space-y-1">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                                                                        {member.name.charAt(0)}
                                                                    </div>
                                                                    <p className="text-sm font-medium">{member.name}</p>
                                                                </div>
                                                                <Badge variant="secondary">{member.tasks_count} tasks</Badge>
                                                            </div>
                                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                                                <div className="h-full rounded-full bg-primary" style={{ width: `${width}%` }} />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                {(!team_workload || team_workload.length === 0) && (
                                                    <p className="text-sm text-muted-foreground text-center py-2">No data.</p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="shadow-none">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-primary" />
                                                <CardTitle>Client Overview</CardTitle>
                                            </div>
                                            <CardDescription>{stats?.active_clients || 0} active clients</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Top by active projects</p>
                                            <div className="space-y-2">
                                                {(client_overview || []).map((client: any, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between rounded-lg bg-muted/40 p-2">
                                                        <span className="text-sm font-medium truncate pr-2">{client.client_name}</span>
                                                        <Badge variant="outline">{client.count} Projects</Badge>
                                                    </div>
                                                ))}
                                                {(!client_overview || client_overview.length === 0) && (
                                                    <p className="text-sm text-muted-foreground text-center py-2">No active clients.</p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="shadow-none">
                                        <CardHeader className="pb-2">
                                            <CardTitle>Upcoming Deadlines</CardTitle>
                                            <CardDescription>Nearest project due dates</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {(upcoming_deadlines || []).map((project: any) => (
                                                    <div key={project.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium leading-none mb-1 truncate">{project.project_name}</p>
                                                            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {new Date(project.deadline).toLocaleDateString('id-ID')}
                                                            </p>
                                                        </div>
                                                        <Badge variant="outline" className="bg-primary/5 text-[10px] shrink-0">{project.status}</Badge>
                                                    </div>
                                                ))}
                                                {(!upcoming_deadlines || upcoming_deadlines.length === 0) && (
                                                    <p className="text-sm text-muted-foreground text-center py-2">No upcoming deadlines.</p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}

                        {/* --- OPERATION DASHBOARD --- */}
                        {user_role === 'operation' && (
                            <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <StatCard title="My Assigned Projects" value={stats?.project_assigned || 0} icon={Briefcase} accent="blue" />
                                    <StatCard title="Pending Tasks" value={stats?.pending_tasks || 0} icon={ListTodo} accent="amber" valueClass="text-amber-600 dark:text-amber-400" />
                                    <StatCard title="Tasks Due Today" value={stats?.today_tasks || 0} icon={AlertTriangle} accent="red" valueClass="text-destructive" />
                                </div>

                                <div className="grid gap-6 lg:grid-cols-3">
                                    <Card className="lg:col-span-2 flex flex-col shadow-none">
                                        <CardHeader className="pb-2">
                                            <CardTitle>My Tasks Pipeline</CardTitle>
                                            <CardDescription>Your pending assignments sorted by deadline.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-1">
                                            <div className="space-y-3">
                                                {(my_tasks || []).map((task: any) => (
                                                    <div key={task.id} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-sm mb-1 truncate">{task.title}</p>
                                                            <div className="flex gap-1.5">
                                                                <Badge variant="outline" className="text-[10px]">{task.status}</Badge>
                                                                <Badge variant={task.priority === 'High' ? 'destructive' : 'secondary'} className="text-[10px]">{task.priority}</Badge>
                                                            </div>
                                                        </div>
                                                        {task.deadline && (
                                                            <div className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-muted-foreground">
                                                                <Clock className="h-3 w-3" />
                                                                {new Date(task.deadline).toLocaleDateString('id-ID')}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {(!my_tasks || my_tasks.length === 0) && (
                                                    <p className="text-sm text-muted-foreground text-center py-6">You have no pending tasks.</p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="space-y-6">
                                        <Card className="shadow-none">
                                            <CardHeader className="pb-2">
                                                <CardTitle>Task Status</CardTitle>
                                                <CardDescription>{sumValues(task_status_chart)} total tasks</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[200px]">
                                                    <Doughnut data={catData(task_status_chart, 'Tasks')} options={doughnutOptions} plugins={[centerTotal('Tasks')]} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="shadow-none">
                                            <CardHeader className="pb-2">
                                                <CardTitle>Active Milestones</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    {(milestones_progress || []).map((milestone: any) => (
                                                        <div key={milestone.id} className="flex flex-col gap-0.5 rounded-lg border p-2.5 hover:bg-muted/50">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <p className="text-sm font-medium truncate pr-2">{milestone.name}</p>
                                                                <Badge variant="outline" className="bg-primary/5 shrink-0 text-[10px]">{milestone.status}</Badge>
                                                            </div>
                                                            <p className="text-[11px] text-muted-foreground truncate">Project: {milestone.project?.project_name}</p>
                                                            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                Due: {new Date(milestone.end_date).toLocaleDateString('id-ID')}
                                                            </p>
                                                        </div>
                                                    ))}
                                                    {(!milestones_progress || milestones_progress.length === 0) && (
                                                        <p className="text-sm text-muted-foreground text-center py-2">No active milestones.</p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- MARKETING DASHBOARD --- */}
                        {user_role === 'marketing' && (
                            <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <StatCard title="Total Clients" value={stats?.total_clients || 0} icon={Building2} accent="blue" />
                                    <StatCard title="Active Portfolios" value={stats?.active_portfolios || 0} icon={FolderOpen} accent="violet" />
                                    <StatCard title="Published News" value={stats?.published_news || 0} icon={Newspaper} accent="slate" />
                                    <StatCard title="Scheduled Content" value={stats?.content_plans || 0} icon={Megaphone} accent="emerald" valueClass="text-emerald-600 dark:text-emerald-400" />
                                </div>

                                <div className="grid gap-6 lg:grid-cols-3">
                                    <div className="lg:col-span-2 space-y-6">
                                        <Card className="shadow-none">
                                            <CardHeader className="pb-2">
                                                <CardTitle>Content Platform Distribution</CardTitle>
                                                <CardDescription>{sumValues(content_platform_chart)} total content pieces</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[240px] w-full">
                                                    <Bar data={barData(content_platform_chart, 'Content by Platform', CHART_COLORS[4])} options={barOptions} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="shadow-none">
                                            <CardHeader className="pb-2">
                                                <CardTitle>Upcoming Content Plans</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    {(recent_contents || []).map((content: any) => (
                                                        <div key={content.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50">
                                                            <div className="min-w-0">
                                                                <p className="font-medium text-sm mb-0.5 truncate">{content.title}</p>
                                                                <p className="text-[11px] font-medium text-muted-foreground">{content.platform}</p>
                                                            </div>
                                                            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                                                                {new Date(content.scheduled_at).toLocaleDateString('id-ID')}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {(!recent_contents || recent_contents.length === 0) && (
                                                        <p className="text-sm text-muted-foreground text-center py-2">No scheduled content.</p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                    <div className="space-y-6">
                                        <Card className="shadow-none">
                                            <CardHeader className="pb-2">
                                                <CardTitle>Portfolio Categories</CardTitle>
                                                <CardDescription>{sumValues(portfolio_category_chart)} portfolios</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[220px]">
                                                    <Doughnut data={catData(portfolio_category_chart, 'Portfolios')} options={doughnutOptions} plugins={[centerTotal('Total')]} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="shadow-none">
                                            <CardHeader className="pb-2">
                                                <CardTitle>Recent Clients</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    {(recent_clients || []).map((client: any) => (
                                                        <div key={client.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium truncate">{client.name}</p>
                                                                <p className="text-[11px] text-muted-foreground truncate">{client.company_name}</p>
                                                            </div>
                                                            <Badge variant="outline" className="text-[10px] shrink-0">{client.status}</Badge>
                                                        </div>
                                                    ))}
                                                    {(!recent_clients || recent_clients.length === 0) && (
                                                        <p className="text-sm text-muted-foreground text-center py-2">No recent clients.</p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- ADMINISTRASI DASHBOARD --- */}
                        {user_role === 'administrasi' && (
                            <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <StatCard title="Pending Invoices" value={stats?.invoices_pending || 0} icon={CreditCard} accent="red" valueClass="text-destructive" />
                                    <StatCard title="Surat Masuk" value={stats?.surat_masuk || 0} icon={MailOpen} accent="blue" />
                                    <StatCard title="Surat Keluar" value={stats?.surat_keluar || 0} icon={Mail} accent="violet" />
                                    <StatCard title="Total Documents" value={stats?.total_documents || 0} icon={FolderOpen} accent="slate" />
                                </div>

                                <div className="grid gap-6 lg:grid-cols-3">
                                    <Card className="lg:col-span-2 flex flex-col shadow-none">
                                        <CardHeader className="pb-2">
                                            <CardTitle>Unpaid Invoices</CardTitle>
                                            <CardDescription>Invoices that require immediate follow-up.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-1">
                                            <div className="space-y-3">
                                                {(recent_invoices || []).map((invoice: any) => (
                                                    <div key={invoice.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50">
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-sm mb-0.5 truncate">{invoice.invoice_number}</p>
                                                            <p className="text-[11px] font-medium text-muted-foreground truncate">Project: {invoice.project?.project_name}</p>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className="mb-0.5 text-base font-semibold text-destructive">{rp(invoice.total)}</p>
                                                            <p className="flex items-center justify-end gap-1 text-[11px] font-medium text-muted-foreground">
                                                                <Clock className="h-3 w-3" />
                                                                Due: {new Date(invoice.due_date).toLocaleDateString('id-ID')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {(!recent_invoices || recent_invoices.length === 0) && (
                                                    <p className="text-sm text-muted-foreground text-center py-6">No unpaid invoices found.</p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <div className="space-y-6">
                                        <Card className="shadow-none">
                                            <CardHeader className="pb-2">
                                                <CardTitle>Invoice Status</CardTitle>
                                                <CardDescription>{sumValues(invoice_status_chart)} total invoices</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[200px]">
                                                    <Doughnut data={catData(invoice_status_chart, 'Invoices')} options={doughnutOptions} plugins={[centerTotal('Invoices')]} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="shadow-none">
                                            <CardHeader className="pb-2">
                                                <CardTitle>Documents Activity</CardTitle>
                                                <CardDescription>{sumValues(document_category_chart)} documents</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[200px] w-full">
                                                    <Bar data={barData(document_category_chart, 'Documents', CHART_COLORS[1])} options={barOptions} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar Area (Activity Logs) */}
                    <div className="xl:col-span-1">
                        <Card className="h-full border-l bg-muted/10 shadow-none xl:rounded-l-none xl:border-y-0 xl:border-r-0">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-2">
                                    <History className="h-5 w-5 text-primary" />
                                    <CardTitle>Recent Activity</CardTitle>
                                </div>
                                <CardDescription>System-wide action history</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Left-aligned straight timeline */}
                                <div className="relative space-y-4 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-border">
                                    {(activity_logs || []).map((log: ActivityLog) => (
                                        <div key={log.id} className="group relative flex items-start gap-3">
                                            <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] border-background bg-primary text-primary-foreground transition-transform group-hover:scale-110">
                                                <Activity className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 rounded-lg border bg-background/80 p-3 transition-colors group-hover:border-primary/40">
                                                <div className="mb-1 flex items-center justify-between gap-2">
                                                    <span className="line-clamp-1 text-sm font-semibold text-foreground">{log.user?.name || 'System'}</span>
                                                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">{log.action}</span>
                                                </div>
                                                <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">{log.description}</p>
                                                <time className="mt-2 block text-[10px] font-medium text-muted-foreground opacity-70">
                                                    {new Date(log.created_at).toLocaleString('id-ID')}
                                                </time>
                                            </div>
                                        </div>
                                    ))}
                                    {(!activity_logs || activity_logs.length === 0) && (
                                        <p className="relative z-10 py-4 text-center text-sm text-muted-foreground">No recent activity.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

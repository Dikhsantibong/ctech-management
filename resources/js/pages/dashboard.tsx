import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, ListTodo, Users, Bell, AlertTriangle, CheckCircle, Megaphone, FolderOpen, CreditCard, Building2, Newspaper, Clock, Activity, History, MailOpen, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Line, Pie, Doughnut, Bar } from 'react-chartjs-2';
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
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

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

export default function Dashboard({ 
    user_role, 
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
    client_overview
}: any) {

    // Helper function to format chart data
    const formatChartData = (dataObj: any, label: string, bgColors: string[]) => {
        if (!dataObj) return { labels: [], datasets: [] };
        return {
            labels: Object.keys(dataObj),
            datasets: [
                {
                    label: label,
                    data: Object.values(dataObj),
                    backgroundColor: bgColors,
                    borderWidth: 1,
                },
            ],
        };
    };

    const defaultColors = [
        'rgba(59, 130, 246, 0.8)', // blue
        'rgba(16, 185, 129, 0.8)', // emerald
        'rgba(245, 158, 11, 0.8)', // amber
        'rgba(239, 68, 68, 0.8)',  // red
        'rgba(139, 92, 246, 0.8)', // purple
        'rgba(107, 114, 128, 0.8)', // gray
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-4 p-4 w-full max-w-none">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Overview of operations tailored for your role.</p>
                </div>

                {/* --- ANNOUNCEMENTS --- */}
                {announcements && announcements.length > 0 && (
                    <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
                        {announcements.map((announcement: Announcement) => (
                            <div key={announcement.id} className="rounded-xl border bg-card p-3 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-1">
                                    <Bell className={`h-4 w-4 ${announcement.type === 'error' ? 'text-destructive' : 'text-primary'}`} />
                                    <h3 className="font-semibold text-sm line-clamp-1">{announcement.title}</h3>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">{announcement.content}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                    {/* Main Content Area */}
                    <div className="xl:col-span-3 space-y-4">
                        {/* --- DIREKTUR UTAMA (CEO) DASHBOARD --- */}
                        {user_role === 'direktur_utama' && (
                            <div className="space-y-4">
                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                                    <Card className="hover:shadow-md transition-all py-1">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
                                            <CardTitle className="text-sm font-medium">Project Health</CardTitle>
                                            <Activity className="h-4 w-4 text-emerald-500" />
                                        </CardHeader>
                                        <CardContent className="px-4 pb-3">
                                            <div className="text-2xl font-bold">{stats?.project_health || 100}%</div>
                                            <p className="text-xs text-muted-foreground mt-0.5">Projects on-track</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="hover:shadow-md transition-all py-1">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
                                            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                                            <Briefcase className="h-4 w-4 text-primary" />
                                        </CardHeader>
                                        <CardContent className="px-4 pb-3">
                                            <div className="text-2xl font-bold">{stats?.active_projects || 0}</div>
                                            <p className="text-xs text-muted-foreground mt-0.5">Currently in progress</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="hover:shadow-md transition-all border-destructive/20 py-1">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
                                            <CardTitle className="text-sm font-medium">Delayed Projects</CardTitle>
                                            <AlertTriangle className="h-4 w-4 text-destructive" />
                                        </CardHeader>
                                        <CardContent className="px-4 pb-3">
                                            <div className="text-2xl font-bold text-destructive">{stats?.delayed_projects || 0}</div>
                                            <p className="text-xs text-muted-foreground mt-0.5">Projects behind schedule</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="hover:shadow-md transition-all py-1">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
                                            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                                            <Users className="h-4 w-4 text-primary" />
                                        </CardHeader>
                                        <CardContent className="px-4 pb-3">
                                            <div className="text-2xl font-bold">{stats?.team_members || 0}</div>
                                            <p className="text-xs text-muted-foreground mt-0.5">Active in the system</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    <Card className="col-span-2 flex flex-col">
                                        <CardHeader className="pb-2">
                                            <CardTitle>Financial Summary</CardTitle>
                                            <CardDescription>Overview of project revenues and costs over time.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-1 flex flex-col">
                                            <div className="grid grid-cols-3 gap-2 text-center mb-3 border-b pb-3">
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Total Revenue</p>
                                                    <p className="text-lg lg:text-xl font-bold">Rp {Number(financials?.total_revenue || 0).toLocaleString('id-ID')}</p>
                                                </div>
                                                <div className="space-y-0.5 border-l">
                                                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Total Cost</p>
                                                    <p className="text-lg lg:text-xl font-bold text-destructive">Rp {Number(financials?.total_cost || 0).toLocaleString('id-ID')}</p>
                                                </div>
                                                <div className="space-y-0.5 border-l">
                                                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Total Profit</p>
                                                    <p className="text-lg lg:text-xl font-bold text-emerald-500">Rp {Number(financials?.total_profit || 0).toLocaleString('id-ID')}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mt-2 mb-4 bg-muted/30 rounded-lg p-3">
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">Paid Invoices</p>
                                                    <p className="font-bold text-emerald-600">Rp {Number(stats?.paid_invoices || 0).toLocaleString('id-ID')}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">Unpaid Invoices</p>
                                                    <p className="font-bold text-destructive">Rp {Number(stats?.unpaid_invoices || 0).toLocaleString('id-ID')}</p>
                                                </div>
                                            </div>
                                            <div className="flex-1 w-full min-h-[180px]">
                                                {revenue_trend_chart && (
                                                    <Line 
                                                        data={{
                                                            labels: revenue_trend_chart.labels,
                                                            datasets: [
                                                                {
                                                                    label: 'Revenue',
                                                                    data: revenue_trend_chart.data,
                                                                    borderColor: 'rgba(59, 130, 246, 1)',
                                                                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                                                    fill: true,
                                                                    tension: 0.4
                                                                }
                                                            ]
                                                        }}
                                                        options={{ maintainAspectRatio: false }}
                                                    />
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="space-y-4">
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle>Team Workload</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    {(team_workload || []).map((member: any) => (
                                                        <div key={member.id} className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                                                    {member.name.charAt(0)}
                                                                </div>
                                                                <p className="text-sm font-medium">{member.name}</p>
                                                            </div>
                                                            <Badge variant="secondary">{member.tasks_count} tasks</Badge>
                                                        </div>
                                                    ))}
                                                    {(!team_workload || team_workload.length === 0) && (
                                                        <p className="text-sm text-muted-foreground text-center py-2">No data.</p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle>Project Status</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[140px] flex justify-center">
                                                    <Pie data={formatChartData(project_status_chart, 'Projects', defaultColors)} options={{ maintainAspectRatio: false }} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle>Client Overview</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex gap-4 items-center mb-4 p-3 bg-muted/50 rounded-lg">
                                                <div className="p-3 bg-primary/10 text-primary rounded-full">
                                                    <Building2 className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-bold">{stats?.active_clients || 0}</p>
                                                    <p className="text-xs text-muted-foreground">Total Active Clients</p>
                                                </div>
                                            </div>
                                            <p className="text-xs font-semibold mb-2">Top Clients (by Active Projects)</p>
                                            <div className="space-y-2">
                                                <div className="space-y-2">
                                                {(client_overview || []).map((client: any, idx: number) => (
                                                    <div key={idx} className="flex justify-between items-center bg-muted/30 p-2 rounded">
                                                        <span className="text-sm font-medium">{client.client_name}</span>
                                                        <Badge variant="outline">{client.count} Projects</Badge>
                                                    </div>
                                                ))}
                                                {(!client_overview || client_overview.length === 0) && (
                                                    <p className="text-sm text-muted-foreground text-center py-2">No active clients.</p>
                                                )}
                                            </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle>Upcoming Deadlines</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {(upcoming_deadlines || []).map((project: any) => (
                                                    <div key={project.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                                        <div>
                                                            <p className="text-sm font-medium leading-none mb-1">{project.project_name}</p>
                                                            <p className="text-[11px] text-muted-foreground">Due: {new Date(project.deadline).toLocaleDateString('id-ID')}</p>
                                                        </div>
                                                        <Badge variant="outline" className="bg-primary/5 text-[10px]">{project.status}</Badge>
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

                        {/* --- OPERATION DASHBOARD --- */}{/* --- OPERATION DASHBOARD --- */}
                        {user_role === 'operation' && (
                            <div className="space-y-4">
                                <div className="grid gap-3 md:grid-cols-3">
                                    <Card className="hover:shadow-md transition-all py-1">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
                                            <CardTitle className="text-sm font-medium">My Assigned Projects</CardTitle>
                                            <Briefcase className="h-4 w-4 text-primary" />
                                        </CardHeader>
                                        <CardContent className="px-4 pb-3">
                                            <div className="text-2xl font-bold">{stats?.project_assigned || 0}</div>
                                        </CardContent>
                                    </Card>
                                    <Card className="hover:shadow-md transition-all border-amber-500/20 py-1">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
                                            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                                            <ListTodo className="h-4 w-4 text-amber-500" />
                                        </CardHeader>
                                        <CardContent className="px-4 pb-3">
                                            <div className="text-2xl font-bold text-amber-600">{stats?.pending_tasks || 0}</div>
                                        </CardContent>
                                    </Card>
                                    <Card className="hover:shadow-md transition-all border-destructive/20 py-1">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
                                            <CardTitle className="text-sm font-medium">Tasks Due Today</CardTitle>
                                            <AlertTriangle className="h-4 w-4 text-destructive" />
                                        </CardHeader>
                                        <CardContent className="px-4 pb-3">
                                            <div className="text-2xl font-bold text-destructive">{stats?.today_tasks || 0}</div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <Card className="md:col-span-2 flex flex-col">
                                        <CardHeader className="pb-2">
                                            <CardTitle>My Tasks Pipeline</CardTitle>
                                            <CardDescription>Your pending assignments sorted by deadline.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-1">
                                            <div className="space-y-3">
                                                {(my_tasks || []).map((task: any) => (
                                                    <div key={task.id} className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 transition-colors">
                                                        <div>
                                                            <p className="font-medium text-sm mb-1">{task.title}</p>
                                                            <div className="flex gap-1.5">
                                                                <Badge variant="outline" className="text-[10px]">{task.status}</Badge>
                                                                <Badge variant={task.priority === 'High' ? 'destructive' : 'secondary'} className="text-[10px]">{task.priority}</Badge>
                                                            </div>
                                                        </div>
                                                        {task.deadline && (
                                                            <div className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium shrink-0">
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

                                    <div className="space-y-4">
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle>Task Status</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[160px] flex justify-center">
                                                    <Doughnut data={formatChartData(task_status_chart, 'Tasks', defaultColors)} options={{ maintainAspectRatio: false }} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle>Active Milestones</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    {(milestones_progress || []).map((milestone: any) => (
                                                        <div key={milestone.id} className="flex flex-col gap-0.5 rounded-md border p-2.5 hover:bg-muted/50">
                                                            <div className="flex justify-between items-center mb-1">
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
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- MARKETING DASHBOARD --- */}
                        {user_role === 'marketing' && (
                            <div className="space-y-4">
                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                                    <Card className="py-1">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
                                            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                                            <Building2 className="h-4 w-4 text-primary" />
                                        </CardHeader>
                                        <CardContent className="px-4 pb-3">
                                            <div className="text-2xl font-bold">{stats?.total_clients || 0}</div>
                                        </CardContent>
                                    </Card>
                                    <Card className="py-1">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
                                            <CardTitle className="text-sm font-medium">Active Portfolios</CardTitle>
                                            <FolderOpen className="h-4 w-4 text-primary" />
                                        </CardHeader>
                                        <CardContent className="px-4 pb-3">
                                            <div className="text-2xl font-bold">{stats?.active_portfolios || 0}</div>
                                        </CardContent>
                                    </Card>
                                    <Card className="py-1">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
                                            <CardTitle className="text-sm font-medium">Published News</CardTitle>
                                            <Newspaper className="h-4 w-4 text-primary" />
                                        </CardHeader>
                                        <CardContent className="px-4 pb-3">
                                            <div className="text-2xl font-bold">{stats?.published_news || 0}</div>
                                        </CardContent>
                                    </Card>
                                    <Card className="py-1">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
                                            <CardTitle className="text-sm font-medium">Scheduled Content</CardTitle>
                                            <Megaphone className="h-4 w-4 text-emerald-500" />
                                        </CardHeader>
                                        <CardContent className="px-4 pb-3">
                                            <div className="text-2xl font-bold text-emerald-600">{stats?.content_plans || 0}</div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="md:col-span-2 space-y-4">
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle>Content Platform Distribution</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[220px] w-full">
                                                    <Bar data={formatChartData(content_platform_chart, 'Content by Platform', defaultColors)} options={{ maintainAspectRatio: false }} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle>Upcoming Content Plans</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    {(recent_contents || []).map((content: any) => (
                                                        <div key={content.id} className="flex justify-between items-center rounded-md border p-3 hover:bg-muted/50">
                                                            <div>
                                                                <p className="font-medium text-sm mb-0.5">{content.title}</p>
                                                                <p className="text-[11px] text-muted-foreground font-medium">{content.platform}</p>
                                                            </div>
                                                            <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded-full shrink-0">
                                                                {new Date(content.scheduled_at).toLocaleDateString('id-ID')}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                    <div className="space-y-4">
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle>Portfolio Categories</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[180px] flex justify-center">
                                                    <Pie data={formatChartData(portfolio_category_chart, 'Portfolios', defaultColors)} options={{ maintainAspectRatio: false }} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle>Recent Clients</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    {(recent_clients || []).map((client: any) => (
                                                        <div key={client.id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                                                            <div>
                                                                <p className="text-sm font-medium">{client.name}</p>
                                                                <p className="text-[11px] text-muted-foreground">{client.company_name}</p>
                                                            </div>
                                                            <Badge variant="outline" className="text-[10px]">{client.status}</Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- ADMINISTRASI DASHBOARD --- */}
                        {user_role === 'administrasi' && (
                            <div className="space-y-4">
                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                                    <Card className="border-destructive/20 py-1">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
                                            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
                                            <CreditCard className="h-4 w-4 text-destructive" />
                                        </CardHeader>
                                        <CardContent className="px-4 pb-3">
                                            <div className="text-2xl font-bold text-destructive">{stats?.invoices_pending || 0}</div>
                                        </CardContent>
                                    </Card>
                                    <Card className="py-1">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
                                            <CardTitle className="text-sm font-medium">Surat Masuk</CardTitle>
                                            <MailOpen className="h-4 w-4 text-primary" />
                                        </CardHeader>
                                        <CardContent className="px-4 pb-3">
                                            <div className="text-2xl font-bold">{stats?.surat_masuk || 0}</div>
                                        </CardContent>
                                    </Card>
                                    <Card className="py-1">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
                                            <CardTitle className="text-sm font-medium">Surat Keluar</CardTitle>
                                            <Mail className="h-4 w-4 text-primary" />
                                        </CardHeader>
                                        <CardContent className="px-4 pb-3">
                                            <div className="text-2xl font-bold">{stats?.surat_keluar || 0}</div>
                                        </CardContent>
                                    </Card>
                                    <Card className="py-1">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
                                            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                                            <FolderOpen className="h-4 w-4 text-primary" />
                                        </CardHeader>
                                        <CardContent className="px-4 pb-3">
                                            <div className="text-2xl font-bold">{stats?.total_documents || 0}</div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <Card className="md:col-span-2 flex flex-col">
                                        <CardHeader className="pb-2">
                                            <CardTitle>Unpaid Invoices</CardTitle>
                                            <CardDescription>Invoices that require immediate follow-up.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-1">
                                            <div className="space-y-3">
                                                {(recent_invoices || []).map((invoice: any) => (
                                                    <div key={invoice.id} className="flex justify-between items-center rounded-md border p-3 hover:bg-muted/50">
                                                        <div>
                                                            <p className="font-bold text-sm mb-0.5">{invoice.invoice_number}</p>
                                                            <p className="text-[11px] text-muted-foreground font-medium">Project: {invoice.project?.project_name}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-base font-bold text-destructive mb-0.5">Rp {Number(invoice.total).toLocaleString('id-ID')}</p>
                                                            <p className="text-[11px] text-muted-foreground font-medium flex justify-end items-center gap-1">
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
                                    <div className="space-y-4">
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle>Invoice Status</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[160px] flex justify-center">
                                                    <Doughnut data={formatChartData(invoice_status_chart, 'Invoices', defaultColors)} options={{ maintainAspectRatio: false }} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle>Documents Activity</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[180px] w-full">
                                                    <Bar data={formatChartData(document_category_chart, 'Documents', defaultColors)} options={{ maintainAspectRatio: false }} />
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
                        <Card className="h-full border-l xl:rounded-l-none xl:border-y-0 xl:border-r-0 xl:shadow-none bg-muted/10">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-2">
                                    <History className="h-5 w-5 text-primary" />
                                    <CardTitle>Recent Activity</CardTitle>
                                </div>
                                <CardDescription>System-wide action history</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Left-aligned straight timeline */}
                                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-border">
                                    {(activity_logs || []).map((log: ActivityLog) => (
                                        <div key={log.id} className="relative flex items-start gap-3 group">
                                            {/* Icon */}
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-[3px] border-background bg-primary text-primary-foreground shadow-sm shrink-0 z-10 group-hover:scale-110 transition-transform">
                                                <Activity className="h-4 w-4" />
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="flex-1 bg-background/80 backdrop-blur-sm p-3 rounded-lg border shadow-sm group-hover:border-primary/40 group-hover:shadow-md transition-all">
                                                <div className="flex items-center justify-between mb-1 gap-2">
                                                    <span className="font-bold text-sm text-foreground line-clamp-1">{log.user?.name || 'System'}</span>
                                                    <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">{log.action}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground leading-snug line-clamp-2">{log.description}</p>
                                                <time className="block text-[10px] text-muted-foreground mt-2 font-medium opacity-70">
                                                    {new Date(log.created_at).toLocaleString('id-ID')}
                                                </time>
                                            </div>
                                        </div>
                                    ))}
                                    {(!activity_logs || activity_logs.length === 0) && (
                                        <p className="text-sm text-muted-foreground text-center py-4 relative z-10">No recent activity.</p>
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

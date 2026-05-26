import { Head } from '@inertiajs/react';
import { Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { dashboard } from '@/routes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Briefcase, FileText, ListTodo, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard({ stats, upcoming_tasks, task_status_counts, tasks_last_7_days }: { stats: any, upcoming_tasks: any[], task_status_counts?: Record<string, number>, tasks_last_7_days?: { labels: string[], data: number[] } }) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Overview of your startup's operations.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_projects}</div>
                            <p className="text-xs text-muted-foreground">Projects currently in progress</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                            <ListTodo className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_tasks}</div>
                            <p className="text-xs text-muted-foreground">Tasks waiting to be completed</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.unpaid_invoices}</div>
                            <p className="text-xs text-muted-foreground">Invoices pending payment</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.team_members}</div>
                            <p className="text-xs text-muted-foreground">Active in the system</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Latest actions performed by your team.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {upcoming_tasks.slice(0, 8).map((task: any, i: number) => (
                                    <div key={i} className="flex items-center">
                                        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                                            {task.title.charAt(0)}
                                        </span>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {task.title} <span className="text-muted-foreground font-normal">• {task.project?.project_name}</span>
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : '—'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Upcoming Deadlines</CardTitle>
                            <CardDescription>Projects and tasks due soon.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcoming_tasks.length > 0 ? (
                                    <>
                                        <div className="space-y-3">
                                            {upcoming_tasks.map((task: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium">{task.title}</p>
                                                        <p className="text-xs text-muted-foreground">{task.project?.project_name} • Due: {new Date(task.deadline).toLocaleDateString()}</p>
                                                    </div>
                                                    <Badge variant={task.priority === 'High' ? 'destructive' : (task.priority === 'Medium' ? 'secondary' : 'outline')}>
                                                        {task.priority}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Simple status distribution chart */}
                                        <div className="mt-4">
                                            <h4 className="text-sm font-medium mb-2">Tasks by Status</h4>
                                            <div className="space-y-2">
                                                {['Todo','Progress','Review','Done'].map((s) => {
                                                    const count = Number(task_status_counts?.[s] ?? 0);
                                                    const total = Object.values(task_status_counts || {}).reduce((a:any,b:any)=>Number(a)+Number(b), 0) || 1;
                                                    const pct = Math.round((count / total) * 100);
                                                    return (
                                                        <div key={s} className="flex items-center gap-3">
                                                            <div className="w-24 text-xs text-muted-foreground">{s}</div>
                                                            <div className="flex-1 bg-muted rounded h-3 overflow-hidden">
                                                                <div className="h-3 bg-primary" style={{ width: `${pct}%` }} />
                                                            </div>
                                                            <div className="w-12 text-right text-xs">{count}</div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">No upcoming deadlines.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts row */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tasks Over Last 7 Days</CardTitle>
                            <CardDescription>New tasks created per day</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {tasks_last_7_days ? (
                                <Line
                                    options={{
                                        responsive: true,
                                        plugins: { legend: { display: false } },
                                    }}
                                    data={{
                                        labels: tasks_last_7_days.labels,
                                        datasets: [
                                            {
                                                label: 'Tasks',
                                                data: tasks_last_7_days.data,
                                                borderColor: 'rgba(59,130,246,1)',
                                                backgroundColor: 'rgba(59,130,246,0.2)',
                                                tension: 0.4,
                                            },
                                        ],
                                    }}
                                />
                            ) : (
                                <p className="text-sm text-muted-foreground">No data available.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Task Status Distribution</CardTitle>
                            <CardDescription>Proportion of tasks by status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full h-64 flex items-center justify-center">
                                <div className="w-full h-full">
                                    <Pie
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: { legend: { position: 'bottom' } },
                                        }}
                                        data={{
                                            labels: ['Todo','Progress','Review','Done'],
                                            datasets: [
                                                {
                                                    data: ['Todo','Progress','Review','Done'].map(s => Number(task_status_counts?.[s] ?? 0)),
                                                    backgroundColor: ['#f97316', '#3b82f6', '#f59e0b', '#10b981'],
                                                },
                                            ],
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};

import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Briefcase, FileText, ListTodo, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Dashboard({ stats, upcoming_tasks }: { stats: any, upcoming_tasks: any[] }) {
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
                                {[
                                    { user: 'Budi Santoso', action: 'completed task', target: 'Design Homepage UI', time: '2 hours ago' },
                                    { user: 'Andi Wijaya', action: 'created project', target: 'Mobile App Revamp', time: '4 hours ago' },
                                    { user: 'Siti Aminah', action: 'generated invoice', target: 'INV-2026-001', time: 'Yesterday' },
                                    { user: 'Budi Santoso', action: 'uploaded document', target: 'Q1 Financial Report', time: 'Yesterday' },
                                ].map((activity, i) => (
                                    <div key={i} className="flex items-center">
                                        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                                            {activity.user.charAt(0)}
                                        </span>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {activity.user} <span className="text-muted-foreground font-normal">{activity.action}</span> {activity.target}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {activity.time}
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
                                {upcoming_tasks.length > 0 ? upcoming_tasks.map((task: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">{task.title}</p>
                                            <p className="text-xs text-muted-foreground">{task.project?.project_name} • Due: {new Date(task.deadline).toLocaleDateString()}</p>
                                        </div>
                                        <Badge variant={task.priority === 'High' ? 'destructive' : (task.priority === 'Medium' ? 'secondary' : 'outline')}>
                                            {task.priority}
                                        </Badge>
                                    </div>
                                )) : (
                                    <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">No upcoming deadlines.</p>
                                )}
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

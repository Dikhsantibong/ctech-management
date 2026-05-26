import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Users, Briefcase, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProjectShow({ project }: { project: any }) {
    const statusBadgeColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'default';
            case 'Progress': return 'secondary';
            case 'Review': return 'outline';
            default: return 'outline';
        }
    };

    return (
        <>
            <Head title={project.project_name} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/projects">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold tracking-tight">{project.project_name}</h2>
                            <Badge variant={statusBadgeColor(project.status)}>
                                {project.status}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground flex items-center gap-1">
                            <Briefcase className="h-4 w-4" /> {project.client_name}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-wrap">{project.description || 'No description provided.'}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Tasks</CardTitle>
                                <CardDescription>Manage tasks for this project.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center p-8 border border-dashed rounded-lg">
                                    <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                                    <h3 className="font-semibold text-lg">No tasks yet</h3>
                                    <p className="text-muted-foreground mb-4">Get started by creating a new task.</p>
                                    <Button asChild>
                                        <Link href={`/tasks?project_id=${project.id}`}>
                                            Manage Tasks
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Start Date</p>
                                        <p className="text-sm text-muted-foreground">{new Date(project.start_date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-destructive" />
                                    <div>
                                        <p className="text-sm font-medium">Deadline</p>
                                        <p className="text-sm text-muted-foreground">{new Date(project.deadline).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-4 w-4" /> Team Members
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {project.members && project.members.length > 0 ? (
                                        project.members.map((member: any) => (
                                            <div key={member.id} className="flex items-center gap-3">
                                                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{member.name}</p>
                                                    <p className="text-xs text-muted-foreground">{member.role}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No team members assigned.</p>
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

ProjectShow.layout = {
    breadcrumbs: [
        {
            title: 'Projects',
            href: '/projects',
        },
        {
            title: 'Project Details',
            href: '#',
        },
    ],
};

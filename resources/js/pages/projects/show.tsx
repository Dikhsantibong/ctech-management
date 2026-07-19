import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, Users, Briefcase, FileText, Globe, Github, Figma, Server, Code, Edit, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ProjectMilestones from './ProjectMilestones';
import ProjectDocuments from './ProjectDocuments';
import ProjectMeetings from './ProjectMeetings';
import ProjectActivity from './ProjectActivity';
import ProjectRevisions from './ProjectRevisions';
import ClientFeedback from './ClientFeedback';
import React from 'react';

export default function ProjectShow({ project }: { project: any }) {
    const { data: metaData, setData: setMetaData, put: putMeta, processing: processingMeta } = useForm({
        tech_stack: project.metadata?.tech_stack || '',
        repo_link: project.metadata?.repo_link || '',
        domain_link: project.metadata?.domain_link || '',
        design_link: project.metadata?.design_link || '',
        structure_notes: project.metadata?.structure_notes || '',
    });

    const [isMetaOpen, setIsMetaOpen] = React.useState(false);

    const handleMetaSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        putMeta(`/projects/${project.id}/metadata`, {
            onSuccess: () => setIsMetaOpen(false)
        });
    };
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

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="mb-4 bg-muted/50 p-1 flex-wrap h-auto">
                        <TabsTrigger value="overview" className="rounded-md">Overview</TabsTrigger>
                        <TabsTrigger value="milestones" className="rounded-md">Milestones & Timeline</TabsTrigger>
                        <TabsTrigger value="documents" className="rounded-md">Document Center</TabsTrigger>
                        <TabsTrigger value="meetings" className="rounded-md">Meetings & MoM</TabsTrigger>
                        <TabsTrigger value="activity" className="rounded-md">Activity Timeline</TabsTrigger>
                        <TabsTrigger value="revisions" className="rounded-md">Revisions</TabsTrigger>
                        <TabsTrigger value="feedback" className="rounded-md">Client Feedback</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="md:col-span-2 space-y-6">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle>Overview</CardTitle>
                                        <Dialog open={isMetaOpen} onOpenChange={setIsMetaOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm"><Edit className="h-4 w-4 mr-2"/> Edit Tech Info</Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[500px]">
                                                <DialogHeader><DialogTitle>Edit Master Project Info</DialogTitle></DialogHeader>
                                                <form onSubmit={handleMetaSubmit} className="space-y-4">
                                                    <div>
                                                        <Label>Tech Stack</Label>
                                                        <Input placeholder="e.g. Laravel, React, Tailwind" value={metaData.tech_stack} onChange={e => setMetaData('tech_stack', e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <Label>Domain Link</Label>
                                                        <Input placeholder="https://" value={metaData.domain_link} onChange={e => setMetaData('domain_link', e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <Label>Repository Link</Label>
                                                        <Input placeholder="Github/Gitlab link" value={metaData.repo_link} onChange={e => setMetaData('repo_link', e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <Label>Design Link</Label>
                                                        <Input placeholder="Figma link" value={metaData.design_link} onChange={e => setMetaData('design_link', e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <Label>Architecture & Structure Notes</Label>
                                                        <Textarea rows={3} placeholder="Database architecture, server info, etc." value={metaData.structure_notes} onChange={e => setMetaData('structure_notes', e.target.value)} />
                                                    </div>
                                                    <Button type="submit" disabled={processingMeta} className="w-full">Save Changes</Button>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="whitespace-pre-wrap mb-6">{project.description || 'No description provided.'}</p>
                                        
                                        <div className="bg-muted/30 p-4 rounded-lg border space-y-4">
                                            <h4 className="font-semibold text-sm mb-2 flex items-center border-b pb-2"><Server className="w-4 h-4 mr-2" /> Master Project Info</h4>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex gap-2">
                                                    <Code className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-semibold text-muted-foreground uppercase">Tech Stack</p>
                                                        <p className="text-sm font-medium">{project.metadata?.tech_stack || '-'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Globe className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-semibold text-muted-foreground uppercase">Domain</p>
                                                        {project.metadata?.domain_link ? (
                                                            <a href={project.metadata.domain_link} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-500 hover:underline break-all">{project.metadata.domain_link}</a>
                                                        ) : <p className="text-sm">-</p>}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Github className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-semibold text-muted-foreground uppercase">Repository</p>
                                                        {project.metadata?.repo_link ? (
                                                            <a href={project.metadata.repo_link} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-500 hover:underline break-all">{project.metadata.repo_link}</a>
                                                        ) : <p className="text-sm">-</p>}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Figma className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-semibold text-muted-foreground uppercase">Design / UI</p>
                                                        {project.metadata?.design_link ? (
                                                            <a href={project.metadata.design_link} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-500 hover:underline break-all">{project.metadata.design_link}</a>
                                                        ) : <p className="text-sm">-</p>}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 pt-4 border-t">
                                                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Architecture & Structure Notes</p>
                                                <p className="text-sm bg-background p-3 rounded border whitespace-pre-wrap">{project.metadata?.structure_notes || 'No architecture notes provided.'}</p>
                                            </div>
                                        </div>
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
                    </TabsContent>

                    <TabsContent value="milestones">
                        <ProjectMilestones project={project} />
                    </TabsContent>

                    <TabsContent value="documents">
                        <ProjectDocuments project={project} />
                    </TabsContent>

                    <TabsContent value="meetings">
                        <ProjectMeetings project={project} />
                    </TabsContent>

                    <TabsContent value="activity">
                        <ProjectActivity project={project} />
                    </TabsContent>

                    <TabsContent value="revisions">
                        <ProjectRevisions project={project} />
                    </TabsContent>

                    <TabsContent value="feedback">
                        <ClientFeedback project={project} />
                    </TabsContent>
                </Tabs>
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

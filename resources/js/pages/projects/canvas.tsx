import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { ProjectCanvasEditor } from '@/components/project-canvas/Canvas';

interface Props {
    project: { id: number; project_name: string; client_name: string };
    canvas: { id: number; name: string; viewport: any; settings: any; updated_at: string };
    nodes: any[];
    edges: any[];
    versions: any[];
    markdownDocuments: { id: number; name: string }[];
}

export default function ProjectCanvasPage({ project, canvas, nodes, edges, versions }: Props) {
    return (
        <>
            <Head title={`Canvas — ${project.project_name}`} />
            <div className="flex h-[calc(100dvh-5rem)] flex-col overflow-hidden">
                <div className="flex items-center gap-3 border-b bg-card px-4 py-2.5">
                    <Link href={`/projects/${project.id}`} className="text-muted-foreground transition-colors hover:text-foreground" title="Kembali ke project">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 text-sm">
                            <Link href={`/projects/${project.id}`} className="font-semibold hover:underline">{project.project_name}</Link>
                            <span className="text-muted-foreground">/ Canvas</span>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{canvas.name} · {project.client_name}</p>
                    </div>
                </div>
                <div className="min-h-0 flex-1">
                    <ProjectCanvasEditor
                        projectId={project.id}
                        initialNodes={nodes}
                        initialEdges={edges}
                        initialViewport={canvas.viewport}
                        initialVersions={versions}
                    />
                </div>
            </div>
        </>
    );
}

ProjectCanvasPage.layout = {
    breadcrumbs: [
        { title: 'Projects', href: '/projects' },
        { title: 'Canvas', href: '#' },
    ],
};

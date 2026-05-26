import { Head, Link } from '@inertiajs/react';
import { Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ActivityLogsIndex({ logs }: { logs: any }) {
    const actionBadgeColor = (action: string) => {
        switch (action) {
            case 'created': return 'default';
            case 'updated': return 'secondary';
            case 'deleted': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <>
            <Head title="Activity Logs" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Activity Logs</h2>
                        <p className="text-muted-foreground">Track all system activities and changes.</p>
                    </div>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Action</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Module</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date/Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.data.map((log: any) => (
                                        <tr key={log.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">
                                                {log.user?.name || 'System'}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={actionBadgeColor(log.action)}>
                                                    {log.action}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle">{log.model_type}</td>
                                            <td className="p-4 align-middle text-muted-foreground">{log.description}</td>
                                            <td className="p-4 align-middle">
                                                {new Date(log.created_at).toLocaleString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                    {logs.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                                No activity logs found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                {/* Pagination */}
                {logs.last_page > 1 && (
                    <div className="flex items-center justify-end gap-2">
                        {logs.links.map((link: any, i: number) => (
                            <Button
                                key={i}
                                variant={link.active ? "default" : "outline"}
                                size="sm"
                                className={link.url === null ? "opacity-50 cursor-not-allowed" : ""}
                                asChild={link.url !== null}
                                disabled={link.url === null}
                            >
                                {link.url !== null ? (
                                    <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ) : (
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                )}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

ActivityLogsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Activity Logs',
            href: '/activity-logs',
        },
    ],
};

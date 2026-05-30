import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit2, Trash2, Info, AlertTriangle, CheckCircle, XCircle, Calendar, User, Clock } from 'lucide-react';

interface Announcement {
    id: number;
    title: string;
    content: string;
    visible_to_roles: string[];
    type: 'info' | 'warning' | 'success' | 'error';
    is_active: boolean;
    published_at: string | null;
    expires_at: string | null;
    created_at: string;
    updated_at: string;
    creator?: {
        id: number;
        name: string;
        email: string;
    };
}

interface Props {
    announcement: Announcement;
    canManage: boolean;
}

export default function AnnouncementShow({ announcement, canManage }: Props) {
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'info': return <Info className="h-5 w-5" />;
            case 'warning': return <AlertTriangle className="h-5 w-5" />;
            case 'success': return <CheckCircle className="h-5 w-5" />;
            case 'error': return <XCircle className="h-5 w-5" />;
            default: return <Info className="h-5 w-5" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
            case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'success': return 'bg-green-50 border-green-200 text-green-800';
            case 'error': return 'bg-red-50 border-red-200 text-red-800';
            default: return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    const formatRole = (role: string) => {
        return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <>
            <Head title={announcement.title} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/announcements" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Pengumuman
                        </Link>
                        <h2 className="text-2xl font-bold tracking-tight">{announcement.title}</h2>
                    </div>
                    {canManage && (
                        <div className="flex gap-2">
                            <Link href={`/announcements/${announcement.id}/edit`}>
                                <Button variant="outline">
                                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-lg ${getTypeColor(announcement.type)}`}>
                                            {getTypeIcon(announcement.type)}
                                        </div>
                                        <div>
                                            <CardTitle>{announcement.title}</CardTitle>
                                            <CardDescription className="mt-1">
                                                {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant={announcement.is_active ? 'default' : 'secondary'}>
                                        {announcement.is_active ? 'Aktif' : 'Nonaktif'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="prose dark:prose-invert max-w-none">
                                    <div dangerouslySetInnerHTML={{ __html: announcement.content }} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Informasi Pengumuman</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Dibuat Oleh</p>
                                        <p className="text-sm text-muted-foreground">{announcement.creator?.name || 'Unknown'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Dibuat Pada</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(announcement.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                {announcement.published_at && (
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">Dipublish Pada</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(announcement.published_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {announcement.expires_at && (
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">Expires Pada</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(announcement.expires_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Visible To</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {announcement.visible_to_roles.map((role) => (
                                        <Badge key={role} variant="secondary">
                                            {formatRole(role)}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

AnnouncementShow.layout = {
    breadcrumbs: [
        {
            title: 'Pengumuman',
            href: '/announcements',
        },
        {
            title: 'Detail',
        },
    ],
};

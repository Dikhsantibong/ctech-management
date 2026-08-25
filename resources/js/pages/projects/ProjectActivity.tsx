import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Activity, PlusCircle, Edit, Trash2, CheckCircle, Calendar, Upload, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/fetch';

/** Aksi disimpan dalam bahasa Inggris di DB; tampilkan versi Indonesianya */
const ACTION_META: Record<string, { label: string; icon: React.ElementType; tone: string }> = {
    created: { label: 'menambahkan', icon: PlusCircle, tone: 'text-emerald-600 dark:text-emerald-400' },
    updated: { label: 'memperbarui', icon: Edit, tone: 'text-blue-600 dark:text-blue-400' },
    deleted: { label: 'menghapus', icon: Trash2, tone: 'text-rose-600 dark:text-rose-400' },
    completed: { label: 'menyelesaikan', icon: CheckCircle, tone: 'text-emerald-600 dark:text-emerald-400' },
    uploaded: { label: 'mengupload', icon: Upload, tone: 'text-violet-600 dark:text-violet-400' },
    scheduled: { label: 'menjadwalkan', icon: Calendar, tone: 'text-amber-600 dark:text-amber-400' },
};

export default function ProjectActivity({ project }: { project: any }) {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true);
            setError(false);
            try {
                const res = await apiFetch(`/api/v1/projects/${project.id}/activities`);
                if (!res.ok) throw new Error('request failed');
                const data = await res.json();
                setActivities(Array.isArray(data) ? data : []);
            } catch {
                setError(true);
                setActivities([]);
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, [project.id]);

    const relativeTime = (value: string) => {
        try {
            return formatDistanceToNow(new Date(value), { addSuffix: true, locale: localeId });
        } catch {
            return '';
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-lg border bg-card p-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <Activity className="h-5 w-5 text-muted-foreground" /> Linimasa Aktivitas
                </h3>
                <p className="text-sm text-muted-foreground">
                    Rekam jejak perubahan pada proyek ini — siapa melakukan apa dan kapan.
                </p>
            </div>

            <Card>
                <CardContent className="p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <Loader2 className="mb-2 h-8 w-8 animate-spin opacity-50" />
                            <p className="text-sm">Memuat aktivitas…</p>
                        </div>
                    ) : error ? (
                        <div className="py-12 text-center text-muted-foreground">
                            <Activity className="mx-auto mb-2 h-10 w-10 opacity-20" />
                            <p className="text-sm">Gagal memuat aktivitas. Coba muat ulang halaman.</p>
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground">
                            <Activity className="mx-auto mb-2 h-10 w-10 opacity-20" />
                            <p className="font-medium">Belum ada aktivitas tercatat</p>
                            <p className="text-sm">Perubahan pada milestone, dokumen, dan meeting akan muncul di sini.</p>
                        </div>
                    ) : (
                        <div className="relative ml-4 space-y-6 border-l py-2">
                            {activities.map((activity) => {
                                const meta = ACTION_META[String(activity.action).toLowerCase()] ?? {
                                    label: activity.action,
                                    icon: Activity,
                                    tone: 'text-muted-foreground',
                                };
                                const Icon = meta.icon;

                                return (
                                    <div key={activity.id} className="relative pl-6">
                                        <div className="absolute -left-[13px] top-0 rounded-full border bg-background p-1">
                                            <Icon className={`h-3.5 w-3.5 ${meta.tone}`} />
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                                <p className="text-sm">
                                                    <span className="font-semibold">{activity.user?.name || 'Sistem'}</span>{' '}
                                                    <span className={meta.tone}>{meta.label}</span>{' '}
                                                    <span className="text-muted-foreground">{activity.model_type}</span>
                                                </p>
                                                <span className="whitespace-nowrap text-xs text-muted-foreground">
                                                    {relativeTime(activity.created_at)}
                                                </span>
                                            </div>
                                            {activity.description && (
                                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

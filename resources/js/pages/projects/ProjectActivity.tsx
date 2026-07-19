import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Activity, PlusCircle, Edit, Trash2, CheckCircle, FileText, Calendar, Upload } from 'lucide-react';
import { apiFetch } from '@/lib/fetch';

export default function ProjectActivity({ project }: { project: any }) {
    const [activities, setActivities] = useState<any[]>([]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await apiFetch(`/api/v1/projects/${project.id}/activities`);
                const data = await res.json();
                setActivities(data);
            } catch (e) {
                console.error('Failed to fetch activities');
            }
        };
        fetchActivities();
    }, [project.id]);

    const getActionIcon = (action: string) => {
        switch (action.toLowerCase()) {
            case 'created': return <PlusCircle className="h-5 w-5 text-green-500" />;
            case 'updated': return <Edit className="h-5 w-5 text-blue-500" />;
            case 'deleted': return <Trash2 className="h-5 w-5 text-red-500" />;
            case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'uploaded': return <Upload className="h-5 w-5 text-purple-500" />;
            case 'scheduled': return <Calendar className="h-5 w-5 text-yellow-500" />;
            default: return <Activity className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium">Activity Timeline</h3>
            
            <Card>
                <CardContent className="p-6">
                    {activities.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Activity className="h-10 w-10 mx-auto mb-2 opacity-20" />
                            <p>No recent activity found for this project.</p>
                        </div>
                    ) : (
                        <div className="relative border-l border-muted ml-4 space-y-8 py-4">
                            {activities.map((activity) => (
                                <div key={activity.id} className="relative pl-6">
                                    <div className="absolute -left-3 top-0 bg-background rounded-full border shadow-sm p-0.5">
                                        {getActionIcon(activity.action)}
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">
                                                <span className="font-bold">{activity.user?.name || 'System'}</span>{' '}
                                                {activity.action} a {activity.model_type}
                                            </p>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                                                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

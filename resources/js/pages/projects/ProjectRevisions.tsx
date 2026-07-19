import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitCommit, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useForm } from '@inertiajs/react';

export default function ProjectRevisions({ project }: { project: any }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    
    // Fallback if revisions is undefined
    const revisions = project.revisions || [];

    const { data, setData, post, processing, reset } = useForm({
        version_tag: '',
        title: '',
        category: '',
        description: '',
        status: 'Pending'
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/projects/${project.id}/revisions`, {
            onSuccess: () => {
                toast.success('Revision logged successfully');
                setIsCreateOpen(false);
                reset();
            },
            onError: () => {
                toast.error('Failed to log revision. Please check inputs.');
            }
        });
    };

    const getStatusIcon = (status: string) => {
        if (status === 'Completed') return <CheckCircle className="h-4 w-4 text-emerald-500" />;
        if (status === 'In Progress') return <Clock className="h-4 w-4 text-blue-500" />;
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-card p-4 rounded-lg border shadow-sm">
                <h3 className="text-lg font-bold flex items-center"><GitCommit className="mr-2 text-primary h-5 w-5" /> Revision History</h3>
                
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="h-4 w-4 mr-2" /> Log Revision</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Log New Revision</DialogTitle></DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Version Tag</Label>
                                    <Input required placeholder="e.g. 1.0 or v1.1" value={data.version_tag} onChange={(e) => setData('version_tag', e.target.value)} />
                                </div>
                                <div>
                                    <Label>Category</Label>
                                    <Input required placeholder="e.g. Bug Fix, Feature" value={data.category} onChange={(e) => setData('category', e.target.value)} />
                                </div>
                            </div>
                            
                            <div>
                                <Label>Title / Short Description</Label>
                                <Input required placeholder="e.g. Add Payment Feature" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                            </div>
                            <div>
                                <Label>Detailed Description</Label>
                                <Textarea rows={3} value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            </div>
                            <div>
                                <Label>Status</Label>
                                <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" disabled={processing} className="w-full">Save Revision</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                {revisions.map((rev: any) => (
                    <Card key={rev.id} className="hover:shadow-md transition-shadow overflow-hidden">
                        <div className="border-l-4 border-primary p-4 bg-card flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="default" className="text-xs">{rev.version_tag}</Badge>
                                    <Badge variant="outline" className="text-xs bg-muted/50">{rev.category}</Badge>
                                </div>
                                <h4 className="font-bold text-base">{rev.title}</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{rev.description}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0 md:border-l md:pl-4">
                                <div className="flex items-center gap-1.5 text-sm font-medium">
                                    {getStatusIcon(rev.status)} {rev.status}
                                </div>
                                <div className="text-xs text-muted-foreground text-right">
                                    <p>By User ID: {rev.requested_by || 'System'}</p>
                                    <p>{new Date(rev.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric'})}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
                
                {revisions.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                        <GitCommit className="mx-auto h-12 w-12 opacity-20 mb-3" />
                        <p className="font-medium text-lg">No Revisions Yet</p>
                        <p className="text-sm">Log your first project revision above.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

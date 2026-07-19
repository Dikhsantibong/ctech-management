import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Plus, AlertTriangle, ArrowRight, Paperclip } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useForm, router } from '@inertiajs/react';

export default function ClientFeedback({ project }: { project: any }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const feedbacks = project.feedbacks || [];

    const { data, setData, post, processing, reset } = useForm({
        subject: '',
        message: '',
        priority: 'Medium',
        status: 'Open'
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/projects/${project.id}/feedbacks`, {
            onSuccess: () => {
                toast.success('Feedback submitted');
                setIsCreateOpen(false);
                reset();
            },
            onError: () => {
                toast.error('Failed to submit feedback.');
            }
        });
    };

    const convertToTask = (feedback: any) => {
        if (!confirm('Convert this feedback to a Task?')) return;
        
        // Let's call the endpoint to convert it
        router.post(`/projects/${project.id}/feedbacks/${feedback.id}/convert-to-task`, {}, {
            onSuccess: () => toast.success('Successfully converted to Task!'),
            onError: () => toast.error('Failed to convert to task.')
        });
    };

    const priorityColors = {
        'Low': 'bg-blue-100 text-blue-800 border-blue-200',
        'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'High': 'bg-orange-100 text-orange-800 border-orange-200',
        'Urgent': 'bg-red-100 text-red-800 border-red-200',
    };

    const statusColors = {
        'Open': 'default',
        'Review': 'secondary',
        'Development': 'outline',
        'Testing': 'outline',
        'Completed': 'outline'
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-card p-4 rounded-lg border shadow-sm">
                <h3 className="text-lg font-bold flex items-center"><MessageSquare className="mr-2 text-primary h-5 w-5" /> Client Feedback</h3>
                
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="h-4 w-4 mr-2" /> New Feedback</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Submit Client Feedback</DialogTitle></DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <Label>Title / Subject</Label>
                                <Input required placeholder="e.g. Button layout broken on Mobile" value={data.subject} onChange={(e) => setData('subject', e.target.value)} />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Textarea rows={4} required placeholder="Detail the issue or request..." value={data.message} onChange={(e) => setData('message', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Priority</Label>
                                    <Select value={data.priority} onValueChange={(val) => setData('priority', val)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                            <SelectItem value="Urgent">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Open">Open</SelectItem>
                                            <SelectItem value="Review">Review</SelectItem>
                                            <SelectItem value="Development">Development</SelectItem>
                                            <SelectItem value="Testing">Testing</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button type="submit" disabled={processing} className="w-full">Submit Feedback</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {feedbacks.map((fb: any) => (
                    <Card key={fb.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start gap-2 mb-2">
                                <Badge className={priorityColors[fb.priority as keyof typeof priorityColors] || priorityColors['Medium']} variant="outline">
                                    {fb.priority} Priority
                                </Badge>
                                <Badge variant={statusColors[fb.status as keyof typeof statusColors] as any || 'outline'}>{fb.status}</Badge>
                            </div>
                            <CardTitle className="text-base leading-tight">{fb.subject}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-4 line-clamp-3">{fb.message}</p>
                            
                            <div className="flex items-center justify-between mt-auto pt-4 border-t">
                                <div className="text-xs text-muted-foreground">
                                    <p>{new Date(fb.created_at).toLocaleDateString('id-ID')}</p>
                                </div>
                                <div className="flex gap-2">
                                    {fb.attachment_path && (
                                        <Button variant="outline" size="sm" className="h-8 text-xs">
                                            <Paperclip className="h-3.5 w-3.5 mr-1" /> File
                                        </Button>
                                    )}
                                    <Button variant="default" size="sm" className="h-8 text-xs" onClick={() => convertToTask(fb)}>
                                        Convert to Task <ArrowRight className="h-3 w-3 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                
                {feedbacks.length === 0 && (
                    <div className="md:col-span-2 text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                        <MessageSquare className="mx-auto h-12 w-12 opacity-20 mb-3" />
                        <p className="font-medium text-lg">No Feedback Logged</p>
                        <p className="text-sm">Client feedback will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

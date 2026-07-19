import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, CheckSquare, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function ProjectMilestones({ project }: { project: any }) {
    const { users } = usePage().props as any;
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        pic_user_id: '',
        start_date: '',
        end_date: '',
        status: 'Not Started'
    });

    const statuses = ['Not Started', 'In Progress', 'Review', 'Completed', 'Delayed'];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-500/10 text-green-700';
            case 'In Progress': return 'bg-blue-500/10 text-blue-700';
            case 'Review': return 'bg-yellow-500/10 text-yellow-700';
            case 'Delayed': return 'bg-red-500/10 text-red-700';
            default: return 'bg-gray-500/10 text-gray-700';
        }
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/api/v1/projects/${project.id}/milestones`, formData, {
            onSuccess: () => {
                toast.success('Milestone created');
                setIsCreateOpen(false);
                setFormData({ name: '', description: '', pic_user_id: '', start_date: '', end_date: '', status: 'Not Started' });
                router.reload({ only: ['project'] });
            },
            onError: () => toast.error('Failed to create milestone')
        });
    };

    const updateProgress = (milestoneId: number, progress: number) => {
        router.put(`/api/v1/milestones/${milestoneId}/progress`, { progress }, {
            onSuccess: () => {
                toast.success('Progress updated');
                router.reload({ only: ['project'] });
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-medium">Milestones</h3>
                    <p className="text-sm text-muted-foreground">Manage project phases and deliverables</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="h-4 w-4 mr-2" /> Add Milestone</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Milestone</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Input type="date" value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    <Input type="date" value={formData.end_date} onChange={(e) => setFormData({...formData, end_date: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Assign To</Label>
                                <Select value={formData.pic_user_id} onValueChange={(val) => setFormData({...formData, pic_user_id: val})}>
                                    <SelectTrigger><SelectValue placeholder="Select team member" /></SelectTrigger>
                                    <SelectContent>
                                        {users?.map((u: any) => <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full">Create</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Kanban Board View */}
            <div className="flex gap-4 overflow-x-auto pb-4">
                {statuses.map(status => (
                    <div key={status} className="min-w-[300px] flex-1 bg-muted/30 rounded-lg p-4">
                        <h4 className="font-semibold text-sm mb-4 flex justify-between items-center">
                            {status}
                            <Badge variant="secondary" className="rounded-full">
                                {project.milestones?.filter((m: any) => m.status === status).length || 0}
                            </Badge>
                        </h4>
                        
                        <div className="space-y-3">
                            {project.milestones?.filter((m: any) => m.status === status).map((milestone: any) => (
                                <Card key={milestone.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <h5 className="font-medium text-sm leading-tight">{milestone.name}</h5>
                                            <Badge className={getStatusColor(milestone.status)} variant="outline">
                                                {milestone.progress}%
                                            </Badge>
                                        </div>
                                        
                                        <div className="flex items-center text-xs text-muted-foreground gap-3">
                                            {milestone.end_date && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(milestone.end_date).toLocaleDateString()}
                                                </span>
                                            )}
                                            {milestone.pic && (
                                                <span className="flex items-center gap-1">
                                                    <div className="h-4 w-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                                                        {milestone.pic.name.charAt(0)}
                                                    </div>
                                                    {milestone.pic.name}
                                                </span>
                                            )}
                                        </div>

                                        <div className="w-full bg-secondary rounded-full h-1.5 mt-2">
                                            <div className="bg-primary h-1.5 rounded-full" style={{ width: `${milestone.progress}%` }}></div>
                                        </div>

                                        <div className="flex justify-between mt-2 pt-2 border-t text-xs">
                                            <button 
                                                onClick={() => updateProgress(milestone.id, Math.min(100, milestone.progress + 25))}
                                                className="text-blue-600 hover:underline">
                                                + Progress
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

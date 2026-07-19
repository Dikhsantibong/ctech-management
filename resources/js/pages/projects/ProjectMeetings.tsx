import { apiFetch } from '@/lib/fetch';
import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, Users, FileText, CheckCircle, Video, Play, MapPin, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProjectMeetings({ project }: { project: any }) {
    const { users } = usePage().props as any;
    const [meetings, setMeetings] = useState<any[]>([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    
    // Forms
    const [formData, setFormData] = useState({
        title: '',
        scheduled_at: '',
        duration_minutes: 60,
        location_or_link: '',
        description: '',
        participants: [] as string[]
    });

    const [momData, setMomData] = useState({ id: null as number | null, minutes: '' });
    const [isMomOpen, setIsMomOpen] = useState(false);

    const fetchMeetings = async () => {
        try {
            const res = await apiFetch(`/api/v1/projects/${project.id}/meetings`, {
                headers: { 'Accept': 'application/json' }
            });
            const data = await res.json();
            setMeetings(data);
        } catch (e) {
            console.error('Failed to fetch meetings');
        }
    };

    useEffect(() => {
        fetchMeetings();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await apiFetch(`/api/v1/projects/${project.id}/meetings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                toast.success('Meeting scheduled');
                setIsCreateOpen(false);
                setFormData({ title: '', scheduled_at: '', duration_minutes: 60, location_or_link: '', description: '', participants: [] });
                fetchMeetings();
            }
        } catch (e) {
            toast.error('Error scheduling meeting');
        }
    };

    const handleSaveMom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!momData.id) return;
        try {
            const res = await apiFetch(`/api/v1/meetings/${momData.id}/minutes`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ minutes_of_meeting: momData.minutes })
            });
            if (res.ok) {
                toast.success('MoM saved and meeting completed');
                setIsMomOpen(false);
                setMomData({ id: null, minutes: '' });
                fetchMeetings();
            }
        } catch (e) {
            toast.error('Error saving MoM');
        }
    };

    const handleParticipantToggle = (userId: string) => {
        setFormData(prev => {
            if (prev.participants.includes(userId)) {
                return { ...prev, participants: prev.participants.filter(id => id !== userId) };
            }
            return { ...prev, participants: [...prev.participants, userId] };
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Meeting Center</h3>
                
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button><CalendarIcon className="h-4 w-4 mr-2" /> Schedule Meeting</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader><DialogTitle>Schedule Meeting</DialogTitle></DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <Label>Title</Label>
                                <Input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Date & Time</Label>
                                    <Input required type="datetime-local" value={formData.scheduled_at} onChange={(e) => setFormData({...formData, scheduled_at: e.target.value})} />
                                </div>
                                <div>
                                    <Label>Duration (Minutes)</Label>
                                    <Input required type="number" min="15" step="15" value={formData.duration_minutes} onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})} />
                                </div>
                            </div>
                            <div>
                                <Label>Location / Video Link</Label>
                                <Input placeholder="Zoom / Google Meet link or Room name" value={formData.location_or_link} onChange={(e) => setFormData({...formData, location_or_link: e.target.value})} />
                            </div>
                            <div>
                                <Label>Agenda / Description</Label>
                                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                            </div>
                            <div>
                                <Label>Participants</Label>
                                <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-2 mt-2">
                                    {users?.map((u: any) => (
                                        <label key={u.id} className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-muted p-1 rounded">
                                            <input type="checkbox" checked={formData.participants.includes(u.id.toString())} onChange={() => handleParticipantToggle(u.id.toString())} />
                                            <span>{u.name} ({u.role})</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <Button type="submit" className="w-full">Schedule</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meetings.map((meeting: any) => (
                    <Card key={meeting.id} className="flex flex-col">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant={meeting.status === 'Completed' ? 'default' : 'secondary'}>
                                    {meeting.status}
                                </Badge>
                                {meeting.status === 'Scheduled' && (
                                    <Button variant="outline" size="sm" onClick={() => { setMomData({ id: meeting.id, minutes: meeting.minutes_of_meeting || '' }); setIsMomOpen(true); }}>
                                        <FileText className="h-3 w-3 mr-1" /> Add MoM
                                    </Button>
                                )}
                            </div>
                            <CardTitle className="text-lg">{meeting.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            <div className="flex flex-col space-y-2 text-sm text-muted-foreground mt-2">
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2" />
                                    {new Date(meeting.scheduled_at).toLocaleString()} ({meeting.duration_minutes} min)
                                </div>
                                <div className="flex items-center">
                                    {meeting.location_or_link?.includes('http') ? <Video className="h-4 w-4 mr-2 text-blue-500" /> : <MapPin className="h-4 w-4 mr-2" />}
                                    <span className="truncate">{meeting.location_or_link || 'TBD'}</span>
                                </div>
                            </div>
                            
                            {meeting.description && (
                                <p className="text-sm line-clamp-2 bg-muted p-2 rounded-md">{meeting.description}</p>
                            )}

                            <div>
                                <p className="text-xs font-semibold mb-2 flex items-center"><Users className="h-3 w-3 mr-1"/> Participants ({meeting.participants?.length})</p>
                                <div className="flex flex-wrap gap-1">
                                    {meeting.participants?.map((p: any) => (
                                        <Badge key={p.id} variant="outline" className="text-[10px]">{p.user?.name.split(' ')[0]}</Badge>
                                    ))}
                                </div>
                            </div>

                            {meeting.status === 'Completed' && (
                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-sm font-semibold mb-2 flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Minutes of Meeting</p>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">{meeting.minutes_of_meeting}</p>
                                    <Button variant="link" className="p-0 h-auto text-xs" onClick={() => { setMomData({ id: meeting.id, minutes: meeting.minutes_of_meeting }); setIsMomOpen(true); }}>Read Full MoM</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isMomOpen} onOpenChange={setIsMomOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader><DialogTitle>Minutes of Meeting (MoM)</DialogTitle></DialogHeader>
                    <form onSubmit={handleSaveMom} className="space-y-4">
                        <Textarea 
                            className="min-h-[300px]" 
                            placeholder="Write the meeting minutes, decisions, and action items here..."
                            value={momData.minutes}
                            onChange={(e) => setMomData({...momData, minutes: e.target.value})}
                        />
                        <Button type="submit">Save & Complete Meeting</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

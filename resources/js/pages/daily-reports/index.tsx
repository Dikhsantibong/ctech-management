import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Trash, FileText, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiFetch } from '@/lib/fetch';

export default function DailyReportsIndex({ users, projects }: { users: any[], projects: any[] }) {
    const { auth } = usePage().props as any;
    const isManager = ['direktur_utama', 'direktur_operasional', 'admin_operasional'].includes(auth.user.role);

    const [reports, setReports] = useState<any[]>([]);
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
    const [filterUser, setFilterUser] = useState<string>('');

    // Form State
    const [formData, setFormData] = useState({
        report_date: new Date().toISOString().split('T')[0],
        blockers: '',
        notes: '',
        tasks: [{ project_id: '', task_description: '', hours_spent: '', status: 'Completed' }]
    });

    const fetchReports = async () => {
        try {
            let url = `/api/v1/daily-reports?date=${filterDate}`;
            if (isManager && filterUser && filterUser !== 'all') {
                url += `&user_id=${filterUser}`;
            }
            const res = await apiFetch(url);
            const data = await res.json();
            setReports(data.data || []);
        } catch (e) {
            toast.error('Failed to load reports');
        }
    };

    useEffect(() => {
        fetchReports();
    }, [filterDate, filterUser]);

    const handleAddTask = () => {
        setFormData({
            ...formData,
            tasks: [...formData.tasks, { project_id: '', task_description: '', hours_spent: '', status: 'Completed' }]
        });
    };

    const handleRemoveTask = (index: number) => {
        const newTasks = [...formData.tasks];
        newTasks.splice(index, 1);
        setFormData({ ...formData, tasks: newTasks });
    };

    const handleTaskChange = (index: number, field: string, value: string) => {
        const newTasks = [...formData.tasks] as any[];
        newTasks[index][field] = value;
        setFormData({ ...formData, tasks: newTasks });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                tasks: formData.tasks.map(t => ({
                    ...t,
                    project_id: (t.project_id === '' || t.project_id === 'none') ? null : t.project_id,
                    hours_spent: t.hours_spent === '' ? null : parseFloat(t.hours_spent)
                }))
            };

            const res = await apiFetch('/api/v1/daily-reports', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success('Daily report submitted successfully');
                setFormData({
                    report_date: new Date().toISOString().split('T')[0],
                    blockers: '',
                    notes: '',
                    tasks: [{ project_id: '', task_description: '', hours_spent: '', status: 'Completed' }]
                });
                fetchReports();
            } else {
                toast.error('Failed to submit report');
            }
        } catch (e) {
            toast.error('Error submitting report');
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        if (status === 'Completed') return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center w-max"><CheckCircle className="w-3 h-3 mr-1" /> Completed</span>;
        if (status === 'In Progress') return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center w-max"><Calendar className="w-3 h-3 mr-1" /> In Progress</span>;
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center w-max"><AlertCircle className="w-3 h-3 mr-1" /> Blocked</span>;
    };

    return (
        <>
            <Head title="Daily Reports" />
            
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Daily Reports</h2>
                    <p className="text-muted-foreground">Manage and view daily work reports.</p>
                </div>
                <div className="space-y-6">
                    
                    <Tabs defaultValue={isManager ? "team" : "mine"} className="w-full">
                        <TabsList className="mb-4 bg-muted/50 p-1">
                            {isManager && <TabsTrigger value="team" className="rounded-md">Team Reports</TabsTrigger>}
                            <TabsTrigger value="mine" className="rounded-md">Submit My Report</TabsTrigger>
                        </TabsList>

                        {isManager && (
                            <TabsContent value="team">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                                        <CardTitle className="text-lg font-medium">Team Daily Reports</CardTitle>
                                        <div className="flex space-x-2">
                                            <Select value={filterUser} onValueChange={setFilterUser}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="All Users" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Users</SelectItem>
                                                    {users.map(u => <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-6">
                                        {reports.length === 0 ? (
                                            <div className="text-center py-12 text-muted-foreground">
                                                <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                                <p>No reports found for this date.</p>
                                            </div>
                                        ) : (
                                            reports.map(report => (
                                                <div key={report.id} className="border rounded-lg p-4 bg-white">
                                                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                                                        <div className="font-semibold text-lg">{report.user.name}</div>
                                                        <div className="text-sm text-muted-foreground">{report.report_date}</div>
                                                    </div>
                                                    
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="text-sm font-semibold mb-2">Tasks Worked On:</h4>
                                                            <div className="space-y-2">
                                                                {report.tasks.map((task: any) => (
                                                                    <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-muted/30 p-2 rounded border text-sm">
                                                                        <div className="flex-1">
                                                                            <span className="font-medium">{task.project?.project_name || 'General Task'}</span>: {task.task_description}
                                                                        </div>
                                                                        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                                                                            <span className="text-muted-foreground whitespace-nowrap">{task.hours_spent ? `${task.hours_spent} hours` : '-'}</span>
                                                                            <StatusBadge status={task.status} />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {report.blockers && (
                                                            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded text-sm">
                                                                <span className="font-semibold flex items-center"><AlertCircle className="w-4 h-4 mr-1"/> Blockers:</span>
                                                                <p className="mt-1">{report.blockers}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        )}

                        <TabsContent value="mine">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Submit Daily Report</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <Label>Report Date</Label>
                                            <Input type="date" required value={formData.report_date} onChange={(e) => setFormData({...formData, report_date: e.target.value})} className="w-[200px]" />
                                        </div>

                                        <div className="space-y-4">
                                            <Label className="text-base font-semibold">Tasks</Label>
                                            {formData.tasks.map((task, index) => (
                                                <div key={index} className="flex flex-col md:flex-row gap-4 items-start p-4 border rounded-lg bg-muted/10 relative">
                                                    <div className="flex-1 space-y-4 w-full">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <Label>Project (Optional)</Label>
                                                                <Select value={task.project_id} onValueChange={(val) => handleTaskChange(index, 'project_id', val)}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select Project" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="none">-- General / No Project --</SelectItem>
                                                                        {projects.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.project_name}</SelectItem>)}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label>Status</Label>
                                                                <Select value={task.status} onValueChange={(val) => handleTaskChange(index, 'status', val)}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Status" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                                                        <SelectItem value="Completed">Completed</SelectItem>
                                                                        <SelectItem value="Blocked">Blocked</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Label>Task Description</Label>
                                                            <Input required placeholder="What did you do?" value={task.task_description} onChange={(e) => handleTaskChange(index, 'task_description', e.target.value)} />
                                                        </div>
                                                        <div className="w-1/3">
                                                            <Label>Hours Spent</Label>
                                                            <Input type="number" step="0.5" min="0" placeholder="e.g. 2.5" value={task.hours_spent} onChange={(e) => handleTaskChange(index, 'hours_spent', e.target.value)} />
                                                        </div>
                                                    </div>
                                                    
                                                    {formData.tasks.length > 1 && (
                                                        <Button type="button" variant="ghost" size="icon" className="text-red-500 absolute top-2 right-2 md:relative md:top-0" onClick={() => handleRemoveTask(index)}>
                                                            <Trash className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                            
                                            <Button type="button" variant="outline" onClick={handleAddTask}>
                                                <Plus className="w-4 h-4 mr-2" /> Add Another Task
                                            </Button>
                                        </div>

                                        <div>
                                            <Label>Blockers / Issues (Optional)</Label>
                                            <Textarea placeholder="Any blockers that prevent you from completing your work?" value={formData.blockers} onChange={(e) => setFormData({...formData, blockers: e.target.value})} className="border-red-200 focus-visible:ring-red-500" />
                                        </div>

                                        <div>
                                            <Label>Additional Notes (Optional)</Label>
                                            <Textarea placeholder="Any other notes for the PM?" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
                                        </div>

                                        <Button type="submit" className="w-full md:w-auto">Submit Report</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
}

DailyReportsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Daily Reports',
            href: '/daily-reports',
        },
    ],
};

import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function WorksReport({ works, metrics }: { works: any[], metrics: any }) {
    
    // Status Distribution
    const statusCounts = works.reduce((acc, work) => {
        acc[work.status] = (acc[work.status] || 0) + 1;
        return acc;
    }, {});
    
    const statusData = {
        labels: Object.keys(statusCounts),
        datasets: [
            {
                data: Object.values(statusCounts),
                backgroundColor: [
                    '#f4f4f5', // Inbox
                    '#a1a1aa', // Todo
                    '#3b82f6', // In Progress
                    '#eab308', // Waiting
                    '#f97316', // Review
                    '#22c55e', // Done
                ],
                borderWidth: 1,
            },
        ],
    };

    // Category Distribution
    const categoryCounts = works.reduce((acc, work) => {
        acc[work.category] = (acc[work.category] || 0) + 1;
        return acc;
    }, {});
    
    const categoryData = {
        labels: Object.keys(categoryCounts),
        datasets: [
            {
                label: 'Works by Category',
                data: Object.values(categoryCounts),
                backgroundColor: '#3b82f6',
            },
        ],
    };

    // Works by Team Member
    const teamCounts = works.reduce((acc, work) => {
        const name = work.assignee ? work.assignee.name : 'Unassigned';
        acc[name] = (acc[name] || 0) + 1;
        return acc;
    }, {});

    // Monthly Completion Trend (Last 6 months)
    const completedWorks = works.filter(w => w.status === 'Done');
    const monthlyData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Static for MVP, normally dynamic based on data
        datasets: [
            {
                label: 'Completed Works',
                data: [12, 19, 15, 25, 22, completedWorks.length],
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.5)',
            },
        ],
    };

    return (
        <>
            <Head title="Work Management Report" />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.get('/works')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Work Management Report</h2>
                            <p className="text-muted-foreground">Key metrics and performance overview.</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => window.print()}>
                            <FileText className="mr-2 h-4 w-4" /> Export PDF
                        </Button>
                        <Button variant="outline" onClick={() => alert("Excel export functionality to be implemented.")}>
                            <Download className="mr-2 h-4 w-4" /> Export Excel
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Works</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.totalWorks}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600">{metrics.completedWorks}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Works</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{metrics.activeWorks}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-destructive">{metrics.overdueWorks}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.completionRate}%</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Work Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px] flex items-center justify-center">
                            <Pie data={statusData} options={{ maintainAspectRatio: false }} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Work Category Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <Bar data={categoryData} options={{ maintainAspectRatio: false }} />
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Monthly Completion Trend</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <Line data={monthlyData} options={{ maintainAspectRatio: false }} />
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Works by Team Member</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(teamCounts).map(([name, count]) => (
                                    <div key={name} className="flex items-center justify-between">
                                        <span className="font-medium">{name}</span>
                                        <span className="text-muted-foreground">{count as number} Works</span>
                                    </div>
                                ))}
                                {Object.keys(teamCounts).length === 0 && (
                                    <div className="text-muted-foreground text-center py-4">No data available.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

WorksReport.layout = {
    breadcrumbs: [
        {
            title: 'Works',
            href: '/works',
        },
        {
            title: 'Report',
            href: '/works/report',
        },
    ],
};

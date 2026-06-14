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

export default function ContentPlansReport({ contentPlans, metrics }: { contentPlans: any[], metrics: any }) {
    
    // Status Distribution
    const statusCounts = contentPlans.reduce((acc, cp) => {
        acc[cp.status] = (acc[cp.status] || 0) + 1;
        return acc;
    }, {});
    
    const statusData = {
        labels: Object.keys(statusCounts),
        datasets: [
            {
                data: Object.values(statusCounts),
                backgroundColor: [
                    '#f4f4f5', // Idea
                    '#a1a1aa', // Drafting
                    '#eab308', // Review
                    '#3b82f6', // Approved
                    '#f97316', // Scheduled
                    '#22c55e', // Published
                ],
                borderWidth: 1,
            },
        ],
    };

    // Platform Distribution
    const platformCounts = contentPlans.reduce((acc, cp) => {
        acc[cp.platform] = (acc[cp.platform] || 0) + 1;
        return acc;
    }, {});
    
    const platformData = {
        labels: Object.keys(platformCounts),
        datasets: [
            {
                label: 'Content by Platform',
                data: Object.values(platformCounts),
                backgroundColor: '#3b82f6',
            },
        ],
    };

    // Content Type Distribution
    const contentTypeCounts = contentPlans.reduce((acc, cp) => {
        acc[cp.content_type] = (acc[cp.content_type] || 0) + 1;
        return acc;
    }, {});

    const contentTypeData = {
        labels: Object.keys(contentTypeCounts),
        datasets: [
            {
                label: 'Content by Type',
                data: Object.values(contentTypeCounts),
                backgroundColor: '#8b5cf6', // purple
            },
        ],
    };

    // Assigned Team Member
    const teamCounts = contentPlans.reduce((acc, cp) => {
        const name = cp.assigned_to ? cp.assigned_to.name : 'Unassigned';
        acc[name] = (acc[name] || 0) + 1;
        return acc;
    }, {});

    // Monthly Completion Trend (Last 6 months placeholder)
    const completedPlans = contentPlans.filter(cp => cp.status === 'Published');
    const monthlyData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Static for MVP
        datasets: [
            {
                label: 'Published Content',
                data: [5, 8, 12, 10, 15, completedPlans.length],
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.5)',
            },
        ],
    };

    return (
        <>
            <Head title="Content Planning Report" />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.get('/content-plans')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Content Planning Report</h2>
                            <p className="text-muted-foreground">Key metrics and content overview.</p>
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
                            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.totalContent}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Published</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600">{metrics.publishedContent}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active (WIP)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{metrics.activeContent}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-destructive">{metrics.overdueContent}</div>
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
                            <CardTitle>Content Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px] flex items-center justify-center">
                            <Pie data={statusData} options={{ maintainAspectRatio: false }} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Platform Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <Bar data={platformData} options={{ maintainAspectRatio: false }} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Content Type Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <Bar data={contentTypeData} options={{ maintainAspectRatio: false, indexAxis: 'y' as const }} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Content Assigned by Team Member</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(teamCounts).map(([name, count]) => (
                                    <div key={name} className="flex items-center justify-between">
                                        <span className="font-medium">{name}</span>
                                        <span className="text-muted-foreground">{count as number} Items</span>
                                    </div>
                                ))}
                                {Object.keys(teamCounts).length === 0 && (
                                    <div className="text-muted-foreground text-center py-4">No data available.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Monthly Publication Trend</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <Line data={monthlyData} options={{ maintainAspectRatio: false }} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

ContentPlansReport.layout = {
    breadcrumbs: [
        {
            title: 'Content Planning',
            href: '/content-plans',
        },
        {
            title: 'Report',
            href: '/content-plans/report',
        },
    ],
};

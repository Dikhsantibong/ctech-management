import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Download, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function LetterShow({ letter }: { letter: any }) {
    const statusBadgeColor = (status: string) => {
        switch (status) {
            case 'Final': return 'default';
            default: return 'outline';
        }
    };

    const updateStatus = (newStatus: string) => {
        router.put(`/letters/${letter.id}`, { ...letter, status: newStatus }, { preserveScroll: true });
    };

    return (
        <>
            <Head title={letter.reference_number} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/letters">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold tracking-tight">{letter.reference_number}</h2>
                                <Badge variant={statusBadgeColor(letter.status)}>
                                    {letter.status}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground flex items-center gap-1">
                                {letter.type}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="w-32">
                            <Select value={letter.status} onValueChange={updateStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                    <SelectItem value="Final">Final</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button asChild>
                            <a href={`/letters/${letter.id}/pdf`} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4" /> Download PDF
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <Card className="min-h-[500px]">
                            <CardHeader className="border-b bg-muted/20 pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <CardTitle>Document Preview</CardTitle>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                                    <div>
                                        <span className="text-muted-foreground">To: </span>
                                        <span className="font-medium">{letter.recipient}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Subject: </span>
                                        <span className="font-medium">{letter.subject}</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap font-serif">
                                    {letter.content}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Document Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Reference No.</p>
                                    <p className="font-medium">{letter.reference_number}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                                    <p className="font-medium">{letter.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Created Date</p>
                                    <p className="font-medium">{new Date(letter.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Created By</p>
                                    <p className="font-medium">{letter.creator?.name}</p>
                                </div>
                                {letter.status === 'Final' && (
                                    <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-950/30 p-3 rounded-lg border border-green-200 dark:border-green-900">
                                        <CheckCircle className="h-5 w-5" />
                                        <span className="font-medium">Document is Finalized</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

LetterShow.layout = {
    breadcrumbs: [
        {
            title: 'Letters',
            href: '/letters',
        },
        {
            title: 'Document Viewer',
            href: '#',
        },
    ],
};

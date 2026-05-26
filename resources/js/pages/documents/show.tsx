import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DocumentShow({ document }: { document: any }) {
    return (
        <>
            <Head title={document.title} />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/documents">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">{document.title}</h2>
                    </div>
                </div>

                <Card className="min-h-[600px]">
                    <CardHeader className="border-b bg-muted/20">
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{document.creator?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>Last updated {new Date(document.updated_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <div className="prose prose-slate max-w-none dark:prose-invert whitespace-pre-wrap">
                            {/* Note: In a real app, you would parse the markdown here using a library like react-markdown */}
                            {document.content || <span className="italic text-muted-foreground">This document is empty.</span>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

DocumentShow.layout = {
    breadcrumbs: [
        {
            title: 'Documents',
            href: '/documents',
        },
        {
            title: 'View Document',
            href: '#',
        },
    ],
};

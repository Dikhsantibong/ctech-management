import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCompactCurrency, priorityColor, stageColor } from '@/lib/crm';

interface Column { stage: string; count: number; value: number; prospects: any[] }

export default function PipelineIndex({ columns }: { columns: Column[]; stages: string[] }) {
    const [dragId, setDragId] = useState<number | null>(null);
    const [overStage, setOverStage] = useState<string | null>(null);

    const onDrop = (stage: string) => {
        if (dragId !== null) {
            router.put(`/crm/prospek/${dragId}/stage`, { stage }, { preserveScroll: true });
        }
        setDragId(null);
        setOverStage(null);
    };

    return (
        <>
            <Head title="Pipeline" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Pipeline</h2>
                    <p className="text-muted-foreground">Geser kartu antar tahap untuk memperbarui posisi opportunity.</p>
                </div>

                <div className="overflow-x-auto pb-4">
                    <div className="flex min-w-max items-start gap-3">
                        {columns.map((col) => (
                            <div
                                key={col.stage}
                                onDragOver={(e) => { e.preventDefault(); setOverStage(col.stage); }}
                                onDragLeave={() => setOverStage((s) => (s === col.stage ? null : s))}
                                onDrop={() => onDrop(col.stage)}
                                className={`flex w-72 flex-col rounded-lg border bg-muted/30 ${overStage === col.stage ? 'ring-2 ring-primary' : ''}`}
                            >
                                <div className="flex items-center justify-between border-b bg-card p-3">
                                    <div>
                                        <div className="text-sm font-semibold">{col.stage}</div>
                                        <div className="text-xs text-muted-foreground">{formatCompactCurrency(col.value)}</div>
                                    </div>
                                    <Badge variant="secondary">{col.count}</Badge>
                                </div>
                                <div className="flex max-h-[calc(100vh-16rem)] flex-col gap-2 overflow-y-auto p-2">
                                    {col.prospects.map((p) => (
                                        <div
                                            key={p.id}
                                            draggable
                                            onDragStart={() => setDragId(p.id)}
                                            onDragEnd={() => setDragId(null)}
                                            className="group cursor-grab rounded-md border bg-card p-3 active:cursor-grabbing"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <Link href={`/crm/prospek/${p.id}`} className="text-sm font-medium hover:underline">{p.company_name}</Link>
                                                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100" />
                                            </div>
                                            {p.pic_name && <div className="mt-0.5 text-xs text-muted-foreground">{p.pic_name}</div>}
                                            <div className="mt-2 flex items-center justify-between">
                                                <Badge variant="outline" className={priorityColor(p.priority)}>{p.priority}</Badge>
                                                {p.estimated_value ? <span className="text-xs font-medium">{formatCompactCurrency(p.estimated_value)}</span> : null}
                                            </div>
                                            {p.sales?.name && <div className="mt-2 border-t pt-2 text-xs text-muted-foreground">{p.sales.name}</div>}
                                        </div>
                                    ))}
                                    {col.prospects.length === 0 && (
                                        <div className="rounded-md border border-dashed p-4 text-center text-xs text-muted-foreground">Kosong</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {columns.map((c) => (
                        <span key={c.stage}><Badge variant="outline" className={stageColor(c.stage)}>{c.stage}</Badge></span>
                    ))}
                </div>
            </div>
        </>
    );
}

PipelineIndex.layout = {
    breadcrumbs: [{ title: 'CRM', href: '/crm' }, { title: 'Pipeline', href: '/crm/pipeline' }],
};

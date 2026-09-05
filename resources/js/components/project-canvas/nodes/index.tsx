import { memo } from 'react';
import { Handle, Position, NodeResizer, type NodeProps, type NodeTypes } from '@xyflow/react';
import {
    Database, KeyRound, Link2, Box, Puzzle, AppWindow, FileText, Webhook, UserCog, Cloud, StickyNote,
} from 'lucide-react';
import type { CanvasNodeData, CanvasColumn } from '@/lib/canvas';

/** Empat titik sambung: atas/kiri sebagai target, bawah/kanan sebagai source. */
function Ports() {
    const cls = '!h-2 !w-2 !border !border-primary/60 !bg-background';
    return (
        <>
            <Handle id="t" type="target" position={Position.Top} className={cls} />
            <Handle id="l" type="target" position={Position.Left} className={cls} />
            <Handle id="b" type="source" position={Position.Bottom} className={cls} />
            <Handle id="r" type="source" position={Position.Right} className={cls} />
        </>
    );
}

const ring = (selected?: boolean) => (selected ? 'ring-2 ring-primary ring-offset-1' : '');

function StartEnd({ data, selected, tone }: { data: CanvasNodeData; selected?: boolean; tone: 'start' | 'end' }) {
    const styles = tone === 'start'
        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900'
        : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900';
    return (
        <div className={`min-w-[120px] rounded-full border px-5 py-2.5 text-center text-sm font-semibold ${styles} ${ring(selected)}`}>
            <Ports />
            {data.label || (tone === 'start' ? 'Mulai' : 'Selesai')}
        </div>
    );
}

const StartNode = memo(({ data, selected }: NodeProps) => <StartEnd data={data as CanvasNodeData} selected={selected} tone="start" />);
const EndNode = memo(({ data, selected }: NodeProps) => <StartEnd data={data as CanvasNodeData} selected={selected} tone="end" />);

const ProcessNode = memo(({ data, selected }: NodeProps) => {
    const d = data as CanvasNodeData;
    return (
        <div className={`min-w-[140px] max-w-[240px] rounded-md border bg-card px-4 py-2.5 text-sm text-card-foreground shadow-sm ${ring(selected)}`}>
            <Ports />
            <p className="font-medium leading-snug">{d.label || 'Proses'}</p>
            {d.description ? <p className="mt-0.5 text-xs text-muted-foreground">{d.description}</p> : null}
        </div>
    );
});

const SubprocessNode = memo(({ data, selected }: NodeProps) => {
    const d = data as CanvasNodeData;
    return (
        <div className={`min-w-[140px] max-w-[240px] rounded-md border border-x-4 border-x-primary/40 bg-card px-4 py-2.5 text-sm shadow-sm ${ring(selected)}`}>
            <Ports />
            <p className="font-medium leading-snug">{d.label || 'Subproses'}</p>
        </div>
    );
});

const DecisionNode = memo(({ data, selected }: NodeProps) => {
    const d = data as CanvasNodeData;
    return (
        <div className="relative flex h-[92px] w-[150px] items-center justify-center">
            <Ports />
            <div className={`absolute inset-0 m-auto h-[70px] w-[70px] rotate-45 border bg-amber-50 dark:bg-amber-950/40 dark:border-amber-900 ${ring(selected)}`} style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(45deg)' }} />
            <span className="relative z-10 max-w-[130px] px-1 text-center text-xs font-medium text-amber-900 dark:text-amber-200">{d.label || 'Keputusan?'}</span>
        </div>
    );
});

const DataNode = memo(({ data, selected }: NodeProps) => {
    const d = data as CanvasNodeData;
    return (
        <div className="relative">
            <Ports />
            <div className={`min-w-[130px] -skew-x-12 rounded-sm border bg-sky-50 px-4 py-2.5 dark:bg-sky-950/40 dark:border-sky-900 ${ring(selected)}`}>
                <p className="skew-x-12 text-center text-sm font-medium text-sky-900 dark:text-sky-200">{d.label || 'Data'}</p>
            </div>
        </div>
    );
});

const TextNode = memo(({ data, selected }: NodeProps) => {
    const d = data as CanvasNodeData;
    return (
        <div className={`min-w-[80px] rounded px-2 py-1 text-sm ${selected ? 'ring-1 ring-primary' : ''}`}>
            <Ports />
            {d.label || 'Teks'}
        </div>
    );
});

const NoteNode = memo(({ data, selected }: NodeProps) => {
    const d = data as CanvasNodeData;
    return (
        <div className={`min-h-[64px] w-[180px] rounded-md border border-amber-200 bg-amber-100/80 p-3 text-sm text-amber-900 shadow-sm dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200 ${ring(selected)}`}>
            <Ports />
            <div className="mb-1 flex items-center gap-1 text-xs font-semibold opacity-70"><StickyNote className="h-3 w-3" /> Note</div>
            <p className="whitespace-pre-wrap leading-snug">{d.label || 'Catatan...'}</p>
        </div>
    );
});

const SectionNode = memo(({ data, selected }: NodeProps) => {
    const d = data as CanvasNodeData;
    return (
        <div className={`h-full w-full rounded-lg border-2 border-dashed border-border bg-muted/20 ${selected ? 'border-primary/50' : ''}`}>
            <NodeResizer isVisible={selected} minWidth={220} minHeight={160} lineClassName="!border-primary" handleClassName="!h-2.5 !w-2.5 !bg-primary" />
            <div className="pointer-events-none px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{d.label || 'SECTION'}</div>
            <Handle id="t" type="target" position={Position.Top} className="!h-2 !w-2 !bg-primary/50" />
            <Handle id="b" type="source" position={Position.Bottom} className="!h-2 !w-2 !bg-primary/50" />
        </div>
    );
});

const DatabaseNode = memo(({ data, selected }: NodeProps) => {
    const d = data as CanvasNodeData;
    const columns: CanvasColumn[] = Array.isArray(d.columns) ? d.columns : [];
    return (
        <div className={`min-w-[200px] overflow-hidden rounded-md border bg-card text-card-foreground shadow-sm ${ring(selected)}`}>
            <Ports />
            <div className="flex items-center gap-1.5 border-b bg-muted/50 px-3 py-1.5">
                <Database className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-semibold">{d.label || 'table'}</span>
            </div>
            <div className="divide-y">
                {columns.length === 0 && <div className="px-3 py-1.5 text-xs italic text-muted-foreground">Belum ada kolom</div>}
                {columns.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1 text-xs">
                        <span className="w-3.5 shrink-0">
                            {c.pk ? <KeyRound className="h-3 w-3 text-amber-500" /> : c.fk ? <Link2 className="h-3 w-3 text-blue-500" /> : null}
                        </span>
                        <span className={`flex-1 ${c.pk ? 'font-semibold' : ''}`}>{c.name}</span>
                        <span className="text-muted-foreground">{c.type}</span>
                    </div>
                ))}
            </div>
        </div>
    );
});

const APP_ICONS: Record<string, typeof Box> = {
    Module: Box, Feature: Puzzle, Application: AppWindow, Page: FileText, API: Webhook, 'User Role': UserCog, 'External Service': Cloud,
};

const AppObjectNode = memo(({ data, selected }: NodeProps) => {
    const d = data as CanvasNodeData;
    const kind = d.objectKind || 'Module';
    const Icon = APP_ICONS[kind] ?? Box;
    return (
        <div className={`min-w-[170px] max-w-[240px] rounded-md border bg-card text-card-foreground shadow-sm ${ring(selected)}`}>
            <Ports />
            <div className="flex items-center gap-1.5 border-b px-3 py-1.5">
                <Icon className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{kind}</span>
            </div>
            <div className="px-3 py-2">
                <p className="text-sm font-medium leading-snug">{d.label || kind}</p>
                {d.module ? <p className="text-xs text-muted-foreground">Modul: {d.module}</p> : null}
                {d.status ? <p className="mt-1 inline-block rounded-full border bg-muted/50 px-2 py-0.5 text-[11px] text-muted-foreground">{d.status}</p> : null}
            </div>
        </div>
    );
});

export const nodeTypes: NodeTypes = {
    start: StartNode,
    end: EndNode,
    process: ProcessNode,
    subprocess: SubprocessNode,
    decision: DecisionNode,
    data: DataNode,
    text: TextNode,
    note: NoteNode,
    section: SectionNode,
    database: DatabaseNode,
    module: AppObjectNode,
    feature: AppObjectNode,
    application: AppObjectNode,
    page: AppObjectNode,
    api: AppObjectNode,
    userRole: AppObjectNode,
    externalService: AppObjectNode,
};

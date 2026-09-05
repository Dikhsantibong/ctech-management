import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ReactFlow, ReactFlowProvider, Background, BackgroundVariant, Controls, MiniMap, Panel,
    useNodesState, useEdgesState, addEdge, useReactFlow,
    type Node, type Edge, type Connection,
} from '@xyflow/react';
import { Cloud, CloudOff, Loader2, Search, FileUp, History, Maximize, Undo2, Redo2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { nodeTypes } from './nodes';
import { edgeTypes, defaultEdgeMarker } from './edges';
import { CanvasToolbar } from './CanvasToolbar';
import { CanvasProperties } from './CanvasProperties';
import { ImportDocumentationDialog } from './ImportDocumentationDialog';
import { VersionHistory } from './VersionHistory';
import { NODE_DEFS, newId, csrfFetch, type CanvasNodeData } from '@/lib/canvas';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface Props {
    projectId: number;
    initialNodes: any[];
    initialEdges: any[];
    initialViewport: any;
    initialVersions: any[];
}

const MINIMAP_COLORS: Record<string, string> = {
    start: '#12B76A', end: '#F04438', decision: '#F79009', database: '#155EEF', section: '#E4E7EC',
};

function toRFNode(n: any): Node {
    const isSection = n.type === 'section';
    return {
        id: n.id,
        type: n.type,
        position: n.position ?? { x: 0, y: 0 },
        data: n.data ?? { label: '' },
        ...(isSection
            ? { style: { width: n.width ?? 340, height: n.height ?? 220, zIndex: 0 }, width: n.width ?? 340, height: n.height ?? 220 }
            : {}),
        ...(n.style && !isSection ? { style: n.style } : {}),
    } as Node;
}

function CanvasInner({ projectId, initialNodes, initialEdges, initialViewport, initialVersions }: Props) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes.map(toRFNode));
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(
        initialEdges.map((e) => ({ ...e, markerEnd: e.type === 'relationship' ? undefined : defaultEdgeMarker })),
    );
    const [mode, setMode] = useState<'select' | 'hand'>('select');
    const [status, setStatus] = useState<SaveStatus>('idle');
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
    const [importOpen, setImportOpen] = useState(false);
    const [versionOpen, setVersionOpen] = useState(false);
    const [versions, setVersions] = useState<any[]>(initialVersions);
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [propsOpen, setPropsOpen] = useState(true);

    const rf = useReactFlow();
    const viewportRef = useRef<any>(initialViewport ?? null);
    const addOffset = useRef(0);

    // ===== Autosave signature + history =====
    const lastSig = useRef<string>('');
    const lastSnapshot = useRef<{ nodes: Node[]; edges: Edge[] }>({ nodes: [], edges: [] });
    const past = useRef<{ nodes: Node[]; edges: Edge[] }[]>([]);
    const future = useRef<{ nodes: Node[]; edges: Edge[] }[]>([]);
    const skipHistory = useRef(false);
    const initialized = useRef(false);
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const signature = useCallback((ns: Node[], es: Edge[]) => JSON.stringify({
        n: ns.map((n) => ({ i: n.id, t: n.type, x: Math.round(n.position.x), y: Math.round(n.position.y), d: n.data, w: n.width ?? n.style?.width, h: n.height ?? n.style?.height })),
        e: es.map((e) => ({ i: e.id, s: e.source, t: e.target, l: e.label, ty: e.type, d: e.data })),
    }), []);

    const buildPayload = useCallback(() => ({
        nodes: nodes.map((n) => ({
            id: n.id, type: n.type, position: n.position, data: n.data,
            width: (n.width ?? (n.style?.width as number)) || null,
            height: (n.height ?? (n.style?.height as number)) || null,
            style: n.type === 'section' ? undefined : n.style,
            source_document_id: (n.data as CanvasNodeData)?.source_document_id ?? (n as any).source_document_id ?? null,
            source_type: (n.data as CanvasNodeData)?.source_type ?? null,
            source_reference: (n.data as CanvasNodeData)?.source_reference ?? null,
        })),
        edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target, sourceHandle: e.sourceHandle, targetHandle: e.targetHandle, label: e.label, type: e.type, data: e.data })),
        viewport: viewportRef.current,
    }), [nodes, edges]);

    const saveNow = useCallback(async () => {
        setStatus('saving');
        try {
            const res = await csrfFetch(`/projects/${projectId}/canvas`, { method: 'PUT', body: buildPayload() });
            setStatus(res.ok ? 'saved' : 'error');
        } catch {
            setStatus('error');
        }
    }, [projectId, buildPayload]);

    // Efek: deteksi perubahan → jadwalkan autosave (debounce) + rekam history.
    useEffect(() => {
        // Jangan rekam/­simpan saat node sedang di-drag — tunggu sampai selesai.
        if (nodes.some((n) => (n as any).dragging)) return;
        const sig = signature(nodes, edges);
        if (!initialized.current) {
            initialized.current = true;
            lastSig.current = sig;
            lastSnapshot.current = { nodes, edges };
            return;
        }
        if (sig === lastSig.current) return;

        if (!skipHistory.current) {
            past.current.push(lastSnapshot.current);
            if (past.current.length > 50) past.current.shift();
            future.current = [];
        } else {
            skipHistory.current = false;
        }
        lastSig.current = sig;
        lastSnapshot.current = { nodes, edges };

        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => { void saveNow(); }, 800);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodes, edges]);

    const undo = useCallback(() => {
        if (past.current.length === 0) return;
        future.current.push(lastSnapshot.current);
        const prev = past.current.pop()!;
        skipHistory.current = true;
        setNodes(prev.nodes);
        setEdges(prev.edges);
    }, [setNodes, setEdges]);

    const redo = useCallback(() => {
        if (future.current.length === 0) return;
        past.current.push(lastSnapshot.current);
        const next = future.current.pop()!;
        skipHistory.current = true;
        setNodes(next.nodes);
        setEdges(next.edges);
    }, [setNodes, setEdges]);

    // ===== Connect =====
    const onConnect = useCallback((c: Connection) => {
        const src = nodes.find((n) => n.id === c.source);
        const tgt = nodes.find((n) => n.id === c.target);
        const isErd = src?.type === 'database' || tgt?.type === 'database';
        setEdges((eds) => addEdge({
            ...c,
            id: newId('e'),
            type: isErd ? 'relationship' : 'flow',
            data: isErd ? { cardinality: '1:N' } : {},
            markerEnd: isErd ? undefined : defaultEdgeMarker,
        }, eds));
    }, [nodes, setEdges]);

    // ===== Add node =====
    const addNode = useCallback((type: string) => {
        const def = NODE_DEFS[type];
        if (!def) return;
        addOffset.current = (addOffset.current + 1) % 6;
        const center = rf.screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        const pos = { x: center.x + addOffset.current * 24 - 80, y: center.y + addOffset.current * 24 - 40 };
        const node: Node = {
            id: newId('n'),
            type,
            position: pos,
            data: { ...def.defaultData },
            ...(type === 'section' ? { style: { width: 340, height: 220, zIndex: 0 }, width: 340, height: 220 } : {}),
        } as Node;
        setNodes((ns) => ns.concat(node));
    }, [rf, setNodes]);

    // ===== Selection =====
    const onSelectionChange = useCallback(({ nodes: sn, edges: se }: { nodes: Node[]; edges: Edge[] }) => {
        setSelectedNode(sn.length === 1 ? sn[0] : null);
        setSelectedEdge(se.length === 1 && sn.length === 0 ? se[0] : null);
        if (sn.length === 1 || se.length === 1) setPropsOpen(true);
    }, []);

    // Keep the selected node object fresh with latest data.
    const liveSelectedNode = useMemo(() => (selectedNode ? nodes.find((n) => n.id === selectedNode.id) ?? null : null), [selectedNode, nodes]);
    const liveSelectedEdge = useMemo(() => (selectedEdge ? edges.find((e) => e.id === selectedEdge.id) ?? null : null), [selectedEdge, edges]);

    const updateNodeData = useCallback((id: string, patch: Partial<CanvasNodeData>) => {
        setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)));
    }, [setNodes]);

    const updateEdge = useCallback((id: string, patch: Record<string, unknown>) => {
        setEdges((es) => es.map((e) => (e.id === id ? { ...e, ...patch, markerEnd: (patch.type ?? e.type) === 'relationship' ? undefined : defaultEdgeMarker } : e)));
    }, [setEdges]);

    const deleteSelected = useCallback(() => {
        setNodes((ns) => ns.filter((n) => !n.selected));
        setEdges((es) => es.filter((e) => !e.selected));
        setSelectedNode(null); setSelectedEdge(null);
    }, [setNodes, setEdges]);

    // ===== Copy / paste =====
    const clipboard = useRef<Node[]>([]);
    const copySelection = useCallback(() => { clipboard.current = nodes.filter((n) => n.selected); }, [nodes]);
    const paste = useCallback(() => {
        if (clipboard.current.length === 0) return;
        const clones = clipboard.current.map((n) => ({ ...n, id: newId('n'), position: { x: n.position.x + 32, y: n.position.y + 32 }, selected: false }));
        setNodes((ns) => ns.concat(clones));
    }, [setNodes]);

    // ===== Keyboard shortcuts =====
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const el = document.activeElement;
            const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || (el as HTMLElement).isContentEditable);
            if (typing) return;
            const mod = e.ctrlKey || e.metaKey;
            if (mod && e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
            else if (mod && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) { e.preventDefault(); redo(); }
            else if (mod && e.key.toLowerCase() === 'c') { copySelection(); }
            else if (mod && e.key.toLowerCase() === 'v') { paste(); }
            else if (mod && e.key.toLowerCase() === 'a') { e.preventDefault(); setNodes((ns) => ns.map((n) => ({ ...n, selected: true }))); }
            else if (e.key === 'Delete' || e.key === 'Backspace') { deleteSelected(); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [undo, redo, copySelection, paste, deleteSelected, setNodes]);

    // ===== Import =====
    const handleImport = useCallback((newNodes: any[], newEdges: any[]) => {
        const existingIds = new Set(nodes.map((n) => n.id));
        const idMap: Record<string, string> = {};
        const offsetY = nodes.length > 0 ? Math.max(...nodes.map((n) => n.position.y)) + 160 : 0;
        const rfNodes = newNodes.map((n) => {
            const id = existingIds.has(n.id) ? newId('imp') : n.id;
            idMap[n.id] = id;
            return toRFNode({ ...n, id, position: { x: (n.position?.x ?? 0) + 40, y: (n.position?.y ?? 0) + offsetY } });
        });
        const rfEdges = newEdges.map((e) => ({
            id: newId('e'), source: idMap[e.source] ?? e.source, target: idMap[e.target] ?? e.target,
            type: e.type ?? 'flow', label: e.label, data: e.data ?? {},
            markerEnd: (e.type ?? 'flow') === 'relationship' ? undefined : defaultEdgeMarker,
        }));
        setNodes((ns) => ns.concat(rfNodes as Node[]));
        setEdges((es) => es.concat(rfEdges as Edge[]));
        toast.success(`${rfNodes.length} node ditambahkan ke canvas.`);
        window.setTimeout(() => rf.fitView({ padding: 0.2, duration: 400 }), 100);
    }, [nodes, setNodes, setEdges, rf]);

    // ===== Restore version =====
    const handleRestored = useCallback((rn: any[], re: any[], vp: any) => {
        skipHistory.current = false;
        setNodes(rn.map(toRFNode));
        setEdges(re.map((e) => ({ ...e, markerEnd: e.type === 'relationship' ? undefined : defaultEdgeMarker })));
        if (vp) { viewportRef.current = vp; rf.setViewport(vp); }
        toast.success('Canvas dikembalikan ke versi terpilih.');
    }, [setNodes, setEdges, rf]);

    // ===== Search =====
    const results = useMemo(() => {
        if (!search.trim()) return [];
        const q = search.toLowerCase();
        return nodes.filter((n) => String((n.data as CanvasNodeData)?.label ?? '').toLowerCase().includes(q)).slice(0, 8);
    }, [search, nodes]);

    const focusNode = (n: Node) => {
        rf.setCenter(n.position.x + 80, n.position.y + 40, { zoom: 1.2, duration: 500 });
        setNodes((ns) => ns.map((x) => ({ ...x, selected: x.id === n.id })));
        setShowSearch(false); setSearch('');
    };

    const statusUI = {
        idle: { icon: Cloud, text: 'Siap', cls: 'text-muted-foreground' },
        saving: { icon: Loader2, text: 'Menyimpan...', cls: 'text-muted-foreground' },
        saved: { icon: Cloud, text: 'Tersimpan', cls: 'text-emerald-600' },
        error: { icon: CloudOff, text: 'Gagal menyimpan', cls: 'text-rose-600' },
    }[status];
    const StatusIcon = statusUI.icon;

    return (
        <div className="flex h-full flex-col">
            {/* Action bar */}
            <div className="flex items-center justify-between gap-3 border-b bg-card px-3 py-2">
                <div className={`flex items-center gap-1.5 text-xs font-medium ${statusUI.cls}`}>
                    <StatusIcon className={`h-3.5 w-3.5 ${status === 'saving' ? 'animate-spin' : ''}`} /> {statusUI.text}
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={undo} title="Undo (Ctrl+Z)"><Undo2 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={redo} title="Redo (Ctrl+Shift+Z)"><Redo2 className="h-4 w-4" /></Button>
                    <div className="mx-1 h-5 w-px bg-border" />
                    <Button variant="ghost" size="sm" onClick={() => setShowSearch((s) => !s)} title="Cari node"><Search className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => rf.fitView({ padding: 0.2, duration: 400 })} title="Fit to screen"><Maximize className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}><FileUp className="mr-1.5 h-4 w-4" /> Import</Button>
                    <Button variant="outline" size="sm" onClick={() => setVersionOpen(true)}><History className="mr-1.5 h-4 w-4" /> Versi</Button>
                </div>
            </div>

            <div className="relative flex flex-1 overflow-hidden">
                {/* Left toolbar */}
                <div className="absolute left-3 top-3 z-10">
                    <CanvasToolbar mode={mode} onMode={setMode} onAdd={addNode} />
                </div>

                {/* Search popover */}
                {showSearch && (
                    <div className="absolute left-1/2 top-3 z-20 w-80 -translate-x-1/2 rounded-lg border bg-card p-2 shadow-md">
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <Input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari node berdasarkan nama..." className="h-8 border-0 shadow-none focus-visible:ring-0" />
                            <button onClick={() => setShowSearch(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
                        </div>
                        {results.length > 0 && (
                            <div className="mt-1 max-h-64 overflow-y-auto border-t pt-1">
                                {results.map((n) => (
                                    <button key={n.id} onClick={() => focusNode(n)} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-muted">
                                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{n.type}</span>
                                        <span className="truncate">{String((n.data as CanvasNodeData)?.label ?? n.id)}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Canvas */}
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onSelectionChange={onSelectionChange}
                    onMoveEnd={(_, vp) => { viewportRef.current = vp; }}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    defaultViewport={initialViewport ?? { x: 0, y: 0, zoom: 1 }}
                    panOnDrag={mode === 'hand'}
                    selectionOnDrag={mode === 'select'}
                    nodesDraggable
                    deleteKeyCode={null}
                    minZoom={0.1}
                    maxZoom={2.5}
                    proOptions={{ hideAttribution: true }}
                    className="bg-background"
                >
                    <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--color-border, #E4E7EC)" />
                    <Controls showInteractive={false} />
                    <MiniMap pannable zoomable nodeColor={(n) => MINIMAP_COLORS[n.type ?? ''] ?? '#98A2B3'} className="!bg-card" />
                    <Panel position="bottom-center" className="rounded-md border bg-card px-2 py-1 text-[11px] text-muted-foreground shadow-sm">
                        {Math.round((rf.getZoom?.() ?? 1) * 100)}% · {nodes.length} node · {edges.length} connector
                    </Panel>
                </ReactFlow>

                {/* Right properties */}
                {propsOpen && (
                    <div className="hidden w-80 shrink-0 border-l bg-card lg:block">
                        <CanvasProperties
                            node={liveSelectedNode}
                            edge={liveSelectedEdge}
                            onNodeData={updateNodeData}
                            onEdge={updateEdge}
                            onDelete={deleteSelected}
                            onClose={() => setPropsOpen(false)}
                        />
                    </div>
                )}
                {/* Mobile properties drawer */}
                {propsOpen && (liveSelectedNode || liveSelectedEdge) && (
                    <div className="absolute inset-y-0 right-0 z-30 w-80 max-w-[85%] border-l bg-card shadow-lg lg:hidden">
                        <CanvasProperties
                            node={liveSelectedNode}
                            edge={liveSelectedEdge}
                            onNodeData={updateNodeData}
                            onEdge={updateEdge}
                            onDelete={deleteSelected}
                            onClose={() => setPropsOpen(false)}
                        />
                    </div>
                )}
            </div>

            <ImportDocumentationDialog open={importOpen} onClose={() => setImportOpen(false)} projectId={projectId} onImport={handleImport} />
            <VersionHistory
                open={versionOpen}
                onClose={() => setVersionOpen(false)}
                projectId={projectId}
                versions={versions}
                onVersionsChange={setVersions}
                onRestored={handleRestored}
                onBeforeSnapshot={saveNow}
            />
        </div>
    );
}

export function ProjectCanvasEditor(props: Props) {
    return (
        <ReactFlowProvider>
            <CanvasInner {...props} />
        </ReactFlowProvider>
    );
}

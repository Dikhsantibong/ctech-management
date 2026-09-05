import { Trash2, Plus, ExternalLink, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NODE_DEFS, STATUS_OPTIONS, type CanvasColumn, type CanvasNodeData } from '@/lib/canvas';

interface Props {
    node: any | null;
    edge: any | null;
    onNodeData: (id: string, patch: Partial<CanvasNodeData>) => void;
    onEdge: (id: string, patch: Record<string, unknown>) => void;
    onDelete: () => void;
    onClose: () => void;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <Label className="text-xs">{label}</Label>
            {children}
        </div>
    );
}

export function CanvasProperties({ node, edge, onNodeData, onEdge, onDelete, onClose }: Props) {
    if (!node && !edge) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                <p className="text-sm font-medium text-muted-foreground">Tidak ada yang dipilih</p>
                <p className="mt-1 text-xs text-muted-foreground">Klik sebuah node atau connector untuk melihat propertinya.</p>
            </div>
        );
    }

    if (edge) {
        return (
            <div className="flex h-full flex-col">
                <Header title="Properti Connector" onClose={onClose} />
                <div className="flex-1 space-y-4 overflow-y-auto p-4">
                    <Row label="Label">
                        <Input value={edge.label ?? ''} onChange={(e) => onEdge(edge.id, { label: e.target.value })} placeholder="mis. 1:N" />
                    </Row>
                    <Row label="Jenis">
                        <Select value={edge.type ?? 'flow'} onValueChange={(v) => onEdge(edge.id, { type: v })}>
                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="flow">Flow (panah)</SelectItem>
                                <SelectItem value="relationship">Relationship (ERD)</SelectItem>
                            </SelectContent>
                        </Select>
                    </Row>
                    {edge.type === 'relationship' && (
                        <Row label="Kardinalitas">
                            <Select value={(edge.data?.cardinality as string) ?? '1:N'} onValueChange={(v) => onEdge(edge.id, { data: { ...(edge.data ?? {}), cardinality: v } })}>
                                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1:1">1 : 1</SelectItem>
                                    <SelectItem value="1:N">1 : N</SelectItem>
                                    <SelectItem value="N:1">N : 1</SelectItem>
                                    <SelectItem value="N:N">N : N</SelectItem>
                                </SelectContent>
                            </Select>
                        </Row>
                    )}
                </div>
                <Footer onDelete={onDelete} label="Hapus Connector" />
            </div>
        );
    }

    const data: CanvasNodeData = node.data ?? {};
    const def = NODE_DEFS[node.type];
    const isErd = node.type === 'database';
    const isApp = def?.category === 'app';
    const patch = (p: Partial<CanvasNodeData>) => onNodeData(node.id, p);

    return (
        <div className="flex h-full flex-col">
            <Header title="Properti" onClose={onClose} />
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
                <div className="flex items-center justify-between">
                    <span className="rounded-full border bg-muted/50 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{def?.label ?? node.type}</span>
                </div>

                <Row label={isErd ? 'Nama Tabel' : 'Nama'}>
                    <Input value={data.label ?? ''} onChange={(e) => patch({ label: e.target.value })} />
                </Row>

                {!isErd && node.type !== 'text' && (
                    <Row label="Deskripsi">
                        <Textarea rows={2} value={data.description ?? ''} onChange={(e) => patch({ description: e.target.value })} />
                    </Row>
                )}

                {isApp && (
                    <>
                        <Row label="Module"><Input value={data.module ?? ''} onChange={(e) => patch({ module: e.target.value })} /></Row>
                        <Row label="Feature"><Input value={data.feature ?? ''} onChange={(e) => patch({ feature: e.target.value })} /></Row>
                        <Row label="Route"><Input value={data.route ?? ''} onChange={(e) => patch({ route: e.target.value })} placeholder="procurement/hps" /></Row>
                        <Row label="Repository"><Input value={data.repository ?? ''} onChange={(e) => patch({ repository: e.target.value })} /></Row>
                        <Row label="Documentation"><Input value={data.documentation ?? ''} onChange={(e) => patch({ documentation: e.target.value })} /></Row>
                    </>
                )}

                {(def?.category === 'flow' || isApp) && (
                    <>
                        <Row label="PIC"><Input value={data.pic ?? ''} onChange={(e) => patch({ pic: e.target.value })} /></Row>
                        <Row label="Status">
                            <Select value={data.status ?? ''} onValueChange={(v) => patch({ status: v })}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="Pilih status" /></SelectTrigger>
                                <SelectContent>{STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                            </Select>
                        </Row>
                    </>
                )}

                {isErd && <ColumnsEditor data={data} onChange={patch} />}

                <Row label="Catatan">
                    <Textarea rows={2} value={data.notes ?? ''} onChange={(e) => patch({ notes: e.target.value })} />
                </Row>

                {data.route ? (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={`/${String(data.route).replace(/^\//, '')}`}><ExternalLink className="mr-2 h-4 w-4" /> Buka Feature</a>
                    </Button>
                ) : isApp ? (
                    <Button variant="outline" size="sm" className="w-full" disabled><ExternalLink className="mr-2 h-4 w-4" /> Buka Feature</Button>
                ) : null}

                {data.source_reference ? (
                    <p className="text-xs text-muted-foreground">Berasal dari dokumen: <span className="font-medium">{String(data.source_reference)}</span></p>
                ) : null}
            </div>
            <Footer onDelete={onDelete} label="Hapus Node" />
        </div>
    );
}

function ColumnsEditor({ data, onChange }: { data: CanvasNodeData; onChange: (p: Partial<CanvasNodeData>) => void }) {
    const columns: CanvasColumn[] = Array.isArray(data.columns) ? data.columns : [];
    const update = (i: number, p: Partial<CanvasColumn>) => {
        const next = columns.map((c, idx) => (idx === i ? { ...c, ...p } : c));
        onChange({ columns: next });
    };
    const add = () => onChange({ columns: [...columns, { name: 'column', type: 'varchar', key: '' }] });
    const remove = (i: number) => onChange({ columns: columns.filter((_, idx) => idx !== i) });

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label className="text-xs">Kolom</Label>
                <Button variant="ghost" size="sm" onClick={add}><Plus className="mr-1 h-3.5 w-3.5" /> Tambah</Button>
            </div>
            <div className="space-y-2">
                {columns.map((c, i) => (
                    <div key={i} className="rounded-md border p-2">
                        <div className="flex gap-1.5">
                            <Input className="h-8" value={c.name} onChange={(e) => update(i, { name: e.target.value })} placeholder="nama" />
                            <Input className="h-8 w-24" value={c.type ?? ''} onChange={(e) => update(i, { type: e.target.value })} placeholder="tipe" />
                            <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => remove(i)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                        </div>
                        <div className="mt-1.5 flex gap-3 text-xs">
                            <label className="flex items-center gap-1"><input type="checkbox" checked={!!c.pk} onChange={(e) => update(i, { pk: e.target.checked, key: e.target.checked ? 'PK' : '' })} /> PK</label>
                            <label className="flex items-center gap-1"><input type="checkbox" checked={!!c.fk} onChange={(e) => update(i, { fk: e.target.checked, key: e.target.checked ? 'FK' : c.pk ? 'PK' : '' })} /> FK</label>
                        </div>
                    </div>
                ))}
                {columns.length === 0 && <p className="text-xs italic text-muted-foreground">Belum ada kolom.</p>}
            </div>
        </div>
    );
}

function Header({ title, onClose }: { title: string; onClose: () => void }) {
    return (
        <div className="flex items-center justify-between border-b p-3">
            <h3 className="text-sm font-semibold">{title}</h3>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 lg:hidden" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
    );
}

function Footer({ onDelete, label }: { onDelete: () => void; label: string }) {
    return (
        <div className="border-t p-3">
            <Button variant="outline" size="sm" className="w-full text-destructive hover:text-destructive" onClick={onDelete}>
                <Trash2 className="mr-2 h-4 w-4" /> {label}
            </Button>
        </div>
    );
}

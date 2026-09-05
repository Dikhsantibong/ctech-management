import { useState } from 'react';
import { Upload, ClipboardPaste, Download, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { csrfFetch } from '@/lib/canvas';

interface PreviewResult {
    detected_type: string;
    nodes: any[];
    edges: any[];
    warnings: string[];
    unmapped: string[];
}

const TYPES = [
    { value: 'auto', label: 'Auto Detect' },
    { value: 'flow', label: 'Business Flow' },
    { value: 'database', label: 'Database Schema' },
    { value: 'architecture', label: 'System Architecture' },
    { value: 'api', label: 'API Documentation' },
];

export function ImportDocumentationDialog({ open, onClose, projectId, onImport }: {
    open: boolean; onClose: () => void; projectId: number; onImport: (nodes: any[], edges: any[]) => void;
}) {
    const [mode, setMode] = useState<'upload' | 'paste'>('paste');
    const [content, setContent] = useState('');
    const [type, setType] = useState('auto');
    const [preview, setPreview] = useState<PreviewResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reset = () => { setContent(''); setPreview(null); setError(null); setType('auto'); };
    const close = () => { reset(); onClose(); };

    const onFile = (file?: File | null) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setContent(String(reader.result ?? ''));
        reader.readAsText(file);
    };

    const runPreview = async () => {
        if (!content.trim()) { setError('Isi atau unggah dokumentasi terlebih dahulu.'); return; }
        setLoading(true); setError(null);
        try {
            const res = await csrfFetch(`/projects/${projectId}/canvas/import`, { method: 'POST', body: { content, type } });
            if (!res.ok) throw new Error('Gagal memproses dokumen.');
            setPreview(await res.json());
        } catch (e: any) {
            setError(e.message ?? 'Terjadi kesalahan.');
        } finally {
            setLoading(false);
        }
    };

    const confirmImport = () => {
        if (!preview) return;
        onImport(preview.nodes, preview.edges);
        close();
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && close()}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Import Documentation</DialogTitle>
                    <DialogDescription>Ubah dokumentasi Markdown menjadi node & connector di canvas. Markdown hanya dibaca sebagai data.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Template */}
                    <div className="flex flex-wrap items-center gap-2 rounded-md border bg-muted/30 p-3 text-sm">
                        <span className="text-muted-foreground">Template:</span>
                        <Button variant="outline" size="sm" asChild><a href={`/projects/${projectId}/canvas/template?type=database`}><Download className="mr-1.5 h-3.5 w-3.5" /> Database Schema (.md)</a></Button>
                        <Button variant="outline" size="sm" asChild><a href={`/projects/${projectId}/canvas/template?type=flow`}><Download className="mr-1.5 h-3.5 w-3.5" /> Business Flow (.md)</a></Button>
                    </div>

                    {/* Source toggle */}
                    <div className="flex gap-2">
                        <Button variant={mode === 'paste' ? 'default' : 'outline'} size="sm" onClick={() => setMode('paste')}><ClipboardPaste className="mr-1.5 h-4 w-4" /> Paste Markdown</Button>
                        <Button variant={mode === 'upload' ? 'default' : 'outline'} size="sm" onClick={() => setMode('upload')}><Upload className="mr-1.5 h-4 w-4" /> Upload Markdown</Button>
                    </div>

                    {mode === 'upload' ? (
                        <input type="file" accept=".md,.markdown,text/markdown" onChange={(e) => onFile(e.target.files?.[0])}
                            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-input file:bg-background file:px-3 file:py-1.5 file:text-sm hover:file:bg-muted" />
                    ) : null}

                    <Textarea rows={7} value={content} onChange={(e) => setContent(e.target.value)} placeholder="# Database Schema&#10;&#10;## users&#10;| Column | Type | Key |&#10;| id | bigint | PK |" className="font-mono text-xs" />

                    {/* Type */}
                    <div>
                        <Label className="mb-2 block text-xs">Tipe Dokumen</Label>
                        <div className="flex flex-wrap gap-3">
                            {TYPES.map((t) => (
                                <label key={t.value} className="flex items-center gap-1.5 text-sm">
                                    <input type="radio" name="doctype" checked={type === t.value} onChange={() => setType(t.value)} /> {t.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    {/* Preview */}
                    {preview && (
                        <div className="space-y-3 rounded-md border p-3">
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                <span className="inline-flex items-center gap-1.5 font-medium"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Terdeteksi: {preview.detected_type}</span>
                                <span className="text-muted-foreground">{preview.nodes.length} node · {preview.edges.length} connector</span>
                            </div>
                            {preview.warnings.length > 0 && (
                                <div className="rounded bg-amber-50 p-2 text-xs text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                                    <p className="mb-1 flex items-center gap-1 font-medium"><AlertTriangle className="h-3.5 w-3.5" /> Perhatian</p>
                                    {preview.warnings.map((w, i) => <p key={i}>• {w}</p>)}
                                </div>
                            )}
                            {preview.nodes.length > 0 && (
                                <div className="max-h-40 space-y-1 overflow-y-auto">
                                    {preview.nodes.map((n, i) => (
                                        <div key={i} className="flex items-center gap-2 rounded border bg-muted/20 px-2 py-1 text-xs">
                                            <FileText className="h-3 w-3 text-muted-foreground" />
                                            <span className="font-medium">{n.data?.label ?? n.id}</span>
                                            <span className="text-muted-foreground">({n.type})</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {preview.unmapped.length > 0 && (
                                <div className="text-xs text-muted-foreground">Tidak terpetakan: {preview.unmapped.join(', ')}</div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={close}>Batal</Button>
                    {!preview ? (
                        <Button onClick={runPreview} disabled={loading}>{loading ? 'Memproses...' : 'Preview'}</Button>
                    ) : (
                        <Button onClick={confirmImport} disabled={preview.nodes.length === 0}>Import to Canvas</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

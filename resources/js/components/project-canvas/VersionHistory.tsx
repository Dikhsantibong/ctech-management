import { useState } from 'react';
import { History, RotateCcw, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { csrfFetch } from '@/lib/canvas';

interface Version {
    id: number; version_number: number; name: string | null; description: string | null; created_by: string | null; created_at: string | null;
}

export function VersionHistory({ open, onClose, projectId, versions, onVersionsChange, onRestored, onBeforeSnapshot }: {
    open: boolean; onClose: () => void; projectId: number; versions: Version[];
    onVersionsChange: (v: Version[]) => void;
    onRestored: (nodes: any[], edges: any[], viewport: any) => void;
    onBeforeSnapshot: () => Promise<void>;
}) {
    const [desc, setDesc] = useState('');
    const [busy, setBusy] = useState(false);

    const saveVersion = async () => {
        setBusy(true);
        try {
            await onBeforeSnapshot(); // pastikan perubahan terakhir tersimpan dulu
            const res = await csrfFetch(`/projects/${projectId}/canvas/versions`, { method: 'POST', body: { description: desc || null } });
            if (res.ok) {
                const json = await res.json();
                onVersionsChange(json.versions);
                setDesc('');
            }
        } finally {
            setBusy(false);
        }
    };

    const restore = async (v: Version) => {
        if (!confirm(`Restore ke versi #${v.version_number}? Kondisi saat ini akan disimpan sebagai versi baru terlebih dahulu.`)) return;
        setBusy(true);
        try {
            const res = await csrfFetch(`/projects/${projectId}/canvas/versions/${v.id}/restore`, { method: 'POST' });
            if (res.ok) {
                const json = await res.json();
                onRestored(json.nodes, json.edges, json.viewport);
                onVersionsChange(json.versions);
                onClose();
            }
        } finally {
            setBusy(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><History className="h-4 w-4" /> Version History</DialogTitle>
                    <DialogDescription>Simpan snapshot canvas dan kembalikan ke versi sebelumnya kapan pun.</DialogDescription>
                </DialogHeader>

                <div className="space-y-2 rounded-md border bg-muted/20 p-3">
                    <Label className="text-xs">Simpan versi baru</Label>
                    <div className="flex gap-2">
                        <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Deskripsi, mis. Added Procurement Module" />
                        <Button onClick={saveVersion} disabled={busy}><Save className="mr-1.5 h-4 w-4" /> Simpan</Button>
                    </div>
                </div>

                <div className="space-y-2">
                    {versions.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Belum ada versi tersimpan.</p>}
                    {versions.map((v) => (
                        <div key={v.id} className="flex items-start justify-between gap-3 rounded-md border p-3">
                            <div className="min-w-0">
                                <p className="text-sm font-medium">Version {v.version_number}</p>
                                <p className="truncate text-xs text-muted-foreground">{v.description || v.name || 'Tanpa deskripsi'}</p>
                                <p className="mt-0.5 text-[11px] text-muted-foreground">{v.created_by ?? 'Sistem'} · {v.created_at ? new Date(v.created_at).toLocaleString('id-ID') : ''}</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => restore(v)} disabled={busy}><RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Restore</Button>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}

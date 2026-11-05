import { AlertTriangle, CheckCircle2, ExternalLink, Loader2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LinkPreviews } from './LinkPreviews';

interface ShareCheck {
    key: string;
    label: string;
    status: 'pass' | 'warn' | 'fail';
    message: string;
}

interface ShareMeta {
    title: string;
    description: string;
    url: string;
    image: { url: string; width: number | null; height: number | null; is_default: boolean };
    story_image_url: string;
    json_ld: Record<string, unknown>;
}

const statusIcon = {
    pass: <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />,
    warn: <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />,
    fail: <XCircle className="h-4 w-4 shrink-0 text-destructive" />,
};

/**
 * Pratinjau link preview berdasarkan metadata yang sama persis dengan yang dirender server untuk crawler.
 */
export function SharePreviewDialog({ newsId, open, onOpenChange }: { newsId: number | null; open: boolean; onOpenChange: (open: boolean) => void }) {
    // Hasil disimpan per newsId agar data artikel lain tidak ikut tampil saat dialog dibuka ulang.
    const [loaded, setLoaded] = useState<{ newsId: number; data?: { meta: ShareMeta; checks: ShareCheck[] }; error?: string } | null>(null);
    const result = loaded?.newsId === newsId ? (loaded.data ?? null) : null;
    const error = loaded?.newsId === newsId ? (loaded.error ?? null) : null;

    useEffect(() => {
        if (!open || !newsId) {
            return;
        }

        fetch(`/news/${newsId}/share-preview`, { headers: { Accept: 'application/json' } })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                return response.json();
            })
            .then((data) => setLoaded({ newsId, data }))
            .catch((reason: Error) => setLoaded({ newsId, error: reason.message }));
    }, [open, newsId]);

    const meta = result?.meta;
    const encodedUrl = meta ? encodeURIComponent(meta.url) : '';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Preview & Validasi Sosial Media</DialogTitle>
                    <DialogDescription>Metadata di bawah adalah yang dibaca crawler WhatsApp, Telegram, Facebook, LinkedIn, dan X dari URL publik artikel.</DialogDescription>
                </DialogHeader>

                {!result && !error && (
                    <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Memeriksa metadata…
                    </div>
                )}
                {error && <p className="py-8 text-center text-sm text-destructive">Gagal memuat preview ({error}).</p>}

                {meta && result && (
                    <div className="max-h-[70vh] space-y-6 overflow-y-auto pr-1">
                        <div className="grid gap-2 rounded-lg border p-4 sm:grid-cols-2">
                            {result.checks.map((check) => (
                                <div key={check.key} className="flex gap-2 text-sm">
                                    {statusIcon[check.status]}
                                    <div>
                                        <p className="font-medium">{check.label}</p>
                                        <p className="break-all text-xs text-muted-foreground">{check.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <LinkPreviews title={meta.title} description={meta.description} imageUrl={meta.image.url} url={meta.url} />

                        <div className="space-y-2 rounded-lg border p-4 text-sm">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-medium">Gambar preview:</span>
                                <Badge variant="outline">
                                    {meta.image.width && meta.image.height ? `${meta.image.width} × ${meta.image.height}` : 'ukuran tidak diketahui'}
                                </Badge>
                                {meta.image.is_default && <Badge variant="secondary">Default CTECH</Badge>}
                                <span className="font-medium">Schema:</span>
                                <Badge variant="outline">{String(meta.json_ld['@type'])}</Badge>
                            </div>
                            <p className="font-medium">Validasi eksternal (gunakan URL artikel yang sudah Published):</p>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    ['Facebook Sharing Debugger', `https://developers.facebook.com/tools/debug/?q=${encodedUrl}`],
                                    ['LinkedIn Post Inspector', `https://www.linkedin.com/post-inspector/inspect/${encodedUrl}`],
                                    ['OpenGraph.xyz', `https://www.opengraph.xyz/url/${encodedUrl}`],
                                    ['Story image 1080 × 1920', meta.story_image_url],
                                ].map(([label, href]) => (
                                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline">
                                        {label} <ExternalLink className="h-3 w-3" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

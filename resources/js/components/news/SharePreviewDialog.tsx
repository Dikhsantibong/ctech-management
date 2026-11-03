import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, ExternalLink, Loader2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

function PreviewFrame({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            {children}
        </div>
    );
}

/**
 * Pratinjau link preview berdasarkan metadata yang sama persis dengan yang dirender server untuk crawler.
 */
export function SharePreviewDialog({ newsId, open, onOpenChange }: { newsId: number | null; open: boolean; onOpenChange: (open: boolean) => void }) {
    const [result, setResult] = useState<{ meta: ShareMeta; checks: ShareCheck[] } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open || !newsId) {
            return;
        }

        setResult(null);
        setError(null);
        fetch(`/news/${newsId}/share-preview`, { headers: { Accept: 'application/json' } })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
            })
            .then(setResult)
            .catch((reason: Error) => setError(reason.message));
    }, [open, newsId]);

    const meta = result?.meta;
    const domain = meta ? new URL(meta.url).host : '';
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

                        <div className="grid gap-6 md:grid-cols-2">
                            <PreviewFrame label="WhatsApp / Telegram">
                                <div className="rounded-lg bg-[#d9fdd3] p-1.5 text-[#111b21]">
                                    <div className="overflow-hidden rounded-md bg-[#cfe9c6]">
                                        <img src={meta.image.url} alt="" className="aspect-[1.91/1] w-full object-cover" />
                                        <div className="space-y-0.5 p-2">
                                            <p className="line-clamp-2 text-sm font-semibold">{meta.title}</p>
                                            <p className="line-clamp-2 text-xs text-[#3b4a54]">{meta.description}</p>
                                            <p className="text-xs text-[#667781]">{domain}</p>
                                        </div>
                                    </div>
                                    <p className="break-all px-1 pt-1 text-xs text-[#027eb5]">{meta.url}</p>
                                </div>
                            </PreviewFrame>

                            <PreviewFrame label="Facebook">
                                <div className="overflow-hidden border border-[#dadde1] bg-white text-[#050505]">
                                    <img src={meta.image.url} alt="" className="aspect-[1.91/1] w-full object-cover" />
                                    <div className="border-t border-[#dadde1] bg-[#f0f2f5] px-3 py-2">
                                        <p className="text-xs uppercase text-[#65676b]">{domain}</p>
                                        <p className="line-clamp-2 font-semibold">{meta.title}</p>
                                        <p className="line-clamp-1 text-sm text-[#65676b]">{meta.description}</p>
                                    </div>
                                </div>
                            </PreviewFrame>

                            <PreviewFrame label="LinkedIn">
                                <div className="overflow-hidden rounded-md border border-[#e0dfdc] bg-white text-[#191919]">
                                    <img src={meta.image.url} alt="" className="aspect-[1.91/1] w-full object-cover" />
                                    <div className="px-3 py-2">
                                        <p className="line-clamp-2 text-sm font-semibold">{meta.title}</p>
                                        <p className="text-xs text-[#666666]">{domain}</p>
                                    </div>
                                </div>
                            </PreviewFrame>

                            <PreviewFrame label="X (summary_large_image)">
                                <div className="text-[#0f1419]">
                                    <div className="relative overflow-hidden rounded-2xl border border-[#cfd9de]">
                                        <img src={meta.image.url} alt="" className="aspect-[1.91/1] w-full object-cover" />
                                        <span className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">{meta.title}</span>
                                    </div>
                                    <p className="pt-1 text-xs text-[#536471]">Dari {domain}</p>
                                </div>
                            </PreviewFrame>
                        </div>

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

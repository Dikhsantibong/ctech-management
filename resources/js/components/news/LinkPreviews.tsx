interface LinkPreviewsProps {
    title: string;
    description: string;
    imageUrl: string;
    url: string;
    /** Satu kolom untuk panel samping yang sempit. */
    compact?: boolean;
}

function PreviewFrame({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            {children}
        </div>
    );
}

function hostOf(url: string): string {
    try {
        return new URL(url).host;
    } catch {
        return url;
    }
}

/**
 * Tiruan tampilan link preview WhatsApp/Telegram, Facebook, LinkedIn, dan X.
 */
export function LinkPreviews({ title, description, imageUrl, url, compact = false }: LinkPreviewsProps) {
    const domain = hostOf(url);

    return (
        <div className={compact ? 'grid gap-6' : 'grid gap-6 md:grid-cols-2'}>
            <PreviewFrame label="WhatsApp / Telegram">
                <div className="rounded-lg bg-[#d9fdd3] p-1.5 text-[#111b21]">
                    <div className="overflow-hidden rounded-md bg-[#cfe9c6]">
                        <img src={imageUrl} alt="" className="aspect-[1.91/1] w-full object-cover" />
                        <div className="space-y-0.5 p-2">
                            <p className="line-clamp-2 text-sm font-semibold">{title}</p>
                            <p className="line-clamp-2 text-xs text-[#3b4a54]">{description}</p>
                            <p className="text-xs text-[#667781]">{domain}</p>
                        </div>
                    </div>
                    <p className="break-all px-1 pt-1 text-xs text-[#027eb5]">{url}</p>
                </div>
            </PreviewFrame>

            <PreviewFrame label="Facebook">
                <div className="overflow-hidden border border-[#dadde1] bg-white text-[#050505]">
                    <img src={imageUrl} alt="" className="aspect-[1.91/1] w-full object-cover" />
                    <div className="border-t border-[#dadde1] bg-[#f0f2f5] px-3 py-2">
                        <p className="text-xs uppercase text-[#65676b]">{domain}</p>
                        <p className="line-clamp-2 font-semibold">{title}</p>
                        <p className="line-clamp-1 text-sm text-[#65676b]">{description}</p>
                    </div>
                </div>
            </PreviewFrame>

            <PreviewFrame label="LinkedIn">
                <div className="overflow-hidden rounded-md border border-[#e0dfdc] bg-white text-[#191919]">
                    <img src={imageUrl} alt="" className="aspect-[1.91/1] w-full object-cover" />
                    <div className="px-3 py-2">
                        <p className="line-clamp-2 text-sm font-semibold">{title}</p>
                        <p className="text-xs text-[#666666]">{domain}</p>
                    </div>
                </div>
            </PreviewFrame>

            <PreviewFrame label="X (summary_large_image)">
                <div className="text-[#0f1419]">
                    <div className="relative overflow-hidden rounded-2xl border border-[#cfd9de]">
                        <img src={imageUrl} alt="" className="aspect-[1.91/1] w-full object-cover" />
                        <span className="absolute bottom-2 left-2 max-w-[90%] truncate rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">{title}</span>
                    </div>
                    <p className="pt-1 text-xs text-[#536471]">Dari {domain}</p>
                </div>
            </PreviewFrame>
        </div>
    );
}

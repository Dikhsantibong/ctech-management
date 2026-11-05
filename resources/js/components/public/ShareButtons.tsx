import { Check, Download, Facebook, Link as LinkIcon, Linkedin, MessageCircle, Send, Share2 } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
    url: string;
    title: string;
    storyImageUrl: string;
}

function XIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

/**
 * Tombol bagikan artikel. Semua tautan memakai canonical URL dari server.
 */
export function ShareButtons({ url, title, storyImageUrl }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const [preparingStory, setPreparingStory] = useState(false);
    const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const targets = [
        { label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, icon: MessageCircle },
        { label: 'Telegram', href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`, icon: Send },
        { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: Facebook },
        { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, icon: Linkedin },
        { label: 'X', href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, icon: XIcon },
    ];

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
        } catch {
            window.prompt('Salin link artikel:', url);
        }

        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const nativeShare = async () => {
        try {
            await navigator.share({ title, url });
        } catch {
            // Dibatalkan pengguna.
        }
    };

    /** Bagikan story image sebagai file (fitur Story di HP); fallback unduh. */
    const shareStory = async () => {
        setPreparingStory(true);

        try {
            const blob = await fetch(storyImageUrl).then((response) => response.blob());
            const file = new File([blob], 'ctech-story.jpg', { type: blob.type || 'image/jpeg' });

            if (navigator.canShare?.({ files: [file] })) {
                await navigator.share({ files: [file], title, text: url });

                return;
            }

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'ctech-story.jpg';
            link.click();
            URL.revokeObjectURL(link.href);
        } catch {
            window.open(storyImageUrl, '_blank', 'noopener');
        } finally {
            setPreparingStory(false);
        }
    };

    const buttonClass =
        'inline-flex h-11 items-center gap-2 rounded-full border border-gray-200 px-4 font-body text-xs font-semibold uppercase tracking-[0.12em] text-[#0d0d0d] transition-colors hover:border-[var(--premium-gold)] hover:text-[var(--premium-gold)]';

    return (
        <div className="mt-16 border-t border-gray-100 pt-10">
            <p className="mb-5 font-body text-xs uppercase tracking-[0.2em] text-gray-400">Bagikan artikel</p>
            <div className="flex flex-wrap gap-3">
                {canNativeShare && (
                    <button type="button" onClick={nativeShare} className={buttonClass}>
                        <Share2 className="h-4 w-4" /> Bagikan
                    </button>
                )}
                {targets.map(({ label, href, icon: Icon }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={buttonClass} aria-label={`Bagikan ke ${label}`}>
                        <Icon className="h-4 w-4" /> {label}
                    </a>
                ))}
                <button type="button" onClick={copyLink} className={buttonClass}>
                    {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />} {copied ? 'Tersalin' : 'Salin Link'}
                </button>
                <button type="button" onClick={shareStory} disabled={preparingStory} className={`${buttonClass} disabled:opacity-50`}>
                    <Download className="h-4 w-4" /> {preparingStory ? 'Menyiapkan…' : 'Story Image'}
                </button>
            </div>
        </div>
    );
}

import { Head, Link } from '@inertiajs/react';
import { User, Calendar, Tag } from 'lucide-react';
import { useRef, useEffect } from 'react';
import PublicNavbar from '@/components/public-navbar';

type NewsBlock =
    | { type: 'html'; html: string }
    | { type: 'paragraph'; text: string }
    | { type: 'ordered-list'; items: string[] }
    | { type: 'unordered-list'; items: string[] };

function normalizeContent(content: string) {
    return (content || '').replace(/\r\n/g, '\n').trim();
}

function parseNewsContent(content: string): NewsBlock[] {
    const normalized = normalizeContent(content);

    if (!normalized) return [];

    if (/<[a-z][\s\S]*>/i.test(normalized)) {
        return [{ type: 'html', html: normalized }];
    }

    const lines = normalized.split('\n');
    const blocks: NewsBlock[] = [];
    let index = 0;

    const isOrderedItem = (line: string) => /^\d+\.\s+/.test(line);
    const isUnorderedItem = (line: string) => /^(?:[-*]|\u2022)\s+/.test(line);

    while (index < lines.length) {
        const line = lines[index].trim();

        if (!line) { index++; continue; }

        if (isOrderedItem(line)) {
            const items: string[] = [];
            while (index < lines.length && isOrderedItem(lines[index].trim())) {
                items.push(lines[index].trim().replace(/^\d+\.\s+/, ''));
                index++;
            }
            blocks.push({ type: 'ordered-list', items });
            continue;
        }

        if (isUnorderedItem(line)) {
            const items: string[] = [];
            while (index < lines.length && isUnorderedItem(lines[index].trim())) {
                items.push(lines[index].trim().replace(/^(?:[-*]|\u2022)\s+/, ''));
                index++;
            }
            blocks.push({ type: 'unordered-list', items });
            continue;
        }

        const paragraphLines: string[] = [];
        while (
            index < lines.length &&
            lines[index].trim() &&
            !isOrderedItem(lines[index].trim()) &&
            !isUnorderedItem(lines[index].trim())
        ) {
            paragraphLines.push(lines[index].trim());
            index++;
        }
        blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') });
    }

    return blocks;
}

/**
 * Renumber semua <ol><li> dalam container secara berurutan global (1, 2, 3, ...)
 * meskipun setiap <li> berada dalam <ol> yang terpisah-pisah.
 */
function renumberOrderedLists(container: HTMLElement) {
    const allOlItems = container.querySelectorAll('ol li');
    allOlItems.forEach((li, i) => {
        const el = li as HTMLElement;
        el.style.listStyleType = 'none';
        el.style.position = 'relative';
        el.style.paddingLeft = '2rem';

        // Hapus pseudo-counter lama jika ada
        const existing = el.querySelector('.custom-counter');
        if (existing) existing.remove();

        const counter = document.createElement('span');
        counter.className = 'custom-counter';
        counter.textContent = `${i + 1}.`;
        counter.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            font-variant-numeric: tabular-nums;
            min-width: 1.5rem;
            text-align: left;
        `;
        el.insertBefore(counter, el.firstChild);
    });
}

export default function PublicNewsShow({ news, relatedNews }: { news: any; relatedNews: any[] }) {
    const contentBlocks = parseNewsContent(news.content || '');
    const articleRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (articleRef.current) {
            renumberOrderedLists(articleRef.current);
        }
    }, [contentBlocks]);

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
            <Head title={news.title} />

            <PublicNavbar isLandingPage={false} />

            <main className="max-w-4xl mx-auto px-6 py-16 pt-32">
                <div className="mb-10 text-center">
                    {news.category && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-6">
                            <Tag className="w-3.5 h-3.5" /> {news.category}
                        </span>
                    )}
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                        {news.title}
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" /> {news.author?.name || 'Admin'}
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />{' '}
                            {new Date(news.published_at || news.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </div>
                    </div>
                </div>

                {news.image && (
                    <div className="mb-12 rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                        <img
                            src={`/storage/${news.image}`}
                            alt={news.title}
                            className="w-full h-auto object-cover max-h-[500px]"
                        />
                    </div>
                )}

                <article
                    ref={articleRef}
                    className="prose prose-lg prose-slate max-w-none mx-auto prose-headings:font-bold prose-p:leading-8 prose-li:leading-8 prose-ul:pl-6 prose-ol:pl-6"
                >
                    {contentBlocks.length > 0 ? (
                        contentBlocks.map((block, i) => {
                            if (block.type === 'html') {
                                return (
                                    <div
                                        key={i}
                                        dangerouslySetInnerHTML={{ __html: block.html }}
                                    />
                                );
                            }

                            if (block.type === 'paragraph') {
                                return <p key={i} className="text-justify mb-4">{block.text}</p>;
                            }

                            const ListTag = block.type === 'ordered-list' ? 'ol' : 'ul';

                            return (
                                <ListTag
                                    key={i}
                                    className={
                                        block.type === 'ordered-list'
                                            ? 'my-6 list-decimal space-y-2 pl-6'
                                            : 'my-6 list-disc space-y-2 pl-6'
                                    }
                                >
                                    {block.items.map((item, itemIndex) => (
                                        <li key={itemIndex} className="pl-1">
                                            {item}
                                        </li>
                                    ))}
                                </ListTag>
                            );
                        })
                    ) : (
                        <p className="text-slate-500 italic">Tidak ada isi berita.</p>
                    )}
                </article>
            </main>

            {relatedNews.length > 0 && (
                <section className="bg-slate-50 py-16 border-t border-slate-100">
                    <div className="max-w-7xl mx-auto px-6">
                        <h3 className="text-2xl font-bold text-slate-900 mb-8">Berita Terkait</h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedNews.map((item: any) => (
                                <Link
                                    key={item.id}
                                    href={`/berita/${item.slug}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col"
                                >
                                    <div className="relative h-48 overflow-hidden bg-slate-100">
                                        {item.image ? (
                                            <img
                                                src={`/storage/${item.image}`}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h4 className="font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {item.title}
                                        </h4>
                                        <span className="text-blue-600 text-sm font-semibold mt-2 inline-block">
                                            Baca Selengkapnya &rarr;
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
import { Head, Link } from '@inertiajs/react';
import { User, Calendar, Tag } from 'lucide-react';
import { useRef } from 'react';
import { PremiumNavbar as PublicNavbar } from '@/components/ui/PremiumNavbar';
import { SEO } from '@/components/SEO';

import 'react-quill-new/dist/quill.core.css';

export default function PublicNewsShow({ news, relatedNews }: { news: any, relatedNews: any[] }) {
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',_sans-serif]">
            <SEO 
                title={`${news.title} | Berita CTECH`}
                description={news.excerpt || news.content?.replace(/(<([^>]+)>)/gi, "").substring(0, 160)}
                image={news.image ? (news.image.startsWith('http') ? news.image : `/storage/${news.image}`) : undefined}
                url={`/berita/${news.slug}`}
            />

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

                <article className="ql-editor prose prose-lg prose-slate max-w-none mx-auto prose-headings:font-bold prose-p:leading-8 prose-li:leading-8 prose-img:rounded-xl">
                    {news.content ? (
                        <div dangerouslySetInnerHTML={{ __html: news.content }} />
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
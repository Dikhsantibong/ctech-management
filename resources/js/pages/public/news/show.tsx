import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { User, Calendar, Tag, ArrowLeft } from 'lucide-react';
import { PremiumNavbar } from '@/components/ui/PremiumNavbar';
import { Footer } from '@/components/public/sections/Footer';
import { useLenis } from '@/hooks/use-lenis';
import { SEO } from '@/components/SEO';

import 'react-quill-new/dist/quill.core.css';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function PublicNewsShow({ news, relatedNews }: { news: any; relatedNews: any[] }) {
    useLenis();

    return (
        <div className="min-h-screen bg-white flex flex-col font-body text-[var(--premium-text)] selection:bg-[var(--premium-gold)] selection:text-white">
            <SEO
                title={`${news.title} | Berita CTECH`}
                description={news.excerpt || news.content?.replace(/(<([^>]+)>)/gi, '').substring(0, 160)}
                image={news.image ? (news.image.startsWith('http') ? news.image : `/storage/${news.image}`) : undefined}
                url={`/berita/${news.slug}`}
            />

            <PremiumNavbar />

            {/* Header gelap */}
            <header className="bg-[#0d0d0d] text-white pt-36 md:pt-48 pb-16 md:pb-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <Link
                            href="/berita"
                            className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors mb-8"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" /> Semua Berita
                        </Link>
                        {news.category && (
                            <div className="mb-6">
                                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/15 text-[var(--premium-gold)] font-body text-xs uppercase tracking-[0.15em] font-medium">
                                    <Tag className="w-3 h-3" /> {news.category}
                                </span>
                            </div>
                        )}
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.15, ease: EASE }}
                        className="font-display text-3xl md:text-5xl font-semibold leading-[1.15] tracking-tight mb-8"
                    >
                        {news.title}
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex items-center justify-center gap-6 font-body text-xs uppercase tracking-[0.15em] text-white/50"
                    >
                        <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5" /> {news.author?.name || 'Admin'}
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />{' '}
                            {new Date(news.published_at || news.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </div>
                    </motion.div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-16 md:py-20 w-full">
                {news.image && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
                        className="mb-14 rounded-3xl overflow-hidden border border-gray-100 shadow-[0_30px_80px_-40px_rgba(13,13,13,0.3)] -mt-28 md:-mt-32 relative z-10"
                    >
                        <img
                            src={`/storage/${news.image}`}
                            alt={news.title}
                            className="w-full h-auto object-cover max-h-[520px]"
                        />
                    </motion.div>
                )}

                <article className="ql-editor prose prose-lg prose-slate max-w-none mx-auto prose-headings:font-display prose-headings:tracking-tight prose-p:leading-8 prose-li:leading-8 prose-img:rounded-2xl">
                    {news.content ? (
                        <div dangerouslySetInnerHTML={{ __html: news.content }} />
                    ) : (
                        <p className="text-gray-400 italic">Tidak ada isi berita.</p>
                    )}
                </article>
            </main>

            {relatedNews.length > 0 && (
                <section className="bg-[#f9fafb] py-20 md:py-24 border-t border-gray-100">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                        <h3 className="font-display text-2xl md:text-4xl font-semibold tracking-tight text-[#0d0d0d] mb-12">Berita Terkait</h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedNews.map((item: any) => (
                                <Link
                                    key={item.id}
                                    href={`/berita/${item.slug}`}
                                    className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-[0_30px_60px_-30px_rgba(13,13,13,0.25)] transition-shadow duration-500 flex flex-col"
                                >
                                    <div className="relative h-48 overflow-hidden bg-gray-100">
                                        {item.image ? (
                                            <img
                                                src={`/storage/${item.image}`}
                                                alt={item.title}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center font-body text-xs uppercase tracking-widest text-gray-400">
                                                Tanpa Gambar
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h4 className="font-display text-lg font-semibold tracking-tight text-[#0d0d0d] mb-3 leading-snug group-hover:text-[var(--premium-gold)] transition-colors line-clamp-2">
                                            {item.title}
                                        </h4>
                                        <span className="font-body text-xs uppercase tracking-[0.15em] font-semibold text-[var(--premium-gold)] mt-2 inline-block">
                                            Baca Selengkapnya &rarr;
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </div>
    );
}

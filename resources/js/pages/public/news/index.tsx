import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { PremiumNavbar } from '@/components/ui/PremiumNavbar';
import { Footer } from '@/components/public/sections/Footer';
import { PageHeader } from '@/components/public/PageHeader';
import { useLenis } from '@/hooks/use-lenis';
import { SEO } from '@/components/SEO';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function PublicNewsIndex({ news }: { news: any }) {
    useLenis();

    return (
        <div className="min-h-screen bg-white font-body text-[var(--premium-text)] selection:bg-[var(--premium-gold)] selection:text-white">
            <SEO
                title="Berita & Artikel | CTECH Creative"
                description="Ikuti perkembangan terbaru, update produk, dan cerita di balik layar dari tim CTECH."
                url="/berita"
            />

            <PremiumNavbar />

            <main className="w-full overflow-hidden">
                <PageHeader
                    eyebrow="Wawasan"
                    title="Berita & Artikel."
                    description="Ikuti perkembangan terbaru, update produk, dan cerita di balik layar dari tim CTECH."
                />

                <section className="py-24 md:py-32">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 mb-16">
                            {news.data.map((item: any, i: number) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-50px' }}
                                    transition={{ duration: 0.8, delay: (i % 3) * 0.15, ease: EASE }}
                                >
                                    <Link href={`/berita/${item.slug}`} className="group flex flex-col h-full">
                                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 mb-6">
                                            {item.image ? (
                                                <img
                                                    src={`/storage/${item.image}`}
                                                    alt={item.title}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-body text-xs uppercase tracking-widest text-gray-400">Tanpa Gambar</div>
                                            )}
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-[#0d0d0d] text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                                                {item.category || 'Berita'}
                                            </div>
                                        </div>
                                        <div className="flex flex-col flex-grow">
                                            <div className="flex items-center gap-2 font-body text-xs uppercase tracking-[0.15em] text-gray-400 mb-3">
                                                <span>{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                                <span>•</span>
                                                <span>{item.author?.name || 'Admin'}</span>
                                            </div>
                                            <h3 className="font-display text-xl md:text-2xl font-semibold tracking-tight text-[#0d0d0d] mb-3 leading-snug group-hover:text-[var(--premium-gold)] transition-colors line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <p className="font-body text-sm text-gray-500 leading-relaxed line-clamp-3 mb-5 flex-grow">
                                                {item.content.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')}
                                            </p>
                                            <span className="inline-flex items-center gap-1.5 font-body text-xs uppercase tracking-[0.15em] font-semibold text-[#0d0d0d] mt-auto group-hover:gap-3 group-hover:text-[var(--premium-gold)] transition-all">
                                                Baca Selengkapnya &rarr;
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {news.last_page > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12">
                                {news.links.map((link: any, i: number) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`px-4 py-2 rounded-full font-body text-sm font-medium transition-colors ${
                                            link.active
                                                ? 'bg-[#0d0d0d] text-white'
                                                : !link.url
                                                    ? 'text-gray-300 cursor-not-allowed'
                                                    : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

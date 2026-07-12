import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ExternalLink, Tag, ArrowLeft } from 'lucide-react';
import { PremiumNavbar } from '@/components/ui/PremiumNavbar';
import { Footer } from '@/components/public/sections/Footer';
import { useLenis } from '@/hooks/use-lenis';
import { SEO } from '@/components/SEO';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function PublicPortfolioShow({ portfolio, relatedPortfolios }: { portfolio: any; relatedPortfolios: any[] }) {
    useLenis();

    return (
        <div className="min-h-screen bg-white font-body text-[var(--premium-text)] selection:bg-[var(--premium-gold)] selection:text-white">
            <SEO
                title={`${portfolio.title} | Portfolio CTECH`}
                description={portfolio.description?.replace(/(<([^>]+)>)/gi, '').substring(0, 160) || 'Detail portfolio project kami.'}
                image={portfolio.image ? (portfolio.image.startsWith('http') ? portfolio.image : `/storage/${portfolio.image}`) : undefined}
                url={`/portfolio/${portfolio.id}`}
            />

            <PremiumNavbar />

            {/* Header gelap */}
            <header className="bg-[#0d0d0d] text-white pt-36 md:pt-48 pb-16 md:pb-24">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <Link
                            href="/portfolio"
                            className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors mb-8"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" /> Semua Karya
                        </Link>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/15 text-[var(--premium-gold)] font-body text-xs uppercase tracking-[0.15em] font-medium">
                                <Tag className="w-3 h-3" />
                                {portfolio.category || 'Proyek'}
                            </span>
                        </div>
                    </motion.div>
                    <div className="overflow-hidden">
                        <motion.h1
                            initial={{ y: '110%' }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1, delay: 0.15, ease: EASE }}
                            className="font-display text-3xl md:text-6xl font-semibold leading-[1.08] tracking-tight max-w-5xl"
                        >
                            {portfolio.title}
                        </motion.h1>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    {/* Gambar */}
                    {portfolio.image && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
                            className="lg:sticky lg:top-32"
                        >
                            <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-[0_30px_80px_-40px_rgba(13,13,13,0.3)]">
                                <img
                                    src={portfolio.image.startsWith('http') ? portfolio.image : `/storage/${portfolio.image}`}
                                    alt={portfolio.title}
                                    className="w-full h-auto object-cover max-h-[720px]"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Deskripsi */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
                    >
                        <span className="font-body text-xs uppercase tracking-[0.25em] text-[var(--premium-gold)] mb-6 block">
                            Tentang Proyek
                        </span>
                        <div
                            className="prose prose-lg prose-slate max-w-none mb-12 font-body prose-headings:font-display prose-headings:tracking-tight"
                            dangerouslySetInnerHTML={{
                                __html: portfolio.description || 'Tidak ada deskripsi.',
                            }}
                        />

                        {/* Detail project */}
                        <div className="bg-[#f9fafb] p-8 md:p-10 rounded-3xl border border-gray-100">
                            <h3 className="font-display text-xl font-semibold text-[#0d0d0d] mb-6 border-b border-gray-200 pb-4">
                                Detail Project
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <p className="font-body text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">Kategori</p>
                                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--premium-gold)]/10 text-[var(--premium-gold)] font-body text-sm font-semibold">
                                        <Tag className="w-3.5 h-3.5" />
                                        {portfolio.category}
                                    </span>
                                </div>

                                {portfolio.link && (
                                    <div className="pt-6 border-t border-gray-200">
                                        <a
                                            href={portfolio.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-center gap-2 w-full bg-[#0d0d0d] hover:bg-[var(--premium-gold)] text-white py-4 px-4 rounded-full font-body text-sm font-semibold uppercase tracking-widest transition-colors duration-500"
                                        >
                                            Kunjungi Website
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Karya serupa */}
            {relatedPortfolios.length > 0 && (
                <section className="bg-[#f9fafb] py-20 md:py-24 border-t border-gray-100">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                        <h3 className="font-display text-2xl md:text-4xl font-semibold tracking-tight text-[#0d0d0d] mb-12">Karya Serupa</h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedPortfolios.map((item: any) => (
                                <Link
                                    key={item.id}
                                    href={`/portfolio/${item.id}`}
                                    className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-[0_30px_60px_-30px_rgba(13,13,13,0.25)] transition-shadow duration-500 block"
                                >
                                    <div className="relative h-52 overflow-hidden bg-gray-100">
                                        {item.image ? (
                                            <img
                                                src={item.image.startsWith('http') ? item.image : `/storage/${item.image}`}
                                                alt={item.title}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center font-body text-xs uppercase tracking-widest text-gray-400">Tanpa Gambar</div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <p className="font-body text-xs uppercase tracking-[0.2em] text-[var(--premium-gold)] mb-2 font-medium">{item.category || 'Proyek'}</p>
                                        <h4 className="font-display text-lg font-semibold text-[#0d0d0d] group-hover:text-[var(--premium-gold)] transition-colors line-clamp-2">{item.title}</h4>
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

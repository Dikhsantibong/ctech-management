import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";
import { ArrowUpRight } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function stripHtml(html?: string) {
    return (html || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Highlight 3 berita terbaru di beranda (data dari route '/').
 */
export function NewsHighlight({ news = [] }: { news?: any[] }) {
    if (!Array.isArray(news) || news.length === 0) return null;

    return (
        <section id="news" className="py-24 md:py-32 bg-[#f9fafb] text-[#0d0d0d] border-t border-gray-100">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8"
                >
                    <div>
                        <span className="font-body text-xs uppercase tracking-[0.25em] text-gray-400 mb-6 block">
                            Wawasan
                        </span>
                        <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
                            Berita terbaru<br />dari kami.
                        </h2>
                    </div>
                    <Link
                        href="/berita"
                        className="group inline-flex items-center gap-2 font-body text-sm uppercase tracking-widest text-[#0d0d0d]/60 hover:text-[#0d0d0d] transition-colors border-b border-[#0d0d0d]/20 hover:border-[#0d0d0d] pb-1 self-start md:self-auto"
                    >
                        Semua Berita
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                    {news.slice(0, 3).map((item: any, i: number) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, delay: i * 0.15, ease: EASE }}
                        >
                            <Link href={`/berita/${item.slug}`} className="group flex flex-col h-full">
                                <div className="relative aspect-[4/3] overflow-hidden rounded-none bg-gray-100 mb-6">
                                    {item.image ? (
                                        <img
                                            src={item.image.startsWith("http") ? item.image : `/storage/${item.image}`}
                                            alt={item.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-body text-xs uppercase tracking-widest text-gray-400">
                                            Tanpa Gambar
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-[#0d0d0d] text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-none">
                                        {item.category || "Berita"}
                                    </div>
                                </div>
                                <div className="flex flex-col flex-grow">
                                    <span className="font-body text-xs uppercase tracking-[0.15em] text-gray-400 mb-3">
                                        {new Date(item.published_at || item.created_at).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>
                                    <h3 className="font-display text-xl md:text-2xl font-semibold tracking-tight mb-3 leading-snug group-hover:text-gray-400 transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="font-body text-sm text-gray-500 leading-relaxed line-clamp-3 mb-5 flex-grow">
                                        {stripHtml(item.content)}
                                    </p>
                                    <span className="inline-flex items-center gap-1.5 font-body text-xs uppercase tracking-[0.15em] font-semibold text-[#0d0d0d] mt-auto group-hover:gap-3 group-hover:text-gray-400 transition-all">
                                        Baca Selengkapnya &rarr;
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

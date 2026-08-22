import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";
import { ArrowUpRight } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function imageUrl(image?: string, index: number = 0) {
    if (!image) return null;
    if (image.startsWith("http") && image.includes("unsplash")) {
        const aiImages = ['/img/portfolio/software.jpg', '/img/portfolio/creative.jpg', '/img/portfolio/architecture.jpg'];
        return aiImages[index % aiImages.length];
    }
    return image.startsWith("http") ? image : `/storage/${image}`;
}

/**
 * Grid 4 portofolio terbaru — menggantikan DocumentationStrip.
 * Gambar ditampilkan grayscale, lalu berwarna saat hover (sama seperti gaya strip lama),
 * ditambah animasi masuk dan overlay judul proyek.
 */
export function RecentPortfolio({ portfolios = [] }: { portfolios?: any[] }) {
    const items: any[] = Array.isArray(portfolios) ? portfolios.slice(0, 4) : [];

    if (items.length === 0) return null;

    return (
        <section className="border-t border-gray-200 bg-white text-[#0f1115] py-16 md:py-20">
            <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                {/* Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <p className="font-body text-[11px] uppercase tracking-[0.28em] text-gray-400 mb-4">
                            Portofolio Terbaru
                        </p>
                        <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight leading-tight">
                            Karya pilihan<br className="hidden md:inline" /> kami.
                        </h2>
                    </div>
                    <Link
                        href="/layanan"
                        className="group hidden sm:inline-flex items-center gap-2 font-body text-xs uppercase tracking-widest text-[#0d0d0d]/50 hover:text-[#0d0d0d] transition-colors border-b border-[#0d0d0d]/15 hover:border-[#0d0d0d] pb-1"
                    >
                        Lihat Semua
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-px bg-gray-200 lg:grid-cols-4">
                    {items.map((project, i) => {
                        const img = imageUrl(project.image, i);
                        return (
                            <motion.div
                                key={project.id ?? i}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                                className={`group relative aspect-[4/5] overflow-hidden bg-gray-100 ${i > 1 ? 'hidden lg:block' : ''} sm:block`}
                            >
                                {img ? (
                                    <img
                                        src={img}
                                        alt={project.title || `Portofolio ${i + 1}`}
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-cover grayscale transition-[filter,transform] duration-700 group-hover:grayscale-0 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center font-body text-xs uppercase tracking-widest text-gray-400">
                                        Tanpa Gambar
                                    </div>
                                )}

                                {/* Overlay info — muncul saat hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
                                    <p className="font-display text-sm md:text-base font-semibold text-white leading-snug line-clamp-2">
                                        {project.title}
                                    </p>
                                    {project.category && (
                                        <span className="font-body text-[10px] uppercase tracking-[0.2em] text-white/60 mt-1.5">
                                            {project.category}
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <p className="mt-5 font-body text-xs text-gray-500">
                    Hasil karya terbaru dari berbagai lini layanan kami.
                </p>
            </div>
        </section>
    );
}

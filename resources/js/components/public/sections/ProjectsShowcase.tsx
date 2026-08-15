import { motion, PanInfo } from "framer-motion";
import { useState } from "react";
import { Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const CARD_COLORS = ["#f8f9fa", "#f1f5f9", "#f4f4f5"];

function stripHtml(html?: string) {
    return (html || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

function imageUrl(image?: string) {
    if (!image) return null;
    return image.startsWith("http") ? image : `/storage/${image}`;
}

/**
 * Carousel kartu bertumpuk interaktif untuk portfolio.
 * Kartu depan bisa di-drag horizontal; kartu belakang bisa diklik untuk maju.
 */
export function ProjectsShowcase({ portfolios = [] }: { portfolios?: any }) {
    const projects: any[] = Array.isArray(portfolios) ? portfolios : portfolios?.data || [];
    const [active, setActive] = useState(0);
    const count = projects.length;

    const next = () => count > 1 && setActive((a) => (a + 1) % count);
    const prev = () => count > 1 && setActive((a) => (a - 1 + count) % count);

    const handleDragEnd = (_: unknown, info: PanInfo) => {
        if (info.offset.x < -100) next();
        else if (info.offset.x > 100) prev();
    };

    return (
        <section id="portfolio" className="py-24 md:py-32 bg-white text-[#0d0d0d] overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                {/* Header + kontrol */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8"
                >
                    <div>
                        <span className="font-body text-xs uppercase tracking-[0.25em] text-gray-400 mb-6 block">
                            Karya Pilihan
                        </span>
                        <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
                            Proyek terbaru<br />kami.
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/portfolio"
                            className="group hidden sm:inline-flex items-center gap-2 font-body text-sm uppercase tracking-widest text-[#0d0d0d]/60 hover:text-[#0d0d0d] transition-colors border-b border-[#0d0d0d]/20 hover:border-[#0d0d0d] pb-1 mr-4"
                        >
                            Semua Proyek
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                        {count > 1 && (
                            <>
                                <button
                                    onClick={prev}
                                    aria-label="Proyek sebelumnya"
                                    className="w-12 h-12 rounded-none border border-gray-200 flex items-center justify-center hover:bg-[#0d0d0d] hover:text-white hover:border-[#0d0d0d] transition-colors duration-500"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={next}
                                    aria-label="Proyek berikutnya"
                                    className="w-12 h-12 rounded-none border border-gray-200 flex items-center justify-center hover:bg-[#0d0d0d] hover:text-white hover:border-[#0d0d0d] transition-colors duration-500"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>
                </motion.div>

                {count === 0 ? (
                    <div className="text-center py-20 text-gray-400 font-body tracking-[0.2em] uppercase text-sm border border-dashed border-gray-200 rounded-none">
                        Belum ada portfolio yang ditambahkan.
                    </div>
                ) : (
                    <div className="relative pt-16 md:pt-20">
                        <div className="relative h-[680px] md:h-[600px]">
                            {projects.map((project, i) => {
                                const depth = (i - active + count) % count;
                                const isFront = depth === 0;
                                const visible = depth < 3;
                                const year = project.created_at ? new Date(project.created_at).getFullYear() : null;
                                const description = stripHtml(project.description);
                                const img = imageUrl(project.image);

                                return (
                                    <motion.article
                                        key={project.id ?? i}
                                        animate={{
                                            y: -28 * depth,
                                            scale: 1 - depth * 0.05,
                                            opacity: visible ? 1 : 0,
                                        }}
                                        transition={{ duration: 0.6, ease: EASE }}
                                        style={{ zIndex: 30 - depth, backgroundColor: CARD_COLORS[i % CARD_COLORS.length] }}
                                        drag={isFront && count > 1 ? "x" : false}
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={0.25}
                                        onDragEnd={isFront ? handleDragEnd : undefined}
                                        onClick={() => !isFront && visible && setActive(i)}
                                        className={`absolute inset-0 rounded-none border border-gray-200/80 shadow-none overflow-hidden ${
                                            isFront ? "cursor-grab active:cursor-grabbing" : visible ? "cursor-pointer" : "pointer-events-none"
                                        }`}
                                        aria-hidden={!visible}
                                    >
                                        <div className="grid grid-rows-[220px_1fr] md:grid-rows-1 md:grid-cols-2 h-full">
                                            {/* Gambar */}
                                            <div className="relative md:order-2 p-4 md:p-8 flex">
                                                <div className="relative w-full h-full rounded-none overflow-hidden bg-gray-200">
                                                    {img ? (
                                                        <img
                                                            src={img}
                                                            alt={project.title}
                                                            loading="lazy"
                                                            draggable={false}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center font-body text-xs uppercase tracking-widest text-gray-400">
                                                            Tanpa Gambar
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Konten */}
                                            <div className="md:order-1 p-6 md:p-14 flex flex-col justify-between min-h-0">
                                                <div>
                                                    <div className="flex items-center gap-4 mb-6 md:mb-10">
                                                        <span className="w-11 h-11 rounded-none border border-[#0d0d0d]/15 flex items-center justify-center font-body text-xs font-semibold">
                                                            {String(i + 1).padStart(2, "0")}
                                                        </span>
                                                        <span className="font-body text-xs uppercase tracking-[0.2em] text-gray-400 font-medium">
                                                            {[year, project.category || "Proyek"].filter(Boolean).join(" • ")}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-display text-2xl md:text-4xl font-semibold tracking-tight leading-tight mb-4 md:mb-6 line-clamp-2">
                                                        {project.title}
                                                    </h3>
                                                    {description && (
                                                        <p className="font-body text-sm md:text-base text-gray-500 leading-relaxed line-clamp-2 md:line-clamp-4 max-w-md">
                                                            {description}
                                                        </p>
                                                    )}
                                                </div>
                                                <Link
                                                    href={`/portfolio/${project.id}`}
                                                    className="mt-6 self-start inline-flex items-center gap-2 rounded-none bg-[#0d0d0d] text-white px-6 py-3 font-body text-xs md:text-sm font-semibold uppercase tracking-widest hover:bg-[#2c3140] transition-colors duration-500"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Lihat Studi Kasus <ArrowUpRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </div>

                        {/* Indikator */}
                        {count > 1 && (
                            <div className="mt-10 flex justify-center gap-2">
                                {projects.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActive(i)}
                                        aria-label={`Ke proyek ${i + 1}`}
                                        className={`h-1.5 rounded-none transition-all duration-500 ${
                                            i === active ? "w-8 bg-[#0d0d0d]" : "w-3 bg-gray-300 hover:bg-gray-400"
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

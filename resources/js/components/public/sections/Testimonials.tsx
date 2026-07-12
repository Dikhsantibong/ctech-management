import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const TESTIMONIALS = [
    {
        quote: "CTECH tidak sekadar membuat software; mereka merancang ulang seluruh alur kerja operasional kami. Arsitektur cloud baru ini mampu menangani lonjakan pengunjung tanpa hambatan sedikitpun.",
        author: "Budi Santoso",
        role: "COO, Ritel Nasional",
    },
    {
        quote: "Tim teknis paling profesional yang pernah bekerja sama dengan kami. Mulai dari perumusan masalah hingga peluncuran, perhatian mereka pada estetika antarmuka dan ketangguhan backend sangat luar biasa.",
        author: "Andi Pratama",
        role: "CEO, Enterprise Corp",
    },
];

export function Testimonials() {
    const [active, setActive] = useState(0);
    const count = TESTIMONIALS.length;

    return (
        <section className="py-24 md:py-32 bg-white text-[#0d0d0d] relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="flex justify-between items-end mb-16 border-b border-gray-200 pb-8">
                    <span className="font-body text-xs uppercase tracking-[0.25em] text-[var(--premium-gold)]">
                        Suara Mitra Kami
                    </span>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setActive((a) => (a - 1 + count) % count)}
                            aria-label="Testimoni sebelumnya"
                            className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#0d0d0d] hover:text-white hover:border-[#0d0d0d] transition-colors duration-500"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setActive((a) => (a + 1) % count)}
                            aria-label="Testimoni berikutnya"
                            className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#0d0d0d] hover:text-white hover:border-[#0d0d0d] transition-colors duration-500"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="relative min-h-[320px] md:min-h-[300px]">
                    {TESTIMONIALS.map((testi, i) => (
                        <motion.blockquote
                            key={i}
                            initial={false}
                            animate={{
                                opacity: i === active ? 1 : 0,
                                y: i === active ? 0 : 24,
                                zIndex: i === active ? 10 : 0,
                            }}
                            transition={{ duration: 0.8, ease: EASE }}
                            className="absolute top-0 left-0 w-full lg:w-4/5"
                            style={{ pointerEvents: i === active ? "auto" : "none" }}
                        >
                            <p className="font-display text-2xl md:text-4xl font-medium leading-[1.3] tracking-tight mb-10">
                                &ldquo;{testi.quote}&rdquo;
                            </p>
                            <footer>
                                <div className="font-body text-base font-semibold">{testi.author}</div>
                                <div className="font-body text-xs uppercase tracking-[0.2em] mt-1.5 text-gray-400">{testi.role}</div>
                            </footer>
                        </motion.blockquote>
                    ))}
                </div>

                <div className="flex gap-2 mt-12">
                    {TESTIMONIALS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            aria-label={`Testimoni ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-[#0d0d0d]" : "w-3 bg-gray-300 hover:bg-gray-400"}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

import { motion, useScroll } from "framer-motion";
import { useRef } from "react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PROCESS_STEPS = [
    { num: "01", title: "Riset & Strategi", desc: "Kami menyelami logika bisnis Anda, memahami inti masalah sebelum menulis satu baris kode pun." },
    { num: "02", title: "Arsitektur & Desain", desc: "Merancang cetak biru. Kami membangun sistem yang skalabel sekaligus antarmuka yang elegan secara bersamaan." },
    { num: "03", title: "Pengembangan", desc: "Siklus kerja gesit (Agile) yang berfokus pada eksekusi tinggi, menggunakan teknologi web mutakhir." },
    { num: "04", title: "Peluncuran & Skala", desc: "Peluncuran tanpa cacat dan integrasi berkelanjutan. Kami memastikan sistem Anda siap untuk pertumbuhan yang pesat." },
];

export function Process() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"],
    });

    return (
        <section id="process" ref={containerRef} className="py-24 md:py-32 bg-[#0d0d0d] text-white relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-16 md:mb-24 md:w-1/2"
                >
                    <span className="font-body text-xs uppercase tracking-[0.25em] text-[var(--premium-gold)] mb-6 block">
                        Metodologi Kami
                    </span>
                    <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
                        Presisi dalam setiap fase.
                    </h2>
                </motion.div>

                <div className="relative">
                    {/* Garis vertikal progres */}
                    <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2 hidden md:block">
                        <motion.div
                            style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
                            className="w-full h-full bg-[var(--premium-gold)]"
                        />
                    </div>

                    <div className="flex flex-col gap-8 md:gap-20">
                        {PROCESS_STEPS.map((step, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <div key={step.num} className={`relative flex flex-col md:flex-row items-center w-full ${isEven ? "md:flex-row-reverse" : ""}`}>
                                    <div className="absolute left-1/2 w-3 h-3 bg-[var(--premium-gold)] rounded-full -translate-x-1/2 z-10 hidden md:block"></div>

                                    <div className="w-full md:w-1/2 md:px-14">
                                        <motion.div
                                            initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.8, ease: EASE }}
                                            viewport={{ once: true, margin: "-100px" }}
                                            className="bg-[#1a1a1a] p-8 md:p-10 rounded-3xl border border-white/[0.08] hover:border-[var(--premium-gold)]/40 transition-colors duration-700"
                                        >
                                            <div className="font-display text-4xl font-medium text-[var(--premium-gold)]/60 mb-6">{step.num}</div>
                                            <h3 className="font-display text-2xl font-semibold mb-4">{step.title}</h3>
                                            <p className="font-body text-sm md:text-base text-white/50 leading-relaxed font-light">{step.desc}</p>
                                        </motion.div>
                                    </div>
                                    <div className="hidden md:block w-1/2"></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

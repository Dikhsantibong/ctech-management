import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { fadeUp } from "@/lib/animations/motionVariants";

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
        offset: ["start center", "end center"]
    });

    return (
        <section id="process" ref={containerRef} className="py-32 bg-[var(--premium-bg-alt)] relative">
            <div className="px-8 md:px-16 w-full max-w-[1920px] mx-auto">
                <motion.div 
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="mb-24 md:w-1/2"
                >
                    <span className="font-['Space_Grotesk',_monospace] text-sm uppercase tracking-widest text-[var(--premium-gold)] mb-6 block">
                        Metodologi Kami
                    </span>
                    <h2 className="font-['Clash_Display',_sans-serif] text-4xl md:text-6xl font-medium text-[var(--premium-dark)] leading-tight">
                        Presisi dalam setiap fase.
                    </h2>
                </motion.div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-4 md:left-[50%] top-0 bottom-0 w-[1px] bg-blue-200 transform md:-translate-x-1/2 hidden md:block">
                        <motion.div 
                            style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
                            className="w-full h-full bg-[var(--premium-dark)]"
                        />
                    </div>

                    <div className="flex flex-col gap-12 md:gap-24">
                        {PROCESS_STEPS.map((step, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <div key={step.num} className={`relative flex flex-col md:flex-row items-center w-full ${isEven ? 'md:flex-row-reverse' : ''}`}>
                                    
                                    {/* Center Dot for desktop */}
                                    <div className="absolute left-4 md:left-[50%] w-3 h-3 bg-[var(--premium-gold)] rounded-full transform -translate-x-1/2 z-10 hidden md:block"></div>
                                    
                                    <div className="w-full md:w-1/2 p-8 md:px-16">
                                        <motion.div 
                                            initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                                            viewport={{ once: true, margin: "-100px" }}
                                            className="bg-[var(--premium-bg)] p-10 rounded-2xl shadow-sm border border-blue-100 hover:shadow-xl transition-shadow duration-500"
                                        >
                                            <div className="font-['Space_Grotesk',_monospace] text-4xl font-light text-blue-300 mb-6">{step.num}</div>
                                            <h3 className="font-['Clash_Display',_sans-serif] text-2xl font-medium text-[var(--premium-dark)] mb-4">{step.title}</h3>
                                            <p className="font-['Inter',_sans-serif] text-[var(--premium-text)] leading-relaxed">{step.desc}</p>
                                        </motion.div>
                                    </div>
                                    <div className="w-full md:w-1/2"></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

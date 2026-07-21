import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function ClientMarquee() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    // Subtle parallax for the background marquee text
    const xParallax1 = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
    
    return (
        <section 
            ref={containerRef}
            className="py-24 md:py-32 bg-[#f9fafb] text-[#0d0d0d] overflow-hidden border-y border-gray-100"
        >
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col items-center text-center mb-20 md:mb-28">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="font-body text-xs uppercase tracking-[0.25em] text-[var(--premium-gold)] mb-6 block"
                    >
                        Kemitraan Strategis
                    </motion.span>
                    
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight max-w-4xl"
                    >
                        Dipercaya untuk mengawal transformasi digital instansi dan korporasi.
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
                    {/* Card 1: PT PLN Nusantara Power */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="bg-white p-12 md:p-16 flex flex-col justify-between items-start border border-gray-100 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 rounded-lg group"
                    >
                        <div className="mb-16">
                            <span className="font-body text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4 block">
                                Badan Usaha Milik Negara (BUMN)
                            </span>
                            <h3 className="font-display text-2xl md:text-3xl font-medium text-[#0d0d0d] leading-snug">
                                PT PLN Nusantara Power
                            </h3>
                        </div>
                        
                        <div className="w-12 h-[1px] bg-gray-200 mb-8 group-hover:w-full group-hover:bg-[var(--premium-gold)] transition-all duration-700 ease-in-out" />
                        
                        <p className="font-body text-gray-500 font-light leading-relaxed">
                            Membangun infrastruktur sistem manajemen digital untuk mendukung efisiensi dan transparansi operasional energi nasional.
                        </p>
                    </motion.div>

                    {/* Card 2: Pemkab Muna Barat */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="bg-white p-12 md:p-16 flex flex-col justify-between items-start border border-gray-100 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 rounded-lg group"
                    >
                        <div className="mb-16">
                            <span className="font-body text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4 block">
                                Pemerintahan Daerah
                            </span>
                            <h3 className="font-display text-2xl md:text-3xl font-medium text-[#0d0d0d] leading-snug">
                                Pemkab Muna Barat
                            </h3>
                        </div>
                        
                        <div className="w-12 h-[1px] bg-gray-200 mb-8 group-hover:w-full group-hover:bg-[var(--premium-gold)] transition-all duration-700 ease-in-out" />
                        
                        <p className="font-body text-gray-500 font-light leading-relaxed">
                            Akselerasi Sistem Pemerintahan Berbasis Elektronik (SPBE) untuk mewujudkan pelayanan publik yang modern dan akuntabel.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Subtle floating watermark text behind or below */}
            <motion.div 
                style={{ x: xParallax1 }}
                className="pointer-events-none mt-20 opacity-[0.03] flex whitespace-nowrap"
            >
                <span className="font-display text-[150px] font-bold uppercase leading-none px-8">
                    TRUSTED PARTNER — TRUSTED PARTNER — 
                </span>
                <span className="font-display text-[150px] font-bold uppercase leading-none px-8">
                    TRUSTED PARTNER — TRUSTED PARTNER — 
                </span>
            </motion.div>
        </section>
    );
}

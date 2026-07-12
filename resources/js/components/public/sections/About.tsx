import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function About() {
    const gridRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: gridRef,
        offset: ["start end", "end start"],
    });
    const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
    const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
    const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    return (
        <section id="about" className="py-24 md:py-32 bg-[#f9fafb] text-[#0d0d0d] overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                    {/* Teks sticky di kiri */}
                    <div className="lg:w-5/12">
                        <div className="lg:sticky lg:top-32">
                            <motion.span
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="font-body text-xs uppercase tracking-[0.25em] text-[var(--premium-gold)] mb-8 block"
                            >
                                Visi & Misi Kami
                            </motion.span>
                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                className="font-display text-4xl md:text-6xl font-semibold leading-[1.08] tracking-tight mb-10"
                            >
                                Kami tidak sekadar membuat software. Kami merancang warisan digital.
                            </motion.h2>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                                className="flex flex-col gap-6"
                            >
                                <p className="font-body text-lg md:text-xl font-light leading-relaxed text-gray-700">
                                    Didirikan di atas prinsip arsitektur yang tangguh dan desain editorial,
                                    studio kami menggabungkan rekayasa berkinerja tinggi dengan estetika yang memukau.
                                </p>
                                <p className="font-body text-base text-gray-500 font-light leading-relaxed">
                                    Setiap proyek adalah peluang untuk mendobrak batasan inovasi di dunia web.
                                    Kami adalah kumpulan arsitek senior, desainer pemenang penghargaan, dan ahli
                                    animasi yang percaya bahwa dunia digital layak mendapatkan keahlian kerajinan
                                    tangan yang sama seperti produk fisik mewah.
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Masonry parallax di kanan */}
                    <div ref={gridRef} className="lg:w-7/12 grid grid-cols-2 gap-4 md:gap-6 items-start">
                        <motion.div style={{ y: y1 }} className="col-span-1 row-span-2">
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                                alt="Kolaborasi tim CTECH"
                                loading="lazy"
                                className="w-full aspect-[3/4] object-cover rounded-2xl"
                            />
                        </motion.div>
                        <motion.div style={{ y: y2 }} className="col-span-1 mt-12 md:mt-20">
                            <img
                                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
                                alt="Diskusi strategi digital"
                                loading="lazy"
                                className="w-full aspect-square object-cover rounded-2xl"
                            />
                        </motion.div>
                        <motion.div style={{ y: y3 }} className="col-span-1">
                            <img
                                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                                alt="Ruang kerja studio"
                                loading="lazy"
                                className="w-full aspect-[4/3] object-cover rounded-2xl"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

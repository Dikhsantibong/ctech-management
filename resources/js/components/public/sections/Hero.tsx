import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkle } from "lucide-react";
import { Link } from "@inertiajs/react";
import { HeroShaderCanvas } from "@/components/public/HeroShaderCanvas";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero() {
    const { scrollY } = useScroll();
    // Konten bergerak lebih lambat dari halaman (parallax)
    const y = useTransform(scrollY, [0, 1000], [0, 400]);
    const opacity = useTransform(scrollY, [0, 700], [1, 0]);

    return (
        <section className="relative h-screen min-h-[640px] w-full flex items-center overflow-hidden bg-[#0d0d0d] text-white">
            {/* Background WebGL liquid streaks */}
            <div className="absolute inset-0 z-0">
                <HeroShaderCanvas />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/40 via-transparent to-[#0d0d0d]"></div>
            </div>

            <motion.div style={{ y, opacity }} className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12">
                <motion.span
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="font-body text-xs md:text-sm uppercase tracking-[0.3em] text-white/60 mb-8 block"
                >
                    CTECH Creative — Agensi Digital
                </motion.span>

                <h1 className="font-display font-semibold text-5xl md:text-[100px] leading-[1.1] tracking-tight max-w-6xl">
                    <span className="block overflow-hidden">
                        <motion.span
                            initial={{ y: "110%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1, delay: 0.3, ease: EASE }}
                            className="block"
                        >
                            Rekayasa
                        </motion.span>
                    </span>
                    <span className="block overflow-hidden">
                        <motion.span
                            initial={{ y: "110%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1, delay: 0.45, ease: EASE }}
                            className="flex items-center flex-wrap gap-x-5"
                        >
                            <span>
                                Keanggunan{" "}
                                <span className="text-white/90">Digital</span>
                            </span>
                            {/* Garis micro-interaction memanjang dari huruf terakhir */}
                            <motion.span
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 1.5, delay: 0.9, ease: EASE }}
                                className="inline-block w-[100px] md:w-[450px] h-2.5 bg-white rounded-r-full origin-left"
                            ></motion.span>
                        </motion.span>
                    </span>
                </h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                    className="mt-10 md:mt-14 max-w-xl font-body text-base md:text-lg text-white/60 leading-relaxed font-light"
                >
                    Kami merancang pengalaman digital berkelas yang menggabungkan presisi teknis
                    tingkat tinggi dengan desain antarmuka avant-garde.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
                    className="mt-10 flex items-center gap-6"
                >
                    <Link
                        href="/kontak"
                        className="group inline-flex items-center gap-3 rounded-full bg-white text-[#0d0d0d] px-8 py-4 font-body text-sm font-semibold uppercase tracking-widest hover:bg-[var(--premium-gold)] hover:text-white transition-colors duration-500"
                    >
                        Mulai Proyek
                        <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
                    </Link>
                    <Link
                        href="/portfolio"
                        className="hidden sm:inline-flex items-center gap-2 font-body text-sm uppercase tracking-widest text-white/70 hover:text-white transition-colors border-b border-white/20 hover:border-white pb-1"
                    >
                        Lihat Karya
                    </Link>
                </motion.div>
            </motion.div>

            {/* Badge lingkaran berputar — kanan bawah */}
            <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1.4, ease: EASE }}
                className="absolute bottom-10 right-6 md:bottom-14 md:right-14 z-10 hidden sm:block"
            >
                <Link href="/kontak" aria-label="Mulai sebuah proyek" className="relative block w-28 h-28 md:w-36 md:h-36 group">
                    <motion.svg
                        viewBox="0 0 100 100"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                        className="w-full h-full"
                    >
                        <defs>
                            <path id="hero-circle-path" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                        </defs>
                        <text className="fill-white/80 uppercase" style={{ fontSize: "10px", letterSpacing: "2.5px", fontFamily: "Inter, sans-serif" }}>
                            <textPath href="#hero-circle-path">MULAI PROYEK • MULAI PROYEK •</textPath>
                        </text>
                    </motion.svg>
                    <span className="absolute inset-0 flex items-center justify-center">
                        <Sparkle className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-[var(--premium-gold)] group-hover:rotate-90 transition-all duration-700" />
                    </span>
                </Link>
            </motion.div>

            {/* Indikator scroll — kiri bawah */}
            <div className="absolute bottom-10 left-6 md:left-12 z-10 flex items-center gap-4 font-body text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40">
                <span>Gulir ke bawah</span>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="w-px h-10 bg-white/30"
                ></motion.div>
            </div>
        </section>
    );
}

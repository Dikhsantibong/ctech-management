import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Building2, Landmark, ShieldCheck, Zap, ArrowUpRight } from "lucide-react";

const clients = [
    {
        name: "PT PLN Nusantara Power",
        type: "Badan Usaha Milik Negara (BUMN)",
        desc: "Dipercaya untuk membangun infrastruktur sistem manajemen digital guna mendukung efisiensi operasional energi nasional.",
        icon: Zap,
        color: "from-amber-400 to-orange-600",
        bg: "bg-orange-500/10"
    },
    {
        name: "Pemkab Muna Barat",
        type: "Pemerintahan Daerah",
        desc: "Mitra strategis dalam akselerasi sistem pemerintahan berbasis elektronik (SPBE) untuk pelayanan publik yang transparan.",
        icon: Landmark,
        color: "from-blue-400 to-indigo-600",
        bg: "bg-blue-500/10"
    }
];

export function ClientMarquee() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const yBackground = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
    const opacityBackground = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

    return (
        <section 
            ref={containerRef}
            className="relative py-32 overflow-hidden bg-zinc-950 text-white"
        >
            {/* Animated Background Mesh */}
            <motion.div 
                style={{ y: yBackground, opacity: opacityBackground }}
                className="absolute inset-0 z-0 pointer-events-none"
            >
                <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-[var(--premium-gold)]/20 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen" />
                
                {/* Dot grid */}
                <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.03] bg-repeat" />
            </motion.div>

            <div className="container relative z-10 mx-auto px-6">
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
                    >
                        <ShieldCheck className="w-4 h-4 text-[var(--premium-gold)]" />
                        <span className="text-sm font-semibold tracking-widest uppercase text-zinc-300">
                            Kepercayaan Skala Besar
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 40 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8"
                    >
                        Mitra Strategis{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--premium-gold)] via-yellow-200 to-[var(--premium-gold)]">
                            Korporasi & Pemerintahan
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto"
                    >
                        Kualitas yang teruji melahirkan kepercayaan tak ternilai. Kami mengawal transformasi digital instansi dengan keamanan dan skalabilitas tertinggi.
                    </motion.p>
                </div>

                {/* Client Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
                    {clients.map((client, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 50 }}
                            transition={{ duration: 0.8, delay: 0.6 + (idx * 0.2), type: "spring", bounce: 0.4 }}
                            whileHover={{ y: -10 }}
                            className="relative group cursor-pointer"
                        >
                            {/* Animated glowing border effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-white/20 to-white/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                            
                            <div className="relative h-full p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden flex flex-col transition-all duration-500 hover:bg-white/10">
                                
                                {/* Inner glow */}
                                <div className={`absolute top-0 right-0 w-32 h-32 ${client.bg} blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700`} />

                                <div className="flex justify-between items-start mb-10">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${client.color} shadow-lg relative z-10`}>
                                        <client.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-100">
                                        <ArrowUpRight className="w-5 h-5 text-white" />
                                    </div>
                                </div>

                                <div className="relative z-10 flex-grow">
                                    <p className="text-sm font-semibold tracking-widest uppercase text-zinc-400 mb-3">
                                        {client.type}
                                    </p>
                                    <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
                                        {client.name}
                                    </h3>
                                    <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                                        {client.desc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Seamless Infinite Marquee Strip */}
            <div className="relative w-full overflow-hidden mt-32 py-6 border-y border-white/5 bg-black/20 backdrop-blur-sm">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ ease: "linear", duration: 30, repeat: Infinity }}
                    className="flex flex-nowrap items-center w-max"
                >
                    {[0, 1].map((n) => (
                        <div key={n} className="flex items-center gap-16 px-8">
                            {["Keamanan Tingkat Enterprise", "Skalabilitas Tinggi", "Infrastruktur Modern", "Tata Kelola Data", "Dukungan 24/7"].map((text, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <ShieldCheck className="w-6 h-6 text-[var(--premium-gold)]" />
                                    <span className="font-display text-xl md:text-2xl font-bold uppercase tracking-widest text-zinc-600 whitespace-nowrap">
                                        {text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

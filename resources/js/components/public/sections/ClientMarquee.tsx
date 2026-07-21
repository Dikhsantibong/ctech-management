import { motion } from "framer-motion";
import { Building2, Landmark } from "lucide-react";

export function ClientMarquee() {
    return (
        <section className="py-20 md:py-24 bg-zinc-50 border-y border-zinc-200 overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[var(--premium-gold)]/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-4 md:px-8 mb-12 relative z-10 text-center">
                <p className="text-[var(--premium-gold)] font-semibold tracking-wider text-sm md:text-base uppercase mb-4">
                    Kemitraan Strategis
                </p>
                <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 max-w-4xl mx-auto leading-tight">
                    Dipercaya Penuh untuk Mengawal Transformasi Digital Korporasi & Pemerintahan
                </h3>
                <p className="text-zinc-600 mt-6 max-w-2xl mx-auto text-lg">
                    Kami bangga menjadi mitra teknologi andalan bagi institusi berskala besar dalam mewujudkan ekosistem digital yang modern, aman, dan efisien.
                </p>
            </div>

            <div className="relative w-full max-w-[1200px] mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 md:p-10 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center text-center group transition-all duration-300 hover:shadow-xl hover:border-[var(--premium-gold)]/30"
                    >
                        <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center mb-6 group-hover:bg-[var(--premium-gold)]/10 transition-colors">
                            <Building2 className="w-8 h-8 text-zinc-400 group-hover:text-[var(--premium-gold)] transition-colors" />
                        </div>
                        <h4 className="font-display text-xl md:text-2xl font-bold text-zinc-900 mb-2">PT PLN Nusantara Power</h4>
                        <p className="text-zinc-500 font-medium">Badan Usaha Milik Negara (BUMN)</p>
                    </motion.div>

                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 md:p-10 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center text-center group transition-all duration-300 hover:shadow-xl hover:border-[var(--premium-gold)]/30"
                    >
                        <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center mb-6 group-hover:bg-[var(--premium-gold)]/10 transition-colors">
                            <Landmark className="w-8 h-8 text-zinc-400 group-hover:text-[var(--premium-gold)] transition-colors" />
                        </div>
                        <h4 className="font-display text-xl md:text-2xl font-bold text-zinc-900 mb-2">Pemerintahan Kab. Muna Barat</h4>
                        <p className="text-zinc-500 font-medium">Instansi Pemerintahan Daerah</p>
                    </motion.div>
                </div>
            </div>

            {/* Moving text overlay for premium aesthetic */}
            <div className="relative w-full overflow-hidden mt-20 opacity-40">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ ease: "linear", duration: 40, repeat: Infinity }}
                    className="flex flex-nowrap w-max"
                    aria-hidden="true"
                >
                    {[0, 1].map((n) => (
                        <span key={n} className="font-display text-5xl md:text-7xl font-bold uppercase whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-zinc-400 pr-12">
                            Membangun Ekosistem Digital Berkelanjutan&nbsp;•&nbsp;
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

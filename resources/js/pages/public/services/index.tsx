import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { PremiumNavbar } from '@/components/ui/PremiumNavbar';
import { Footer } from '@/components/public/sections/Footer';
import { motion } from 'framer-motion';
import { Process } from '@/components/public/sections/Process';

export default function ServicesIndex() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    return (
        <div className="bg-[var(--premium-bg)] text-[var(--premium-text)] selection:bg-[var(--premium-gold)] selection:text-[var(--premium-dark)] font-['Inter',_sans-serif]">
            <Head>
                <title>Layanan | CTECH</title>
            </Head>

            <div className="fixed top-0 w-full z-50 mix-blend-difference text-white">
                <PremiumNavbar />
            </div>

            <main className="w-full overflow-hidden pt-32">
                <section className="px-8 md:px-16 w-full max-w-[1920px] mx-auto min-h-[50vh] flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                    >
                        <span className="font-['Space_Grotesk',_monospace] text-sm uppercase tracking-widest text-[var(--premium-gold)] mb-8 block">
                            Keahlian Kami
                        </span>
                        <h1 className="font-['Clash_Display',_sans-serif] text-[clamp(3rem,8vw,8rem)] leading-[0.9] tracking-[-0.02em] font-medium text-[var(--premium-dark)] uppercase max-w-5xl">
                            Solusi Skalabel.
                        </h1>
                    </motion.div>
                </section>

                <Process />

                <section className="py-32 bg-[var(--premium-dark)] text-white">
                    <div className="px-8 md:px-16 w-full max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Service Card 1 */}
                        <div className="p-10 border border-white/10 hover:border-[var(--premium-gold)] transition-colors duration-500 rounded-3xl bg-white/5 backdrop-blur-sm">
                            <h3 className="font-['Clash_Display',_sans-serif] text-3xl font-medium mb-6">Software Enterprise</h3>
                            <p className="font-['Inter',_sans-serif] text-gray-400 font-light leading-relaxed mb-10">Membangun ERP, CRM, dan sistem manajemen inti khusus untuk perusahaan Anda dengan arsitektur cloud terkini.</p>
                        </div>
                        {/* Service Card 2 */}
                        <div className="p-10 border border-white/10 hover:border-[var(--premium-gold)] transition-colors duration-500 rounded-3xl bg-white/5 backdrop-blur-sm">
                            <h3 className="font-['Clash_Display',_sans-serif] text-3xl font-medium mb-6">Aplikasi Web</h3>
                            <p className="font-['Inter',_sans-serif] text-gray-400 font-light leading-relaxed mb-10">Aplikasi web berkinerja tinggi, responsif, dan interaktif menggunakan ekosistem modern seperti React, Next.js, dan Laravel.</p>
                        </div>
                        {/* Service Card 3 */}
                        <div className="p-10 border border-white/10 hover:border-[var(--premium-gold)] transition-colors duration-500 rounded-3xl bg-white/5 backdrop-blur-sm">
                            <h3 className="font-['Clash_Display',_sans-serif] text-3xl font-medium mb-6">Desain UI/UX</h3>
                            <p className="font-['Inter',_sans-serif] text-gray-400 font-light leading-relaxed mb-10">Merancang antarmuka memukau yang tidak hanya mengedepankan estetika, namun sangat berfokus pada pengalaman pengguna yang tak terlupakan.</p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

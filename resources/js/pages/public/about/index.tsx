import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { PremiumNavbar } from '@/components/ui/PremiumNavbar';
import { Footer } from '@/components/public/sections/Footer';
import { motion } from 'framer-motion';

export default function AboutIndex() {
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
                <title>Tentang Kami | CTECH</title>
            </Head>

            <div className="fixed top-0 w-full z-50 mix-blend-difference text-white">
                <PremiumNavbar />
            </div>

            <main className="w-full overflow-hidden pt-32 pb-32">
                <section className="px-8 md:px-16 w-full max-w-[1920px] mx-auto min-h-[60vh] flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                    >
                        <span className="font-['Space_Grotesk',_monospace] text-sm uppercase tracking-widest text-[var(--premium-gold)] mb-8 block">
                            Cerita Kami
                        </span>
                        <h1 className="font-['Clash_Display',_sans-serif] text-[clamp(3rem,8vw,8rem)] leading-[0.9] tracking-[-0.02em] font-medium text-[var(--premium-dark)] uppercase max-w-5xl">
                            Kami Merancang Keunggulan Digital.
                        </h1>
                    </motion.div>
                </section>
                
                <section className="px-8 md:px-16 w-full max-w-[1920px] mx-auto mt-20">
                    <div className="w-full aspect-video rounded-3xl overflow-hidden mb-24">
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000" alt="Team" />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-16">
                        <h2 className="font-['Clash_Display',_sans-serif] text-4xl md:text-5xl font-medium">Lebih dari sekadar agensi teknologi.</h2>
                        <div className="font-['Inter',_sans-serif] text-xl leading-relaxed text-gray-600 font-light flex flex-col gap-6">
                            <p>CTECH didirikan dengan satu misi: menghilangkan kerumitan teknis dari proses bisnis Anda dan menggantinya dengan alur kerja digital yang mulus, skalabel, dan indah.</p>
                            <p>Kami menggabungkan prinsip desain editorial dengan teknik rekayasa perangkat lunak tingkat tinggi untuk menghasilkan produk yang tidak hanya berfungsi secara sempurna, tetapi juga memanjakan mata penggunanya.</p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

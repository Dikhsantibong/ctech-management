import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { PremiumNavbar } from '@/components/ui/PremiumNavbar';
import { Footer } from '@/components/public/sections/Footer';
import { PageHeader } from '@/components/public/PageHeader';
import { Statistics } from '@/components/public/sections/Statistics';
import { useLenis } from '@/hooks/use-lenis';
import { SEO } from '@/components/SEO';

export default function AboutIndex() {
    useLenis();

    const imageRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: imageRef,
        offset: ['start end', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

    return (
        <div className="bg-white text-[var(--premium-text)] selection:bg-[var(--premium-gold)] selection:text-white font-body">
            <SEO
                title="Tentang Kami | CTECH Creative"
                description="Pelajari lebih lanjut tentang CTECH Creative, tim ahli di balik solusi software dan desain digital pemenang penghargaan. Kami menggabungkan estetika premium dengan kode yang tangguh."
                url="/tentang"
            />

            <PremiumNavbar />

            <main className="w-full overflow-hidden">
                <PageHeader
                    eyebrow="Cerita Kami"
                    title="Kami Merancang Keunggulan Digital."
                    description="Tim ahli di balik solusi software dan desain digital pemenang penghargaan."
                />

                <section className="py-24 md:py-32">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                        <div ref={imageRef} className="w-full aspect-video rounded-3xl overflow-hidden mb-20 md:mb-28">
                            <motion.img
                                style={{ y, scale: 1.15 }}
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                                className="w-full h-full object-cover"
                                alt="Tim CTECH Creative"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-100px' }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className="font-display text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-[#0d0d0d]"
                            >
                                Lebih dari sekadar agensi teknologi.
                            </motion.h2>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-100px' }}
                                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                                className="font-body text-lg md:text-xl leading-relaxed text-gray-500 font-light flex flex-col gap-6"
                            >
                                <p>CTECH didirikan dengan satu misi: menghilangkan kerumitan teknis dari proses bisnis Anda dan menggantinya dengan alur kerja digital yang mulus, skalabel, dan indah.</p>
                                <p>Kami menggabungkan prinsip desain editorial dengan teknik rekayasa perangkat lunak tingkat tinggi untuk menghasilkan produk yang tidak hanya berfungsi secara sempurna, tetapi juga memanjakan mata penggunanya.</p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <Statistics />
            </main>

            <Footer />
        </div>
    );
}

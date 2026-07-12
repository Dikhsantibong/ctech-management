import { motion } from 'framer-motion';
import { Maximize2, Zap, Layout, ArrowUpRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { PremiumNavbar } from '@/components/ui/PremiumNavbar';
import { Footer } from '@/components/public/sections/Footer';
import { PageHeader } from '@/components/public/PageHeader';
import { Process } from '@/components/public/sections/Process';
import { useLenis } from '@/hooks/use-lenis';
import { SEO } from '@/components/SEO';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const SERVICES = [
    {
        icon: Maximize2,
        title: 'Software Enterprise',
        desc: 'Membangun ERP, CRM, dan sistem manajemen inti khusus untuk perusahaan Anda dengan arsitektur cloud terkini.',
    },
    {
        icon: Zap,
        title: 'Aplikasi Web',
        desc: 'Aplikasi web berkinerja tinggi, responsif, dan interaktif menggunakan ekosistem modern seperti React, Next.js, dan Laravel.',
    },
    {
        icon: Layout,
        title: 'Desain UI/UX',
        desc: 'Merancang antarmuka memukau yang tidak hanya mengedepankan estetika, namun sangat berfokus pada pengalaman pengguna yang tak terlupakan.',
    },
];

export default function ServicesIndex() {
    useLenis();

    return (
        <div className="bg-white text-[var(--premium-text)] selection:bg-[var(--premium-gold)] selection:text-white font-body">
            <SEO
                title="Layanan | CTECH Creative"
                description="Layanan utama CTECH Creative meliputi pengembangan Software Enterprise (ERP, CRM), Aplikasi Web berkinerja tinggi, dan Desain UI/UX yang memukau."
                url="/layanan"
            />

            <PremiumNavbar />

            <main className="w-full overflow-hidden">
                <PageHeader
                    eyebrow="Keahlian Kami"
                    title="Solusi Skalabel."
                    description="Software enterprise, aplikasi web berkinerja tinggi, dan desain UI/UX yang memukau — dirancang presisi untuk pertumbuhan bisnis Anda."
                />

                {/* Kartu layanan */}
                <section className="py-24 md:py-32 bg-white">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 border border-gray-200">
                        {SERVICES.map((service, i) => (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.8, delay: i * 0.15, ease: EASE }}
                                className="bg-white p-10 md:p-14 flex flex-col gap-10 group hover:bg-[#0d0d0d] transition-colors duration-700"
                            >
                                <service.icon className="w-9 h-9 text-[var(--premium-gold)]" strokeWidth={1.5} />
                                <div>
                                    <span className="font-body text-xs uppercase tracking-[0.2em] text-gray-400 mb-3 block">
                                        0{i + 1}
                                    </span>
                                    <h3 className="font-display text-2xl md:text-3xl font-semibold mb-5 text-[#0d0d0d] group-hover:text-white transition-colors duration-700">
                                        {service.title}
                                    </h3>
                                    <p className="font-body text-sm md:text-base text-gray-500 group-hover:text-white/60 leading-relaxed transition-colors duration-700">
                                        {service.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <Process />

                {/* CTA */}
                <section className="py-24 md:py-32 bg-white text-center">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        >
                            <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-[#0d0d0d] mb-10">
                                Siap membangun bersama kami?
                            </h2>
                            <Link
                                href="/kontak"
                                className="inline-flex items-center gap-3 rounded-full bg-[#0d0d0d] text-white px-8 py-4 font-body text-sm font-semibold uppercase tracking-widest hover:bg-[var(--premium-gold)] transition-colors duration-500"
                            >
                                Mulai Diskusi <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

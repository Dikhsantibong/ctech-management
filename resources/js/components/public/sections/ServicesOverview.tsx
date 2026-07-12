import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";
import { ArrowUpRight, Maximize2, Zap, Layout } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const SERVICES = [
    {
        icon: Maximize2,
        title: "Software Enterprise",
        desc: "Membangun ERP, CRM, dan sistem manajemen inti khusus untuk perusahaan Anda dengan arsitektur cloud terkini.",
    },
    {
        icon: Zap,
        title: "Aplikasi Web",
        desc: "Aplikasi web berkinerja tinggi, responsif, dan interaktif menggunakan ekosistem modern seperti React, Next.js, dan Laravel.",
    },
    {
        icon: Layout,
        title: "Desain UI/UX",
        desc: "Merancang antarmuka memukau yang tidak hanya mengedepankan estetika, namun sangat berfokus pada pengalaman pengguna.",
    },
];

export function ServicesOverview() {
    return (
        <section id="services" className="py-24 md:py-32 bg-white text-[#0d0d0d]">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
                >
                    <div>
                        <span className="font-body text-xs uppercase tracking-[0.25em] text-[var(--premium-gold)] mb-6 block">
                            Keahlian Kami
                        </span>
                        <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
                            Solusi digital<br />yang skalabel.
                        </h2>
                    </div>
                    <Link
                        href="/layanan"
                        className="group inline-flex items-center gap-2 font-body text-sm uppercase tracking-widest text-[#0d0d0d]/60 hover:text-[#0d0d0d] transition-colors border-b border-[#0d0d0d]/20 hover:border-[#0d0d0d] pb-1 self-start md:self-auto"
                    >
                        Semua Layanan
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
                    {SERVICES.map((service, i) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.8, delay: i * 0.15, ease: EASE }}
                            className="bg-white p-10 md:p-12 flex flex-col gap-8 group hover:bg-[#0d0d0d] transition-colors duration-700"
                        >
                            <service.icon className="w-8 h-8 text-[var(--premium-gold)]" strokeWidth={1.5} />
                            <div>
                                <span className="font-body text-xs uppercase tracking-[0.2em] text-gray-400 mb-3 block">
                                    0{i + 1}
                                </span>
                                <h3 className="font-display text-2xl font-semibold mb-4 group-hover:text-white transition-colors duration-700">
                                    {service.title}
                                </h3>
                                <p className="font-body text-sm text-gray-500 group-hover:text-white/60 leading-relaxed transition-colors duration-700">
                                    {service.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}

                    {/* Kartu CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
                        className="bg-[var(--premium-gold)] p-10 md:p-12 flex flex-col justify-between gap-8 group"
                    >
                        <ArrowUpRight className="w-8 h-8 text-white transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" strokeWidth={1.5} />
                        <div>
                            <h3 className="font-display text-2xl font-semibold text-white mb-4">
                                Punya kebutuhan khusus?
                            </h3>
                            <Link
                                href="/kontak"
                                className="font-body text-sm uppercase tracking-widest text-white border-b border-white/40 hover:border-white pb-1 inline-block transition-colors"
                            >
                                Konsultasi Gratis
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

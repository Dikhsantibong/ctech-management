import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "@inertiajs/react";
import { ArrowUp, ArrowUpRight } from "lucide-react";

const NAV_LINKS = [
    { name: "Beranda", href: "/" },
    { name: "Tentang Kami", href: "/tentang" },
    { name: "Layanan", href: "/layanan" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Berita", href: "/berita" },
    { name: "Kontak", href: "/kontak" },
];

const SOCIAL_LINKS = [
    { name: "Instagram", href: "https://www.instagram.com/ctech.agency/" },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/pt-creativetech/" },
];

export function Footer() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"],
    });
    const y = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <footer ref={containerRef} className="relative bg-[#0d0d0d] text-white overflow-hidden">
            <motion.div style={{ y }} className="relative">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-10">
                    {/* CTA besar */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-20 md:pb-28 border-b border-white/10">
                        <div>
                            <span className="font-body text-xs uppercase tracking-[0.25em] text-[var(--premium-gold)] mb-6 block">
                                Mulai Proyek
                            </span>
                            <h2 className="font-display text-4xl md:text-7xl font-semibold leading-[1.05] tracking-tight max-w-3xl">
                                Mari wujudkan sesuatu yang baru.
                            </h2>
                            <Link
                                href="/kontak"
                                className="mt-10 inline-flex items-center gap-3 rounded-full bg-white text-[#0d0d0d] px-8 py-4 font-body text-sm font-semibold uppercase tracking-widest hover:bg-[var(--premium-gold)] hover:text-white transition-colors duration-500"
                            >
                                Hubungi Kami <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <button
                            onClick={scrollToTop}
                            aria-label="Kembali ke atas"
                            className="self-start md:self-end w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#0d0d0d] transition-colors duration-500"
                        >
                            <ArrowUp className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Kolom link */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 py-16 md:py-20">
                        <div className="md:col-span-5">
                            <img src="/logo/sidebar-logo.png" alt="CTECH Logo" className="h-12 md:h-16 w-auto opacity-90" />
                            <p className="mt-6 font-body text-sm text-white/50 leading-relaxed max-w-sm font-light">
                                Agensi digital premium yang berfokus pada pengembangan software enterprise,
                                aplikasi web memukau, dan desain UI/UX kelas dunia.
                            </p>
                        </div>
                        <div className="md:col-span-3">
                            <p className="font-body text-xs uppercase tracking-[0.25em] text-white/40 mb-6">Navigasi</p>
                            <ul className="flex flex-col gap-3 font-body text-sm">
                                {NAV_LINKS.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="text-white/70 hover:text-[var(--premium-gold)] transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="md:col-span-2">
                            <p className="font-body text-xs uppercase tracking-[0.25em] text-white/40 mb-6">Sosial</p>
                            <ul className="flex flex-col gap-3 font-body text-sm">
                                {SOCIAL_LINKS.map((link) => (
                                    <li key={link.href}>
                                        <a href={link.href} target="_blank" rel="noreferrer" className="text-white/70 hover:text-[var(--premium-gold)] transition-colors inline-flex items-center gap-1">
                                            {link.name} <ArrowUpRight className="w-3 h-3" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="md:col-span-2">
                            <p className="font-body text-xs uppercase tracking-[0.25em] text-white/40 mb-6">Kontak</p>
                            <ul className="flex flex-col gap-3 font-body text-sm text-white/70">
                                <li><a href="mailto:hello@ctechcreative.com" className="hover:text-[var(--premium-gold)] transition-colors break-all">hello@ctechcreative.com</a></li>
                                <li><a href="tel:+6282293118410" className="hover:text-[var(--premium-gold)] transition-colors">0822 9311 8410</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bar bawah */}
                    <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 font-body text-xs text-white/40 uppercase tracking-[0.2em] gap-4">
                        <p>&copy; {new Date().getFullYear()} CTECH Enterprise. Hak Cipta Dilindungi.</p>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
                            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </footer>
    );
}

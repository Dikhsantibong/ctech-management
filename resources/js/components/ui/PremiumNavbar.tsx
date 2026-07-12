import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const MENU_ITEMS = [
    { name: "Beranda", href: "/" },
    { name: "Tentang Kami", href: "/tentang" },
    { name: "Layanan", href: "/layanan" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Kontak", href: "/kontak" },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface PremiumNavbarProps {
    /** true (default): transparan di atas hero gelap. false: selalu solid gelap (untuk halaman berlatar terang). */
    isLandingPage?: boolean;
}

export function PremiumNavbar({ isLandingPage = true }: PremiumNavbarProps) {
    const { scrollY } = useScroll();
    const { url } = usePage();
    const [hidden, setHidden] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        setHidden(latest > previous && latest > 150 && !mobileMenuOpen);
        setIsScrolled(latest > 50);
    });

    // Kunci scroll body saat overlay menu mobile terbuka
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileMenuOpen]);

    const isActive = (href: string) =>
        href === "/" ? url === "/" : url.startsWith(href);

    const solid = isScrolled || !isLandingPage;

    return (
        <>
            <motion.nav
                variants={{
                    visible: { y: 0 },
                    hidden: { y: "-100%" },
                }}
                animate={hidden ? "hidden" : "visible"}
                transition={{ duration: 0.4, ease: EASE }}
                className={`fixed top-0 left-0 w-full z-50 text-white transition-colors duration-500 ${
                    solid
                        ? "bg-[#0d0d0d]/85 backdrop-blur-xl border-b border-white/[0.08]"
                        : "bg-transparent"
                }`}
            >
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 md:h-24 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="group flex items-center gap-2" aria-label="CTECH - Beranda">
                        <img src="/logo/sidebar-logo.png" alt="CTECH Logo" className="h-8 md:h-9 w-auto" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-10 font-body text-xs uppercase tracking-[0.2em]">
                        {MENU_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative group transition-colors duration-300 ${
                                    isActive(item.href) ? "text-white" : "text-white/60 hover:text-white"
                                }`}
                            >
                                {item.name}
                                <span
                                    className={`absolute -bottom-2 left-0 h-px bg-[var(--premium-gold)] transition-all duration-500 ${
                                        isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                                    }`}
                                ></span>
                            </Link>
                        ))}
                        <Link
                            href="/kontak"
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-5 py-2.5 text-white/90 hover:bg-white hover:text-[#0d0d0d] hover:border-white transition-all duration-500"
                        >
                            Mulai Proyek <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden flex flex-col gap-1.5 z-50 relative text-white p-2 -mr-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
                        aria-expanded={mobileMenuOpen}
                    >
                        <span className={`block w-6 h-[1.5px] bg-current transition-transform duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`}></span>
                        <span className={`block w-6 h-[1.5px] bg-current transition-opacity duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`}></span>
                        <span className={`block w-6 h-[1.5px] bg-current transition-transform duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}></span>
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Fullscreen Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="fixed inset-0 bg-[#0d0d0d] z-40 flex flex-col items-start justify-center px-8"
                    >
                        <nav className="flex flex-col gap-2 w-full" aria-label="Menu utama">
                            {MENU_ITEMS.map((item, i) => (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease: EASE }}
                                    className="overflow-hidden"
                                >
                                    <Link
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`font-display text-4xl font-medium py-2 block transition-colors ${
                                            isActive(item.href) ? "text-[var(--premium-gold)]" : "text-white hover:text-[var(--premium-gold)]"
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="mt-12 flex flex-col gap-2 font-body text-xs uppercase tracking-[0.2em] text-white/50"
                        >
                            <a href="mailto:hello@ctechcreative.com" className="hover:text-white transition-colors">hello@ctechcreative.com</a>
                            <a href="tel:+6282293118410" className="hover:text-white transition-colors">0822 9311 8410</a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

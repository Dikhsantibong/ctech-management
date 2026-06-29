import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

const MENU_ITEMS = [
    { name: "Beranda", href: "/" },
    { name: "Tentang Kami", href: "/tentang" },
    { name: "Layanan", href: "/layanan" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Kontak", href: "/kontak" },
];

export function PremiumNavbar() {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
        setIsScrolled(latest > 50);
    });

    return (
        <motion.nav
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" }
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${isScrolled ? 'bg-[var(--premium-dark)]/90 backdrop-blur-md shadow-lg border-b border-white/10' : 'bg-transparent'}`}
        >
            <div className="max-w-[1920px] mx-auto px-8 md:px-16 h-24 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="group flex items-center gap-2">
                    <div className="w-8 h-8 bg-[var(--premium-gold)] flex items-center justify-center font-['Space_Grotesk',_monospace] font-bold text-[var(--premium-dark)] text-sm group-hover:bg-white transition-colors">
                        CT
                    </div>
                    <span className="font-['Clash_Display',_sans-serif] font-medium tracking-widest text-white text-xl">
                        CTECH.
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-12 font-['Space_Grotesk',_monospace] text-sm uppercase tracking-widest">
                    {MENU_ITEMS.map((item, i) => (
                        <Link 
                            key={i} 
                            href={item.href}
                            className="text-white/80 hover:text-[var(--premium-gold)] transition-colors relative group"
                        >
                            {item.name}
                            <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[var(--premium-gold)] transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}
                    
                    <Link href="/login" className="px-6 py-2 border border-white/20 text-white hover:bg-white hover:text-[var(--premium-dark)] transition-colors duration-300">
                        Login
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    className="md:hidden flex flex-col gap-1.5 z-50 relative text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span className={`block w-6 h-[1.5px] bg-current transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
                    <span className={`block w-6 h-[1.5px] bg-current transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-6 h-[1.5px] bg-current transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 bg-[var(--premium-dark)] z-40 flex flex-col items-center justify-center gap-8 font-['Clash_Display',_sans-serif] text-3xl"
                    >
                        {MENU_ITEMS.map((item, i) => (
                            <Link 
                                key={i} 
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-white hover:text-[var(--premium-gold)] transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link 
                            href="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="mt-8 px-8 py-3 border border-white/20 text-white font-['Space_Grotesk',_monospace] text-sm uppercase tracking-widest"
                        >
                            Login
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

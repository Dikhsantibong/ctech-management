import { motion } from "framer-motion";

export function Footer() {
    return (
        <footer className="bg-[var(--premium-dark)] text-white pt-32 pb-10 border-t border-white/10 overflow-hidden">
            <div className="px-8 md:px-16 w-full max-w-[1920px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-12">
                    <div className="text-[12vw] leading-[0.8] font-['Clash_Display',_sans-serif] font-medium tracking-tight uppercase">
                        CTECH.
                    </div>
                    <div className="flex gap-16 font-['Space_Grotesk',_monospace] text-sm tracking-widest uppercase">
                        <ul className="flex flex-col gap-4">
                            <li><a href="#" className="hover:text-[var(--premium-gold)] transition-colors">Home</a></li>
                            <li><a href="#about" className="hover:text-[var(--premium-gold)] transition-colors">About</a></li>
                            <li><a href="#services" className="hover:text-[var(--premium-gold)] transition-colors">Services</a></li>
                            <li><a href="#portfolio" className="hover:text-[var(--premium-gold)] transition-colors">Work</a></li>
                        </ul>
                        <ul className="flex flex-col gap-4">
                            <li><a href="#" className="hover:text-[var(--premium-gold)] transition-colors">Instagram</a></li>
                            <li><a href="#" className="hover:text-[var(--premium-gold)] transition-colors">LinkedIn</a></li>
                            <li><a href="#" className="hover:text-[var(--premium-gold)] transition-colors">Twitter</a></li>
                            <li><a href="#" className="hover:text-[var(--premium-gold)] transition-colors">Awwwards</a></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 font-['Space_Grotesk',_monospace] text-xs text-gray-500 uppercase tracking-widest gap-4">
                    <p>&copy; {new Date().getFullYear()} CTECH Enterprise. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

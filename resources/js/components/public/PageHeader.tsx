import { motion } from "framer-motion";
import { ReactNode } from "react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface PageHeaderProps {
    eyebrow: string;
    title: string;
    description?: string;
    children?: ReactNode;
}

/**
 * Header gelap standar untuk sub-halaman public.
 * Menjamin navbar (teks putih) selalu terbaca di bagian atas halaman.
 */
export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
    return (
        <header className="bg-[#0d0d0d] text-white pt-36 md:pt-48 pb-20 md:pb-28 relative overflow-hidden">
            {/* Tekstur titik halus */}
            <div
                className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{ backgroundImage: "radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)", backgroundSize: "36px 36px" }}
            ></div>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative">
                <motion.span
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="font-body text-xs uppercase tracking-[0.3em] text-[var(--premium-gold)] mb-6 block"
                >
                    {eyebrow}
                </motion.span>
                <div className="overflow-hidden">
                    <motion.h1
                        initial={{ y: "110%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, delay: 0.15, ease: EASE }}
                        className="font-display text-4xl md:text-7xl font-semibold leading-[1.05] tracking-tight max-w-5xl"
                    >
                        {title}
                    </motion.h1>
                </div>
                {description && (
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="mt-8 font-body text-base md:text-lg text-white/50 leading-relaxed font-light max-w-2xl"
                    >
                        {description}
                    </motion.p>
                )}
                {children}
            </div>
        </header>
    );
}

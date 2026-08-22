import { motion } from "framer-motion";
import { ReactNode } from "react";
import { SectionBackdrop } from "@/components/public/SectionBackdrop";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface PageHeaderProps {
    eyebrow: string;
    title: string;
    description?: string;
    /** Keterangan ringkas bergaya dokumen, mis. { "Badan Usaha": "PT ..." } */
    meta?: { label: string; value: string }[];
    /** Foto latar dari public/. Diredam kuat agar teks tetap terbaca. */
    backdrop?: string;
    backdropPosition?: string;
    children?: ReactNode;
}

/**
 * Kepala halaman untuk sub-halaman publik.
 *
 * Tekstur titik dekoratif dan aksen emas dihilangkan; ruangnya dipakai untuk
 * keterangan yang berguna agar halaman terbaca sebagai dokumen resmi.
 */
export function PageHeader({
    eyebrow,
    title,
    description,
    meta,
    backdrop,
    backdropPosition = "center 35%",
    children,
}: PageHeaderProps) {
    return (
        <header className="relative overflow-hidden border-b border-white/10 bg-[#0f1115] pb-16 pt-36 text-white md:pb-20 md:pt-44">
            {backdrop && <SectionBackdrop image={backdrop} overlay={90} position={backdropPosition} />}

            <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="font-body text-[11px] uppercase tracking-[0.28em] text-white/40"
                >
                    {eyebrow}
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.06, ease: EASE }}
                    className="mt-6 max-w-4xl font-display text-[2.25rem] font-semibold leading-[1.14] tracking-tight md:text-[3.5rem]"
                >
                    {title}
                </motion.h1>

                {description && (
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
                        className="mt-7 max-w-2xl font-body text-base leading-relaxed text-white/55 md:text-lg"
                    >
                        {description}
                    </motion.p>
                )}

                {meta && meta.length > 0 && (
                    <motion.dl
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
                        className="mt-12 grid grid-cols-1 gap-px border-t border-white/10 sm:grid-cols-3"
                    >
                        {meta.map((item) => (
                            <div key={item.label} className="border-b border-white/10 py-5 sm:border-b-0 sm:pr-8">
                                <dt className="font-body text-[10px] uppercase tracking-[0.24em] text-white/35">{item.label}</dt>
                                <dd className="mt-2 font-body text-sm leading-relaxed text-white/75">{item.value}</dd>
                            </div>
                        ))}
                    </motion.dl>
                )}

                {children}
            </div>
        </header>
    );
}

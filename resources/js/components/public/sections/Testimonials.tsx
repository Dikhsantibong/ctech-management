import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations/motionVariants";
import { useState } from "react";

const TESTIMONIALS = [
    {
        quote: "CTECH didn't just build a software; they completely re-engineered our operational workflow. The new cloud architecture handled our Black Friday traffic without a single hiccup.",
        author: "Budi Santoso",
        role: "COO, Retail Nasional",
    },
    {
        quote: "The most professional engineering team we've ever partnered with. From discovery to deployment, their attention to both UI/UX and backend scalability is unmatched.",
        author: "Andi Pratama",
        role: "CEO, Enterprise Corp",
    }
];

export function Testimonials() {
    const [active, setActive] = useState(0);

    return (
        <section className="py-32 bg-[var(--premium-beige)] text-[var(--premium-dark)] relative overflow-hidden">
            <div className="px-8 md:px-16 w-full max-w-[1920px] mx-auto min-h-[50vh] flex flex-col justify-center">
                <div className="flex justify-between items-end mb-16 border-b border-[var(--premium-dark)]/20 pb-8">
                    <span className="font-['Space_Grotesk',_monospace] text-sm uppercase tracking-widest">
                        Voices of our Partners
                    </span>
                    <div className="flex gap-4">
                        {TESTIMONIALS.map((_, i) => (
                            <button 
                                key={i}
                                onClick={() => setActive(i)}
                                className={`w-3 h-3 rounded-full transition-colors duration-500 ${i === active ? 'bg-[var(--premium-dark)]' : 'bg-[var(--premium-dark)]/20'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="relative min-h-[300px]">
                    {TESTIMONIALS.map((testi, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: i === active ? 1 : 0, y: i === active ? 0 : 20, zIndex: i === active ? 10 : 0 }}
                            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                            className="absolute top-0 left-0 w-full md:w-3/4 pointer-events-none"
                            style={{ pointerEvents: i === active ? 'auto' : 'none' }}
                        >
                            <h3 className="font-['Clash_Display',_sans-serif] text-3xl md:text-5xl font-medium leading-[1.2] mb-12">
                                "{testi.quote}"
                            </h3>
                            <div>
                                <div className="font-['Inter',_sans-serif] text-xl font-bold">{testi.author}</div>
                                <div className="font-['Space_Grotesk',_monospace] text-sm tracking-widest mt-1 opacity-70 uppercase">{testi.role}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

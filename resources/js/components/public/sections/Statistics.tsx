import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const STATS = [
    { value: 250, label: "Proyek Selesai", suffix: "+" },
    { value: 98, label: "Kepuasan Klien", suffix: "%" },
    { value: 10, label: "Tahun Pengalaman", suffix: "+" },
    { value: 50, label: "Tim Ahli", suffix: "+" },
];

function AnimatedCounter({ value, suffix }: { value: number, suffix: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const end = value;
            const duration = 2000;
            const increment = end / (duration / 16);
            
            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    clearInterval(timer);
                    setCount(end);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);
            
            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return (
        <span ref={ref}>
            {count}{suffix}
        </span>
    );
}

export function Statistics() {
    return (
        <section className="py-32 bg-[var(--premium-dark)] text-white relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}></div>
            <div className="px-8 md:px-16 w-full max-w-[1920px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 relative z-10">
                {STATS.map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: [0.76, 0, 0.24, 1] }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center justify-center text-center group"
                    >
                        <h4 className="font-['Clash_Display',_sans-serif] text-5xl md:text-7xl font-medium mb-4 text-[var(--premium-gold)]">
                            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                        </h4>
                        <p className="font-['Space_Grotesk',_monospace] text-sm tracking-widest text-gray-400 group-hover:text-white transition-colors duration-500 uppercase">
                            {stat.label}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

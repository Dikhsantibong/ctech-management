import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const STATS = [
    { value: 250, label: "Proyek Selesai", suffix: "+" },
    { value: 98, label: "Kepuasan Klien", suffix: "%" },
    { value: 10, label: "Tahun Pengalaman", suffix: "+" },
    { value: 50, label: "Tim Ahli", suffix: "+" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
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
        <section className="py-24 md:py-32 bg-white text-[#0d0d0d] border-t border-gray-100">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4">
                {STATS.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: i * 0.15, ease: EASE }}
                        viewport={{ once: true, margin: "-80px" }}
                        className={`flex flex-col gap-4 py-8 md:py-4 px-6 md:px-10 ${i > 0 ? "md:border-l md:border-gray-200" : ""} ${i % 2 === 1 ? "border-l border-gray-200 md:border-l" : ""}`}
                    >
                        <h4 className="font-display text-5xl md:text-7xl font-semibold tracking-tight">
                            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                        </h4>
                        <p className="font-body text-xs md:text-sm uppercase tracking-[0.2em] text-gray-400">
                            {stat.label}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

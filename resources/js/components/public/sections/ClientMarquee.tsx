import { motion } from "framer-motion";

const LOGOS = [
    { name: "Acme Corp", src: "/logos/company1.png" },
    { name: "Global Tech", src: "/logos/company2.png" },
    { name: "Innovate Inc", src: "/logos/company3.png" },
    { name: "Future Systems", src: "/logos/company4.png" },
];

export function ClientMarquee() {
    return (
        <section className="py-20 md:py-24 bg-[#f9fafb] border-y border-gray-100 overflow-hidden">
            {/* Marquee teks outline */}
            <div className="relative w-full overflow-hidden mb-14">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ ease: "linear", duration: 30, repeat: Infinity }}
                    className="flex flex-nowrap w-max"
                    aria-hidden="true"
                >
                    {[0, 1].map((n) => (
                        <span key={n} className="font-display text-6xl md:text-8xl font-bold uppercase whitespace-nowrap text-stroke-dark pr-8">
                            Dipercaya Pemimpin Industri&nbsp;—&nbsp;Dipercaya Pemimpin Industri&nbsp;—&nbsp;
                        </span>
                    ))}
                </motion.div>
            </div>

            <div className="relative w-full max-w-[1400px] mx-auto flex overflow-x-hidden">
                <div className="absolute left-0 top-0 w-24 md:w-32 h-full bg-gradient-to-r from-[#f9fafb] to-transparent z-10"></div>
                <div className="absolute right-0 top-0 w-24 md:w-32 h-full bg-gradient-to-l from-[#f9fafb] to-transparent z-10"></div>

                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ ease: "linear", duration: 20, repeat: Infinity }}
                    className="flex flex-nowrap items-center gap-16 md:gap-32 w-max pr-16 md:pr-32"
                >
                    {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
                        <div key={i} className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-500 filter grayscale hover:grayscale-0">
                            <img src={logo.src} alt={logo.name} loading="lazy" className="h-9 md:h-11 object-contain" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

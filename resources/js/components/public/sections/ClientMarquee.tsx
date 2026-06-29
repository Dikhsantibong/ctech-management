import { motion } from "framer-motion";

const LOGOS = [
    { name: "Acme Corp", src: "/logos/company1.png" },
    { name: "Global Tech", src: "/logos/company2.png" },
    { name: "Innovate Inc", src: "/logos/company3.png" },
    { name: "Future Systems", src: "/logos/company4.png" },
    { name: "Acme Corp 2", src: "/logos/company1.png" },
    { name: "Global Tech 2", src: "/logos/company2.png" },
    { name: "Innovate Inc 2", src: "/logos/company3.png" },
    { name: "Future Systems 2", src: "/logos/company4.png" },
];

export function ClientMarquee() {
    return (
        <section className="py-24 bg-white border-y border-gray-100 overflow-hidden flex flex-col items-center">
            <span className="font-['Space_Grotesk',_monospace] text-xs uppercase tracking-widest text-gray-400 mb-12 block text-center">
                Trusted by industry leaders
            </span>
            <div className="relative w-full max-w-[1920px] mx-auto flex overflow-x-hidden">
                <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
                <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
                
                <motion.div 
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ ease: "linear", duration: 20, repeat: Infinity }}
                    className="flex flex-nowrap items-center gap-16 md:gap-32 w-max pr-16 md:pr-32"
                >
                    {[...LOGOS, ...LOGOS].map((logo, i) => (
                        <div key={i} className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-500 filter grayscale hover:grayscale-0 cursor-pointer">
                            <img src={logo.src} alt={logo.name} className="h-10 md:h-12 object-contain" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

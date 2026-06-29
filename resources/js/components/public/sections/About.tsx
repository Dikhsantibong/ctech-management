import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations/motionVariants";

export function About() {
    return (
        <section id="about" className="py-32 md:py-48 bg-[var(--premium-dark)] text-[var(--premium-gray)] overflow-hidden">
            <div className="px-8 md:px-16 w-full max-w-[1920px] mx-auto swiss-grid">
                
                <motion.div 
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        animate: { transition: { staggerChildren: 0.1 } }
                    }}
                    className="col-span-12 md:col-span-5 flex flex-col justify-between"
                >
                    <motion.span variants={fadeUp} className="font-['Space_Grotesk',_monospace] text-sm uppercase tracking-widest text-[var(--premium-gold)] mb-8 block">
                        Our Vision & Mission
                    </motion.span>
                    <motion.h2 variants={fadeUp} className="font-['Clash_Display',_sans-serif] text-4xl md:text-6xl font-medium leading-tight mb-12">
                        We don't just build software. We craft digital legacies.
                    </motion.h2>
                </motion.div>

                <div className="col-span-12 md:col-span-6 md:col-start-7 flex flex-col gap-12 pt-12 md:pt-0">
                    <motion.div 
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeUp}
                    >
                        <p className="font-['Inter',_sans-serif] text-xl md:text-3xl font-light leading-relaxed mb-8">
                            Founded on the principles of brutalist architecture and editorial design, our studio merges high-performance engineering with breathtaking aesthetics.
                        </p>
                        <p className="font-['Inter',_sans-serif] text-lg text-gray-400 font-light leading-relaxed">
                            Every project is an opportunity to push the boundaries of what is possible on the web. We are a collective of senior architects, award-winning designers, and motion experts who believe that the digital world deserves the same craftsmanship as high-end physical products.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                        viewport={{ once: true }}
                        className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mt-12"
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
                            alt="Luxury Office" 
                            className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000 ease-out"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-1000"></div>
                    </motion.div>
                </div>

            </div>
        </section>
    );
}

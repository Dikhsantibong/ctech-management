import { motion, useScroll, useTransform } from "framer-motion";
import { fadeUp, revealLine, EASING } from "@/lib/animations/motionVariants";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "@inertiajs/react";

export function Hero() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    return (
        <section 
            ref={containerRef}
            className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[var(--premium-bg)]"
        >
            <motion.div 
                style={{ y, opacity }}
                className="absolute inset-0 z-0 pointer-events-none"
            >
                {/* Abstract animated gradient or high-end imagery could go here */}
                <div className="absolute top-[20%] left-[60%] w-[40vw] h-[40vw] rounded-full bg-[var(--premium-bg-alt)] mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[70%] w-[30vw] h-[30vw] rounded-full bg-[var(--premium-beige)] mix-blend-multiply filter blur-[80px] opacity-50"></div>
            </motion.div>

            <div className="relative z-10 swiss-grid px-8 md:px-16 w-full max-w-[1920px]">
                <div className="col-span-12 md:col-span-10 md:col-start-2 flex flex-col items-start pt-20">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={{
                            animate: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
                        }}
                        className="overflow-hidden"
                    >
                        <div className="overflow-hidden">
                            <motion.h1 variants={revealLine} className="font-['Clash_Display',_sans-serif] text-[clamp(3rem,8vw,9rem)] leading-[0.9] tracking-[-0.02em] font-medium text-[var(--premium-dark)] uppercase">
                                Engineering
                            </motion.h1>
                        </div>
                        <div className="overflow-hidden flex items-center gap-4 md:gap-8">
                            <motion.div variants={fadeUp} className="w-16 md:w-32 h-[2px] bg-[var(--premium-gold)] hidden md:block"></motion.div>
                            <motion.h1 variants={revealLine} className="font-['Clash_Display',_sans-serif] text-[clamp(3rem,8vw,9rem)] leading-[0.9] tracking-[-0.02em] font-medium text-[var(--premium-dark)] uppercase">
                                Digital Elegance
                            </motion.h1>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial="initial"
                        animate="animate"
                        variants={fadeUp}
                        className="mt-12 md:mt-24 max-w-xl"
                    >
                        <p className="font-['Inter',_sans-serif] text-lg md:text-2xl text-[var(--premium-text)] leading-relaxed font-light">
                            We craft award-winning digital experiences that merge Swiss precision with avant-garde motion design.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8, ease: EASING }}
                        className="mt-12 flex items-center gap-6"
                    >
                        <Link href="/kontak">
                            <MagneticButton>
                                Discover Our Work <ArrowRight className="w-4 h-4" />
                            </MagneticButton>
                        </Link>
                    </motion.div>
                </div>
            </div>

            <div className="absolute bottom-10 left-8 md:left-16 flex items-center gap-4 text-xs font-['Space_Grotesk',_monospace] uppercase tracking-widest text-[var(--premium-text)] opacity-60">
                <span>Scroll to explore</span>
                <motion.div 
                    animate={{ y: [0, 10, 0] }} 
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="w-[1px] h-12 bg-[var(--premium-dark)]"
                ></motion.div>
            </div>
        </section>
    );
}

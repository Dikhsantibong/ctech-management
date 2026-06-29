import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations/motionVariants";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function Contact() {
    return (
        <section className="py-32 bg-[var(--premium-dark)] text-white relative">
            <div className="px-8 md:px-16 w-full max-w-[1920px] mx-auto swiss-grid">
                
                <div className="col-span-12 md:col-span-6 flex flex-col justify-between">
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
                    >
                        <motion.span variants={fadeUp} className="font-['Space_Grotesk',_monospace] text-sm uppercase tracking-widest text-[var(--premium-gold)] mb-8 block">
                            Start a Project
                        </motion.span>
                        <motion.h2 variants={fadeUp} className="font-['Clash_Display',_sans-serif] text-5xl md:text-8xl font-medium leading-[0.9] mb-12">
                            Let's build<br/>something<br/>extraordinary.
                        </motion.h2>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        viewport={{ once: true }}
                        className="mt-12 md:mt-0 font-['Space_Grotesk',_monospace]"
                    >
                        <p className="text-gray-400 mb-2 uppercase text-sm tracking-widest">Email us</p>
                        <a href="mailto:hello@ctech.co" className="text-2xl hover:text-[var(--premium-gold)] transition-colors">hello@ctech.co</a>
                        
                        <p className="text-gray-400 mt-8 mb-2 uppercase text-sm tracking-widest">Call us</p>
                        <a href="tel:+6281112345678" className="text-2xl hover:text-[var(--premium-gold)] transition-colors">+62 811 1234 5678</a>
                    </motion.div>
                </div>

                <div className="col-span-12 md:col-span-5 md:col-start-8 mt-16 md:mt-0">
                    <motion.form 
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="flex flex-col gap-12 bg-white/5 p-10 rounded-3xl border border-white/10 backdrop-blur-md"
                    >
                        <div className="flex flex-col gap-4">
                            <label className="font-['Space_Grotesk',_monospace] text-sm tracking-widest uppercase text-gray-400">What's your name?</label>
                            <input type="text" placeholder="John Doe *" className="bg-transparent border-b border-gray-600 pb-4 text-xl focus:outline-none focus:border-[var(--premium-gold)] transition-colors text-white placeholder-gray-600" />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="font-['Space_Grotesk',_monospace] text-sm tracking-widest uppercase text-gray-400">What's your email?</label>
                            <input type="email" placeholder="john@company.com *" className="bg-transparent border-b border-gray-600 pb-4 text-xl focus:outline-none focus:border-[var(--premium-gold)] transition-colors text-white placeholder-gray-600" />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="font-['Space_Grotesk',_monospace] text-sm tracking-widest uppercase text-gray-400">Tell us about your project</label>
                            <textarea placeholder="Hello CTECH, I need help with... *" rows={4} className="bg-transparent border-b border-gray-600 pb-4 text-xl focus:outline-none focus:border-[var(--premium-gold)] transition-colors text-white placeholder-gray-600 resize-none"></textarea>
                        </div>
                        
                        <MagneticButton variant="primary" className="self-start mt-4 bg-white text-black hover:bg-[var(--premium-gold)] hover:text-white">
                            Send Message
                        </MagneticButton>
                    </motion.form>
                </div>

            </div>
        </section>
    );
}

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations/motionVariants";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useState } from "react";

export function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.message) {
            alert("Mohon lengkapi semua data sebelum mengirim pesan.");
            return;
        }

        const text = `Halo tim CTECH,\n\nSaya ingin berdiskusi mengenai proyek.\n\n*Nama:* ${formData.name}\n*Email:* ${formData.email}\n\n*Pesan / Detail Proyek:*\n${formData.message}`;
        const whatsappUrl = `https://wa.me/6282293118410?text=${encodeURIComponent(text)}`;
        
        window.open(whatsappUrl, '_blank');
        
        // Reset form
        setFormData({ name: "", email: "", message: "" });
    };

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
                            Mulai Proyek
                        </motion.span>
                        <motion.h2 variants={fadeUp} className="font-['Clash_Display',_sans-serif] text-5xl md:text-8xl font-medium leading-[0.9] mb-12">
                            Mari ciptakan<br/>sesuatu yang<br/>luar biasa.
                        </motion.h2>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        viewport={{ once: true }}
                        className="mt-12 md:mt-0 font-['Space_Grotesk',_monospace]"
                    >
                        <p className="text-gray-400 mb-2 uppercase text-sm tracking-widest">Email kami</p>
                        <a href="mailto:hello@ctechcreative.com" className="text-2xl hover:text-[var(--premium-gold)] transition-colors">hello@ctechcreative.com</a>
                        
                        <p className="text-gray-400 mt-8 mb-2 uppercase text-sm tracking-widest">Hubungi kami</p>
                        <a href="tel:+6282293118410" className="text-2xl hover:text-[var(--premium-gold)] transition-colors">0822 9311 8410</a>
                    </motion.div>
                </div>

                <div className="col-span-12 md:col-span-5 md:col-start-8 mt-16 md:mt-0">
                    <motion.form 
                        onSubmit={handleSubmit}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="flex flex-col gap-12 bg-white/5 p-10 rounded-3xl border border-white/10 backdrop-blur-md"
                    >
                        <div className="flex flex-col gap-4">
                            <label className="font-['Space_Grotesk',_monospace] text-sm tracking-widest uppercase text-gray-400">Siapa nama Anda?</label>
                            <input 
                                type="text" 
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Budi Santoso *" 
                                className="bg-transparent border-b border-gray-600 pb-4 text-xl focus:outline-none focus:border-[var(--premium-gold)] transition-colors text-white placeholder-gray-600" 
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="font-['Space_Grotesk',_monospace] text-sm tracking-widest uppercase text-gray-400">Apa alamat email Anda?</label>
                            <input 
                                type="email" 
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="budi@perusahaan.com *" 
                                className="bg-transparent border-b border-gray-600 pb-4 text-xl focus:outline-none focus:border-[var(--premium-gold)] transition-colors text-white placeholder-gray-600" 
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="font-['Space_Grotesk',_monospace] text-sm tracking-widest uppercase text-gray-400">Ceritakan tentang proyek Anda</label>
                            <textarea 
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                placeholder="Halo CTECH, saya butuh bantuan untuk... *" 
                                rows={4} 
                                className="bg-transparent border-b border-gray-600 pb-4 text-xl focus:outline-none focus:border-[var(--premium-gold)] transition-colors text-white placeholder-gray-600 resize-none"
                            ></textarea>
                        </div>
                        
                        <button type="submit" className="self-start mt-4">
                            <MagneticButton variant="primary" className="bg-white text-black hover:bg-[var(--premium-gold)] hover:text-white pointer-events-none">
                                Kirim Pesan
                            </MagneticButton>
                        </button>
                    </motion.form>
                </div>

            </div>
        </section>
    );
}

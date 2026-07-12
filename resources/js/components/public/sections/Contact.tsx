import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

export function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            alert("Mohon lengkapi semua data sebelum mengirim pesan.");
            return;
        }

        const text = `Halo tim CTECH,\n\nSaya ingin berdiskusi mengenai proyek.\n\n*Nama:* ${formData.name}\n*Email:* ${formData.email}\n\n*Pesan / Detail Proyek:*\n${formData.message}`;
        const whatsappUrl = `https://wa.me/6282293118410?text=${encodeURIComponent(text)}`;

        window.open(whatsappUrl, "_blank");

        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <section className="py-24 md:py-32 bg-[#0d0d0d] text-white relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                <div className="flex flex-col justify-between">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="font-body text-xs uppercase tracking-[0.25em] text-[var(--premium-gold)] mb-8 block">
                            Mulai Proyek
                        </span>
                        <h2 className="font-display text-5xl md:text-7xl font-semibold leading-[1.02] tracking-tight mb-12">
                            Mari ciptakan<br />sesuatu yang<br />luar biasa.
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 1 }}
                        viewport={{ once: true }}
                        className="mt-4 flex flex-col gap-8"
                    >
                        <div>
                            <p className="font-body text-xs uppercase tracking-[0.25em] text-white/40 mb-2">Email kami</p>
                            <a href="mailto:hello@ctechcreative.com" className="font-display text-xl md:text-2xl hover:text-[var(--premium-gold)] transition-colors">
                                hello@ctechcreative.com
                            </a>
                        </div>
                        <div>
                            <p className="font-body text-xs uppercase tracking-[0.25em] text-white/40 mb-2">Hubungi kami</p>
                            <a href="tel:+6282293118410" className="font-display text-xl md:text-2xl hover:text-[var(--premium-gold)] transition-colors">
                                0822 9311 8410
                            </a>
                        </div>
                    </motion.div>
                </div>

                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="flex flex-col gap-10 bg-[#1a1a1a] p-8 md:p-12 rounded-3xl border border-white/[0.08]"
                >
                    <div className="flex flex-col gap-3">
                        <label htmlFor="contact-name" className="font-body text-xs uppercase tracking-[0.2em] text-white/40">
                            Siapa nama Anda?
                        </label>
                        <input
                            id="contact-name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Budi Santoso *"
                            className="bg-transparent border-b border-white/15 pb-4 font-body text-lg focus:outline-none focus:border-[var(--premium-gold)] transition-colors text-white placeholder-white/25"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label htmlFor="contact-email" className="font-body text-xs uppercase tracking-[0.2em] text-white/40">
                            Apa alamat email Anda?
                        </label>
                        <input
                            id="contact-email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="budi@perusahaan.com *"
                            className="bg-transparent border-b border-white/15 pb-4 font-body text-lg focus:outline-none focus:border-[var(--premium-gold)] transition-colors text-white placeholder-white/25"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label htmlFor="contact-message" className="font-body text-xs uppercase tracking-[0.2em] text-white/40">
                            Ceritakan tentang proyek Anda
                        </label>
                        <textarea
                            id="contact-message"
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Halo CTECH, saya butuh bantuan untuk... *"
                            rows={4}
                            className="bg-transparent border-b border-white/15 pb-4 font-body text-lg focus:outline-none focus:border-[var(--premium-gold)] transition-colors text-white placeholder-white/25 resize-none"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="self-start mt-2 inline-flex items-center gap-3 rounded-full bg-white text-[#0d0d0d] px-8 py-4 font-body text-sm font-semibold uppercase tracking-widest hover:bg-[var(--premium-gold)] hover:text-white transition-colors duration-500"
                    >
                        Kirim Pesan <ArrowUpRight className="w-4 h-4" />
                    </button>
                </motion.form>
            </div>
        </section>
    );
}

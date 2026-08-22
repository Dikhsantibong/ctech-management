import { motion } from "framer-motion";
import { useState } from "react";
import { SectionBackdrop } from "@/components/public/SectionBackdrop";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Company = {
    legal_name?: string | null;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
};

const SUBJECTS = [
    "Sistem informasi manajemen",
    "Aplikasi web / portal",
    "Integrasi & migrasi data",
    "Pemeliharaan sistem berjalan",
    "Lainnya",
];

/** Hanya sisakan angka agar tautan wa.me valid, dan awali dengan kode negara. */
const toWhatsApp = (phone?: string | null) => {
    if (!phone) return null;
    const digits = phone.replace(/\D/g, "");
    if (!digits) return null;
    return digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
};

export function Contact({ company }: { company?: Company }) {
    const [form, setForm] = useState({ name: "", organization: "", email: "", subject: SUBJECTS[0], message: "" });
    const [error, setError] = useState<string | null>(null);

    const waNumber = toWhatsApp(company?.phone) ?? "6282293118410";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            setError("Nama, email, dan uraian kebutuhan wajib diisi.");
            return;
        }

        setError(null);

        const text = [
            "Permohonan penawaran",
            "",
            `Nama            : ${form.name}`,
            `Instansi/Perusahaan : ${form.organization || "-"}`,
            `Email           : ${form.email}`,
            `Kebutuhan       : ${form.subject}`,
            "",
            "Uraian:",
            form.message,
        ].join("\n");

        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
        setForm({ name: "", organization: "", email: "", subject: SUBJECTS[0], message: "" });
    };

    const fieldClass =
        "w-full border-b border-white/20 bg-transparent pb-3 font-body text-base text-white placeholder-white/30 transition-colors focus:border-white focus:outline-none";
    const labelClass = "font-body text-[10px] uppercase tracking-[0.24em] text-white/40";

    return (
        <section className="relative overflow-hidden bg-[#0f1115] py-24 text-white md:py-32">
            <SectionBackdrop image="/our-story/photo4.jpeg" overlay={92} position="center 30%" />

            <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-16 px-6 md:px-12 lg:grid-cols-12 lg:gap-20">
                {/* Keterangan resmi */}
                <div className="lg:col-span-5">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6, ease: EASE }}
                    >
                        <p className={labelClass}>Pengajuan Kebutuhan</p>
                        <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.15] tracking-tight md:text-[2.6rem]">
                            Sampaikan kebutuhan Anda, kami balas dengan lingkup dan estimasi.
                        </h2>
                        <p className="mt-6 font-body text-base leading-relaxed text-white/55">
                            Permohonan yang masuk kami tinjau pada hari kerja. Bila diperlukan, kami
                            jadwalkan pertemuan untuk memperjelas lingkup sebelum penawaran disusun.
                        </p>
                    </motion.div>

                    <motion.dl
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
                        className="mt-12 divide-y divide-white/10 border-y border-white/10"
                    >
                        {company?.legal_name && (
                            <div className="py-5">
                                <dt className={labelClass}>Badan Usaha</dt>
                                <dd className="mt-2 font-body text-sm text-white/80">{company.legal_name}</dd>
                            </div>
                        )}
                        {company?.address && (
                            <div className="py-5">
                                <dt className={labelClass}>Alamat</dt>
                                <dd className="mt-2 font-body text-sm leading-relaxed text-white/80">{company.address}</dd>
                            </div>
                        )}
                        {company?.email && (
                            <div className="py-5">
                                <dt className={labelClass}>Surel</dt>
                                <dd className="mt-2">
                                    <a href={`mailto:${company.email}`} className="font-body text-sm text-white/80 underline-offset-4 hover:underline">
                                        {company.email}
                                    </a>
                                </dd>
                            </div>
                        )}
                        {company?.phone && (
                            <div className="py-5">
                                <dt className={labelClass}>Telepon</dt>
                                <dd className="mt-2">
                                    <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="font-body text-sm text-white/80 underline-offset-4 hover:underline">
                                        {company.phone}
                                    </a>
                                </dd>
                            </div>
                        )}
                        <div className="py-5">
                            <dt className={labelClass}>Jam Layanan</dt>
                            <dd className="mt-2 font-body text-sm text-white/80">Senin–Jumat, 08.00–17.00 WITA</dd>
                        </div>
                    </motion.dl>
                </div>

                {/* Formulir */}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, delay: 0.14, ease: EASE }}
                    className="flex flex-col gap-9 border border-white/10 p-8 md:p-10 lg:col-span-7"
                >
                    <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                        <div className="flex flex-col gap-3">
                            <label htmlFor="contact-name" className={labelClass}>Nama Lengkap</label>
                            <input
                                id="contact-name"
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className={fieldClass}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <label htmlFor="contact-org" className={labelClass}>Instansi / Perusahaan</label>
                            <input
                                id="contact-org"
                                type="text"
                                value={form.organization}
                                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                                className={fieldClass}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <label htmlFor="contact-email" className={labelClass}>Surel</label>
                        <input
                            id="contact-email"
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className={fieldClass}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label htmlFor="contact-subject" className={labelClass}>Jenis Kebutuhan</label>
                        <select
                            id="contact-subject"
                            value={form.subject}
                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                            className={`${fieldClass} [&>option]:bg-[#0f1115]`}
                        >
                            {SUBJECTS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-3">
                        <label htmlFor="contact-message" className={labelClass}>Uraian Kebutuhan</label>
                        <textarea
                            id="contact-message"
                            required
                            rows={5}
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            placeholder="Proses apa yang ingin dibenahi, siapa penggunanya, dan target waktunya."
                            className={`${fieldClass} resize-none`}
                        />
                    </div>

                    {error && <p className="font-body text-sm text-red-300">{error}</p>}

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <button
                            type="submit"
                            className="bg-white px-8 py-4 font-body text-sm font-semibold uppercase tracking-[0.12em] text-[#0f1115] transition-colors duration-300 hover:bg-white/85"
                        >
                            Kirim Permohonan
                        </button>
                        <p className="font-body text-xs text-white/40">
                            Permohonan diteruskan melalui WhatsApp resmi perusahaan.
                        </p>
                    </div>
                </motion.form>
            </div>
        </section>
    );
}

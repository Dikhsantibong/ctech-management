import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Layanan dijabarkan dalam bentuk keluaran yang bisa diperiksa, bukan kata sifat.
 * "Antarmuka memukau" tidak bisa diverifikasi; "dokumen serah terima" bisa.
 */
const SERVICES = [
    {
        title: "Sistem Informasi Manajemen",
        summary:
            "Aplikasi internal untuk mengelola proyek, dokumen, keuangan, dan pelaporan — menggantikan pencatatan yang masih tersebar di berkas terpisah.",
        deliverables: ["Analisis proses berjalan", "Basis data terstruktur", "Hak akses per jabatan", "Pelatihan pengguna"],
    },
    {
        title: "Aplikasi Web & Portal",
        summary:
            "Situs korporat, portal layanan, dan aplikasi berbasis web yang berjalan di peramban tanpa pemasangan di perangkat pengguna.",
        deliverables: ["Rancangan antarmuka", "Pengembangan front-end & back-end", "Uji terima pengguna", "Panduan operasional"],
    },
    {
        title: "Integrasi & Migrasi Data",
        summary:
            "Menyambungkan sistem yang sudah berjalan dan memindahkan data lama ke sistem baru tanpa menghentikan operasional.",
        deliverables: ["Pemetaan data", "Skrip migrasi terverifikasi", "Uji paralel", "Berita acara migrasi"],
    },
];

export function ServicesOverview() {
    return (
        <section id="services" className="border-t border-gray-200 bg-[#f7f8f9] py-24 text-[#0f1115] md:py-32">
            <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="flex flex-col justify-between gap-6 border-b border-gray-300 pb-10 md:flex-row md:items-end"
                >
                    <div>
                        <p className="font-body text-[11px] uppercase tracking-[0.28em] text-gray-400">Lingkup Layanan</p>
                        <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold leading-[1.15] tracking-tight md:text-[2.75rem]">
                            Tiga lini pekerjaan yang kami tangani secara penuh.
                        </h2>
                    </div>
                    <Link
                        href="/layanan"
                        className="shrink-0 self-start border-b border-gray-400 pb-1 font-body text-sm uppercase tracking-[0.12em] text-gray-600 transition-colors hover:border-[#0f1115] hover:text-[#0f1115] md:self-auto"
                    >
                        Rincian Layanan
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3">
                    {SERVICES.map((service, i) => (
                        <motion.article
                            key={service.title}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                            className={`border-b border-gray-300 py-10 lg:border-b-0 lg:py-12 ${
                                i > 0 ? "lg:border-l lg:border-gray-300 lg:pl-10" : "lg:pr-10"
                            } ${i === 1 ? "lg:px-10" : ""}`}
                        >
                            <span className="font-body text-[11px] tabular-nums tracking-[0.2em] text-gray-400">
                                {String(i + 1).padStart(2, "0")}
                            </span>

                            <h3 className="mt-4 font-display text-xl font-semibold leading-snug">{service.title}</h3>

                            <p className="mt-4 font-body text-sm leading-relaxed text-gray-600">{service.summary}</p>

                            <p className="mt-7 font-body text-[10px] uppercase tracking-[0.24em] text-gray-400">
                                Keluaran Pekerjaan
                            </p>
                            <ul className="mt-3 divide-y divide-gray-200 border-t border-gray-200">
                                {service.deliverables.map((item) => (
                                    <li key={item} className="py-2.5 font-body text-sm text-gray-700">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}

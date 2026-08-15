import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PRINCIPLES = [
    {
        title: "Lingkup tertulis sebelum pengerjaan",
        body: "Setiap proyek dimulai dari dokumen kebutuhan yang disepakati kedua pihak — apa yang dikerjakan, apa yang tidak, dan bagaimana perubahan lingkup ditangani.",
    },
    {
        title: "Serah terima disertai dokumentasi",
        body: "Kode sumber, basis data, dan petunjuk operasional diserahkan lengkap. Klien tidak terkunci pada satu vendor untuk melanjutkan sistemnya.",
    },
    {
        title: "Pendampingan setelah peluncuran",
        body: "Masa pendampingan disepakati di muka, mencakup perbaikan kesalahan dan pendampingan pengguna pada periode awal pemakaian.",
    },
];

type Company = {
    legal_name?: string | null;
    address?: string | null;
};

/**
 * Profil perusahaan.
 *
 * Versi sebelumnya menampilkan tiga foto stok Unsplash dengan keterangan
 * "Kolaborasi tim CTECH" dan "Ruang kerja studio" — foto pihak lain yang
 * disajikan seolah milik perusahaan. Bagian itu diganti keterangan tertulis
 * yang memang bisa dipertanggungjawabkan.
 */
export function About({ company, capabilities = [] }: { company?: Company; capabilities?: string[] }) {
    const legalName = company?.legal_name ?? "PT Kreatif Teknologi Maju Bersama";

    return (
        <section id="about" className="border-t border-gray-200 bg-white py-24 text-[#0f1115] md:py-32">
            <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
                    <div className="lg:col-span-5">
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.6, ease: EASE }}
                            className="font-body text-[11px] uppercase tracking-[0.28em] text-gray-400"
                        >
                            Profil Perusahaan
                        </motion.p>

                        <motion.h2
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.7, delay: 0.06, ease: EASE }}
                            className="mt-6 font-display text-3xl font-semibold leading-[1.15] tracking-tight md:text-[2.75rem]"
                        >
                            Badan usaha berbadan hukum, dengan cara kerja yang bisa diaudit.
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
                            className="mt-8 space-y-5 font-body text-base leading-relaxed text-gray-600"
                        >
                            <p>
                                {legalName} menangani pembangunan perangkat lunak untuk kebutuhan
                                operasional perusahaan dan instansi. Pekerjaan dijalankan berbasis kontrak
                                dengan lingkup, tenggat, dan mekanisme serah terima yang tertulis.
                            </p>
                            <p>
                                Kami bekerja pada skala yang bisa kami pertanggungjawabkan. Bila suatu
                                kebutuhan berada di luar kompetensi kami, hal itu kami sampaikan sejak
                                awal ketimbang dipaksakan.
                            </p>
                        </motion.div>
                    </div>

                    {/* Prinsip kerja — daftar bernomor bergaya dokumen */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, delay: 0.16, ease: EASE }}
                        className="lg:col-span-7"
                    >
                        <dl className="divide-y divide-gray-200 border-y border-gray-200">
                            {PRINCIPLES.map((item, i) => (
                                <div key={item.title} className="grid grid-cols-12 gap-6 py-7">
                                    <dt className="col-span-12 sm:col-span-5">
                                        <span className="font-body text-[11px] tabular-nums tracking-[0.2em] text-gray-400">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span className="mt-2 block font-display text-lg font-semibold leading-snug">
                                            {item.title}
                                        </span>
                                    </dt>
                                    <dd className="col-span-12 font-body text-sm leading-relaxed text-gray-600 sm:col-span-7">
                                        {item.body}
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        {capabilities.length > 0 && (
                            <div className="mt-10">
                                <p className="font-body text-[11px] uppercase tracking-[0.24em] text-gray-400">
                                    Bidang Pekerjaan Terdokumentasi
                                </p>
                                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                                    {capabilities.map((item) => (
                                        <li key={item} className="font-body text-sm text-gray-700">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

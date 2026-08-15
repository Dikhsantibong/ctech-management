import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
};

type Company = {
    legal_name?: string | null;
    address?: string | null;
};

/**
 * Hero korporat.
 *
 * Disederhanakan secara sengaja: tanpa gradient, tanpa lencana berputar, dan
 * tanpa ikon dekoratif. Ruang yang tadinya dipakai ornamen kini diisi keterangan
 * yang bisa diverifikasi — badan hukum, domisili, dan bidang penanganan.
 */
export function Hero({ company, metrics = [] }: { company?: Company; metrics?: { value: number; label: string }[] }) {
    const legalName = company?.legal_name ?? "PT Kreatif Teknologi Maju Bersama";
    const headline = metrics.slice(0, 3);

    return (
        <section className="relative w-full bg-[#0f1115] text-white">
            <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 px-6 pb-16 pt-36 md:px-12 md:pb-20 md:pt-44 lg:grid-cols-12 lg:gap-20">
                {/* Kolom utama */}
                <div className="lg:col-span-8">
                    <motion.p
                        {...fadeUp}
                        transition={{ duration: 0.6, ease: EASE }}
                        className="font-body text-[11px] uppercase tracking-[0.28em] text-white/45"
                    >
                        {legalName}
                    </motion.p>

                    <motion.h1
                        {...fadeUp}
                        transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
                        className="mt-8 max-w-4xl font-display text-[2.6rem] font-semibold leading-[1.12] tracking-tight md:text-[4.2rem]"
                    >
                        Perangkat lunak korporat yang dirancang untuk dipakai bertahun-tahun.
                    </motion.h1>

                    <motion.p
                        {...fadeUp}
                        transition={{ duration: 0.7, delay: 0.16, ease: EASE }}
                        className="mt-8 max-w-2xl font-body text-base leading-relaxed text-white/60 md:text-lg"
                    >
                        Kami membangun sistem informasi, aplikasi web, dan perangkat operasional untuk
                        instansi dan perusahaan — dari perumusan kebutuhan, pengembangan, hingga
                        pendampingan setelah serah terima.
                    </motion.p>

                    <motion.div
                        {...fadeUp}
                        transition={{ duration: 0.7, delay: 0.24, ease: EASE }}
                        className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4"
                    >
                        <Link
                            href="/kontak"
                            className="inline-flex items-center bg-white px-8 py-4 font-body text-sm font-semibold uppercase tracking-[0.12em] text-[#0f1115] transition-colors duration-300 hover:bg-white/85"
                        >
                            Ajukan Kebutuhan
                        </Link>
                        <Link
                            href="/portfolio"
                            className="border-b border-white/25 pb-1 font-body text-sm uppercase tracking-[0.12em] text-white/70 transition-colors hover:border-white hover:text-white"
                        >
                            Rekam Jejak Pekerjaan
                        </Link>
                    </motion.div>
                </div>

                {/* Kolom keterangan — mengganti ornamen dengan data */}
                <motion.aside
                    {...fadeUp}
                    transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
                    className="lg:col-span-4 lg:border-l lg:border-white/10 lg:pl-12"
                >
                    <dl className="divide-y divide-white/10 border-y border-white/10">
                        {company?.address && (
                            <div className="py-5">
                                <dt className="font-body text-[10px] uppercase tracking-[0.24em] text-white/40">Domisili</dt>
                                <dd className="mt-2 font-body text-sm leading-relaxed text-white/75">{company.address}</dd>
                            </div>
                        )}
                        <div className="py-5">
                            <dt className="font-body text-[10px] uppercase tracking-[0.24em] text-white/40">Bidang Penanganan</dt>
                            <dd className="mt-2 font-body text-sm leading-relaxed text-white/75">
                                Sistem informasi manajemen · Aplikasi web · Integrasi data · Antarmuka &amp; pengalaman pengguna
                            </dd>
                        </div>
                        <div className="py-5">
                            <dt className="font-body text-[10px] uppercase tracking-[0.24em] text-white/40">Model Kerja</dt>
                            <dd className="mt-2 font-body text-sm leading-relaxed text-white/75">
                                Kontrak proyek dengan lingkup, jadwal, dan serah terima yang tertulis.
                            </dd>
                        </div>
                    </dl>
                </motion.aside>
            </div>

            {/* Baris angka — hanya tampil bila datanya benar-benar ada */}
            {headline.length > 0 && (
                <div className="border-t border-white/10">
                    <div className="mx-auto grid max-w-[1400px] grid-cols-1 divide-y divide-white/10 px-6 md:grid-cols-3 md:divide-x md:divide-y-0 md:px-12">
                        {headline.map((metric, i) => (
                            <motion.div
                                key={metric.label}
                                {...fadeUp}
                                whileInView="animate"
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.05 * i, ease: EASE }}
                                className={`py-8 ${i > 0 ? "md:pl-10" : ""} ${i < headline.length - 1 ? "md:pr-10" : ""}`}
                            >
                                <span className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
                                    {metric.value}
                                </span>
                                <span className="mt-2 block font-body text-[11px] uppercase tracking-[0.22em] text-white/45">
                                    {metric.label}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

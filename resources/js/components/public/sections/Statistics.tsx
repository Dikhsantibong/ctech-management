import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Metric = { value: number; label: string };

/**
 * Angka perusahaan.
 *
 * Nilainya berasal dari database (proyek, klien, portofolio) dan dihitung ulang
 * setiap halaman dimuat. Versi sebelumnya memakai nilai statis 250+, 98%, 10+,
 * dan 50+ yang tidak dapat diverifikasi dan terbaca sebagai isian contoh.
 *
 * Bila tidak ada data, bagian ini tidak dirender sama sekali — lebih baik kosong
 * daripada menampilkan angka yang tidak benar.
 */
export function Statistics({ metrics = [] }: { metrics?: Metric[] }) {
    if (metrics.length === 0) return null;

    return (
        <section className="border-t border-gray-200 bg-white py-16 text-[#0f1115] md:py-20">
            <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                <p className="font-body text-[11px] uppercase tracking-[0.28em] text-gray-400">
                    Rekapitulasi Per {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </p>

                <dl className="mt-8 grid grid-cols-2 border-t border-gray-300 lg:grid-cols-4">
                    {metrics.map((metric, i) => (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                            className={`border-b border-gray-200 py-8 ${i % 2 === 1 ? "border-l border-gray-200 pl-6" : "pr-6"} lg:border-l lg:border-b-0 lg:px-8 ${
                                i === 0 ? "lg:border-l-0 lg:pl-0" : ""
                            }`}
                        >
                            <dd className="font-display text-4xl font-semibold tabular-nums tracking-tight md:text-5xl">
                                {new Intl.NumberFormat("id-ID").format(metric.value)}
                            </dd>
                            <dt className="mt-3 font-body text-[11px] uppercase tracking-[0.22em] text-gray-500">
                                {metric.label}
                            </dt>
                        </motion.div>
                    ))}
                </dl>

                <p className="mt-6 font-body text-xs leading-relaxed text-gray-400">
                    Angka dihitung langsung dari basis data operasional perusahaan.
                </p>
            </div>
        </section>
    );
}

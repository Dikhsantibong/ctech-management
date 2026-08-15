import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Tahapan kerja disajikan sebagai tabel: setiap fase disertai keluaran dan
 * pihak yang terlibat, sehingga klien tahu persis apa yang mereka terima dan
 * kapan keputusan mereka dibutuhkan.
 */
const PHASES = [
    {
        phase: "Perumusan Kebutuhan",
        output: "Dokumen lingkup pekerjaan, estimasi jadwal, dan estimasi biaya",
        involvement: "Wawancara pengguna dan pemilik proses",
    },
    {
        phase: "Perancangan",
        output: "Rancangan basis data, alur proses, dan purwarupa antarmuka",
        involvement: "Persetujuan tertulis sebelum pengembangan dimulai",
    },
    {
        phase: "Pengembangan",
        output: "Modul berjalan yang ditinjau berkala pada lingkungan uji",
        involvement: "Peninjauan berkala bersama penanggung jawab klien",
    },
    {
        phase: "Uji Terima",
        output: "Catatan pengujian, perbaikan temuan, dan berita acara",
        involvement: "Pengujian dilakukan oleh calon pengguna sistem",
    },
    {
        phase: "Serah Terima & Pendampingan",
        output: "Kode sumber, dokumentasi, pelatihan, dan masa pendampingan",
        involvement: "Penandatanganan berita acara serah terima",
    },
];

export function Process() {
    return (
        <section id="process" className="bg-[#0f1115] py-24 text-white md:py-32">
            <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="max-w-3xl"
                >
                    <p className="font-body text-[11px] uppercase tracking-[0.28em] text-white/40">Tahapan Pekerjaan</p>
                    <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.15] tracking-tight md:text-[2.75rem]">
                        Lima tahap, masing-masing dengan keluaran yang disepakati.
                    </h2>
                    <p className="mt-6 font-body text-base leading-relaxed text-white/55">
                        Pembayaran dikaitkan dengan penyelesaian tahap, bukan waktu berjalan. Klien
                        mengetahui apa yang diterima pada setiap termin.
                    </p>
                </motion.div>

                {/* Tabel tahapan */}
                <div className="mt-14 border-t border-white/15">
                    {/* Kepala tabel hanya di layar lebar */}
                    <div className="hidden grid-cols-12 gap-6 border-b border-white/15 py-4 md:grid">
                        <span className="col-span-1 font-body text-[10px] uppercase tracking-[0.24em] text-white/35">Tahap</span>
                        <span className="col-span-3 font-body text-[10px] uppercase tracking-[0.24em] text-white/35">Fase</span>
                        <span className="col-span-5 font-body text-[10px] uppercase tracking-[0.24em] text-white/35">Keluaran</span>
                        <span className="col-span-3 font-body text-[10px] uppercase tracking-[0.24em] text-white/35">Keterlibatan Klien</span>
                    </div>

                    {PHASES.map((item, i) => (
                        <motion.div
                            key={item.phase}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                            className="grid grid-cols-12 gap-x-6 gap-y-2 border-b border-white/10 py-6 transition-colors hover:bg-white/[0.03]"
                        >
                            <span className="col-span-12 font-body text-[11px] tabular-nums tracking-[0.2em] text-white/35 md:col-span-1">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <h3 className="col-span-12 font-display text-lg font-semibold leading-snug md:col-span-3 md:text-base">
                                {item.phase}
                            </h3>
                            <p className="col-span-12 font-body text-sm leading-relaxed text-white/65 md:col-span-5">
                                {item.output}
                            </p>
                            <p className="col-span-12 font-body text-sm leading-relaxed text-white/45 md:col-span-3">
                                {item.involvement}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

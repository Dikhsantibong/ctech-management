import { motion } from 'framer-motion';
import { PremiumNavbar } from '@/components/ui/PremiumNavbar';
import { Footer } from '@/components/public/sections/Footer';
import { PageHeader } from '@/components/public/PageHeader';
import { Statistics } from '@/components/public/sections/Statistics';
import { useLenis } from '@/hooks/use-lenis';
import { SEO } from '@/components/SEO';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Company = {
    legal_name?: string | null;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
};

/** Cara kerja yang bisa dinilai klien, bukan kata sifat tentang diri sendiri. */
const COMMITMENTS = [
    {
        title: 'Lingkup disepakati tertulis',
        body: 'Sebelum pengerjaan dimulai, disusun dokumen kebutuhan yang memuat batas pekerjaan, keluaran, dan mekanisme bila terjadi perubahan lingkup di tengah jalan.',
    },
    {
        title: 'Pembayaran mengikuti tahapan',
        body: 'Termin dikaitkan dengan penyelesaian tahap yang dapat diperiksa, bukan lama waktu pengerjaan. Setiap termin disertai keluaran yang disepakati.',
    },
    {
        title: 'Tanpa penguncian vendor',
        body: 'Kode sumber, struktur basis data, dan dokumentasi teknis diserahkan pada akhir pekerjaan. Klien bebas melanjutkan pengembangan dengan pihak lain.',
    },
    {
        title: 'Penolakan bila di luar kompetensi',
        body: 'Bila kebutuhan berada di luar kemampuan atau kapasitas kami, hal tersebut disampaikan sejak awal beserta saran alternatif, bukan diterima lalu dikerjakan setengah jalan.',
    },
];

export default function AboutIndex({
    company,
    metrics = [],
    capabilities = [],
}: {
    company?: Company;
    metrics?: { value: number; label: string }[];
    capabilities?: string[];
}) {
    useLenis();

    const legalName = company?.legal_name ?? 'PT Kreatif Teknologi Maju Bersama';

    const meta = [
        { label: 'Badan Usaha', value: legalName },
        ...(company?.address ? [{ label: 'Domisili', value: company.address }] : []),
        { label: 'Bidang Usaha', value: 'Pengembangan perangkat lunak dan layanan teknologi informasi' },
    ];

    return (
        <div className="bg-white font-body text-[#0f1115]">
            <SEO
                title={`Tentang Kami | ${legalName}`}
                description="Profil perusahaan, dasar hukum, cara kerja, dan komitmen kami dalam menangani pekerjaan pengembangan perangkat lunak untuk instansi dan korporasi."
                url="/tentang"
            />

            <PremiumNavbar />

            <main className="w-full">
                <PageHeader
                    eyebrow="Profil Perusahaan"
                    title="Perusahaan pengembang perangkat lunak untuk kebutuhan operasional."
                    description="Kami menangani pembangunan sistem yang dipakai setiap hari oleh staf dan pengguna — bukan proyek sekali jadi yang ditinggalkan setelah peluncuran."
                    meta={meta}
                />

                {/* Ringkasan perusahaan */}
                <section className="border-b border-gray-200 py-20 md:py-28">
                    <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 md:px-12 lg:grid-cols-12 lg:gap-20">
                        <motion.h2
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.6, ease: EASE }}
                            className="font-display text-2xl font-semibold leading-[1.2] tracking-tight md:text-[2.25rem] lg:col-span-5"
                        >
                            Kami bekerja pada skala yang bisa kami pertanggungjawabkan.
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
                            className="space-y-5 font-body text-base leading-relaxed text-gray-600 lg:col-span-7"
                        >
                            <p>
                                {legalName} berdiri sebagai badan usaha berbadan hukum yang menangani
                                perancangan dan pembangunan perangkat lunak untuk kebutuhan operasional
                                perusahaan maupun instansi pemerintah.
                            </p>
                            <p>
                                Fokus kami pada sistem yang berumur panjang: struktur data yang rapi,
                                dokumentasi yang lengkap, dan penyerahan yang utuh sehingga sistem tetap
                                dapat dikembangkan meski tim pengembangnya berganti.
                            </p>
                            <p>
                                Setiap pekerjaan dijalankan berbasis kontrak dengan lingkup, tenggat, dan
                                mekanisme serah terima yang tertulis — termasuk masa pendampingan setelah
                                sistem mulai dipakai.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Komitmen kerja */}
                <section className="border-b border-gray-200 bg-[#f7f8f9] py-20 md:py-28">
                    <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                        <p className="font-body text-[11px] uppercase tracking-[0.28em] text-gray-400">Komitmen Kerja</p>
                        <h2 className="mt-5 max-w-3xl font-display text-2xl font-semibold leading-[1.2] tracking-tight md:text-[2.25rem]">
                            Empat hal yang berlaku pada setiap kontrak, tanpa kecuali.
                        </h2>

                        <dl className="mt-12 grid grid-cols-1 border-t border-gray-300 md:grid-cols-2">
                            {COMMITMENTS.map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 14 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-60px' }}
                                    transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                                    className={`border-b border-gray-300 py-8 md:py-10 ${i % 2 === 1 ? 'md:border-l md:border-gray-300 md:pl-10' : 'md:pr-10'}`}
                                >
                                    <span className="font-body text-[11px] tabular-nums tracking-[0.2em] text-gray-400">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <dt className="mt-3 font-display text-lg font-semibold leading-snug">{item.title}</dt>
                                    <dd className="mt-3 max-w-xl font-body text-sm leading-relaxed text-gray-600">{item.body}</dd>
                                </motion.div>
                            ))}
                        </dl>

                        {capabilities.length > 0 && (
                            <div className="mt-12">
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
                    </div>
                </section>

                <Statistics metrics={metrics} />
            </main>

            <Footer company={company} />
        </div>
    );
}

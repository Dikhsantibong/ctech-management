import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { PremiumNavbar } from '@/components/ui/PremiumNavbar';
import { Footer } from '@/components/public/sections/Footer';
import { PageHeader } from '@/components/public/PageHeader';
import { Process } from '@/components/public/sections/Process';
import { useLenis } from '@/hooks/use-lenis';
import { SEO } from '@/components/SEO';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Company = { legal_name?: string | null };

/**
 * Rincian layanan.
 *
 * Tiap lini dijabarkan ke dalam cakupan pekerjaan, keluaran yang diserahkan,
 * dan batasan — sehingga calon klien bisa menilai kesesuaian sebelum menghubungi,
 * bukan sekadar membaca kata sifat.
 */
const SERVICES = [
    {
        title: 'Sistem Informasi Manajemen',
        summary:
            'Aplikasi internal untuk mengelola proyek, dokumen, keuangan, kepegawaian, dan pelaporan dalam satu basis data terpadu.',
        scope: [
            'Pemetaan proses kerja yang berjalan saat ini',
            'Perancangan basis data dan hak akses per jabatan',
            'Modul pencatatan, persetujuan, dan pelaporan',
            'Migrasi data dari berkas atau sistem lama',
        ],
        deliverables: ['Dokumen kebutuhan', 'Aplikasi terpasang di server klien', 'Panduan pengguna', 'Pelatihan staf'],
        note: 'Cocok bila pencatatan masih tersebar di banyak berkas terpisah dan sulit direkap.',
    },
    {
        title: 'Aplikasi Web & Portal Layanan',
        summary:
            'Situs korporat, portal layanan publik, dan aplikasi berbasis web yang berjalan di peramban tanpa pemasangan di perangkat pengguna.',
        scope: [
            'Perancangan struktur informasi dan alur pengguna',
            'Pengembangan antarmuka dan sisi server',
            'Penyesuaian tampilan untuk perangkat bergerak',
            'Pengaturan dasar optimasi mesin pencari',
        ],
        deliverables: ['Rancangan antarmuka', 'Kode sumber lengkap', 'Uji terima pengguna', 'Panduan operasional'],
        note: 'Termasuk pengelolaan konten mandiri agar tim klien dapat memperbarui isi tanpa bantuan pengembang.',
    },
    {
        title: 'Integrasi & Migrasi Data',
        summary:
            'Menyambungkan sistem yang sudah berjalan dan memindahkan data lama ke sistem baru tanpa menghentikan kegiatan operasional.',
        scope: [
            'Penelusuran dan pemetaan sumber data',
            'Penyusunan skrip migrasi yang dapat diulang',
            'Uji paralel antara sistem lama dan baru',
            'Penyusunan berita acara migrasi',
        ],
        deliverables: ['Peta data', 'Skrip migrasi terverifikasi', 'Laporan hasil uji', 'Berita acara'],
        note: 'Data asli tidak pernah diubah selama proses; migrasi dijalankan pada salinan hingga hasilnya disetujui.',
    },
];

export default function ServicesIndex({ company }: { company?: Company }) {
    useLenis();

    const legalName = company?.legal_name ?? 'PT Kreatif Teknologi Maju Bersama';

    return (
        <div className="bg-white font-body text-[#0f1115]">
            <SEO
                title={`Layanan | ${legalName}`}
                description="Lingkup layanan: sistem informasi manajemen, aplikasi web dan portal layanan, serta integrasi dan migrasi data — lengkap dengan keluaran pekerjaan pada setiap lini."
                url="/layanan"
            />

            <PremiumNavbar />

            <main className="w-full">
                <PageHeader
                    eyebrow="Lingkup Layanan"
                    title="Tiga lini pekerjaan yang kami tangani secara penuh."
                    description="Setiap lini disertai cakupan pekerjaan dan daftar keluaran yang diserahkan, agar lingkup dapat dinilai sebelum penawaran disusun."
                    meta={[
                        { label: 'Model Kerja', value: 'Kontrak proyek dengan lingkup dan tenggat tertulis' },
                        { label: 'Termin', value: 'Pembayaran mengikuti penyelesaian tahap' },
                        { label: 'Setelah Serah Terima', value: 'Masa pendampingan disepakati di muka' },
                    ]}
                />

                {/* Rincian tiap lini */}
                <section className="border-b border-gray-200">
                    {SERVICES.map((service, i) => (
                        <motion.article
                            key={service.title}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.6, ease: EASE }}
                            className="border-b border-gray-200 py-16 last:border-b-0 md:py-20"
                        >
                            <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 md:px-12 lg:grid-cols-12 lg:gap-16">
                                <div className="lg:col-span-5">
                                    <span className="font-body text-[11px] tabular-nums tracking-[0.2em] text-gray-400">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <h2 className="mt-4 font-display text-2xl font-semibold leading-snug tracking-tight md:text-3xl">
                                        {service.title}
                                    </h2>
                                    <p className="mt-5 max-w-md font-body text-base leading-relaxed text-gray-600">
                                        {service.summary}
                                    </p>
                                    <p className="mt-6 max-w-md border-l-2 border-gray-300 pl-4 font-body text-sm leading-relaxed text-gray-500">
                                        {service.note}
                                    </p>
                                </div>

                                <div className="lg:col-span-4">
                                    <p className="font-body text-[10px] uppercase tracking-[0.24em] text-gray-400">
                                        Cakupan Pekerjaan
                                    </p>
                                    <ul className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
                                        {service.scope.map((item) => (
                                            <li key={item} className="py-3 font-body text-sm leading-relaxed text-gray-700">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="lg:col-span-3">
                                    <p className="font-body text-[10px] uppercase tracking-[0.24em] text-gray-400">
                                        Yang Diserahkan
                                    </p>
                                    <ul className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
                                        {service.deliverables.map((item) => (
                                            <li key={item} className="py-3 font-body text-sm text-gray-700">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </section>

                <Process />

                {/* Penutup */}
                <section className="border-t border-gray-200 py-20 md:py-24">
                    <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-8 px-6 md:flex-row md:items-end md:px-12">
                        <div>
                            <h2 className="max-w-2xl font-display text-2xl font-semibold leading-[1.2] tracking-tight md:text-[2.25rem]">
                                Sampaikan kebutuhan Anda, kami balas dengan lingkup dan estimasi.
                            </h2>
                            <p className="mt-4 max-w-xl font-body text-base leading-relaxed text-gray-600">
                                Peninjauan dilakukan pada hari kerja. Bila diperlukan, kami jadwalkan
                                pertemuan untuk memperjelas lingkup sebelum penawaran disusun.
                            </p>
                        </div>
                        <Link
                            href="/kontak"
                            className="shrink-0 self-start bg-[#0f1115] px-8 py-4 font-body text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:bg-[#2c3140] md:self-auto"
                        >
                            Ajukan Kebutuhan
                        </Link>
                    </div>
                </section>
            </main>

            <Footer company={company} />
        </div>
    );
}

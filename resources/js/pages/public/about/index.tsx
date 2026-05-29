import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import PublicNavbar from '@/components/public-navbar';
import {
    ArrowRight, CheckCircle2, ChevronDown, ChevronUp,
    Lightbulb, Target, Rocket, Users, Award, Heart,
    Play, ExternalLink, MapPin, Phone, Mail,
    Facebook, Instagram, Linkedin, Star,
    Code2, Palette, TrendingUp, Zap
} from 'lucide-react';

/* ─────────── DATA ─────────── */

const timeline = [
    {
        year: '2023',
        title: 'Diskusi di Ruang Kelas Kampus',
        description: 'Semuanya bermula dari obrolan panjang di sudut kelas — sekelompok mahasiswa yang gerah melihat potensi teknologi yang belum tersentuh di Kendari. Dari sana, tim kecil kami terbentuk, modal utamanya: semangat dan laptop masing-masing.',
        image: '/images/about/timeline-2023-awal.jpg',
    },
    {
        year: '2023',
        title: 'Nama CTECH Mulai Beredar di Kampus',
        description: 'Karya-karya kecil kami mulai diperhatikan. Dosen dan mahasiswa mengenal CTECH sebagai tim yang serius soal teknologi. Tak lama, undangan datang — kami hadir sebagai pemateri di seminar, workshop kampus, dan beberapa event komunitas teknologi di Kendari.',
        image: '/images/about/timeline-2023-kampus.jpg',
    },
    {
        year: '2023',
        title: 'Project Perdana — Sistem Informasi PT PLN Nusantara Power UP Kendari',
        description: 'Kepercayaan besar datang di tahun pertama: kami dipercaya membangun sistem informasi untuk salah satu divisi di PT PLN Nusantara Power UP Kendari. Ini bukan sekadar project — ini pembuktian bahwa tim kami mampu bermain di level industri nyata.',
        image: '/images/about/timeline-2023-pln.jpg',
    },
    {
        year: '2024',
        title: 'Portofolio Meluas, Kepercayaan Bertumbuh',
        description: 'Pengalaman dari project PLN membuka pintu lebih lebar. Klien baru datang — dari instansi, bisnis lokal, hingga startup yang butuh tangan teknologi. Tim kami berkembang, kapasitas bertambah, dan nama CTECH mulai lekat di telinga pelaku usaha Sulawesi Tenggara.',
        image: '/images/about/timeline-2024-ekspansi.jpg',
    },
    {
        year: '2024',
        title: 'Lahirnya CTECH Paylo & CTECH Booth',
        description: 'Kami tak hanya mengerjakan pesanan — kami mulai membangun produk sendiri. CTECH Paylo hadir sebagai solusi bisnis all-in-one: kasir offline-first, inventory, absensi karyawan, hingga dashboard analisis bisnis dalam satu paket. Bersamaan, CTECH Booth lahir sebagai platform photobooth modern yang kini dipercaya oleh lebih dari 10 lokasi photobooth di Kendari.',
        image: '/images/about/timeline-2024-produk.jpg',
    },
    {
        year: '2025',
        title: 'CTECH Resmi — Studio Teknologi Profesional',
        description: 'Dari ruang kelas ke ruang kerja sesungguhnya. CTECH bertransformasi menjadi studio teknologi & kreatif profesional dengan tim lintas disiplin: developer, designer, dan creative strategist. Layanan mencakup pengembangan sistem enterprise, UI/UX, hingga produksi konten digital untuk branding.',
        image: '/images/about/timeline-2025.jpg',
    },
    {
        year: '2026',
        title: 'Terdepan di Sulawesi Tenggara',
        description: 'CTECH kini dikenal sebagai creative tech studio terdepan di kawasan Sulawesi Tenggara. Produk kami aktif digunakan, klien kami tersebar dari pemerintahan hingga UMKM berkembang — dan kami masih terus tumbuh, satu baris kode dalam satu waktu.',
        image: '/images/about/timeline-2026.jpg',
    },
];

const whyChooseUs = [
    { icon: <Lightbulb className="w-7 h-7" />, title: 'Inovasi Tanpa Batas', desc: 'Kami selalu mengadopsi teknologi terbaru dan pendekatan kreatif untuk setiap solusi yang kami bangun.' },
    { icon: <Target className="w-7 h-7" />, title: 'Fokus pada Hasil', desc: 'Bukan sekadar produk jadi — kami memastikan setiap solusi memberikan dampak nyata bagi bisnis Anda.' },
    { icon: <Rocket className="w-7 h-7" />, title: 'Eksekusi Cepat & Tepat', desc: 'Workflow agile memungkinkan kami mengirimkan hasil dengan cepat tanpa mengorbankan kualitas.' },
    { icon: <Users className="w-7 h-7" />, title: 'Tim Multidisiplin', desc: 'Developer, designer, videografer, dan strategist bekerja dalam satu atap untuk hasil yang komprehensif.' },
    { icon: <Award className="w-7 h-7" />, title: 'Track Record Terbukti', desc: 'Dipercaya oleh puluhan klien dari berbagai sektor industri di Sulawesi Tenggara dan sekitarnya.' },
    { icon: <Heart className="w-7 h-7" />, title: 'Passion for Kendari', desc: 'Kami bangga membangun ekosistem digital di Kendari dan berkontribusi untuk kemajuan daerah.' },
];

const faqs = [
    { q: 'Apa saja layanan yang ditawarkan CTECH?', a: 'CTECH menyediakan layanan lengkap mulai dari Web Development, Mobile App Development, UI/UX Design, Produksi Video & Animasi, Digital Marketing & Branding, hingga sistem internal seperti ERP dan CRM.' },
    { q: 'Berapa lama waktu pengerjaan project rata-rata?', a: 'Tergantung kompleksitas, website company profile bisa selesai dalam 2-4 minggu. Aplikasi mobile atau sistem internal biasanya membutuhkan 2-6 bulan. Kami selalu memberikan estimasi timeline yang transparan di awal.' },
    { q: 'Apakah CTECH melayani klien di luar Kendari?', a: 'Tentu! Meskipun berkantor pusat di Kendari, kami melayani klien dari seluruh Indonesia. Komunikasi bisa dilakukan secara remote melalui video call dan project management tools.' },
    { q: 'Bagaimana sistem pembayaran project?', a: 'Kami menerapkan sistem pembayaran bertahap: Down Payment (DP) di awal, lalu pembayaran sesuai milestone project. Ini memastikan transparansi dan kenyamanan kedua belah pihak.' },
    { q: 'Apakah ada garansi setelah project selesai?', a: 'Ya, setiap project mendapatkan masa garansi maintenance gratis selama 1-3 bulan (tergantung paket). Setelah itu, kami menawarkan paket maintenance bulanan dengan harga terjangkau.' },
    { q: 'Apa itu CTECH Paylo?', a: 'CTECH Paylo adalah produk unggulan kami — paket lengkap aplikasi bisnis all-in-one yang mencakup sistem absensi karyawan, kasir offline-first, inventory management, aplikasi akuntan, dan dashboard analisis bisnis untuk owner.' },
];

const socialMedia = [
    { name: 'Instagram', handle: '@ctech.agency', color: 'from-purple-500 to-pink-500', url: 'https://instagram.com/ctech.kendari', icon: <Instagram className="w-8 h-8" />, followers: '5.2K', desc: 'Behind the scene, tips digital, dan portofolio visual.' },
    { name: 'TikTok', handle: '@ctechagency', color: 'from-slate-800 to-slate-600', url: 'https://tiktok.com/@ctech.kendari', icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.8.1V9a6.33 6.33 0 0 0-.8-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.56a8.23 8.23 0 0 0 4.76 1.5V6.69h-1z"/></svg>, followers: '3.8K', desc: 'Konten edukasi singkat, fun tech, dan trending.' },
    { name: 'YouTube', handle: 'Creative Tech', color: 'from-red-600 to-red-500', url: 'https://youtube.com/@ctechkendari', icon: <Play className="w-8 h-8" />, followers: '1.2K', desc: 'Tutorial, showcase project, dan company vlog.' },
    { name: 'Facebook', handle: 'Ctechagency', color: 'from-blue-700 to-blue-500', url: 'https://facebook.com/ctechkendari', icon: <Facebook className="w-8 h-8" />, followers: '2.4K', desc: 'Update berita, event, dan promo terbaru.' },
];

/* ─────────── COMPONENTS ─────────── */

function FAQItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-blue-200 hover:shadow-sm">
            <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-6 text-left gap-4">
                <span className="font-semibold text-slate-900 text-lg">{q}</span>
                <span className="shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                    {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-6 text-slate-600 leading-relaxed">{a}</div>
            </div>
        </div>
    );
}

/* ─────────── PAGE ─────────── */

export default function AboutIndex() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
            <Head title="Tentang Kami — CTECH Creative Agency Kendari" />

            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
                .about-page * { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
                @keyframes fade-in-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
                .anim-delay-100 { animation-delay: 0.1s; }
                .anim-delay-200 { animation-delay: 0.2s; }
                .anim-delay-300 { animation-delay: 0.3s; }
                .anim-delay-400 { animation-delay: 0.4s; }
                .timeline-line { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, #e2e8f0, #3b82f6, #e2e8f0); transform: translateX(-50%); }
                @media (max-width: 768px) { .timeline-line { left: 24px; } }
            ` }} />

            <div className="about-page">
                <PublicNavbar isLandingPage={false} />

                {/* ═══════════ HERO ═══════════ */}
                <section className="relative min-h-[90vh] flex items-center overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 bg-slate-950">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-blue-600/10 blur-[120px] translate-x-1/3 -translate-y-1/3" />
                        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[100px] -translate-x-1/3 translate-y-1/3" />
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10 w-full pt-32 pb-20">
                        <div className="max-w-4xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/10 text-blue-300 text-sm font-semibold mb-8 animate-fade-in-up">
                                <MapPin className="w-4 h-4" /> Creative Agency & Tech Branding — Kendari, Sulawesi Tenggara
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-8 animate-fade-in-up anim-delay-100">
                                Kami Membangun
                                <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                                    Masa Depan Digital
                                </span>
                                Kendari
                            </h1>

                            <p className="text-xl text-slate-400 max-w-2xl leading-relaxed mb-10 animate-fade-in-up anim-delay-200">
                                PT Kreatif Teknologi Maju Bersama — Creative agency & software house yang menghadirkan solusi teknologi inovatif, desain premium, dan strategi branding yang mengubah cara bisnis Anda beroperasi.
                            </p>

                            <div className="flex flex-wrap gap-4 animate-fade-in-up anim-delay-300">
                                <a href="#our-story" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold transition-all shadow-xl shadow-blue-600/20 hover:-translate-y-0.5 flex items-center gap-2">
                                    Kenali Kami <ArrowRight className="w-5 h-5" />
                                </a>
                                <a href="#video" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-bold transition-all backdrop-blur flex items-center gap-2">
                                    <Play className="w-5 h-5" /> Tonton Video
                                </a>
                            </div>
                        </div>

                        {/* Stats bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 animate-fade-in-up anim-delay-400">
                            {[
                                { num: '50+', label: 'Project Selesai' },
                                { num: '30+', label: 'Klien Puas' },
                                { num: '15+', label: 'Tim Profesional' },
                                { num: '5+', label: 'Tahun Pengalaman' },
                            ].map((s, i) => (
                                <div key={i} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 text-center">
                                    <div className="text-3xl md:text-4xl font-black text-white mb-1">{s.num}</div>
                                    <div className="text-slate-400 text-sm font-medium">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════════ OVERVIEW & OUR STORY ═══════════ */}
                <section id="our-story" className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-4 block">Cerita Kami</span>
                                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                                    Dari Kendari,<br />Untuk Indonesia
                                </h2>
                                <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
                                    <p>
                                        CTECH lahir dari keyakinan sederhana: bahwa <strong className="text-slate-900">Kendari layak memiliki agency teknologi berkualitas global.</strong> Kami melihat potensi besar UMKM dan perusahaan lokal yang belum tersentuh digitalisasi, dan memutuskan untuk menjadi jembatannya.
                                    </p>
                                    <p>
                                        Bermula dari sebuah ruang kerja kecil di tahun 2019, kini CTECH telah berkembang menjadi creative agency & software house terdepan di Sulawesi Tenggara. Kami menggabungkan <strong className="text-slate-900">kekuatan teknologi</strong>, <strong className="text-slate-900">kreativitas visual</strong>, dan <strong className="text-slate-900">strategi bisnis</strong> untuk membantu klien kami bertransformasi secara digital.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3 mt-8">
                                    {['Software House', 'Creative Agency', 'Digital Branding', 'Tech Consulting'].map(tag => (
                                        <span key={tag} className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100">{tag}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div className="rounded-2xl overflow-hidden aspect-[3/4] bg-slate-100 shadow-2xl">
                                            <img src="/our-story/photo1.jpeg" alt="Tim CTECH" className="w-full h-full object-cover grayscale" onError={(e: any) => { e.target.style.display='none'; e.target.parentElement.innerHTML='<div class=&quot;w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center&quot;><span class=&quot;text-white/80 text-5xl font-black&quot;>C</span></div>'; }} />
                                        </div>
                                        <div className="rounded-2xl overflow-hidden aspect-square bg-slate-100 shadow-lg">
                                            <img src="/our-story/photo2.jpeg" alt="Workshop CTECH" className="w-full h-full object-cover grayscale" onError={(e: any) => { e.target.style.display='none'; e.target.parentElement.innerHTML='<div class=&quot;w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center&quot;><span class=&quot;text-white/80 text-4xl font-black&quot;>T</span></div>'; }} />
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-8">
                                        <div className="rounded-2xl overflow-hidden aspect-square bg-slate-100 shadow-lg">
                                            <img src="/our-story/photo3.jpeg" alt="Kantor CTECH" className="w-full h-full object-cover grayscale" onError={(e: any) => { e.target.style.display='none'; e.target.parentElement.innerHTML='<div class=&quot;w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center&quot;><span class=&quot;text-white/80 text-4xl font-black&quot;>E</span></div>'; }} />
                                        </div>
                                        <div className="rounded-2xl overflow-hidden aspect-[3/4] bg-slate-100 shadow-2xl">
                                            <img src="/our-story/photo4.jpeg" alt="Project CTECH" className="w-full h-full object-cover grayscale" onError={(e: any) => { e.target.style.display='none'; e.target.parentElement.innerHTML='<div class=&quot;w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center&quot;><span class=&quot;text-white/80 text-5xl font-black&quot;>H</span></div>'; }} />
                                        </div>
                                    </div>
                                </div>
                                {/* Floating badge */}
                                <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-5 rounded-2xl shadow-xl shadow-blue-600/30">
                                    <div className="text-3xl font-black">5+</div>
                                    <div className="text-blue-100 text-sm font-semibold">Tahun<br/>Berpengalaman</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════ WHY CHOOSE US ═══════════ */}
                <section className="py-24 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-4 block">Keunggulan Kami</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Mengapa Memilih CTECH?</h2>
                            <p className="text-slate-600 text-lg">Kami bukan hanya vendor teknologi — kami adalah partner strategis yang memahami bisnis Anda.</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {whyChooseUs.map((item, idx) => (
                                <div key={idx} className="group bg-white rounded-2xl p-8 border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 hover:-translate-y-1">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════════ VIDEO SHOWCASE ═══════════ */}
                <section id="video" className="py-24 bg-slate-900 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                    <div className="absolute top-0 left-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[100px] -translate-x-1/2 -translate-y-1/2" />

                    <div className="max-w-5xl mx-auto px-6 relative z-10">
                        <div className="text-center mb-16">
                            <span className="text-blue-400 font-bold tracking-wider uppercase text-sm mb-4 block">Lihat Aksi Kami</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Cerita di Balik Layar</h2>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Saksikan bagaimana tim CTECH bekerja, berinovasi, dan membangun solusi digital untuk klien-klien kami.</p>
                        </div>

                        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-600/20 border border-white/10">
                            <div className="aspect-video">
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/HPmPDnmNnf0"
                                    title="CTECH Company Profile"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>

                        <p className="text-center text-slate-500 text-sm mt-6">
                            * Ganti URL embed di atas dengan video company profile resmi CTECH Anda.
                        </p>
                    </div>
                </section>

                {/* ═══════════ TIMELINE ═══════════ */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-20">
                            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-4 block">
                                Perjalanan Kami
                            </span>

                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                                Alur Terbentuknya CTECH
                            </h2>

                            <p className="text-slate-600 text-lg">
                                Setiap milestone yang membentuk CTECH menjadi seperti sekarang —
                                creative agency & tech branding terdepan di Kendari.
                            </p>
                        </div>

                        <div className="relative">

                            {/* Vertical Line */}
                            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-200 via-blue-400 to-blue-200 -translate-x-1/2" />

                            <div className="space-y-20 md:space-y-28">
                                {timeline.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`relative flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-24 ${
                                            idx % 2 === 1 ? 'md:flex-row-reverse' : ''
                                        }`}
                                    >
                                        {/* Desktop Timeline Dot */}
                                        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-blue-600 text-white items-center justify-center font-black text-sm z-20 shadow-xl shadow-blue-600/30 border-4 border-white">
                                            {item.year.slice(-2)}
                                        </div>

                                        {/* Mobile Timeline Dot */}
                                        <div className="md:hidden absolute left-0 top-6 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs z-10 shadow-lg border-4 border-white">
                                            {item.year.slice(-2)}
                                        </div>

                                        {/* Image */}
                                        <div className="w-full md:w-[42%] pl-16 md:pl-0">
                                            <div className="rounded-3xl overflow-hidden aspect-[16/10] bg-slate-100 shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-500 group">

                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover grayscale hover:grayscale-0 hover:scale-105 transition-all duration-700"
                                                    onError={(e: any) => {
                                                        e.target.style.display = 'none';
                                                        e.target.parentElement.innerHTML = `
                                                            <div class="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                                                <span class="text-white/50 text-7xl font-black">
                                                                    ${item.year}
                                                                </span>
                                                            </div>
                                                        `;
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="w-full md:w-[42%] pl-16 md:pl-0">
                                            <div className="bg-slate-50 rounded-3xl p-8 md:p-10 border border-slate-100 hover:shadow-xl transition-all duration-300">

                                                <span className="text-blue-600 font-black text-2xl block mb-3">
                                                    {item.year}
                                                </span>

                                                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                                                    {item.title}
                                                </h3>

                                                <p className="text-slate-600 leading-relaxed text-lg">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════ PROFESSIONAL MEDIA ═══════════ */}
                <section className="py-24 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-4 block">Media Profesional</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Terhubung dengan Kami</h2>
                            <p className="text-slate-600 text-lg">Ikuti media sosial kami untuk update terbaru, tips digital, dan di balik layar karya kreatif tim CTECH.</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {socialMedia.map((social, idx) => (
                                <a key={idx} href={social.url} target="_blank" rel="noreferrer" className="group block bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-300 hover:-translate-y-2">
                                    {/* Header gradient */}
                                    <div className={`bg-gradient-to-r ${social.color} p-6 text-white`}>
                                        <div className="flex items-center justify-between mb-4">
                                            {social.icon}
                                            <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="text-2xl font-black">{social.followers}</div>
                                        <div className="text-white/80 text-sm">Followers</div>
                                    </div>
                                    {/* Body */}
                                    <div className="p-6">
                                        <h3 className="font-bold text-slate-900 text-lg mb-1">{social.name}</h3>
                                        <p className="text-blue-600 text-sm font-semibold mb-3">{social.handle}</p>
                                        <p className="text-slate-600 text-sm leading-relaxed">{social.desc}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════════ FAQ ═══════════ */}
                <section className="py-24 bg-white">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-4 block">FAQ</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Pertanyaan yang Sering Ditanyakan</h2>
                            <p className="text-slate-600 text-lg">Beberapa pertanyaan umum seputar layanan dan proses kerja kami.</p>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <FAQItem key={idx} q={faq.q} a={faq.a} />
                            ))}
                        </div>

                        <div className="text-center mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-8">
                            <h4 className="font-bold text-slate-900 text-lg mb-2">Masih punya pertanyaan?</h4>
                            <p className="text-slate-600 mb-6">Jangan ragu untuk menghubungi tim kami. Kami siap membantu Anda.</p>
                            <a href="mailto:ptkreatifteknologimajubersama@gmail.com" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold transition-colors shadow-lg shadow-blue-600/20">
                                <Mail className="w-4 h-4" /> Hubungi Kami
                            </a>
                        </div>
                    </div>
                </section>

                {/* ═══════════ FOOTER ═══════════ */}
                <footer className="bg-slate-950 text-slate-400 py-20 border-t border-slate-900">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        <div className="space-y-6">
                            <Link href="/" className="flex items-center gap-2">
                                <img src="/logo/logo-web.png" alt="CTECH Logo" className="h-8 grayscale brightness-0 invert" />
                                <span className="font-bold text-2xl tracking-tight text-white">CTECH</span>
                            </Link>
                            <p className="text-sm leading-relaxed pr-4">
                                PT KREATIF TEKNOLOGI MAJU BERSAMA. Creative Agency & Tech Branding terdepan di Kendari, Sulawesi Tenggara.
                            </p>
                            <div className="flex gap-4">
                                <a href="https://facebook.com/ctechkendari" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"><Facebook className="w-4 h-4" /></a>
                                <a href="https://instagram.com/ctech.kendari" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"><Instagram className="w-4 h-4" /></a>
                                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Layanan</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Web Development</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Mobile App</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">UI/UX Design</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Digital Branding</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Video Production</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Perusahaan</h4>
                            <ul className="space-y-3">
                                <li><Link href="/tentang" className="hover:text-blue-400 transition-colors">Tentang Kami</Link></li>
                                <li><Link href="/portfolio" className="hover:text-blue-400 transition-colors">Portfolio</Link></li>
                                <li><Link href="/berita" className="hover:text-blue-400 transition-colors">Berita & Insight</Link></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Karir</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Kontak</h4>
                            <ul className="space-y-4">
                                <li className="flex gap-3"><MapPin className="w-5 h-5 text-blue-500 shrink-0" /><span className="text-sm">BTN UNHALU BLOK L NO 10, Kendari</span></li>
                                <li className="flex gap-3"><Phone className="w-5 h-5 text-blue-500 shrink-0" /><span className="text-sm">+62 22 9311 8410</span></li>
                                <li className="flex gap-3"><Mail className="w-5 h-5 text-blue-500 shrink-0" /><span className="text-sm">ptkreatifteknologimajubersama@gmail.com</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm">
                            &copy; {new Date().getFullYear()} PT Kreatif Teknologi Maju Bersama (CTECH). All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

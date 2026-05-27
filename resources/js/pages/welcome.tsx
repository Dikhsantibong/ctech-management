import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { dashboard } from '@/routes';

const ctechStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    .ctech-landing * {
        font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
    }
    .ctech-landing {
        --ct-bg: #f7f9fb;
        --ct-surface: #f7f9fb;
        --ct-surface-low: #f2f4f6;
        --ct-surface-high: #e6e8ea;
        --ct-surface-highest: #e0e3e5;
        --ct-surface-container: #eceef0;
        --ct-surface-lowest: #ffffff;
        --ct-primary: #000000;
        --ct-secondary: #0058be;
        --ct-secondary-container: #2170e4;
        --ct-on-surface: #191c1e;
        --ct-on-surface-variant: #45464d;
        --ct-on-secondary: #ffffff;
        --ct-outline: #76777d;
        --ct-outline-variant: #c6c6cd;
        --ct-error: #ba1a1a;
        background: var(--ct-bg);
        color: var(--ct-on-surface);
    }
    .hero-gradient {
        background: radial-gradient(circle at 70% 30%, rgba(0, 88, 190, 0.08) 0%, transparent 70%);
    }
    .glass-card {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(226, 232, 240, 0.5);
    }
    .ctech-landing .animate-fade-in {
        animation: ctechFadeIn 0.7s ease-out forwards;
    }
    @keyframes ctechFadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .ctech-landing .section-anim {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.7s ease-out;
    }
    .ctech-landing .section-anim.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;

const beritaData = [
    {
        tanggal: '20 Mei 2025',
        kategori: 'Animasi',
        judul: 'CTECH Luncurkan Layanan Animasi 3D Generasi Berikutnya',
        ringkasan: 'Teknologi rendering terbaru kami menghadirkan animasi 3D berkualitas sinema dengan waktu produksi lebih cepat untuk klien di seluruh Asia Tenggara.',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7C-S0irTnfLdQws0EHEvb97oNBeZS_QjODr3EuHMDS_b1Zfr9kclpuEkxbIVN8Z7arxmPcmqBFw9cLPIkxLkv4jDN8HckjBdz-Dqu55TW2Pr8Oqxdfrwg51nvwSHa8STMmQxi1RFbzIIiooim8QsRZU_oAde0GpJEsSJwsaIEcFUAZKVB_E9RZCryW7PnrwZZROhwgzJ1zDn7Vpb6COImgpnRRoREuyOuKeEv97804fJBP7Dop_UViajtegnb8G1VqGZyoJ_Mef2J',
    },
    {
        tanggal: '10 Mei 2025',
        kategori: 'Desain',
        judul: 'Tren Desain UI/UX 2025 dan Pendekatan CTECH',
        ringkasan: 'Tim desain kami merilis panduan tahunan tentang tren desain terkini dan strategi menciptakan pengalaman pengguna yang memorable.',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBerCNQB8NpwY8voRZz6_NuHTr26Lqy3inhQc54jg05rAr_pcaewUPjczFoXQjo9tvtvuzse5WD2sFvA1MQy6Ue5e7b1KDzZ3cl4en0aPXIOSb_4XUO9hWANKwP5U-7unk76-AQBhk1qPGIb6tV06kk4Ks34guL39Oo-a-a4n4AfM4F15WtMQCCXpoRAK0tZL9EhBtt1fDVuKeIulRG7roGyYZsvjI2ueUtmzb1c4U5Ka02sANR6XmeFeu03yRezJv65gSCI1MKelXB',
    },
    {
        tanggal: '1 Mei 2025',
        kategori: 'Inovasi',
        judul: 'Kemitraan Strategis CTECH dengan Platform Streaming Global',
        ringkasan: 'Kolaborasi baru dengan platform streaming internasional untuk memproduksi konten video original berkualitas tinggi.',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaqlMlprDte5js9l_m35ThCbfxo4tCIa0plSAf6Sc7yd7d3WuVvAb1LBFHDnY8mOX-oVryL5LwaWZkDHXUcxc8KEdnT6rRQhbkWAnINpBDIOLtK1THXu_EgJrpDKJ3OGGZFGBLKayd1sZHFopKxgAl-gpma6cqtsbUAM8wKvGuSZQoBv50sBMWQU2VctcJT_egVJhkGqGEKHFy4bFaF5S8ftONQxWH6N4LqhL6oDsav6A7wQ9F5cSgAN280Pys73cOnyA4ya1EzFRN',
    },
];

const portfolioData = [
    {
        nama: 'Animasi Promosi Startup Tech',
        kategori: 'Animasi 2D',
        deskripsi: 'Produksi animasi explainer video 2 menit untuk startup teknologi dengan gaya modern dan engaging yang meningkatkan konversi 40%.',
        teknologi: ['After Effects', 'Illustrator', 'Premiere Pro'],
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPDaFRcOYMIh3n3_MKsBpzv5ORtq1d0jDLhsspB926NJwmIhjxopoAVqVutcexLAfVR0HxehKEIYQLzorqM8K4u0P1D04_19MCnoejnx_yZOAohy3flZHjuriJltKvxMFSik-onj93I515CETPgcgM5yGc2HI-Pdfby81CSdwiw_OPDgp-RBQGlDp2gB4MPGE-ycDwgoOw6Vf2Cdduofw5gkjN8C_m3QmCxQq6sGlSt6etnP3onuUn4blbAl8o0KprSm4n2sA9gZjT',
    },
    {
        nama: 'Rebranding E-Commerce Fashion',
        kategori: 'Desain Grafis',
        deskripsi: 'Desain ulang identitas visual lengkap termasuk logo, palet warna, dan aset marketing untuk brand fashion lokal yang ekspansi ke regional.',
        teknologi: ['Photoshop', 'Illustrator', 'Figma'],
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7C-S0irTnfLdQws0EHEvb97oNBeZS_QjODr3EuHMDS_b1Zfr9kclpuEkxbIVN8Z7arxmPcmqBFw9cLPIkxLkv4jDN8HckjBdz-Dqu55TW2Pr8Oqxdfrwg51nvwSHa8STMmQxi1RFbzIIiooim8QsRZU_oAde0GpJEsSJwsaIEcFUAZKVB_E9RZCryW7PnrwZZROhwgzJ1zDn7Vpb6COImgpnRRoREuyOuKeEv97804fJBP7Dop_UViajtegnb8G1VqGZyoJ_Mef2J',
    },
    {
        nama: 'Aplikasi Mobile Fintech',
        kategori: 'App Development',
        deskripsi: 'Pengembangan aplikasi mobile iOS dan Android untuk layanan keuangan dengan fitur e-wallet, transfer, dan analitik pengguna.',
        teknologi: ['React Native', 'Node.js', 'MongoDB'],
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBerCNQB8NpwY8voRZz6_NuHTr26Lqy3inhQc54jg05rAr_pcaewUPjczFoXQjo9tvtvuzse5WD2sFvA1MQy6Ue5e7b1KDzZ3cl4en0aPXIOSb_4XUO9hWANKwP5U-7unk76-AQBhk1qPGIb6tV06kk4Ks34guL39Oo-a-a4n4AfM4F15WtMQCCXpoRAK0tZL9EhBtt1fDVuKeIulRG7roGyYZsvjI2ueUtmzb1c4U5Ka02sANR6XmeFeu03yRezJv65gSCI1MKelXB',
    },
    {
        nama: 'Video Dokumenter Corporate',
        kategori: 'Video Production',
        deskripsi: 'Produksi video dokumenter perusahaan 10 menit dengan sinematografi profesional untuk annual report perusahaan multinasional.',
        teknologi: ['Cinema 4D', 'DaVinci Resolve', 'Drone'],
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaqlMlprDte5js9l_m35ThCbfxo4tCIa0plSAf6Sc7yd7d3WuVvAb1LBFHDnY8mOX-oVryL5LwaWZkDHXUcxc8KEdnT6rRQhbkWAnINpBDIOLtK1THXu_EgJrpDKJ3OGGZFGBLKayd1sZHFopKxgAl-gpma6cqtsbUAM8wKvGuSZQoBv50sBMWQU2VctcJT_egVJhkGqGEKHFy4bFaF5S8ftONQxWH6N4LqhL6oDsav6A7wQ9F5cSgAN280Pys73cOnyA4ya1EzFRN',
    },
];

export default function Welcome() {
    const { auth } = usePage<any>().props;
    const [language, setLanguage] = useState<'id' | 'en'>('id');

    const translations = {
        id: {
            services: 'Layanan',
            about: 'Tentang',
            news: 'Berita',
            portfolio: 'Portfolio',
            heroTitle: 'Kreativitas Tanpa Batas',
            heroSubtitle: 'Mengubah Ide Menjadi Realitas Digital yang Menakjubkan',
            heroDescription: 'Kami adalah creative agency yang bergerak di bidang software development dan multimedia. Menyediakan jasa animasi, video, desain, dan pengembangan aplikasi dengan kualitas terbaik.',
            viewServices: 'Lihat Layanan Kami',
            trustedBy: 'Dipercaya oleh Klien Terbaik',
            coreEcosystem: 'Layanan Kami',
            ecosystemDesc: 'Solusi kreatif dan teknologi terdepan untuk kebutuhan digital bisnis Anda.',
            readyToUpgrade: 'Siap Memulai Proyek?',
            joinUs: 'Bergabung dengan 500+ klien yang telah mempercayai kami.',
            contactUs: 'Hubungi Kami',
            aboutCtech: 'Tentang CTECH',
            expertiseTitle: 'Kreativitas Bertemu Teknologi',
            aboutDesc: 'Di CTECH, kami tidak hanya membuat konten; kami menciptakan pengalaman digital yang memorable. Filosofi kami berakar pada "Creative Innovation"—keyakinan bahwa teknologi harus seindah fungsinya.',
            structuralIntegrity: 'Kualitas Terjamin',
            structuralDesc: 'Menghasilkan karya dengan standar kualitas tertinggi yang memenuhi ekspektasi klien.',
            unwaveringReliability: 'Kepuasan Klien',
            reliabilityDesc: 'Fokus pada kepuasan klien dengan layanan responsif dan hasil yang memuaskan.',
            projects: 'Proyek',
            uptime: 'Kepuasan',
            partners: 'Klien',
            support: 'Support',
            latestNews: 'Berita & Artikel',
            fromCtech: 'Terkini dari CTECH',
            viewAll: 'Lihat Semua',
            readMore: 'Baca Selengkapnya',
            ourPortfolio: 'Portfolio Kami',
            completedProjects: 'Proyek yang Telah Kami Selesaikan',
            portfolioDesc: 'Rekam jejak nyata dalam membantu berbagai brand mewujudkan visi kreatif mereka.',
            quickLinks: 'Tautan Cepat',
            resources: 'Sumber Daya',
            newsletter: 'Newsletter',
            newsletterDesc: 'Tetap update dengan wawasan kreatif dan teknologi terbaru kami.',
            subscribe: 'Berlangganan',
            emailPlaceholder: 'Alamat email Anda',
            copyright: '© 2024 CTECH Creative Agency. Hak cipta dilindungi.',
            privacyPolicy: 'Kebijakan Privasi',
            termsOfService: 'Syarat & Ketentuan',
            cookiePolicy: 'Kebijakan Cookie',
            sitemap: 'Peta Situs'
        },
        en: {
            services: 'Services',
            about: 'About',
            news: 'News',
            portfolio: 'Portfolio',
            heroTitle: 'Limitless Creativity',
            heroSubtitle: 'Transforming Ideas into Stunning Digital Reality',
            heroDescription: 'We are a creative agency specializing in software development and multimedia. Providing animation, video, design, and app development services with the highest quality.',
            viewServices: 'View Our Services',
            trustedBy: 'Trusted by Top Clients',
            coreEcosystem: 'Our Services',
            ecosystemDesc: 'Creative solutions and cutting-edge technology for your business digital needs.',
            readyToUpgrade: 'Ready to Start Your Project?',
            joinUs: 'Join 500+ clients who have trusted us.',
            contactUs: 'Contact Us',
            aboutCtech: 'About CTECH',
            expertiseTitle: 'Creativity Meets Technology',
            aboutDesc: 'At CTECH, we don\'t just create content; we craft memorable digital experiences. Our philosophy is rooted in "Creative Innovation"—the belief that technology should be as beautiful as it is functional.',
            structuralIntegrity: 'Guaranteed Quality',
            structuralDesc: 'Delivering work with the highest quality standards that meet client expectations.',
            unwaveringReliability: 'Client Satisfaction',
            reliabilityDesc: 'Focus on client satisfaction with responsive service and satisfying results.',
            projects: 'Projects',
            uptime: 'Satisfaction',
            partners: 'Clients',
            support: 'Support',
            latestNews: 'News & Articles',
            fromCtech: 'Latest from CTECH',
            viewAll: 'View All',
            readMore: 'Read More',
            ourPortfolio: 'Our Portfolio',
            completedProjects: 'Projects We\'ve Completed',
            portfolioDesc: 'A proven track record of helping various brands realize their creative vision.',
            quickLinks: 'Quick Links',
            resources: 'Resources',
            newsletter: 'Newsletter',
            newsletterDesc: 'Stay updated with our latest creative insights and technology updates.',
            subscribe: 'Subscribe',
            emailPlaceholder: 'Your email address',
            copyright: '© 2024 CTECH Creative Agency. All rights reserved.',
            privacyPolicy: 'Privacy Policy',
            termsOfService: 'Terms of Service',
            cookiePolicy: 'Cookie Policy',
            sitemap: 'Sitemap'
        }
    };

    const t = translations[language];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.section-anim').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Head title="CTECH | Innovating Your Digital Future" />
            <style dangerouslySetInnerHTML={{ __html: ctechStyles }} />

            <div className="ctech-landing overflow-x-hidden">
                {/* TopNavBar */}
                <nav
                    className="sticky top-0 z-50 shadow-sm"
                    style={{ background: 'var(--ct-surface)', borderBottom: '1px solid var(--ct-outline-variant)', height: 80 }}
                >
                    <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-12">
                        <div className="flex items-center gap-12">
                            <a href="#" className="text-2xl font-bold" style={{ color: 'var(--ct-primary)' }}>
                                CTECH
                            </a>
                            <div className="hidden gap-8 items-center md:flex">
                                {[
                                    { label: t.services, href: '#services' },
                                    { label: t.about, href: '#about' },
                                    { label: t.news, href: '#berita' },
                                    { label: t.portfolio, href: '#portfolio' },
                                ].map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        className="text-sm font-medium transition-colors duration-200 hover:opacity-80"
                                        style={{ color: 'var(--ct-on-surface-variant)' }}
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="rounded px-6 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
                                    style={{ background: 'var(--ct-secondary)' }}
                                >
                                    Dashboard
                                </Link>
                            ) : null}
                            <div className="relative">
                                <button
                                    onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
                                    className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all hover:bg-blue-50"
                                    style={{ borderColor: 'var(--ct-outline-variant)', color: 'var(--ct-on-surface-variant)' }}
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                    </svg>
                                    {language === 'id' ? 'ID' : 'EN'}
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <main>
                    {/* Hero Section */}
                    <section className="hero-gradient relative flex min-h-[870px] items-center overflow-hidden">
                        <div className="absolute inset-0 z-0">
                            <div className="absolute right-[-10%] top-20 h-[600px] w-[600px] rounded-full blur-[120px]" style={{ background: 'rgba(0, 88, 190, 0.05)' }} />
                            <div className="absolute bottom-[-10%] left-[-5%] h-[400px] w-[400px] rounded-full blur-[100px]" style={{ background: 'rgba(190, 198, 224, 0.1)' }} />
                        </div>

                        <div className="relative z-10 mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-12 md:grid-cols-2">
                            <div className="flex flex-col items-start justify-center">
                                <span className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--ct-secondary)' }}>
                                    Creative Agency
                                </span>
                                <h1 className="mb-6 text-5xl font-bold leading-tight" style={{ color: 'var(--ct-primary)', letterSpacing: '-0.02em' }}>
                                    {t.heroTitle} <br />
                                    <span style={{ color: 'var(--ct-secondary)' }}>{t.heroSubtitle}</span>
                                </h1>
                                <p className="mb-10 max-w-lg text-lg leading-relaxed" style={{ color: 'var(--ct-on-surface-variant)' }}>
                                    {t.heroDescription}
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    {auth.user ? (
                                        <Link
                                            href={dashboard()}
                                            className="rounded-lg px-8 py-4 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl active:scale-95"
                                            style={{ background: 'var(--ct-secondary)' }}
                                        >
                                            Go to Dashboard
                                        </Link>
                                    ) : (
                                        <a
                                            href="#services"
                                            className="rounded-lg px-8 py-4 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl active:scale-95"
                                            style={{ background: 'var(--ct-secondary)' }}
                                        >
                                            {t.viewServices}
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div className="hidden items-center justify-end md:flex">
                                <div className="relative w-full max-w-lg">
                                    <div className="glass-card translate-y-8 rotate-2 rounded-2xl p-4 shadow-xl">
                                        <img
                                            alt="Tech infrastructure"
                                            className="rounded-xl grayscale transition-all duration-700 hover:grayscale-0"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAL68JjMo73-12dWgBEylYi7MYseGeJxl1HY40kMc7sG7ra8ZrSoGGey4U_EouGiSjbKaoE2hVDv5kjqn6MG2RhVkk301xV9v5yp9uQ9WcCimGSe_CNbRDld9S1BloR-sKzE_ZKRCoim_xSTer8B395VvEhmTZibIc0hFsfJVkL8WsurtSp0rq8CAAyULlBc0aDQYNmrTk3f5o09GmotR0Pj53KxgEDubLkqndIhLYy5FPNWqQm4NGVaZcEaUXL3L1koz6KtZSngdNP"
                                        />
                                    </div>
                                    <div className="glass-card absolute right-0 top-0 -translate-x-12 -translate-y-4 -rotate-3 rounded-xl p-6 shadow-2xl">
                                        <div className="mb-4 flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'var(--ct-secondary-container)' }}>
                                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="font-bold" style={{ color: 'var(--ct-primary)' }}>Secure Core</div>
                                                <div className="text-xs" style={{ color: 'var(--ct-on-surface-variant)' }}>Active Protection</div>
                                            </div>
                                        </div>
                                        <div className="h-2 w-32 overflow-hidden rounded-full" style={{ background: 'var(--ct-surface-highest)' }}>
                                            <div className="h-full w-3/4 rounded-full" style={{ background: 'var(--ct-secondary)' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Partners Section */}
                    <section className="section-anim py-16" style={{ background: 'var(--ct-surface)' }} id="partners">
                        <div className="mx-auto max-w-[1280px] px-12">
                            <div className="mb-10 text-center">
                                <h2 className="text-sm font-medium uppercase tracking-widest opacity-60" style={{ color: 'var(--ct-on-surface-variant)' }}>
                                    {t.trustedBy}
                                </h2>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-12 opacity-60 md:gap-20">
                                {['AWS', 'Google Cloud', 'Microsoft', 'Cisco', 'Intel', 'IBM'].map((name) => (
                                    <div key={name} className="group cursor-pointer">
                                        <div className="flex h-10 items-center justify-center rounded px-4 text-sm font-bold tracking-wider opacity-50 transition-all duration-300 group-hover:opacity-100" style={{ color: 'var(--ct-on-surface-variant)' }}>
                                            {name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Services Section */}
                    <section className="section-anim py-24" style={{ background: 'var(--ct-surface-low)' }} id="services">
                        <div className="mx-auto max-w-[1280px] px-12">
                            <div className="mb-16 text-center">
                                <h2 className="mb-4 text-3xl font-semibold" style={{ color: 'var(--ct-primary)' }}>{t.coreEcosystem}</h2>
                                <p className="mx-auto max-w-2xl" style={{ color: 'var(--ct-on-surface-variant)' }}>
                                    {t.ecosystemDesc}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {/* Card 1: Animation & Video */}
                                <div
                                    className="group flex flex-col gap-8 rounded-xl border p-8 shadow-sm transition-all hover:border-blue-500 md:col-span-2 md:flex-row"
                                    style={{ background: 'var(--ct-surface-lowest)', borderColor: 'var(--ct-outline-variant)' }}
                                >
                                    <div className="w-full overflow-hidden rounded-lg md:w-1/2">
                                        <img
                                            alt="Animation & Video"
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7C-S0irTnfLdQws0EHEvb97oNBeZS_QjODr3EuHMDS_b1Zfr9kclpuEkxbIVN8Z7arxmPcmqBFw9cLPIkxLkv4jDN8HckjBdz-Dqu55TW2Pr8Oqxdfrwg51nvwSHa8STMmQxi1RFbzIIiooim8QsRZU_oAde0GpJEsSJwsaIEcFUAZKVB_E9RZCryW7PnrwZZROhwgzJ1zDn7Vpb6COImgpnRRoREuyOuKeEv97804fJBP7Dop_UViajtegnb8G1VqGZyoJ_Mef2J"
                                        />
                                    </div>
                                    <div className="flex w-full flex-col justify-center md:w-1/2">
                                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg" style={{ background: 'rgba(0, 88, 190, 0.1)' }}>
                                            <svg className="h-6 w-6" style={{ color: 'var(--ct-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="mb-3 text-2xl font-semibold" style={{ color: 'var(--ct-primary)' }}>Animasi & Video</h3>
                                        <p className="mb-6" style={{ color: 'var(--ct-on-surface-variant)' }}>Jasa animasi 2D/3D, video promosi, motion graphics, dan produksi konten video berkualitas tinggi untuk kebutuhan marketing dan branding Anda.</p>
                                        <a href="#" className="flex items-center gap-2 text-sm font-medium transition-all group-hover:gap-4" style={{ color: 'var(--ct-secondary)' }}>
                                            Explore Animation →
                                        </a>
                                    </div>
                                </div>

                                {/* Card 2: Graphic Design */}
                                <div
                                    className="rounded-xl border p-8 shadow-sm transition-all hover:border-blue-500"
                                    style={{ background: 'var(--ct-surface-lowest)', borderColor: 'var(--ct-outline-variant)' }}
                                >
                                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg" style={{ background: 'rgba(0, 88, 190, 0.1)' }}>
                                        <svg className="h-6 w-6" style={{ color: 'var(--ct-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                                        </svg>
                                    </div>
                                    <h3 className="mb-3 text-2xl font-semibold" style={{ color: 'var(--ct-primary)' }}>Desain Grafis</h3>
                                    <p className="mb-8" style={{ color: 'var(--ct-on-surface-variant)' }}>Desain logo, branding, UI/UX design, dan materi visual marketing yang menarik dan profesional.</p>
                                    <img
                                        alt="Graphic Design"
                                        className="h-40 w-full rounded object-cover shadow-inner"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBerCNQB8NpwY8voRZz6_NuHTr26Lqy3inhQc54jg05rAr_pcaewUPjczFoXQjo9tvtvuzse5WD2sFvA1MQy6Ue5e7b1KDzZ3cl4en0aPXIOSb_4XUO9hWANKwP5U-7unk76-AQBhk1qPGIb6tV06kk4Ks34guL39Oo-a-a4n4AfM4F15WtMQCCXpoRAK0tZL9EhBtt1fDVuKeIulRG7roGyYZsvjI2ueUtmzb1c4U5Ka02sANR6XmeFeu03yRezJv65gSCI1MKelXB"
                                    />
                                </div>

                                {/* Card 3: App Development */}
                                <div
                                    className="rounded-xl border p-8 shadow-sm transition-all hover:border-blue-500"
                                    style={{ background: 'var(--ct-surface-lowest)', borderColor: 'var(--ct-outline-variant)' }}
                                >
                                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg" style={{ background: 'rgba(0, 88, 190, 0.1)' }}>
                                        <svg className="h-6 w-6" style={{ color: 'var(--ct-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                                        </svg>
                                    </div>
                                    <h3 className="mb-3 text-2xl font-semibold" style={{ color: 'var(--ct-primary)' }}>Pengembangan Aplikasi</h3>
                                    <p style={{ color: 'var(--ct-on-surface-variant)' }}>Pengembangan aplikasi web, mobile, dan desktop custom sesuai kebutuhan bisnis Anda dengan teknologi terkini.</p>
                                </div>

                                {/* Card 4: CTA */}
                                <div
                                    className="relative flex flex-col items-start justify-center overflow-hidden rounded-xl p-8 text-white md:col-span-2 md:flex-row md:items-center md:justify-between"
                                    style={{ background: 'var(--ct-secondary)' }}
                                >
                                    <div className="relative z-10">
                                        <h3 className="mb-2 text-2xl font-semibold">{t.readyToUpgrade}</h3>
                                        <p className="mb-6 opacity-80">{t.joinUs}</p>
                                        <a
                                            href="#contact"
                                            className="inline-block rounded-lg bg-white px-6 py-3 font-bold transition-all hover:bg-opacity-90"
                                            style={{ color: 'var(--ct-secondary)' }}
                                        >
                                            {t.contactUs}
                                        </a>
                                    </div>
                                    <svg className="absolute right-[-20px] top-[-20px] h-40 w-40 rotate-12 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* About Section */}
                    <section className="section-anim py-24" id="about">
                        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-20 px-12 md:grid-cols-2">
                            <div className="order-2 md:order-1">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div className="h-64 overflow-hidden rounded-xl" style={{ background: 'var(--ct-surface-high)' }}>
                                            <img
                                                alt="Our Team"
                                                className="h-full w-full object-cover"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaqlMlprDte5js9l_m35ThCbfxo4tCIa0plSAf6Sc7yd7d3WuVvAb1LBFHDnY8mOX-oVryL5LwaWZkDHXUcxc8KEdnT6rRQhbkWAnINpBDIOLtK1THXu_EgJrpDKJ3OGGZFGBLKayd1sZHFopKxgAl-gpma6cqtsbUAM8wKvGuSZQoBv50sBMWQU2VctcJT_egVJhkGqGEKHFy4bFaF5S8ftONQxWH6N4LqhL6oDsav6A7wQ9F5cSgAN280Pys73cOnyA4ya1EzFRN"
                                            />
                                        </div>
                                        <div className="rounded-xl border p-6" style={{ background: '#d8e2ff', borderColor: 'rgba(0, 88, 190, 0.2)' }}>
                                            <h4 className="text-2xl font-bold" style={{ color: 'var(--ct-secondary)' }}>15+</h4>
                                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ct-on-surface-variant)' }}>Years Expertise</p>
                                        </div>
                                    </div>
                                    <div className="mt-8 space-y-4">
                                        <div className="rounded-xl p-6" style={{ background: 'var(--ct-surface-high)' }}>
                                            <h4 className="text-2xl font-bold" style={{ color: 'var(--ct-primary)' }}>99.9%</h4>
                                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ct-on-surface-variant)' }}>Service Uptime</p>
                                        </div>
                                        <div className="h-64 overflow-hidden rounded-xl" style={{ background: 'var(--ct-surface-high)' }}>
                                            <img
                                                alt="Growth"
                                                className="h-full w-full object-cover"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPDaFRcOYMIh3n3_MKsBpzv5ORtq1d0jDLhsspB926NJwmIhjxopoAVqVutcexLAfVR0HxehKEIYQLzorqM8K4u0P1D04_19MCnoejnx_yZOAohy3flZHjuriJltKvxMFSik-onj93I515CETPgcgM5yGc2HI-Pdfby81CSdwiw_OPDgp-RBQGlDp2gB4MPGE-ycDwgoOw6Vf2Cdduofw5gkjN8C_m3QmCxQq6sGlSt6etnP3onuUn4blbAl8o0KprSm4n2sA9gZjT"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="order-1 md:order-2">
                                <span className="mb-4 block text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--ct-secondary)' }}>
                                    {t.aboutCtech}
                                </span>
                                <h2 className="mb-6 text-3xl font-semibold" style={{ color: 'var(--ct-primary)' }}>{t.expertiseTitle}</h2>
                                <p className="mb-6 text-lg leading-relaxed" style={{ color: 'var(--ct-on-surface-variant)' }}>
                                    {t.aboutDesc}
                                </p>
                                <div className="space-y-6">
                                    {[
                                        { title: t.structuralIntegrity, desc: t.structuralDesc },
                                        { title: t.unwaveringReliability, desc: t.reliabilityDesc },
                                    ].map((item) => (
                                        <div key={item.title} className="flex items-start gap-4">
                                            <svg className="mt-1 h-5 w-5 flex-shrink-0" style={{ color: 'var(--ct-secondary)' }} fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                            </svg>
                                            <div>
                                                <h4 className="font-bold" style={{ color: 'var(--ct-primary)' }}>{item.title}</h4>
                                                <p className="text-sm" style={{ color: 'var(--ct-on-surface-variant)' }}>{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Stats Section */}
                    <section className="section-anim py-20 text-white" style={{ background: 'var(--ct-primary)' }}>
                        <div className="mx-auto max-w-[1280px] px-12">
                            <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
                                {[
                                    { value: '500+', label: t.projects },
                                    { value: '99%', label: t.uptime },
                                    { value: '50+', label: t.partners },
                                    { value: '24/7', label: t.support },
                                ].map((stat) => (
                                    <div key={stat.label}>
                                        <div className="mb-2 text-5xl font-bold" style={{ letterSpacing: '-0.02em' }}>{stat.value}</div>
                                        <div className="text-sm font-medium uppercase tracking-widest opacity-60">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ===== BERITA SECTION ===== */}
                    <section className="section-anim py-24" style={{ background: 'var(--ct-surface)' }} id="berita">
                        <div className="mx-auto max-w-[1280px] px-12">
                            <div className="mb-16 flex items-end justify-between">
                                <div>
                                    <span className="mb-3 block text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--ct-secondary)' }}>
                                        {t.latestNews}
                                    </span>
                                    <h2 className="text-3xl font-semibold" style={{ color: 'var(--ct-primary)' }}>{t.fromCtech}</h2>
                                </div>
                                <a
                                    href="#"
                                    className="hidden text-sm font-medium transition-all hover:opacity-70 md:block"
                                    style={{ color: 'var(--ct-secondary)' }}
                                >
                                    {t.viewAll} →
                                </a>
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {beritaData.map((item, idx) => (
                                    <article
                                        key={idx}
                                        className="group overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md hover:border-blue-400"
                                        style={{ background: 'var(--ct-surface-lowest)', borderColor: 'var(--ct-outline-variant)' }}
                                    >
                                        <div className="h-48 overflow-hidden">
                                            <img
                                                alt={item.judul}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                src={item.img}
                                            />
                                        </div>
                                        <div className="p-6">
                                            <div className="mb-3 flex items-center gap-3">
                                                <span
                                                    className="rounded-full px-3 py-1 text-xs font-semibold"
                                                    style={{ background: 'rgba(0, 88, 190, 0.1)', color: 'var(--ct-secondary)' }}
                                                >
                                                    {item.kategori}
                                                </span>
                                                <span className="text-xs" style={{ color: 'var(--ct-outline)' }}>{item.tanggal}</span>
                                            </div>
                                            <h3 className="mb-3 text-lg font-semibold leading-snug" style={{ color: 'var(--ct-primary)' }}>
                                                {item.judul}
                                            </h3>
                                            <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--ct-on-surface-variant)' }}>
                                                {item.ringkasan}
                                            </p>
                                            <a
                                                href="#"
                                                className="text-sm font-medium transition-all group-hover:underline"
                                                style={{ color: 'var(--ct-secondary)' }}
                                            >
                                                {t.readMore} →
                                            </a>
                                        </div>
                                    </article>
                                ))}
                            </div>
                            <div className="mt-8 text-center md:hidden">
                                <a href="#" className="text-sm font-medium" style={{ color: 'var(--ct-secondary)' }}>
                                    {t.viewAll} →
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* ===== PORTFOLIO SECTION ===== */}
                    <section className="section-anim py-24" style={{ background: 'var(--ct-surface-low)' }} id="portfolio">
                        <div className="mx-auto max-w-[1280px] px-12">
                            <div className="mb-16 text-center">
                                <span className="mb-3 block text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--ct-secondary)' }}>
                                    {t.ourPortfolio}
                                </span>
                                <h2 className="mb-4 text-3xl font-semibold" style={{ color: 'var(--ct-primary)' }}>{t.completedProjects}</h2>
                                <p className="mx-auto max-w-xl text-base" style={{ color: 'var(--ct-on-surface-variant)' }}>
                                    {t.portfolioDesc}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {portfolioData.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="group flex overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-lg hover:border-blue-400"
                                        style={{ background: 'var(--ct-surface-lowest)', borderColor: 'var(--ct-outline-variant)' }}
                                    >
                                        <div className="w-2/5 overflow-hidden flex-shrink-0">
                                            <img
                                                alt={item.nama}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                src={item.img}
                                            />
                                        </div>
                                        <div className="flex flex-col justify-between p-6 w-3/5">
                                            <div>
                                                <span
                                                    className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold"
                                                    style={{ background: 'rgba(0, 88, 190, 0.1)', color: 'var(--ct-secondary)' }}
                                                >
                                                    {item.kategori}
                                                </span>
                                                <h3 className="mb-2 text-lg font-semibold leading-snug" style={{ color: 'var(--ct-primary)' }}>
                                                    {item.nama}
                                                </h3>
                                                <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--ct-on-surface-variant)' }}>
                                                    {item.deskripsi}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {item.teknologi.map((tech) => (
                                                    <span
                                                        key={tech}
                                                        className="rounded px-2.5 py-1 text-xs font-medium"
                                                        style={{ background: 'var(--ct-surface-high)', color: 'var(--ct-on-surface-variant)' }}
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-12 text-center">
                                <a
                                    href="#"
                                    className="inline-block rounded-lg border px-8 py-3 text-sm font-medium transition-all hover:bg-blue-50"
                                    style={{ borderColor: 'var(--ct-secondary)', color: 'var(--ct-secondary)' }}
                                >
                                    {t.viewAll} →
                                </a>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer style={{ background: 'var(--ct-surface-lowest)' }}>
                    <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-12 py-16 md:grid-cols-4">
                        <div className="flex flex-col gap-6">
                            <div className="text-2xl font-bold" style={{ color: 'var(--ct-primary)' }}>CTECH</div>
                            <p className="text-base" style={{ color: 'var(--ct-on-surface-variant)' }}>
                                {language === 'id' ? 'Creative agency yang bergerak di bidang software development dan multimedia. Menyediakan jasa animasi, video, desain, dan pengembangan aplikasi dengan kualitas terbaik.' : 'Creative agency specializing in software development and multimedia. Providing animation, video, design, and app development services with the highest quality.'}
                            </p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h5 className="mb-2 font-bold" style={{ color: 'var(--ct-primary)' }}>{t.quickLinks}</h5>
                            {['Services', 'About Us', 'News', 'Portfolio'].map((link) => (
                                <a key={link} href="#" className="transition-colors hover:opacity-80" style={{ color: 'var(--ct-on-surface-variant)' }}>
                                    {link}
                                </a>
                            ))}
                        </div>
                        <div className="flex flex-col gap-4">
                            <h5 className="mb-2 font-bold" style={{ color: 'var(--ct-primary)' }}>{t.resources}</h5>
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Sitemap'].map((link) => (
                                <a key={link} href="#" className="transition-colors hover:opacity-80" style={{ color: 'var(--ct-on-surface-variant)' }}>
                                    {link}
                                </a>
                            ))}
                        </div>
                        <div className="flex flex-col gap-4">
                            <h5 className="mb-2 font-bold" style={{ color: 'var(--ct-primary)' }}>{t.newsletter}</h5>
                            <p className="text-xs font-semibold" style={{ color: 'var(--ct-on-surface-variant)' }}>{t.newsletterDesc}</p>
                            <div className="mt-2 flex flex-col gap-2">
                                <input
                                    className="rounded border px-4 py-2.5 text-sm outline-none focus:ring-1"
                                    style={{ background: 'var(--ct-surface)', borderColor: 'var(--ct-outline-variant)', color: 'var(--ct-on-surface)' }}
                                    placeholder={t.emailPlaceholder}
                                    type="email"
                                />
                                <button
                                    className="rounded px-4 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                                    style={{ background: 'var(--ct-secondary)' }}
                                >
                                    {t.subscribe}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mx-auto max-w-[1280px] px-12 py-8 text-center" style={{ borderTop: '1px solid rgba(198, 198, 205, 0.3)' }}>
                        <p className="text-xs font-semibold" style={{ color: 'var(--ct-on-surface-variant)' }}>
                            {t.copyright}
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
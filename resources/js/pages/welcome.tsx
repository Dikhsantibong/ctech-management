import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import PublicNavbar from '@/components/public-navbar';
import { dashboard } from '@/routes';
import {
    ChevronRight, ArrowRight, CheckCircle2,
    Code2, Smartphone, Monitor, Database, Shield, Zap,
    Cpu, Cloud, Menu, X, Star, Quote, Mail, Phone, MapPin,
    Facebook, Twitter, Instagram, Linkedin,
    Briefcase, Activity, Clock, Users, Building2, PlayCircle, BarChart3, LineChart,
    Package, Fingerprint, ShoppingCart, Calculator, PieChart, Wifi, WifiOff, Layers,
    TrendingUp, Palette, MessageCircle, ChevronLeft, ChevronRight as ChevronRightIcon
} from 'lucide-react';

const ctechStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    .ctech-landing * {
        font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
    }

    body {
        background-color: #fafafa;
        color: #0f172a;
    }

    /* Glassmorphism */
    .glass-nav {
        background: rgba(255, 255, 255, 0.75);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(226, 232, 240, 0.6);
    }
    
    .glass-card {
        background: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.8);
        box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
    }

    /* Animations */
    @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
        100% { transform: translateY(0px); }
    }
    .animate-float {
        animation: float 6s ease-in-out infinite;
    }
    .animate-float-delayed {
        animation: float 6s ease-in-out 3s infinite;
    }

    .reveal {
        opacity: 0;
        transform: translateY(40px);
        transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
    }
    .reveal.active {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Text Gradients */
    .text-gradient {
        background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    /* Hover Effects */
    .hover-card {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid transparent;
    }
    .hover-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px -15px rgba(37,99,235,0.15);
        border-color: rgba(59, 130, 246, 0.2);
        background: white;
    }

    .nav-link {
        position: relative;
    }
    .nav-link::after {
        content: '';
        position: absolute;
        width: 0;
        height: 2px;
        bottom: -4px;
        left: 0;
        background-color: #2563eb;
        transition: width 0.3s ease;
    }
    .nav-link:hover::after {
        width: 100%;
    }

    /* Glow Backgrounds */
    .glow-blue {
        position: absolute;
        width: 600px;
        height: 600px;
        background: radial-gradient(circle, rgba(37,99,235,0.08) 0%, rgba(255,255,255,0) 70%);
        border-radius: 50%;
        filter: blur(40px);
        z-index: 0;
        pointer-events: none;
    }
`;

const services = [
    { icon: <Code2 className="w-6 h-6 text-blue-600" />, title: 'Software Development', desc: 'Pengembangan software kustom untuk kebutuhan bisnis dengan teknologi modern dan scalable.' },
    { icon: <Smartphone className="w-6 h-6 text-blue-600" />, title: 'Mobile App Development', desc: 'Aplikasi iOS & Android native/hybrid dengan performa tinggi dan UX premium.' },
    { icon: <PlayCircle className="w-6 h-6 text-blue-600" />, title: 'Video Animasi', desc: 'Produksi video animasi 2D/3D untuk kebutuhan promosi, edukasi, dan branding.' },
    { icon: <TrendingUp className="w-6 h-6 text-blue-600" />, title: 'Digital Marketing', desc: 'Strategi pemasaran digital terpadu untuk meningkatkan visibilitas dan konversi bisnis.' },
    { icon: <Palette className="w-6 h-6 text-blue-600" />, title: 'Desain', desc: 'Desain grafis, UI/UX, dan branding visual untuk identitas bisnis yang kuat.' },
    { icon: <Monitor className="w-6 h-6 text-blue-600" />, title: 'Video Production', desc: 'Produksi video profesional untuk company profile, dokumentasi, dan konten kreatif.' }
];

const features = [
    'Tim Profesional Berpengalaman',
    'Teknologi & Framework Modern',
    'Support Cepat & Responsif 24/7',
    'Sistem Aman Terenkripsi',
    'Skalabilitas Tinggi',
    'Integrasi API Mudah'
];



const testimonials = [
    {
        name: 'Budi Santoso',
        role: 'CEO, Enterprise Group Tech',
        img: 'https://i.pravatar.cc/150?img=11',
        text: '"CTECH telah merevolusi cara kami beroperasi. Transformasi digital yang mereka bangun sangat elegan, aman, dan meningkatkan efisiensi perusahaan kami hingga 300%."',
    },
    {
        name: 'Sarah Wijaya',
        role: 'Direktur Operasional, RetailMaju',
        img: 'https://i.pravatar.cc/150?img=5',
        text: '"Sistem ERP yang dikembangkan sangat scalable dan responsif. Tim CTECH sangat memahami kebutuhan enterprise dengan sempurna."',
    },
    {
        name: 'Arif Pratama',
        role: 'Founder, Startup Nusantara',
        img: 'https://i.pravatar.cc/150?img=8',
        text: '"Dari segi UI/UX hingga arsitektur backend, CTECH membuktikan bahwa mereka adalah partner teknologi kelas dunia yang bisa diandalkan."',
    }
];

export default function Welcome({ news = [], portfolios = [] }: { news?: any[], portfolios?: any[] }) {
    const { auth } = usePage<any>().props;
    const [activePortfolioCategory, setActivePortfolioCategory] = useState('Semua');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const storyImages = [
        { src: '/our-story/photo1.jpeg', alt: 'Tim CTECH', gradient: 'from-blue-500 to-indigo-600', letter: 'C' },
        { src: '/our-story/photo2.jpeg', alt: 'Workshop CTECH', gradient: 'from-cyan-500 to-blue-600', letter: 'T' },
        { src: '/our-story/photo3.jpeg', alt: 'Kantor CTECH', gradient: 'from-indigo-500 to-purple-600', letter: 'E' },
        { src: '/our-story/photo4.jpeg', alt: 'Project CTECH', gradient: 'from-slate-700 to-slate-900', letter: 'H' },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % storyImages.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % storyImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + storyImages.length) % storyImages.length);
    };

    const portfolioCategories = ['Semua', ...Array.from(new Set(portfolios.map(p => p.category).filter(Boolean)))];
    const filteredPortfolios = activePortfolioCategory === 'Semua' 
        ? portfolios 
        : portfolios.filter(p => p.category === activePortfolioCategory);

    useEffect(() => {

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <>
            <Head title="CTECH | Transformasi Digital Masa Depan" />
            <style dangerouslySetInnerHTML={{ __html: ctechStyles }} />

            <div className="ctech-landing min-h-screen overflow-x-hidden selection:bg-blue-200 selection:text-blue-900">
                <PublicNavbar isLandingPage={true} />

                {/* Hero Section */}
                <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex items-center min-h-[90vh]">
                    <div className="glow-blue top-0 left-0"></div>
                    <div className="glow-blue bottom-0 right-0" style={{ transform: 'translate(30%, 30%)' }}></div>
                    
                    <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-2 gap-12 items-center">
                        <div className="max-w-2xl reveal">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-6">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                PT KREATIF TEKNOLOGI MAJU BERSAMA
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
                                Transformasi Digital <br/>
                                <span className="text-gradient">Masa Depan</span> <br/>
                                Dimulai Dari Sini.
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                                CTECH membantu bisnis berkembang melalui teknologi modern, sistem digital, AI solution, software development, automation, dan transformasi digital menyeluruh.
                            </p>
                            <div className="flex flex-wrap items-center gap-4">
                                <a href="#kontak" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-base font-semibold transition-all shadow-xl shadow-blue-500/30 flex items-center gap-2 transform hover:-translate-y-1">
                                    Mulai Konsultasi <ArrowRight className="w-5 h-5" />
                                </a>
                                <a href="#layanan" className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-full text-base font-semibold transition-all flex items-center gap-2">
                                    <PlayCircle className="w-5 h-5 text-blue-600" /> Lihat Layanan
                                </a>
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-200/60 flex items-center gap-8">
                                <div>
                                    <h4 className="text-3xl font-bold text-slate-900">100+</h4>
                                    <p className="text-sm text-slate-500 font-medium">Enterprise Clients</p>
                                </div>
                                <div className="w-px h-10 bg-slate-200"></div>
                                <div>
                                    <h4 className="text-3xl font-bold text-slate-900">99%</h4>
                                    <p className="text-sm text-slate-500 font-medium">Satisfaction Rate</p>
                                </div>
                                <div className="w-px h-10 bg-slate-200"></div>
                                <div className="flex -space-x-3">
                                    <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=1" alt="User"/>
                                    <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=2" alt="User"/>
                                    <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=3" alt="User"/>
                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">+50</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative hidden lg:block reveal">
                            {/* Decorative Elements */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100/40 to-purple-100/40 rounded-full blur-3xl -z-10"></div>
                            
                            {/* Main UI Mockup */}
                            <div className="relative z-10 glass-card rounded-2xl border border-white/60 shadow-2xl p-2 animate-float">
                                <div className="bg-slate-900 rounded-xl overflow-hidden shadow-inner flex flex-col">
                                    {/* Mockup Header */}
                                    <div className="h-10 bg-slate-800/50 flex items-center px-4 gap-2 border-b border-slate-700/50">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                        <div className="mx-auto h-4 w-32 bg-slate-700 rounded-full"></div>
                                    </div>
                                    {/* Mockup Body */}
                                    <div className="p-6 grid grid-cols-3 gap-4">
                                        <div className="col-span-2 space-y-4">
                                            <div className="h-32 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-4 flex flex-col justify-between">
                                                <div className="h-4 w-24 bg-white/20 rounded"></div>
                                                <div className="h-8 w-32 bg-white/40 rounded"></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="h-24 bg-slate-800 rounded-lg p-4 flex flex-col justify-end">
                                                    <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                                                        <div className="h-full w-3/4 bg-blue-500 rounded-full"></div>
                                                    </div>
                                                </div>
                                                <div className="h-24 bg-slate-800 rounded-lg p-4 flex flex-col justify-end">
                                                    <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                                                        <div className="h-full w-1/2 bg-purple-500 rounded-full"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-1 space-y-4">
                                            <div className="h-14 bg-slate-800 rounded-lg flex items-center px-3 gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/20"></div>
                                                <div className="h-2 w-16 bg-slate-600 rounded"></div>
                                            </div>
                                            <div className="h-14 bg-slate-800 rounded-lg flex items-center px-3 gap-3">
                                                <div className="w-8 h-8 rounded-full bg-purple-500/20"></div>
                                                <div className="h-2 w-16 bg-slate-600 rounded"></div>
                                            </div>
                                            <div className="h-14 bg-slate-800 rounded-lg flex items-center px-3 gap-3">
                                                <div className="w-8 h-8 rounded-full bg-green-500/20"></div>
                                                <div className="h-2 w-16 bg-slate-600 rounded"></div>
                                            </div>
                                            <div className="h-14 bg-slate-800 rounded-lg flex items-center px-3 gap-3">
                                                <div className="w-8 h-8 rounded-full bg-orange-500/20"></div>
                                                <div className="h-2 w-16 bg-slate-600 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Card 1 */}
                            <div className="absolute -bottom-6 -left-10 z-20 glass-card rounded-xl p-4 flex items-center gap-4 animate-float-delayed shadow-xl">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Secure System</p>
                                    <p className="text-xs text-slate-500">End-to-end encrypted</p>
                                </div>
                            </div>

                            {/* Floating Card 2 */}
                            <div className="absolute -top-8 -right-8 z-20 glass-card rounded-xl p-4 flex items-center gap-4 animate-float shadow-xl delay-150">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">High Performance</p>
                                    <p className="text-xs text-slate-500">99.9% Uptime SLA</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Client Logos */}
                <section className="py-10 border-y border-slate-200/60 bg-white/50 backdrop-blur-sm reveal">
                    <div className="max-w-7xl mx-auto px-6">
                        <p className="text-center text-sm font-semibold text-slate-400 tracking-wider uppercase mb-8">Dipercaya Oleh Perusahaan dan Pemerintahan</p>
                        <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                            {[
                                { name: 'Company 1', logo: '/logos/company1.png' },
                                { name: 'Company 2', logo: '/logos/company2.png' },
                                { name: 'Company 3', logo: '/logos/company3.png' },
                                { name: 'Company 4', logo: '/logos/company4.png' },
                                { name: 'Company 5', logo: '/logos/company5.png' },
                            ].map((partner) => (
                                <img
                                    key={partner.name}
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="h-12 w-auto object-contain"
                                    onError={(e: any) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Tentang Kami */}
                <section id="tentang" className="py-24 bg-white relative">
                    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative reveal">
                            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-100 shadow-2xl">
                                {storyImages.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 transition-opacity duration-500 ${
                                            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    >
                                        <img
                                            src={image.src}
                                            alt={image.alt}
                                            className="w-full h-full object-cover grayscale"
                                            onError={(e: any) => {
                                                e.target.style.display='none';
                                                e.target.parentElement.innerHTML=`<div class="w-full h-full bg-gradient-to-br ${image.gradient} flex items-center justify-center"><span class="text-white/80 text-5xl font-black">${image.letter}</span></div>`;
                                            }}
                                        />
                                    </div>
                                ))}

                                {/* Navigation buttons */}
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition-all hover:scale-110"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition-all hover:scale-110"
                                >
                                    <ChevronRightIcon className="w-6 h-6" />
                                </button>

                                {/* Dots indicator */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {storyImages.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-3 h-3 rounded-full transition-all ${
                                                index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-5 rounded-2xl shadow-xl shadow-blue-600/30">
                                <div className="text-3xl font-black">5+</div>
                                <div className="text-blue-100 text-sm font-semibold">Tahun<br/>Berpengalaman</div>
                            </div>
                        </div>
                        <div className="reveal">
                            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Tentang Kami</span>
                            <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Mewujudkan Visi Digital Menjadi Realitas Terukur.</h2>
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                CTECH hadir sebagai mitra strategis dalam era digital. Kami tidak sekadar menulis kode, kami merancang ekosistem digital yang efisien, aman, dan scalable untuk mendorong pertumbuhan eksponensial bisnis Anda.
                            </p>
                            
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                                        <Zap className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-2">Inovasi Tanpa Henti</h4>
                                        <p className="text-slate-600">Terus mengadopsi teknologi terbaru seperti AI dan arsitektur Cloud native.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-2">Keamanan Skala Enterprise</h4>
                                        <p className="text-slate-600">Standar keamanan tertinggi untuk melindungi data krusial perusahaan Anda.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Layanan */}
                <section id="layanan" className="py-24 bg-slate-50 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="text-center max-w-2xl mx-auto mb-16 reveal">
                            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Layanan Kami</span>
                            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Solusi Teknologi Komprehensif</h2>
                            <p className="text-slate-600 text-lg">Dari pengembangan perangkat lunak kustom hingga integrasi infrastruktur cloud, kami siap melayani.</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-2xl hover-card reveal" style={{ transitionDelay: `${idx * 100}ms` }}>
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{service.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Produk Unggulan — CTECH Paylo */}
                <section id="produk" className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        {/* Header */}
                        <div className="max-w-2xl mb-16 reveal">
                            <p className="text-blue-600 font-semibold text-sm mb-3">Produk Unggulan</p>
                            <h2 className="text-4xl font-extrabold text-slate-900 mb-5">
                                CTECH Paylo
                            </h2>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                Paket lengkap aplikasi bisnis siap pakai. Satu ekosistem yang menangani seluruh operasional perusahaan Anda — dari absensi hingga analisis bisnis.
                            </p>
                        </div>

                        {/* App Module Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden mb-16">
                            {[
                                {
                                    icon: <Fingerprint className="w-5 h-5 text-blue-600" />,
                                    name: 'Absensi Karyawan',
                                    desc: 'GPS tracking, face recognition, dan laporan kehadiran otomatis secara real-time.',
                                },
                                {
                                    icon: <Database className="w-5 h-5 text-blue-600" />,
                                    name: 'Inventory',
                                    desc: 'Barcode scanning, notifikasi stok minimum, multi-gudang dalam satu dashboard.',
                                },
                                {
                                    icon: <ShoppingCart className="w-5 h-5 text-blue-600" />,
                                    name: 'Kasir / POS',
                                    desc: 'Offline-first, sinkronisasi otomatis saat online. Tetap berjalan tanpa internet.',
                                },
                                {
                                    icon: <Calculator className="w-5 h-5 text-blue-600" />,
                                    name: 'Akuntan',
                                    desc: 'Pembukuan otomatis, laba-rugi, neraca, arus kas — sesuai standar akuntansi Indonesia.',
                                },
                                {
                                    icon: <PieChart className="w-5 h-5 text-blue-600" />,
                                    name: 'Owner Dashboard',
                                    desc: 'Monitoring pendapatan, performa cabang, dan insight strategis untuk pemilik bisnis.',
                                },
                                {
                                    icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
                                    name: 'Analisis Bisnis',
                                    desc: 'Prediksi tren penjualan, analisis pelanggan, dan rekomendasi berbasis data.',
                                },
                            ].map((app, idx) => (
                                <div key={idx} className="bg-white p-8 reveal" style={{ transitionDelay: `${idx * 60}ms` }}>
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                                        {app.icon}
                                    </div>
                                    <h4 className="text-base font-bold text-slate-900 mb-2">{app.name}</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">{app.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Bottom row */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 reveal">
                            <div className="flex flex-wrap gap-x-10 gap-y-4 text-sm text-slate-500">
                                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 6 aplikasi terintegrasi</span>
                                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Kasir offline-first</span>
                                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Siap pakai, deploy cepat</span>
                            </div>
                            <a href="#kontak" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors shrink-0">
                                Jadwalkan Demo <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </section>

                {/* Kenapa Memilih Kami */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="order-2 lg:order-1 relative reveal">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4 pt-8">
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                            <Users className="w-8 h-8 text-blue-600 mb-4" />
                                            <h4 className="font-bold text-slate-900 mb-2">Tim Profesional</h4>
                                            <p className="text-sm text-slate-600">Developer & Designer dengan standar global.</p>
                                        </div>
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                            <Clock className="w-8 h-8 text-blue-600 mb-4" />
                                            <h4 className="font-bold text-slate-900 mb-2">Support Cepat</h4>
                                            <p className="text-sm text-slate-600">Respon SLA di bawah 1 jam untuk isu kritikal.</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                            <Code2 className="w-8 h-8 text-blue-600 mb-4" />
                                            <h4 className="font-bold text-slate-900 mb-2">Teknologi Modern</h4>
                                            <p className="text-sm text-slate-600">Stack teknologi masa depan yang scalable.</p>
                                        </div>
                                        <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-xl shadow-blue-600/20">
                                            <Shield className="w-8 h-8 text-white mb-4" />
                                            <h4 className="font-bold text-white mb-2">Sistem Aman</h4>
                                            <p className="text-sm text-blue-100">Keamanan berlapis sesuai standar industri.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2 reveal">
                                <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Keunggulan Kami</span>
                                <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Infrastruktur Kuat, Tim Hebat, Eksekusi Tepat.</h2>
                                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                    Kami memahami bahwa transformasi digital bukan sekadar tentang aplikasi, melainkan integrasi sistem yang memudahkan manusia di belakangnya.
                                </p>
                                <div className="space-y-4">
                                    {features.map((feat, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                            </div>
                                            <span className="font-medium text-slate-700">{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Portfolio */}
                <section id="portfolio" className="py-24 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col items-center mb-12 gap-8 reveal">
                            <div className="max-w-2xl text-center">
                                <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Karya Kami</span>
                                <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Project Terselesaikan</h2>
                                <p className="text-slate-600 text-lg">Jejak karya teknologi yang telah membantu berbagai klien mencapai tujuan bisnis mereka.</p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-2 w-full">
                                {portfolioCategories.map((filter: any) => (
                                    <button 
                                        key={filter} 
                                        onClick={() => setActivePortfolioCategory(filter)}
                                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activePortfolioCategory === filter ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 transform scale-105' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPortfolios.map((item, idx) => (
                                <Link href={`/portfolio/${item.id}`} key={item.id || idx} className="group relative rounded-3xl overflow-hidden bg-slate-200 aspect-[4/3] reveal active block" style={{ animationDelay: `${idx * 100}ms` }}>
                                    <img src={item.image ? `/storage/${item.image}` : "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                        <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full mb-3 w-max translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.category || 'Portfolio'}</span>
                                        <h3 className="text-xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{item.title}</h3>
                                        <p className="text-slate-300 text-sm mb-4 line-clamp-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{item.description}</p>
                                        <span className="text-blue-300 hover:text-white font-medium flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                                            Lihat Detail <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center mt-16 reveal">
                            <Link href="/portfolio" className="inline-flex items-center gap-3 bg-slate-900 hover:bg-blue-600 text-white px-8 py-3.5 rounded-full font-bold transition-colors shadow-xl">
                                Lihat Semua Karya Kami <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Berita / Artikel */}
                <section id="berita" className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-2xl mx-auto mb-16 reveal">
                            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Insights & Artikel</span>
                            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Berita Teknologi Terkini</h2>
                            <p className="text-slate-600 text-lg">Update seputar dunia teknologi, AI, bisnis digital, dan inovasi startup.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {news.map((item, idx) => (
                                <Link href={`/berita/${item.slug}`} key={idx} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col reveal" style={{ transitionDelay: `${idx * 100}ms` }}>
                                    <div className="aspect-[16/9] overflow-hidden relative bg-slate-100">
                                        <img src={item.image ? `/storage/${item.image}` : "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600"} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
                                            {item.category || 'Berita Umum'}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="text-sm text-slate-400 font-medium mb-3">
                                            {new Date(item.published_at || item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-600 mb-5 line-clamp-3 text-sm flex-grow">
                                            {item.content?.replace(/<[^>]*>?/gm, '').substring(0, 150) || ''}...
                                        </p>
                                        <span className="text-blue-600 font-semibold text-sm flex items-center gap-1.5 group-hover:gap-2 transition-all mt-auto">
                                            Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center mt-12 reveal">
                            <Link href="/berita" className="inline-flex items-center gap-2 border-2 border-slate-200 hover:border-blue-600 text-slate-600 hover:text-blue-600 px-8 py-3 rounded-full font-semibold transition-colors">
                                Lihat Semua Berita <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Testimonial Premium */}
                <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-blue-600/10 rounded-full blur-3xl -z-10"></div>
                    
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-2xl mx-auto mb-16 reveal">
                            <span className="text-blue-400 font-bold tracking-wider uppercase text-sm mb-2 block">Kisah Sukses</span>
                            <h2 className="text-4xl font-extrabold mb-4">Dipercaya oleh Para Pemimpin Industri</h2>
                            <p className="text-slate-400 text-lg">Inilah yang mereka katakan tentang dampak transformasi digital bersama CTECH.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {testimonials.map((testi, idx) => (
                                <div key={idx} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-3xl reveal hover:bg-slate-800 transition-colors" style={{ transitionDelay: `${idx * 100}ms` }}>
                                    <Quote className="w-10 h-10 text-blue-500/30 mb-6" />
                                    <p className="text-slate-300 mb-8 leading-relaxed">
                                        {testi.text}
                                    </p>
                                    <div className="flex items-center gap-4 mt-auto">
                                        <img src={testi.img} alt={testi.name} className="w-12 h-12 rounded-full border-2 border-blue-500" />
                                        <div>
                                            <h4 className="text-white font-bold">{testi.name}</h4>
                                            <p className="text-blue-400 text-xs font-medium">{testi.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section id="kontak" className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-blue-500"></div>
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
                    
                    <div className="max-w-4xl mx-auto px-6 relative z-10 text-center reveal">
                        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">Bangun Masa Depan Digital Bersama CTECH</h2>
                        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                            Jangan biarkan kompetitor mendahului Anda. Jadwalkan sesi konsultasi gratis dengan tim ahli kami untuk mendiskusikan kebutuhan sistem Anda.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <button className="bg-white text-blue-600 hover:bg-slate-50 px-8 py-4 rounded-full text-lg font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto flex justify-center items-center gap-2">
                                Hubungi Kami Sekarang <ArrowRight className="w-5 h-5" />
                            </button>
                            <button className="bg-blue-700/50 hover:bg-blue-700 text-white border border-blue-400/50 px-8 py-4 rounded-full text-lg font-bold transition-all w-full sm:w-auto">
                                Lihat Portfolio
                            </button>
                        </div>
                    </div>
                </section>

                {/* Footer Lengkap */}
                <footer className="bg-slate-950 text-slate-400 py-20 border-t border-slate-900">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <img src="/logo/logo-web.png" alt="CTECH Logo" className="h-8 grayscale brightness-0 invert" />
                                <span className="font-bold text-2xl tracking-tight text-white">CTECH</span>
                            </div>
                            <p className="text-sm leading-relaxed pr-4">
                                PT KREATIF TEKNOLOGI MAJU BERSAMA. Mewujudkan transformasi digital perusahaan Anda melalui teknologi canggih dan desain elegan.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                                    <Facebook className="w-4 h-4" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                                    <Twitter className="w-4 h-4" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                                    <Instagram className="w-4 h-4" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                                    <Linkedin className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Layanan Utama</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Web Development</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Mobile App Development</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">AI & Automation</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Cloud Infrastructure</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Cyber Security</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Perusahaan</h4>
                            <ul className="space-y-3">
                                <li><Link href="/tentang" className="hover:text-blue-400 transition-colors">Tentang Kami</Link></li>
                                <li><Link href="/portfolio" className="hover:text-blue-400 transition-colors">Portfolio</Link></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Karir</a></li>
                                <li><Link href="/berita" className="hover:text-blue-400 transition-colors">Berita & Insight</Link></li>
                                <li><a href="#kontak" className="hover:text-blue-400 transition-colors">Hubungi Kami</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Kontak</h4>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                                    <span className="text-sm">BTN UNHALU BLOK L NO 10</span>
                                </li>
                                <li className="flex gap-3">
                                    <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                                    <span className="text-sm">+62 22 9311 8410</span>
                                </li>
                                <li className="flex gap-3">
                                    <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                                    <span className="text-sm">ptkreatifteknologimajubersama@gmail.com</span>
                                </li>
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
                            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                        </div>
                    </div>
                </footer>

                {/* WhatsApp Floating Button */}
                <div className="fixed bottom-6 right-6 z-50 group">
                    {/* Chat Popup */}
                    <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        {/* Chat Header */}
                        <div className="bg-green-600 text-white p-4 rounded-t-2xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                <MessageCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-bold">CTECH Support</h4>
                                <p className="text-xs text-green-100">Online</p>
                            </div>
                        </div>
                        {/* Chat Body */}
                        <div className="p-4 bg-slate-50">
                            <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm mb-2 max-w-[90%]">
                                <p className="text-sm text-slate-700">
                                    Halo! 👋 Ada yang bisa kami bantu? Silakan kirim pesan untuk konsultasi gratis.
                                </p>
                                <p className="text-xs text-slate-400 mt-1">10:30</p>
                            </div>
                        </div>
                        {/* Chat Input */}
                        <div className="p-3 border-t border-slate-100">
                            <a 
                                href="https://wa.me/6282293118410?text=Halo%20CTECH,%20saya%20ingin%20konsultasi%20tentang%20layanan%20Anda"
                                target="_blank"
                                rel="noreferrer"
                                className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded-xl text-sm font-semibold transition-colors"
                            >
                                Kirim Pesan WhatsApp
                            </a>
                        </div>
                    </div>
                    {/* WhatsApp Button */}
                    <a 
                        href="https://wa.me/6282293118410?text=Halo%20CTECH,%20saya%20ingin%20konsultasi%20tentang%20layanan%20Anda"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                    >
                        <MessageCircle className="w-7 h-7" />
                    </a>
                </div>

            </div>
        </>
    );
}
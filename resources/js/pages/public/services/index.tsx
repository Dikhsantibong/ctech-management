import { Head, Link } from '@inertiajs/react';
import { 
    Code2, 
    Smartphone, 
    PlayCircle, 
    TrendingUp, 
    Palette, 
    Monitor,
    CheckCircle2,
    ArrowRight,
    Zap,
    Users,
    Clock,
    Shield,
    Globe,
    BarChart3,
    Target,
    Lightbulb,
    Database,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    MapPin,
    Phone,
    Mail,
    MessageCircle
} from 'lucide-react';
import PublicNavbar from '@/components/public-navbar';

const services = [
    {
        id: 'software-development',
        icon: <Code2 className="w-8 h-8" />,
        title: 'Software Development',
        tagline: 'Solusi Software Kustom',
        description: 'Pengembangan software kustom untuk kebutuhan bisnis dengan teknologi modern dan scalable. Kami membangun aplikasi yang sesuai dengan kebutuhan spesifik bisnis Anda.',
        color: 'from-blue-600 to-blue-700',
        features: [
            {
                icon: <Code2 className="w-6 h-6" />,
                title: 'Web Development',
                description: 'Pembuatan website modern, responsif, dan scalable untuk kebutuhan enterprise.'
            },
            {
                icon: <Database className="w-6 h-6" />,
                title: 'Sistem Internal',
                description: 'Solusi dashboard admin, ERP, CRM, dan sistem manajemen kustom.'
            },
            {
                icon: <Shield className="w-6 h-6" />,
                title: 'API Development',
                description: 'Pengembangan API yang aman dan terdokumentasi dengan baik.'
            }
        ],
        benefits: [
            'Solusi yang disesuaikan dengan kebutuhan bisnis',
            'Teknologi modern dan scalable',
            'Dukungan teknis berkelanjutan',
            'Dokumentasi lengkap'
        ]
    },
    {
        id: 'mobile-app-development',
        icon: <Smartphone className="w-8 h-8" />,
        title: 'Mobile App Development',
        tagline: 'Aplikasi Mobile Premium',
        description: 'Aplikasi iOS & Android native/hybrid dengan performa tinggi dan UX premium. Kami menghadirkan pengalaman mobile yang seamless untuk pengguna Anda.',
        color: 'from-purple-600 to-purple-700',
        features: [
            {
                icon: <Smartphone className="w-6 h-6" />,
                title: 'Native Development',
                description: 'Aplikasi native untuk iOS dan Android dengan performa maksimal.'
            },
            {
                icon: <Globe className="w-6 h-6" />,
                title: 'Cross-Platform',
                description: 'Aplikasi hybrid dengan React Native atau Flutter untuk efisiensi biaya.'
            },
            {
                icon: <Shield className="w-6 h-6" />,
                title: 'App Store Optimization',
                description: 'Bantuan optimasi untuk meningkatkan visibilitas di App Store dan Play Store.'
            }
        ],
        benefits: [
            'Performa tinggi dan smooth',
            'UI/UX modern dan intuitif',
            'Support berbagai device',
            'Update dan maintenance rutin'
        ]
    },
    {
        id: 'video-animasi',
        icon: <PlayCircle className="w-8 h-8" />,
        title: 'Video Animasi',
        tagline: 'Konten Visual Kreatif',
        description: 'Produksi video animasi 2D/3D untuk kebutuhan promosi, edukasi, dan branding. Kami mengubah ide kompleks menjadi visual yang mudah dipahami.',
        color: 'from-pink-600 to-pink-700',
        features: [
            {
                icon: <PlayCircle className="w-6 h-6" />,
                title: '2D Animation',
                description: 'Animasi 2D untuk explainer video, promosi, dan edukasi.'
            },
            {
                icon: <Monitor className="w-6 h-6" />,
                title: '3D Animation',
                description: 'Animasi 3D untuk visualisasi produk dan branding premium.'
            },
            {
                icon: <Lightbulb className="w-6 h-6" />,
                title: 'Motion Graphics',
                description: 'Motion graphics untuk intro, outro, dan transisi video.'
            }
        ],
        benefits: [
            'Visual yang menarik perhatian',
            'Penyampaian pesan yang efektif',
            'Dapat digunakan di berbagai platform',
            'Durasi fleksibel sesuai kebutuhan'
        ]
    },
    {
        id: 'digital-marketing',
        icon: <TrendingUp className="w-8 h-8" />,
        title: 'Digital Marketing',
        tagline: 'Strategi Pemasaran Digital',
        description: 'Strategi pemasaran digital terpadu untuk meningkatkan visibilitas dan konversi bisnis. Kami membantu bisnis Anda tumbuh dengan pendekatan berbasis data.',
        color: 'from-green-600 to-green-700',
        features: [
            {
                icon: <Globe className="w-6 h-6" />,
                title: 'SEO Optimization',
                description: 'Optimasi mesin pencari untuk meningkatkan ranking website Anda.'
            },
            {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'Social Media Marketing',
                description: 'Manajemen dan strategi konten untuk berbagai platform sosial media.'
            },
            {
                icon: <Target className="w-6 h-6" />,
                title: 'Paid Advertising',
                description: 'Iklan berbayar di Google Ads, Facebook Ads, dan platform lainnya.'
            }
        ],
        benefits: [
            'Peningkatan visibilitas online',
            'Target audiens yang tepat',
            'ROI yang terukur',
            'Laporan dan analisis rutin'
        ]
    },
    {
        id: 'desain',
        icon: <Palette className="w-8 h-8" />,
        title: 'Desain',
        tagline: 'Visual Branding Profesional',
        description: 'Desain grafis, UI/UX, dan branding visual untuk identitas bisnis yang kuat. Kami menciptakan visual yang tidak hanya indah tapi juga efektif.',
        color: 'from-orange-600 to-orange-700',
        features: [
            {
                icon: <Palette className="w-6 h-6" />,
                title: 'Graphic Design',
                description: 'Desain grafis untuk materi promosi, banner, dan kebutuhan visual lainnya.'
            },
            {
                icon: <Smartphone className="w-6 h-6" />,
                title: 'UI/UX Design',
                description: 'Desain antarmuka dan pengalaman pengguna untuk website dan aplikasi.'
            },
            {
                icon: <Lightbulb className="w-6 h-6" />,
                title: 'Brand Identity',
                description: 'Pengembangan identitas brand lengkap dari logo hingga guideline.'
            }
        ],
        benefits: [
            'Identitas visual yang konsisten',
            'Desain yang user-friendly',
            'Meningkatkan brand awareness',
            'File siap pakai untuk berbagai media'
        ]
    },
    {
        id: 'video-production',
        icon: <Monitor className="w-8 h-8" />,
        title: 'Video Production',
        tagline: 'Produksi Video Profesional',
        description: 'Produksi video profesional untuk company profile, dokumentasi, dan konten kreatif. Kami menghadirkan kualitas video broadcast untuk kebutuhan bisnis Anda.',
        color: 'from-red-600 to-red-700',
        features: [
            {
                icon: <Monitor className="w-6 h-6" />,
                title: 'Company Profile',
                description: 'Video profil perusahaan profesional untuk presentasi dan marketing.'
            },
            {
                icon: <Users className="w-6 h-6" />,
                title: 'Event Documentation',
                description: 'Dokumentasi event, seminar, dan kegiatan perusahaan dengan kualitas tinggi.'
            },
            {
                icon: <PlayCircle className="w-6 h-6" />,
                title: 'Commercial Video',
                description: 'Video komersial untuk iklan TV, digital, dan promosi produk.'
            }
        ],
        benefits: [
            'Kualitas video broadcast',
            'Tim profesional berpengalaman',
            'Equipment lengkap dan modern',
            'Post-production berkualitas tinggi'
        ]
    }
];

export default function Services() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
            <Head title="Layanan CTECH - Solusi Digital Komprehensif" />
            
            <PublicNavbar isLandingPage={false} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
                            Layanan Kami
                        </span>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
                            Solusi Digital untuk
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                Pertumbuhan Bisnis Anda
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                            Kami menyediakan layanan lengkap mulai dari pengembangan software, aplikasi mobile, 
                            video animasi, digital marketing, desain, hingga produksi video profesional untuk mendukung 
                            transformasi digital bisnis Anda.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a 
                                href="#kontak" 
                                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transform hover:-translate-y-0.5"
                            >
                                Konsultasi Gratis
                                <ArrowRight className="w-5 h-5" />
                            </a>
                            <Link 
                                href="/"
                                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 px-8 py-4 rounded-full font-semibold transition-all border-2 border-slate-200 hover:border-slate-300"
                            >
                                Kembali ke Home
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            {services.map((service, index) => (
                <section 
                    key={service.id}
                    className={`py-24 px-6 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                >
                    <div className="max-w-7xl mx-auto">
                        {/* Service Header */}
                        <div className="text-center mb-16">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} text-white mb-6 shadow-lg`}>
                                {service.icon}
                            </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                                {service.title}
                            </h2>
                            <p className="text-xl text-blue-600 font-semibold mb-6">
                                {service.tagline}
                            </p>
                            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                                {service.description}
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-3 gap-8 mb-16">
                            {service.features.map((feature, idx) => (
                                <div 
                                    key={idx}
                                    className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
                                >
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} text-white mb-6 group-hover:scale-110 transition-transform`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Benefits */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 text-white">
                            <h3 className="text-3xl font-bold mb-8 text-center">
                                Mengapa Memilih {service.title}?
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {service.benefits.map((benefit, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                                            <CheckCircle2 className="w-6 h-6 text-white" />
                                        </div>
                                        <p className="text-lg leading-relaxed">
                                            {benefit}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            ))}

            {/* Why Choose Us Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-4 block">
                            Keunggulan Kami
                        </span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                            Mengapa CTECH?
                        </h2>
                        <p className="text-slate-600 text-lg">
                            Kami bukan hanya vendor teknologi — kami adalah partner strategis yang memahami bisnis Anda.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <Zap className="w-7 h-7" />, title: 'Eksekusi Cepat', desc: 'Workflow agile untuk hasil cepat tanpa mengorbankan kualitas.' },
                            { icon: <Users className="w-7 h-7" />, title: 'Tim Profesional', desc: 'Tim berpengalaman dengan standar global.' },
                            { icon: <Clock className="w-7 h-7" />, title: 'Support 24/7', desc: 'Dukungan teknis responsif kapan saja dibutuhkan.' },
                            { icon: <Shield className="w-7 h-7" />, title: 'Garansi Kualitas', desc: 'Standar kualitas tinggi dengan testing yang ketat.' }
                        ].map((item, idx) => (
                            <div key={idx} className="group bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 hover:-translate-y-1">
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

            {/* CTA Section */}
            <section id="kontak" className="py-24 px-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                        Siap Memulai Project Anda?
                    </h2>
                    <p className="text-xl mb-10 text-blue-50 leading-relaxed">
                        Jadwalkan konsultasi gratis dan diskusikan kebutuhan bisnis Anda dengan tim kami. 
                        Tanpa komitmen, konsultasi sepenuhnya gratis.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a 
                            href="https://wa.me/6281234567890" 
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Chat WhatsApp
                            <ArrowRight className="w-5 h-5" />
                        </a>
                        <a 
                            href="mailto:info@ctech.id"
                            className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold transition-all hover:bg-white hover:text-blue-600"
                        >
                            Kirim Email
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
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
    );
}

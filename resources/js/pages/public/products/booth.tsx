import { Head, Link } from '@inertiajs/react';
import { 
    Camera, 
    Smartphone, 
    Zap, 
    BarChart3, 
    Star, 
    Clock,
    CheckCircle2,
    ArrowRight,
    Users,
    Shield,
    CreditCard,
    Image as ImageIcon,
    Share2,
    Calendar,
    MapPin,
    QrCode,
    Download,
    Upload,
    Bell,
    Settings,
    Globe,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Phone,
    Mail
} from 'lucide-react';
import PublicNavbar from '@/components/public-navbar';

const features = [
    {
        icon: <Calendar className="w-8 h-8" />,
        title: 'Booking Online',
        description: 'Sistem reservasi slot waktu yang memudahkan pelanggan memesan sesi photobooth secara online dengan konfirmasi otomatis.',
        details: [
            'Kalender booking real-time',
            'Konfirmasi otomatis via WhatsApp/Email',
            'Pilihan paket dan add-on',
            'Deposit payment system'
        ]
    },
    {
        icon: <ImageIcon className="w-8 h-8" />,
        title: 'Galeri Cloud',
        description: 'Foto hasil sesi otomatis diupload ke cloud dan dapat diakses oleh pelanggan melalui link personal dengan password protection.',
        details: [
            'Upload otomatis setelah sesi',
            'Link gallery personal',
            'Password protection',
            'High-resolution download',
            'Auto-enhancement filters'
        ]
    },
    {
        icon: <MapPin className="w-8 h-8" />,
        title: 'Multi-Lokasi',
        description: 'Kelola beberapa lokasi photobooth dari satu dashboard terpusat dengan tracking performa per lokasi.',
        details: [
            'Dashboard multi-lokasi',
            'Perbandingan performa lokasi',
            'Manajemen inventory per lokasi',
            'Staff assignment per lokasi'
        ]
    },
    {
        icon: <BarChart3 className="w-8 h-8" />,
        title: 'Analytics & Insights',
        description: 'Pantau booking rate, peak hours, dan preferensi pelanggan untuk optimasi jadwal dan pricing strategy.',
        details: [
            'Booking rate analysis',
            'Peak hours identification',
            'Customer preferences tracking',
            'Revenue per location',
            'Custom reports'
        ]
    },
    {
        icon: <Share2 className="w-8 h-8" />,
        title: 'Social Sharing',
        description: 'Fitur sharing otomatis ke Instagram, Facebook, dan WhatsApp dengan custom branding untuk meningkatkan reach.',
        details: [
            'One-click social sharing',
            'Custom watermark/branding',
            'Instagram story templates',
            'Facebook auto-post',
            'WhatsApp sharing'
        ]
    },
    {
        icon: <CreditCard className="w-8 h-8" />,
        title: 'Payment Integration',
        description: 'Terima pembayaran online via QRIS, transfer bank, dan e-wallet dengan notifikasi otomatis.',
        details: [
            'QRIS payment',
            'Bank transfer',
            'E-wallet integration',
            'Payment reminders',
            'Invoice generation'
        ]
    },
    {
        icon: <Users className="w-8 h-8" />,
        title: 'Customer Management',
        description: 'Database pelanggan terintegrasi dengan history booking dan preferensi untuk personalization.',
        details: [
            'Customer database',
            'Booking history',
            'Preference tracking',
            'Birthday reminders',
            'Loyalty program'
        ]
    },
    {
        icon: <Shield className="w-8 h-8" />,
        title: 'Keamanan Data',
        description: 'Enkripsi data pelanggan dan foto dengan backup otomatis untuk keamanan maksimal.',
        details: [
            'Data encryption',
            'Secure photo storage',
            'Auto backup',
            'GDPR compliant',
            'Access control'
        ]
    }
];

const benefits = [
    'Dipercaya oleh 10+ lokasi photobooth di Kendari',
    'Meningkatkan booking rate hingga 40%',
    'Mengurangi no-show hingga 70%',
    'Manajemen operasional lebih efisien',
    'Customer experience yang lebih modern',
    'Branding yang konsisten',
    'Support teknis responsif'
];

const workflow = [
    {
        step: '1',
        title: 'Pelanggan Booking',
        description: 'Pelanggan memilih tanggal, waktu, dan paket melalui website atau WhatsApp bot.',
        icon: <Calendar className="w-6 h-6" />
    },
    {
        step: '2',
        title: 'Konfirmasi Otomatis',
        description: 'Sistem mengirim konfirmasi dan reminder otomatis via WhatsApp dan Email.',
        icon: <Bell className="w-6 h-6" />
    },
    {
        step: '3',
        title: 'Sesi Fotografi',
        description: 'Staff melakukan sesi sesuai jadwal dengan sistem check-in digital.',
        icon: <Camera className="w-6 h-6" />
    },
    {
        step: '4',
        title: 'Upload Otomatis',
        description: 'Foto otomatis diupload ke cloud dan diproses dengan filter preset.',
        icon: <Upload className="w-6 h-6" />
    },
    {
        step: '5',
        title: 'Akses Pelanggan',
        description: 'Pelanggan menerima link gallery untuk melihat dan download foto.',
        icon: <Download className="w-6 h-6" />
    },
    {
        step: '6',
        title: 'Share & Review',
        description: 'Pelanggan dapat share foto dan memberikan review untuk meningkatkan trust.',
        icon: <Star className="w-6 h-6" />
    }
];

const pricing = [
    {
        name: 'Single Booth',
        price: 'Rp 750.000',
        period: '/bulan',
        description: 'Untuk photobooth dengan 1 lokasi',
        features: [
            '1 Lokasi',
            'Unlimited Booking',
            'Galeri Cloud 10GB',
            'Basic Analytics',
            'Support Email',
            'Social Media Integration',
            'Payment Gateway Basic'
        ],
        excluded: ['Multi-Lokasi', 'Custom Branding', 'API Access', 'White Label']
    },
    {
        name: 'Multi Booth',
        price: 'Rp 2.000.000',
        period: '/bulan',
        popular: true,
        description: 'Untuk photobooth dengan hingga 5 lokasi',
        features: [
            'Hingga 5 Lokasi',
            'Unlimited Booking',
            'Galeri Cloud 50GB',
            'Advanced Analytics',
            'Custom Branding',
            'Support Prioritas',
            'Training Staff',
            'WhatsApp Bot Integration',
            'Multi Payment Gateway'
        ],
        excluded: ['Unlimited Lokasi', 'White Label', 'Custom Development', 'API Access']
    },
    {
        name: 'Franchise',
        price: 'Custom',
        period: '',
        description: 'Untuk jaringan photobooth skala besar',
        features: [
            'Unlimited Lokasi',
            'White Label Solution',
            'Custom Domain',
            'API Access',
            'Dedicated Support',
            'Custom Development',
            'Revenue Sharing Model',
            'Unlimited Cloud Storage',
            'Advanced Analytics Suite',
            'Multi-language Support'
        ],
        excluded: []
    }
];

export default function Booth() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-purple-600 selection:text-white">
            <Head title="CTECH Booth - Platform Photobooth Modern" />
            
            <PublicNavbar isLandingPage={false} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 bg-gradient-to-br from-purple-50 via-white to-pink-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <Link href="/produk" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 font-medium">
                                Kembali ke Produk
                            </Link>
                            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
                                CTECH Booth
                            </h1>
                            <p className="text-2xl text-purple-600 font-semibold mb-6">
                                Platform Photobooth Modern
                            </p>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Platform photobooth terintegrasi dengan sistem booking, galeri cloud, manajemen lokasi, 
                                dan fitur sharing sosial untuk meningkatkan pengalaman pelanggan dan revenue bisnis photobooth Anda. 
                                Dipercaya oleh 10+ lokasi photobooth di Kendari.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a 
                                    href="#kontak" 
                                    className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40 transform hover:-translate-y-0.5"
                                >
                                    Demo Gratis
                                    <ArrowRight className="w-5 h-5" />
                                </a>
                                <a 
                                    href="#fitur" 
                                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 px-8 py-4 rounded-full font-semibold transition-all border-2 border-slate-200 hover:border-slate-300"
                                >
                                    Lihat Fitur
                                </a>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl">
                                <div className="bg-white rounded-2xl p-6 shadow-inner">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                            <Calendar className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">Booking Dashboard</div>
                                            <div className="text-sm text-slate-500">Real-time management</div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-32 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl flex items-center justify-center">
                                            <BarChart3 className="w-12 h-12 text-purple-400" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-purple-50 rounded-xl p-4">
                                                <div className="text-2xl font-bold text-purple-600">12</div>
                                                <div className="text-sm text-slate-600">Booking Hari Ini</div>
                                            </div>
                                            <div className="bg-pink-50 rounded-xl p-4">
                                                <div className="text-2xl font-bold text-pink-600">85%</div>
                                                <div className="text-sm text-slate-600">Occupancy Rate</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="fitur" className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                            Fitur Lengkap
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Semua yang Anda butuhkan untuk mengelola bisnis photobooth dalam satu platform
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {features.map((feature, idx) => (
                            <div 
                                key={idx}
                                className="bg-slate-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-slate-100"
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 text-white mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 mb-6 leading-relaxed">
                                    {feature.description}
                                </p>
                                <ul className="space-y-3">
                                    {feature.details.map((detail, didx) => (
                                        <li key={didx} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Workflow Section */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                            Cara Kerja
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Alur booking hingga delivery foto yang seamless dan otomatis
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {workflow.map((item, idx) => (
                            <div 
                                key={idx}
                                className="relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100"
                            >
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                                    {item.step}
                                </div>
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 text-purple-600 mb-4">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 px-6 bg-gradient-to-br from-purple-900 to-pink-900 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                            Mengapa CTECH Booth?
                        </h2>
                        <p className="text-xl text-purple-200 max-w-3xl mx-auto">
                            Manfaat nyata yang akan Anda rasakan setelah menggunakan CTECH Booth
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-4 bg-white/5 rounded-xl p-6">
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
            </section>

            {/* Pricing Section */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                            Harga Transparan
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Pilih paket yang sesuai dengan skala bisnis photobooth Anda
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {pricing.map((plan, idx) => (
                            <div 
                                key={idx}
                                className={`relative rounded-2xl p-8 ${
                                    plan.popular 
                                        ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-2xl scale-105' 
                                        : 'bg-white border-2 border-slate-200 hover:border-purple-300'
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="inline-block px-4 py-1 rounded-full bg-yellow-400 text-yellow-900 text-sm font-bold">
                                            Paling Populer
                                        </span>
                                    </div>
                                )}
                                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                                    {plan.name}
                                </h3>
                                <p className={`text-sm mb-6 ${plan.popular ? 'text-purple-100' : 'text-slate-500'}`}>
                                    {plan.description}
                                </p>
                                <div className="mb-6">
                                    <span className={`text-4xl font-extrabold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                                        {plan.price}
                                    </span>
                                    {plan.period && (
                                        <span className={`text-sm ${plan.popular ? 'text-purple-100' : 'text-slate-500'}`}>
                                            {plan.period}
                                        </span>
                                    )}
                                </div>
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, fidx) => (
                                        <li key={fidx} className="flex items-start gap-3">
                                            <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-purple-200' : 'text-green-500'}`} />
                                            <span className={`text-sm ${plan.popular ? 'text-purple-50' : 'text-slate-600'}`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                    {plan.excluded.map((feature, fidx) => (
                                        <li key={fidx} className="flex items-start gap-3 opacity-50">
                                            <div className={`w-5 h-5 flex-shrink-0 mt-0.5 flex items-center justify-center ${plan.popular ? 'text-purple-200' : 'text-slate-400'}`}>
                                                ×
                                            </div>
                                            <span className={`text-sm ${plan.popular ? 'text-purple-50' : 'text-slate-600'}`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <button 
                                    className={`w-full py-4 rounded-xl font-semibold transition-all ${
                                        plan.popular 
                                            ? 'bg-white text-purple-600 hover:bg-purple-50' 
                                            : 'bg-purple-600 text-white hover:bg-purple-700'
                                    }`}
                                >
                                    {plan.price === 'Custom' ? 'Hubungi Kami' : 'Mulai Sekarang'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="kontak" className="py-24 px-6 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                        Siap Tingkatkan Revenue Photobooth Anda?
                    </h2>
                    <p className="text-xl mb-10 text-purple-50 leading-relaxed">
                        Jadwalkan demo gratis dan lihat bagaimana CTECH Booth dapat transformasi 
                        bisnis photobooth Anda. Tanpa komitmen, konsultasi gratis.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a 
                            href="https://wa.me/6281234567890" 
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Chat WhatsApp
                            <ArrowRight className="w-5 h-5" />
                        </a>
                        <a 
                            href="mailto:info@ctech.id"
                            className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold transition-all hover:bg-white hover:text-purple-600"
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
        </div>
    );
}

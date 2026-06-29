import { Head, Link } from '@inertiajs/react';
import { 
    Smartphone, 
    Store, 
    Users, 
    BarChart3, 
    Shield, 
    Clock,
    CheckCircle2,
    ArrowRight,
    Star,
    Zap,
    TrendingUp,
    Database,
    Printer,
    CreditCard,
    Bell,
    Settings,
    Download,
    Upload,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    MapPin,
    Phone,
    Mail,
    MessageCircle
} from 'lucide-react';
import { PremiumNavbar as PublicNavbar } from '@/components/ui/PremiumNavbar';

const features = [
    {
        icon: <Smartphone className="w-8 h-8" />,
        title: 'Kasir Offline-First',
        description: 'Transaksi tetap berjalan lancar meskipun tanpa koneksi internet. Data akan tersinkronisasi secara otomatis saat koneksi kembali.',
        details: [
            'Tidak ada downtime saat gangguan jaringan',
            'Sinkronisasi otomatis saat online kembali',
            'Support berbagai metode pembayaran',
            'Cetak struk thermal Bluetooth/WiFi'
        ]
    },
    {
        icon: <BarChart3 className="w-8 h-8" />,
        title: 'Dashboard Analisis Bisnis',
        description: 'Pantau performa bisnis secara real-time dengan grafik dan laporan yang mudah dipahami untuk pengambilan keputusan yang lebih baik.',
        details: [
            'Grafik penjualan harian, mingguan, bulanan',
            'Analisis produk terlaris',
            'Tracking profit dan loss',
            'Export laporan ke Excel/PDF'
        ]
    },
    {
        icon: <Users className="w-8 h-8" />,
        title: 'Manajemen Karyawan',
        description: 'Sistem absensi dengan GPS tracking, manajemen shift, dan perhitungan gaji otomatis untuk efisiensi HR.',
        details: [
            'Absensi dengan geolocation',
            'Manajemen shift dan jadwal',
            'Perhitungan gaji otomatis',
            'Performance tracking karyawan'
        ]
    },
    {
        icon: <Store className="w-8 h-8" />,
        title: 'Inventaris Cerdas',
        description: 'Tracking stok real-time dengan notifikasi otomatis ketika barang menipis, serta manajemen supplier yang terintegrasi.',
        details: [
            'Notifikasi stok minimum otomatis',
            'Tracking pergerakan stok',
            'Manajemen supplier dan purchase order',
            'Support barcode/QR code scanning'
        ]
    },
    {
        icon: <Shield className="w-8 h-8" />,
        title: 'Keamanan Data',
        description: 'Enkripsi data tingkat lanjut dan backup otomatis untuk memastikan data bisnis Anda selalu aman.',
        details: [
            'Enkripsi data end-to-end',
            'Backup otomatis harian',
            'Role-based access control',
            'Audit trail untuk semua aktivitas'
        ]
    },
    {
        icon: <Clock className="w-8 h-8" />,
        title: 'Laporan Otomatis',
        description: 'Generate laporan penjualan, keuangan, dan inventaris secara otomatis dalam berbagai format.',
        details: [
            'Laporan penjualan detail',
            'Laporan keuangan dan pajak',
            'Laporan inventaris',
            'Custom report builder'
        ]
    },
    {
        icon: <CreditCard className="w-8 h-8" />,
        title: 'Multi Payment Gateway',
        description: 'Terima berbagai metode pembayaran dari tunai, transfer, hingga e-wallet dan QRIS.',
        details: [
            'Support QRIS',
            'Transfer bank otomatis',
            'E-wallet integration',
            'Split payment'
        ]
    },
    {
        icon: <Database className="w-8 h-8" />,
        title: 'Cloud Sync',
        description: 'Data tersimpan di cloud dengan akses dari mana saja dan kapan saja.',
        details: [
            'Akses multi-device',
            'Real-time sync',
            'History transaksi lengkap',
            'Data recovery'
        ]
    }
];

const benefits = [
    'Meningkatkan efisiensi operasional hingga 60%',
    'Mengurangi kesalahan manusia dalam pencatatan',
    'Pengambilan keputusan berbasis data real-time',
    'Hemat biaya operasional jangka panjang',
    'Mudah digunakan tanpa pelatihan teknis',
    'Support teknis responsif',
    'Update fitur berkala'
];

const useCases = [
    {
        title: 'Toko Retail',
        description: 'Ideal untuk toko retail, minimarket, dan supermarket dengan kebutuhan manajemen stok dan kasir yang kompleks.',
        icon: <Store className="w-6 h-6" />
    },
    {
        title: 'F&B / Restoran',
        description: 'Solusi lengkap untuk restoran, kafe, dan warung makan dengan fitur order-taking dan kitchen display.',
        icon: <Zap className="w-6 h-6" />
    },
    {
        title: 'Service Business',
        description: 'Cocok untuk bisnis jasa seperti laundry, bengkel, dan salon dengan manajemen appointment dan service tracking.',
        icon: <Settings className="w-6 h-6" />
    },
    {
        title: 'Multi-Outlet',
        description: 'Kelola beberapa cabang dari satu dashboard terpusat dengan reporting konsolidated.',
        icon: <TrendingUp className="w-6 h-6" />
    }
];

const pricing = [
    {
        name: 'Starter',
        price: 'Rp 500.000',
        period: '/bulan',
        description: 'Untuk bisnis kecil yang baru mulai',
        features: [
            '1 Outlet',
            '2 User Kasir',
            'Manajemen Inventaris Basic',
            'Laporan Harian',
            'Support Email',
            'Cloud Storage 5GB'
        ],
        excluded: ['Manajemen Karyawan', 'Multi Outlet', 'Custom Report', 'API Access']
    },
    {
        name: 'Professional',
        price: 'Rp 1.500.000',
        period: '/bulan',
        popular: true,
        description: 'Untuk bisnis yang sedang berkembang',
        features: [
            '5 Outlet',
            '10 User Kasir',
            'Manajemen Inventaris Advanced',
            'Laporan Lengkap',
            'Manajemen Karyawan',
            'Support Prioritas',
            'Training On-site',
            'Cloud Storage 50GB',
            'Multi Payment Gateway'
        ],
        excluded: ['Custom Development', 'Dedicated Server', 'API Access']
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'Untuk bisnis skala besar',
        features: [
            'Unlimited Outlet',
            'Unlimited User',
            'Custom Features',
            'Dedicated Server',
            'SLA 99.9%',
            'Account Manager',
            'Custom Integration',
            'API Access',
            'White Label Option',
            'Unlimited Cloud Storage'
        ],
        excluded: []
    }
];

export default function Paylo() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
            <Head title="CTECH Paylo - Solusi Kasir & Manajemen Bisnis" />
            
            <PublicNavbar isLandingPage={false} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <Link href="/produk" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium">
                                Kembali ke Produk
                            </Link>
                            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
                                CTECH Paylo
                            </h1>
                            <p className="text-2xl text-blue-600 font-semibold mb-6">
                                Solusi Bisnis All-in-One
                            </p>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Aplikasi bisnis terintegrasi yang menggabungkan kasir offline-first, manajemen inventaris, 
                                absensi karyawan, dan dashboard analisis bisnis dalam satu platform yang mudah digunakan. 
                                Dirancang untuk membantu UMKM hingga enterprise beroperasi lebih efisien.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a 
                                    href="#kontak" 
                                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transform hover:-translate-y-0.5"
                                >
                                    Mulai Gratis 14 Hari
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
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 shadow-2xl">
                                <div className="bg-white rounded-2xl p-6 shadow-inner">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                            <Smartphone className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">Dashboard Overview</div>
                                            <div className="text-sm text-slate-500">Real-time analytics</div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                                            <BarChart3 className="w-12 h-12 text-blue-400" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-green-50 rounded-xl p-4">
                                                <div className="text-2xl font-bold text-green-600">+24%</div>
                                                <div className="text-sm text-slate-600">Penjualan</div>
                                            </div>
                                            <div className="bg-blue-50 rounded-xl p-4">
                                                <div className="text-2xl font-bold text-blue-600">156</div>
                                                <div className="text-sm text-slate-600">Transaksi</div>
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
                            Semua yang Anda butuhkan untuk mengelola bisnis dalam satu aplikasi
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {features.map((feature, idx) => (
                            <div 
                                key={idx}
                                className="bg-slate-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-slate-100"
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white mb-6">
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

            {/* Benefits Section */}
            <section className="py-24 px-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                            Mengapa CTECH Paylo?
                        </h2>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                            Manfaat nyata yang akan Anda rasakan setelah menggunakan CTECH Paylo
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

            {/* Use Cases Section */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                            Cocok untuk Berbagai Bisnis
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            CTECH Paylo dirancang untuk fleksibel dan dapat disesuaikan dengan berbagai jenis bisnis
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {useCases.map((useCase, idx) => (
                            <div 
                                key={idx}
                                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 mb-4">
                                    {useCase.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">
                                    {useCase.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {useCase.description}
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
                            Pilih paket yang sesuai dengan kebutuhan bisnis Anda
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {pricing.map((plan, idx) => (
                            <div 
                                key={idx}
                                className={`relative rounded-2xl p-8 ${
                                    plan.popular 
                                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl scale-105' 
                                        : 'bg-white border-2 border-slate-200 hover:border-blue-300'
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
                                <p className={`text-sm mb-6 ${plan.popular ? 'text-blue-100' : 'text-slate-500'}`}>
                                    {plan.description}
                                </p>
                                <div className="mb-6">
                                    <span className={`text-4xl font-extrabold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                                        {plan.price}
                                    </span>
                                    {plan.period && (
                                        <span className={`text-sm ${plan.popular ? 'text-blue-100' : 'text-slate-500'}`}>
                                            {plan.period}
                                        </span>
                                    )}
                                </div>
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, fidx) => (
                                        <li key={fidx} className="flex items-start gap-3">
                                            <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-blue-200' : 'text-green-500'}`} />
                                            <span className={`text-sm ${plan.popular ? 'text-blue-50' : 'text-slate-600'}`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                    {plan.excluded.map((feature, fidx) => (
                                        <li key={fidx} className="flex items-start gap-3 opacity-50">
                                            <div className={`w-5 h-5 flex-shrink-0 mt-0.5 flex items-center justify-center ${plan.popular ? 'text-blue-200' : 'text-slate-400'}`}>
                                                ×
                                            </div>
                                            <span className={`text-sm ${plan.popular ? 'text-blue-50' : 'text-slate-600'}`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <button 
                                    className={`w-full py-4 rounded-xl font-semibold transition-all ${
                                        plan.popular 
                                            ? 'bg-white text-blue-600 hover:bg-blue-50' 
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
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
            <section id="kontak" className="py-24 px-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                        Siap Transformasi Bisnis Anda?
                    </h2>
                    <p className="text-xl mb-10 text-blue-50 leading-relaxed">
                        Coba gratis selama 14 hari dan rasakan perbedaannya. Tanpa kartu kredit, 
                        tanpa komitmen, cancel kapan saja.
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
                            href="https://wa.me/6282293118410?text=Halo%20CTECH,%20saya%20ingin%20konsultasi%20tentang%20CTECH%20Paylo"
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
                    href="https://wa.me/6282293118410?text=Halo%20CTECH,%20saya%20ingin%20konsultasi%20tentang%20CTECH%20Paylo"
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

import { Head, Link } from '@inertiajs/react';
import { 
    Smartphone, 
    Store, 
    Users, 
    BarChart3, 
    Camera, 
    Zap, 
    Shield, 
    Clock,
    CheckCircle2,
    ArrowRight,
    Star
} from 'lucide-react';
import PublicNavbar from '@/components/public-navbar';

const products = [
    {
        id: 'paylo',
        name: 'CTECH Paylo',
        tagline: 'Solusi Bisnis All-in-One',
        description: 'Aplikasi bisnis terintegrasi yang menggabungkan kasir offline-first, manajemen inventaris, absensi karyawan, dan dashboard analisis bisnis dalam satu platform yang mudah digunakan.',
        icon: <Store className="w-8 h-8" />,
        color: 'from-blue-600 to-blue-700',
        features: [
            {
                icon: <Smartphone className="w-6 h-6" />,
                title: 'Kasir Offline-First',
                description: 'Transaksi tetap berjalan lancar meskipun tanpa koneksi internet. Data akan tersinkronisasi secara otomatis saat koneksi kembali.'
            },
            {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'Dashboard Analisis Bisnis',
                description: 'Pantau performa bisnis secara real-time dengan grafik dan laporan yang mudah dipahami untuk pengambilan keputusan yang lebih baik.'
            },
            {
                icon: <Users className="w-6 h-6" />,
                title: 'Manajemen Karyawan',
                description: 'Sistem absensi dengan GPS tracking, manajemen shift, dan perhitungan gaji otomatis untuk efisiensi HR.'
            },
            {
                icon: <Store className="w-6 h-6" />,
                title: 'Inventaris Cerdas',
                description: 'Tracking stok real-time dengan notifikasi otomatis ketika barang menipis, serta manajemen supplier yang terintegrasi.'
            },
            {
                icon: <Shield className="w-6 h-6" />,
                title: 'Keamanan Data',
                description: 'Enkripsi data tingkat lanjut dan backup otomatis untuk memastikan data bisnis Anda selalu aman.'
            },
            {
                icon: <Clock className="w-6 h-6" />,
                title: 'Laporan Otomatis',
                description: 'Generate laporan penjualan, keuangan, dan inventaris secara otomatis dalam berbagai format.'
            }
        ],
        benefits: [
            'Meningkatkan efisiensi operasional hingga 60%',
            'Mengurangi kesalahan manusia dalam pencatatan',
            'Pengambilan keputusan berbasis data real-time',
            'Hemat biaya operasional jangka panjang',
            'Mudah digunakan tanpa pelatihan teknis'
        ],
        pricing: {
            title: 'Paket Fleksibel',
            plans: [
                {
                    name: 'Starter',
                    price: 'Rp 500.000',
                    period: '/bulan',
                    features: [
                        '1 Outlet',
                        '2 User Kasir',
                        'Manajemen Inventaris Basic',
                        'Laporan Harian',
                        'Support Email'
                    ]
                },
                {
                    name: 'Professional',
                    price: 'Rp 1.500.000',
                    period: '/bulan',
                    popular: true,
                    features: [
                        '5 Outlet',
                        '10 User Kasir',
                        'Manajemen Inventaris Advanced',
                        'Laporan Lengkap',
                        'Manajemen Karyawan',
                        'Support Prioritas',
                        'Training On-site'
                    ]
                },
                {
                    name: 'Enterprise',
                    price: 'Custom',
                    period: '',
                    features: [
                        'Unlimited Outlet',
                        'Unlimited User',
                        'Custom Features',
                        'Dedicated Server',
                        'SLA 99.9%',
                        'Account Manager',
                        'Custom Integration'
                    ]
                }
            ]
        }
    },
    {
        id: 'booth',
        name: 'CTECH Booth',
        tagline: 'Platform Photobooth Modern',
        description: 'Platform photobooth terintegrasi dengan sistem booking, galeri online, manajemen lokasi, dan fitur sharing sosial untuk meningkatkan pengalaman pelanggan dan revenue bisnis photobooth Anda.',
        icon: <Camera className="w-8 h-8" />,
        color: 'from-purple-600 to-purple-700',
        features: [
            {
                icon: <Smartphone className="w-6 h-6" />,
                title: 'Booking Online',
                description: 'Sistem reservasi slot waktu yang memudahkan pelanggan memesan sesi photobooth secara online dengan konfirmasi otomatis.'
            },
            {
                icon: <Zap className="w-6 h-6" />,
                title: 'Galeri Cloud',
                description: 'Foto hasil sesi otomatis diupload ke cloud dan dapat diakses oleh pelanggan melalui link personal dengan password protection.'
            },
            {
                icon: <Users className="w-6 h-6" />,
                title: 'Multi-Lokasi',
                description: 'Kelola beberapa lokasi photobooth dari satu dashboard terpusat dengan tracking performa per lokasi.'
            },
            {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'Analytics & Insights',
                description: 'Pantau booking rate, peak hours, dan preferensi pelanggan untuk optimasi jadwal dan pricing strategy.'
            },
            {
                icon: <Star className="w-6 h-6" />,
                title: 'Social Sharing',
                description: 'Fitur sharing otomatis ke Instagram, Facebook, dan WhatsApp dengan custom branding untuk meningkatkan reach.'
            },
            {
                icon: <Clock className="w-6 h-6" />,
                title: 'Payment Integration',
                description: 'Terima pembayaran online via QRIS, transfer bank, dan e-wallet dengan notifikasi otomatis.'
            }
        ],
        benefits: [
            'Dipercaya oleh 10+ lokasi photobooth di Kendari',
            'Meningkatkan booking rate hingga 40%',
            'Mengurangi no-show hingga 70%',
            'Manajemen operasional lebih efisien',
            'Customer experience yang lebih modern'
        ],
        pricing: {
            title: 'Paket Berdasarkan Lokasi',
            plans: [
                {
                    name: 'Single Booth',
                    price: 'Rp 750.000',
                    period: '/bulan',
                    features: [
                        '1 Lokasi',
                        'Unlimited Booking',
                        'Galeri Cloud 10GB',
                        'Basic Analytics',
                        'Support Email'
                    ]
                },
                {
                    name: 'Multi Booth',
                    price: 'Rp 2.000.000',
                    period: '/bulan',
                    popular: true,
                    features: [
                        'Hingga 5 Lokasi',
                        'Unlimited Booking',
                        'Galeri Cloud 50GB',
                        'Advanced Analytics',
                        'Custom Branding',
                        'Support Prioritas',
                        'Training Staff'
                    ]
                },
                {
                    name: 'Franchise',
                    price: 'Custom',
                    period: '',
                    features: [
                        'Unlimited Lokasi',
                        'White Label Solution',
                        'Custom Domain',
                        'API Access',
                        'Dedicated Support',
                        'Custom Development',
                        'Revenue Sharing Model'
                    ]
                }
            ]
        }
    }
];

export default function Products() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
            <Head title="Produk CTECH - Solusi Bisnis Digital" />
            
            <PublicNavbar isLandingPage={false} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
                            Produk Unggulan
                        </span>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
                            Solusi Digital untuk
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                Pertumbuhan Bisnis Anda
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                            Kami mengembangkan produk teknologi yang dirancang khusus untuk membantu bisnis 
                            beroperasi lebih efisien, modern, dan terukur. Dari UMKM hingga enterprise, 
                            solusi kami siap mendukung transformasi digital Anda.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a 
                                href="#kontak" 
                                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transform hover:-translate-y-0.5"
                            >
                                Konsultasi Gratis
                                <ArrowRight className="w-5 h-5" />
                            </a>
                            <a 
                                href="#paylo" 
                                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 px-8 py-4 rounded-full font-semibold transition-all border-2 border-slate-200 hover:border-slate-300"
                            >
                                Pelajari Lebih Lanjut
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            {products.map((product, index) => (
                <section 
                    key={product.id} 
                    id={product.id}
                    className={`py-24 px-6 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                >
                    <div className="max-w-7xl mx-auto">
                        {/* Product Header */}
                        <div className="text-center mb-16">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${product.color} text-white mb-6 shadow-lg`}>
                                {product.icon}
                            </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                                {product.name}
                            </h2>
                            <p className="text-xl text-blue-600 font-semibold mb-6">
                                {product.tagline}
                            </p>
                            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
                                {product.description}
                            </p>
                            <Link 
                                href={`/produk/${product.id}`}
                                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Lihat Detail Lengkap
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                            {product.features.map((feature, idx) => (
                                <div 
                                    key={idx}
                                    className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
                                >
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${product.color} text-white mb-6 group-hover:scale-110 transition-transform`}>
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
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 mb-20 text-white">
                            <h3 className="text-3xl font-bold mb-8 text-center">
                                Mengapa Memilih {product.name}?
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {product.benefits.map((benefit, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mt-1">
                                            <CheckCircle2 className="w-5 h-5 text-white" />
                                        </div>
                                        <p className="text-lg leading-relaxed">
                                            {benefit}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pricing */}
                        <div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-2 text-center">
                                {product.pricing.title}
                            </h3>
                            <p className="text-slate-600 text-center mb-12">
                                Pilih paket yang sesuai dengan kebutuhan bisnis Anda
                            </p>
                            <div className="grid md:grid-cols-3 gap-8">
                                {product.pricing.plans.map((plan, idx) => (
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
                                        <h4 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                                            {plan.name}
                                        </h4>
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
                    </div>
                </section>
            ))}

            {/* CTA Section */}
            <section id="kontak" className="py-24 px-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                        Siap Mengubah Bisnis Anda?
                    </h2>
                    <p className="text-xl mb-10 text-blue-50 leading-relaxed">
                        Konsultasikan kebutuhan bisnis Anda dengan tim kami. Kami siap membantu 
                        menemukan solusi yang paling tepat untuk pertumbuhan bisnis Anda.
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
            <footer className="bg-slate-900 text-white py-12 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <img src="/logo/logo-web.png" alt="CTECH Logo" className="h-8" />
                        <span className="font-bold text-xl">CTECH</span>
                    </div>
                    <p className="text-slate-400 mb-6">
                        Creative Tech Studio - Solusi Digital untuk Pertumbuhan Bisnis Anda
                    </p>
                    <p className="text-slate-500 text-sm">
                        © 2024 CTECH. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

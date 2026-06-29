import { Head, Link } from '@inertiajs/react';
import { PremiumNavbar as PublicNavbar } from '@/components/ui/PremiumNavbar';
import PublicFooter from '@/components/public-footer';
import { Camera, Image as ImageIcon, Smartphone, Cloud, ArrowRight, CheckCircle2, MessageCircle, Aperture, Settings, Zap } from 'lucide-react';

export default function PhotoboothSolution() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-pink-500 selection:text-white">
            <Head title="Solusi Software Photobooth Profesional - CTECH" />
            
            <PublicNavbar isLandingPage={false} />

            {/* Hero Section */}
            <section className="pt-32 pb-24 px-6 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-purple-600/20 to-slate-950 opacity-80"></div>
                
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/20 text-pink-300 text-sm font-bold tracking-wider uppercase mb-6 border border-pink-500/30">
                            <Camera className="w-4 h-4" /> Khusus Bisnis Photobooth
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                            Tingkatkan Kualitas <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Bisnis Photobooth</span> Anda
                        </h1>
                        <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                            Software photobooth kustom yang stabil, fully-branded dengan logo Anda, dan dilengkapi cloud gallery otomatis. Bebaskan diri dari software mahal dengan lisensi bulanan.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a 
                                href="https://wa.me/6282293118410?text=Halo%20CTECH,%20saya%20ingin%20konsultasi%20mengenai%20software%20photobooth"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transform hover:-translate-y-1"
                            >
                                <MessageCircle className="w-5 h-5" /> Hubungi Kami
                            </a>
                            <Link 
                                href="#fitur"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 px-8 py-4 rounded-full font-bold transition-all"
                            >
                                Pelajari Lebih Lanjut
                            </Link>
                        </div>
                    </div>
                    
                    <div className="relative hidden lg:block">
                        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/30 to-purple-500/30 blur-3xl rounded-full"></div>
                        <div className="bg-slate-900 border-8 border-slate-800 rounded-[3rem] p-4 shadow-2xl relative z-10 w-[300px] mx-auto aspect-[9/16] flex flex-col justify-between overflow-hidden">
                            {/* App Mockup */}
                            <div className="absolute top-0 left-0 right-0 bg-slate-800 h-16 flex items-center justify-center z-20">
                                <span className="font-bold text-lg tracking-widest uppercase">Your Brand</span>
                            </div>
                            <div className="mt-16 flex-grow flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')] bg-cover bg-center opacity-50"></div>
                                <div className="relative z-10 text-center">
                                    <Aperture className="w-16 h-16 text-white/50 mx-auto mb-4 animate-pulse" />
                                    <p className="font-bold">Tap to Start</p>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900 to-transparent z-20 flex items-end justify-center pb-6">
                                <div className="w-16 h-16 rounded-full border-4 border-white/50 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-white"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Section */}
            <section className="py-24 bg-white px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-pink-600 font-bold tracking-wider uppercase text-sm mb-4 block">Mengapa Ganti Software?</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
                            Lelah dengan Software yang Sering Error Saat Event?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Crash di Tengah Acara",
                                desc: "Klien komplain karena aplikasi hang saat antrian sedang panjang. Reputasi bisnis Anda jadi taruhannya.",
                                icon: <Zap className="w-8 h-8 text-red-500" />
                            },
                            {
                                title: "Watermark & Kurang Custom",
                                desc: "Menggunakan software pasaran membuat UI tidak bisa 100% disesuaikan dengan branding perusahaan Anda.",
                                icon: <ImageIcon className="w-8 h-8 text-purple-500" />
                            },
                            {
                                title: "Biaya Langganan Mahal",
                                desc: "Semakin banyak mesin photobooth yang Anda miliki, semakin bengkak biaya lisensi bulanan yang harus dibayar.",
                                icon: <Settings className="w-8 h-8 text-orange-500" />
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-slate-50 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features/Solution Section */}
            <section id="fitur" className="py-24 bg-slate-900 text-white px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col-reverse lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                                        <Cloud className="w-10 h-10 text-pink-400 mb-4" />
                                        <h4 className="font-bold text-lg mb-2">Cloud Sync</h4>
                                        <p className="text-sm text-slate-400">Foto otomatis terunggah ke galeri online klien via QR Code.</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-pink-600 to-purple-600 p-6 rounded-2xl shadow-lg">
                                        <ImageIcon className="w-10 h-10 text-white mb-4" />
                                        <h4 className="font-bold text-lg mb-2">Custom Template</h4>
                                        <p className="text-sm text-pink-100">Bebas atur layout cetak sesuai frame/event.</p>
                                    </div>
                                </div>
                                <div className="space-y-4 mt-8">
                                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                                        <Smartphone className="w-10 h-10 text-cyan-400 mb-4" />
                                        <h4 className="font-bold text-lg mb-2">White Label UI</h4>
                                        <p className="text-sm text-slate-400">Antarmuka aplikasi 100% menggunakan logo dan warna brand Anda.</p>
                                    </div>
                                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                                        <Zap className="w-10 h-10 text-yellow-400 mb-4" />
                                        <h4 className="font-bold text-lg mb-2">DSLR & Webcam</h4>
                                        <p className="text-sm text-slate-400">Kompatibel dengan berbagai kamera untuk hasil maksimal.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 space-y-8">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
                                    Software Photobooth yang Dibangun Khusus untuk Anda
                                </h2>
                                <p className="text-lg text-slate-400 leading-relaxed">
                                    Tingkatkan nilai jual bisnis photobooth Anda di mata klien corporate dan wedding dengan software yang stabil, elegan, dan profesional.
                                </p>
                            </div>

                            <ul className="space-y-4">
                                {[
                                    "Tidak ada biaya lisensi per-mesin bulanan",
                                    "Operasional stabil meski tanpa koneksi internet (Offline Mode)",
                                    "Support berbagai tipe printer (DNP, Sinfonia, dll)",
                                    "Dashboard analitik: pantau jumlah cetak foto di semua mesin"
                                ].map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-pink-500 shrink-0" />
                                        <span className="text-slate-300 font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 bg-white text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 tracking-tight">
                        Bangun Aset Digital Bisnis Photobooth Anda
                    </h2>
                    <p className="text-xl mb-12 text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Jangan biarkan bisnis Anda bergantung pada software pihak ketiga yang mahal. Miliki software sendiri dan tingkatkan profitabilitas Anda.
                    </p>
                    <a 
                        href="https://wa.me/6282293118410?text=Halo%20CTECH,%20saya%20tertarik%20dengan%20solusi%20software%20photobooth"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-pink-600 transition-all shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-500/30"
                    >
                        <MessageCircle className="w-6 h-6" /> Hubungi Tim Kami
                    </a>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}

import { Link } from '@inertiajs/react';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';

export default function PublicFooter() {
    return (
        <>
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
                            <li><Link href="/layanan" className="hover:text-blue-400 transition-colors">Custom Software Development</Link></li>
                            <li><Link href="/solusi/retail" className="hover:text-blue-400 transition-colors">Sistem ERP & POS</Link></li>
                            <li><Link href="/layanan" className="hover:text-blue-400 transition-colors">Mobile App Development</Link></li>
                            <li><Link href="/layanan" className="hover:text-blue-400 transition-colors">Digital & Creative Agency</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Perusahaan</h4>
                        <ul className="space-y-3">
                            <li><Link href="/tentang" className="hover:text-blue-400 transition-colors">Tentang Kami</Link></li>
                            <li><Link href="/portfolio" className="hover:text-blue-400 transition-colors">Case Study & Portfolio</Link></li>
                            <li><Link href="/berita" className="hover:text-blue-400 transition-colors">Berita & Insight</Link></li>
                            <li><Link href="/kontak" className="hover:text-blue-400 transition-colors">Hubungi Kami</Link></li>
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
                                <span className="text-sm">+62 822 9311 8410</span>
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
                    </div>
                </div>
            </footer>

            {/* WhatsApp Floating Button */}
            <div className="fixed bottom-6 right-6 z-50 group">
                <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-green-600 text-white p-4 rounded-t-2xl flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                            <MessageCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h4 className="font-bold">CTECH Support</h4>
                            <p className="text-xs text-green-100">Online</p>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50">
                        <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm mb-2 max-w-[90%]">
                            <p className="text-sm text-slate-700">
                                Halo! 👋 Ada yang bisa kami bantu? Silakan kirim pesan untuk konsultasi gratis.
                            </p>
                            <p className="text-xs text-slate-400 mt-1">{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
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
                <a 
                    href="https://wa.me/6282293118410?text=Halo%20CTECH,%20saya%20ingin%20konsultasi%20tentang%20layanan%20Anda"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                >
                    <MessageCircle className="w-7 h-7" />
                </a>
            </div>
        </>
    );
}

export default function PublicFooter() {
    return (
        <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">
                                CT
                            </div>
                            <span className="font-bold text-xl text-white tracking-wider">CTECH</span>
                        </div>
                        <p className="mb-6 leading-relaxed">Solusi digital kreatif untuk bisnis modern. Berfokus pada inovasi dan kualitas.</p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"><i className="fa-brands fa-instagram"></i></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"><i className="fa-brands fa-linkedin-in"></i></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"><i className="fa-brands fa-youtube"></i></a>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="text-white font-bold mb-6">Navigasi</h4>
                        <ul className="space-y-4">
                            <li><a href="/" className="hover:text-white transition-colors">Beranda</a></li>
                            <li><a href="/tentang" className="hover:text-white transition-colors">Tentang Kami</a></li>
                            <li><a href="/layanan" className="hover:text-white transition-colors">Layanan</a></li>
                            <li><a href="/portfolio" className="hover:text-white transition-colors">Portofolio</a></li>
                            <li><a href="/proses" className="hover:text-white transition-colors">Proses Kerja</a></li>
                            <li><a href="/berita" className="hover:text-white transition-colors">Blog</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="text-white font-bold mb-6">Layanan</h4>
                        <ul className="space-y-4">
                            <li><a href="/layanan" className="hover:text-white transition-colors">Software Development</a></li>
                            <li><a href="/layanan" className="hover:text-white transition-colors">Video Production</a></li>
                            <li><a href="/layanan" className="hover:text-white transition-colors">3D Design</a></li>
                            <li><a href="/layanan" className="hover:text-white transition-colors">3D Artist</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="text-white font-bold mb-6">Kontak</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-sm mt-1 shrink-0">mail</span>
                                <span>hello@ctechagency.com</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-sm mt-1 shrink-0">call</span>
                                <span>+62 812-3456-7890</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-sm mt-1 shrink-0">location_on</span>
                                <span>Jl. Teknologi No. 10, Jakarta Selatan, DKI Jakarta 12345</span>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
                    <p>&copy; {new Date().getFullYear()} CTECH AGENCY. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
                        <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

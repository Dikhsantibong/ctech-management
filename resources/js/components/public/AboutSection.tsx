export default function AboutSection() {
    return (
        <section id="tentang" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="mb-4">
                    <span className="text-blue-600 font-bold tracking-wider text-sm">TENTANG KAMI</span>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                            Tentang CTECH AGENCY
                        </h2>
                        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                            CTECH AGENCY adalah agensi kreatif berbasis teknologi yang berfokus pada solusi digital inovatif untuk membantu bisnis bertransformasi dan bersaing di era digital.
                            <br/><br/>
                            Kami menggabungkan teknologi, kreativitas, dan strategi untuk menghasilkan produk digital yang berdampak dan bernilai tinggi.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-6 mb-10">
                            <div>
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3">
                                    <span className="material-symbols-outlined">lightbulb</span>
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1">Inovatif</h4>
                                <p className="text-sm text-slate-600">Selalu menghadirkan ide baru dan solusi kreatif.</p>
                            </div>
                            <div>
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3">
                                    <span className="material-symbols-outlined">verified</span>
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1">Berkualitas</h4>
                                <p className="text-sm text-slate-600">Mengutamakan kualitas dalam setiap detail.</p>
                            </div>
                            <div>
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3">
                                    <span className="material-symbols-outlined">diversity_3</span>
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1">Kolaboratif</h4>
                                <p className="text-sm text-slate-600">Bekerja bersama klien sebagai partner.</p>
                            </div>
                            <div>
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3">
                                    <span className="material-symbols-outlined">handshake</span>
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1">Terpercaya</h4>
                                <p className="text-sm text-slate-600">Komitmen dan komunikasi yang transparan.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800" alt="Office 1" className="rounded-2xl object-cover h-full w-full shadow-lg" />
                        <div className="space-y-4">
                            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" alt="Team" className="rounded-2xl object-cover h-48 w-full shadow-lg" />
                            <div className="bg-blue-600 text-white rounded-2xl p-6 flex flex-col justify-center h-48 shadow-lg">
                                <span className="text-4xl font-black mb-2">10+</span>
                                <span className="font-semibold">Tahun Pengalaman di Industri Digital</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="mt-16 bg-white rounded-2xl shadow-sm border border-slate-100 p-10 flex flex-wrap justify-around items-center gap-8">
                    <div className="text-center">
                        <div className="text-4xl font-black text-blue-600 mb-2">5+</div>
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tahun Pengalaman</div>
                    </div>
                    <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
                    <div className="text-center">
                        <div className="text-4xl font-black text-blue-600 mb-2">50+</div>
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Proyek Selesai</div>
                    </div>
                    <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
                    <div className="text-center">
                        <div className="text-4xl font-black text-blue-600 mb-2">30+</div>
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Klien Puas</div>
                    </div>
                    <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
                    <div className="text-center">
                        <div className="text-4xl font-black text-blue-600 mb-2">15+</div>
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Anggota Tim</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

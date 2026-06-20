export default function ServicesSection() {
    return (
        <section id="layanan" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="mb-4">
                    <span className="text-blue-600 font-bold tracking-wider text-sm">LAYANAN</span>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                            Layanan Kami
                        </h2>
                        <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                            Kami menyediakan layanan profesional di bidang teknologi dan kreatif untuk berbagai kebutuhan bisnis Anda.
                        </p>
                        
                        <div className="space-y-8">
                            <div className="flex gap-6 group">
                                <div className="w-16 h-16 shrink-0 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined text-3xl">code</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Software Development</h3>
                                    <p className="text-slate-600 leading-relaxed">Pembuatan aplikasi web, mobile, dan sistem informasi yang custom sesuai kebutuhan bisnis.</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-6 group">
                                <div className="w-16 h-16 shrink-0 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined text-3xl">videocam</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Video Production</h3>
                                    <p className="text-slate-600 leading-relaxed">Produksi video company profile, iklan, event, cinematic, hingga konten media sosial.</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-6 group">
                                <div className="w-16 h-16 shrink-0 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined text-3xl">view_in_ar</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">3D Design</h3>
                                    <p className="text-slate-600 leading-relaxed">Desain 3D arsitektur, interior, produk, dan visualisasi realistis untuk presentasi atau pemasaran.</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-6 group">
                                <div className="w-16 h-16 shrink-0 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined text-3xl">brush</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">3D Artist</h3>
                                    <p className="text-slate-600 leading-relaxed">Pembuatan 3D model, karakter, aset game, texturing, rigging, hingga animasi.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid gap-4">
                        <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800" alt="Coding" className="rounded-2xl object-cover h-48 w-full shadow-md" />
                        <img src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800" alt="Video" className="rounded-2xl object-cover h-48 w-full shadow-md" />
                        <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800" alt="3D" className="rounded-2xl object-cover h-48 w-full shadow-md" />
                    </div>
                </div>
            </div>
        </section>
    );
}

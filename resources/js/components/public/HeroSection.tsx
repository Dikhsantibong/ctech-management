import { Link } from '@inertiajs/react';

export default function HeroSection() {
    return (
        <section className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 shadow-sm text-sm font-semibold text-blue-700">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                        CTECH AGENCY
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Solusi Digital <span className="text-blue-600">Kreatif</span><br/>
                        Untuk <span className="text-blue-900">Bisnis Modern</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                        Kami menyediakan layanan pengembangan software, produksi video, desain 3D 
                        dan 3D artist profesional untuk membantu bisnis Anda berkembang.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        <a href="#kontak" className="bg-blue-600 text-white px-8 py-4 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all font-semibold shadow-lg shadow-blue-200">
                            Konsultasi Gratis
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </a>
                        <a href="#portfolio" className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all font-semibold">
                            Lihat Portofolio <span className="material-symbols-outlined text-sm align-middle ml-1">chevron_right</span>
                        </a>
                    </div>
                </div>
                <div className="relative">
                    {/* Decorative elements for the right side mimicking the image */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50 rounded-full blur-3xl -z-10"></div>
                    
                    <div className="grid grid-cols-2 gap-4 relative z-10">
                        <div className="space-y-4 translate-y-12">
                            <div className="bg-white p-4 rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-100 flex items-center gap-4 animate-[bounce_4s_ease-in-out_infinite]">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined">code</span>
                                </div>
                                <span className="font-semibold text-slate-800">Software<br/>Development</span>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-100 flex items-center gap-4 animate-[bounce_5s_ease-in-out_infinite_reverse]">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined">videocam</span>
                                </div>
                                <span className="font-semibold text-slate-800">Video<br/>Production</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-white p-4 rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-100 flex items-center gap-4 animate-[bounce_6s_ease-in-out_infinite]">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined">view_in_ar</span>
                                </div>
                                <span className="font-semibold text-slate-800">3D Design</span>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-100 flex items-center gap-4 animate-[bounce_4.5s_ease-in-out_infinite_reverse]">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined">brush</span>
                                </div>
                                <span className="font-semibold text-slate-800">3D Artist</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trusted By / Stats Strip inside Hero as per image */}
            <div className="mt-24 pt-8 border-t border-slate-100">
                <p className="text-sm text-slate-500 font-semibold mb-6">Dipercaya oleh berbagai perusahaan</p>
                <div className="flex flex-wrap items-center gap-8 md:gap-16 opacity-60 grayscale">
                    {/* Placeholder logos */}
                    <div className="flex items-center gap-2 font-bold text-xl"><span className="material-symbols-outlined">lightbulb</span> Inovasi</div>
                    <div className="flex items-center gap-2 font-bold text-xl"><span className="material-symbols-outlined">domain</span> DIGITECH</div>
                    <div className="flex items-center gap-2 font-bold text-xl"><span className="material-symbols-outlined">rocket_launch</span> NEXORA</div>
                    <div className="flex items-center gap-2 font-bold text-xl"><span className="material-symbols-outlined">architecture</span> BuildUp</div>
                </div>
            </div>
        </section>
    );
}

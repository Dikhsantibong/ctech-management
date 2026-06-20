export default function ProcessSection() {
    const steps = [
        { num: '01', title: 'Konsultasi', desc: 'Kami memahami kebutuhan dan tujuan proyek Anda.' },
        { num: '02', title: 'Perencanaan', desc: 'Menyusun strategi, konsep, dan timeline proyek.' },
        { num: '03', title: 'Eksekusi', desc: 'Tim kami mulai mengerjakan sesuai rencana yang disepakati.' },
        { num: '04', title: 'Review', desc: 'Kami melakukan review dan revisi untuk hasil yang optimal.' },
        { num: '05', title: 'Delivery', desc: 'Proyek diserahkan dan siap digunakan sesuai kebutuhan Anda.' },
    ];

    return (
        <section id="proses-kerja" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="mb-4">
                    <span className="text-blue-600 font-bold tracking-wider text-sm">PROSES KERJA</span>
                </div>
                
                <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                    Proses Kerja Kami
                </h2>
                <p className="text-slate-600 text-lg mb-16 max-w-2xl leading-relaxed">
                    Alur kerja yang terstruktur untuk menghasilkan solusi terbaik.
                </p>
                
                <div className="relative mb-24 hidden md:block">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 -z-10"></div>
                    <div className="grid grid-cols-5 gap-4">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center group">
                                <div className="w-16 h-16 bg-white border-4 border-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-6 group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                    {step.num}
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">{step.title}</h4>
                                <p className="text-sm text-slate-600 px-2">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile version */}
                <div className="md:hidden space-y-8 mb-16 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                    {steps.map((step, idx) => (
                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                {step.num}
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                <h4 className="font-bold text-slate-900 mb-1">{step.title}</h4>
                                <p className="text-sm text-slate-600">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-blue-900 rounded-2xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 bg-blue-800 text-blue-300 rounded-2xl flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-4xl">rocket_launch</span>
                        </div>
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Siap Memulai Proyek Anda?</h3>
                            <p className="text-blue-200 text-lg">Konsultasikan ide Anda dengan tim kami sekarang juga.</p>
                        </div>
                    </div>
                    <a href="#kontak" className="shrink-0 bg-white text-blue-900 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-lg relative z-10">
                        Konsultasi Gratis <span className="material-symbols-outlined text-sm align-middle ml-2">arrow_forward</span>
                    </a>
                </div>
            </div>
        </section>
    );
}

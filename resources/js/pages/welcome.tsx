import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import PublicNavbar from '@/components/public-navbar';

export default function Welcome() {
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        // Micro-interactions
        const details = document.querySelectorAll('details');
        details.forEach((detail) => {
            detail.addEventListener('toggle', () => {
                if (detail.open) {
                    details.forEach((otherDetail) => {
                        if (otherDetail !== detail) otherDetail.removeAttribute('open');
                    });
                }
            });
        });

        // Simple scroll reveal effect for cards
        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-10');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.bento-grid > div, .grid > div').forEach(el => {
            el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
            if (observerRef.current) observerRef.current.observe(el);
        });

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, []);

    return (
        <>
            <Head>
                <title>CTECH | Solusi Software Enterprise & B2B</title>
            </Head>
            <style dangerouslySetInnerHTML={{ __html: `
                .material-symbols-outlined {
                    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                    vertical-align: middle;
                }
                .bento-grid {
                    display: grid;
                    grid-template-columns: repeat(12, 1fr);
                    gap: 24px;
                }
                .process-line {
                    background: repeating-linear-gradient(90deg, #bfdbfe 0, #bfdbfe 4px, transparent 4px, transparent 8px);
                }
                @media (max-width: 768px) {
                    .bento-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}} />

            <div className="bg-white text-slate-900 selection:bg-blue-600 selection:text-white font-body-md overflow-x-hidden pt-20">
                <PublicNavbar />

                {/* Hero Section */}
                <section className="pt-32 pb-stack-xl px-margin-desktop max-w-container-max mx-auto overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-stack-xl items-center">
                        <div className="space-y-stack-lg">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                                <span className="font-label-md text-label-md text-blue-700 font-bold">SIAP MENERIMA PROYEK BARU</span>
                            </div>
                            <h1 className="font-display-lg text-display-lg md:text-display-lg max-md:font-display-lg-mobile max-md:text-display-lg-mobile text-blue-900 tracking-tight">
                                Kami Membangun Software yang Menyelesaikan Masalah Bisnis Nyata
                            </h1>
                            <p className="font-body-lg text-body-lg text-slate-600 max-w-xl leading-relaxed">
                                Dirancang untuk performa, dibangun untuk skala besar. Kami menghadirkan solusi enterprise custom yang mengubah kerumitan operasional menjadi keunggulan kompetitif.
                            </p>
                            <div className="flex flex-wrap gap-stack-md pt-stack-sm">
                                <Link href="/kontak" className="bg-blue-700 text-white px-8 py-4 font-button text-button rounded-lg flex items-center gap-2 group hover:bg-blue-800 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
                                    Konsultasi Gratis
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </Link>
                                <Link href="/portfolio" className="bg-white border-2 border-blue-100 text-blue-700 px-8 py-4 font-button text-button rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all font-semibold shadow-sm">
                                    Lihat Portofolio
                                </Link>
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-blue-600/10 rounded-3xl blur-2xl group-hover:bg-blue-600/20 transition-colors duration-500"></div>
                            <div className="relative border-4 border-white rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
                                <img alt="Enterprise Dashboard" className="w-full h-auto object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg9TpkBO74LrL8da0rH4yVhDiP1ddUK9CLTumeFNt0i8_XEwNdYI4fne8EFLzN04qtpCqVxz6Sf_PZtXmr2oYHu5KGku0Xos4f2x2DQLEiaNpWZcUudJgtVMqMg2NteiHEfecpF6W-J5ZVVeHn8ki0aCAm-hY-0PsIDBbl4BQOAa-uXRcAgEARVMjAarQ8PE5Rk6oq7MiEO7Yb7ke3_YDV9R-9iCTQwb0GmcAP57_ux-YN8KdhYWyDDj4R1u3ipxsuiwR_BSvwtv38" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Client Trust & Stats */}
                <section className="py-stack-xl bg-slate-50 border-y border-blue-100">
                    <div className="max-w-container-max mx-auto px-margin-desktop">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-stack-xl">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-xl flex-grow opacity-60 grayscale hover:grayscale-0 transition-all duration-500 mix-blend-multiply">
                                <img src="/logos/company1.png" alt="Company 1" className="h-12 object-contain" />
                                <img src="/logos/company2.png" alt="Company 2" className="h-12 object-contain" />
                                <img src="/logos/company3.png" alt="Company 3" className="h-12 object-contain" />
                                <img src="/logos/company4.png" alt="Company 4" className="h-12 object-contain" />
                            </div>
                            <div className="flex gap-stack-xl border-l-2 border-blue-200 pl-stack-xl max-md:border-l-0 max-md:pl-0">
                                <div className="text-center">
                                    <div className="font-headline-md text-headline-md text-blue-700 font-extrabold">250+</div>
                                    <div className="font-label-md text-label-md text-slate-500 uppercase tracking-wider font-semibold">Proyek Selesai</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-headline-md text-headline-md text-blue-700 font-extrabold">10+</div>
                                    <div className="font-label-md text-label-md text-slate-500 uppercase tracking-wider font-semibold">Tahun Pengalaman</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-headline-md text-headline-md text-blue-700 font-extrabold">98%</div>
                                    <div className="font-label-md text-label-md text-slate-500 uppercase tracking-wider font-semibold">Kepuasan Klien</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Problems We Solve */}
                <section className="py-stack-xl px-margin-desktop max-w-container-max mx-auto">
                    <div className="text-center mb-stack-xl">
                        <h2 className="font-headline-md text-headline-md text-blue-900 mb-stack-sm font-bold">Tantangan yang Kami Selesaikan</h2>
                        <p className="font-body-md text-body-md text-slate-600 max-w-2xl mx-auto text-lg">Mengidentifikasi dan mengatasi hambatan teknis yang menahan potensi maksimal perusahaan Anda.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-gutter">
                        <div className="p-stack-lg border border-blue-100 rounded-xl hover:border-blue-400 transition-all duration-300 group bg-white shadow-sm hover:shadow-xl hover:-translate-y-1">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-stack-md group-hover:bg-blue-600 transition-colors">
                                <span className="material-symbols-outlined text-blue-600 text-3xl group-hover:text-white transition-colors">speed</span>
                            </div>
                            <h3 className="font-headline-sm text-headline-sm text-blue-900 mb-stack-sm font-bold">Inefisiensi Operasional</h3>
                            <p className="font-body-md text-body-md text-slate-600 leading-relaxed">Alur kerja terfragmentasi dan sistem usang yang menguras sumber daya serta memperlambat kelincahan organisasi.</p>
                        </div>
                        <div className="p-stack-lg border border-blue-100 rounded-xl hover:border-blue-400 transition-all duration-300 group bg-white shadow-sm hover:shadow-xl hover:-translate-y-1">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-stack-md group-hover:bg-blue-600 transition-colors">
                                <span className="material-symbols-outlined text-blue-600 text-3xl group-hover:text-white transition-colors">touch_app</span>
                            </div>
                            <h3 className="font-headline-sm text-headline-sm text-blue-900 mb-stack-sm font-bold">Proses Manual</h3>
                            <p className="font-body-md text-body-md text-slate-600 leading-relaxed">Tugas yang rentan terhadap human-error yang seharusnya bisa diotomatisasi untuk membebaskan tim Anda fokus pada inisiatif strategis.</p>
                        </div>
                        <div className="p-stack-lg border border-blue-100 rounded-xl hover:border-blue-400 transition-all duration-300 group bg-white shadow-sm hover:shadow-xl hover:-translate-y-1">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-stack-md group-hover:bg-blue-600 transition-colors">
                                <span className="material-symbols-outlined text-blue-600 text-3xl group-hover:text-white transition-colors">trending_up</span>
                            </div>
                            <h3 className="font-headline-sm text-headline-sm text-blue-900 mb-stack-sm font-bold">Hambatan Skalabilitas</h3>
                            <p className="font-body-md text-body-md text-slate-600 leading-relaxed">Infrastruktur yang goyah saat beban tinggi, mencegah bisnis Anda menangkap peluang pasar baru yang lebih besar.</p>
                        </div>
                    </div>
                </section>

                {/* Solutions Bento */}
                <section className="py-stack-xl bg-slate-50 border-t border-blue-100">
                    <div className="max-w-container-max mx-auto px-margin-desktop">
                        <div className="mb-stack-xl flex justify-between items-end">
                            <div>
                                <h2 className="font-headline-md text-headline-md text-blue-900 mb-stack-sm font-bold">Solusi Utama Kami</h2>
                                <p className="font-body-md text-body-md text-slate-600 text-lg">Layanan modular yang dirancang untuk ekosistem B2B modern.</p>
                            </div>
                        </div>
                        <div className="bento-grid">
                            {/* Main Card */}
                            <div className="col-span-12 md:col-span-6 bg-gradient-to-br from-blue-700 to-blue-900 p-stack-xl rounded-2xl text-white flex flex-col justify-between min-h-[400px] shadow-lg border border-blue-600 relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-30"></div>
                                <div className="relative z-10">
                                    <div className="font-label-md text-label-md text-blue-200 mb-stack-md font-bold tracking-widest">LAYANAN INTI</div>
                                    <h3 className="font-display-lg text-display-lg max-md:text-display-lg-mobile mb-stack-md leading-tight">Pengembangan Software Custom</h3>
                                    <p className="font-body-lg text-body-lg text-blue-100 max-w-md leading-relaxed">Rekayasa sistem eksklusif end-to-end yang akan menjadi aset paling berharga perusahaan Anda.</p>
                                </div>
                                <div className="flex gap-stack-md relative z-10 mt-8">
                                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-label-md font-label-md font-semibold tracking-wider">ARSITEKTUR</span>
                                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-label-md font-label-md font-semibold tracking-wider">ENGINEERING</span>
                                </div>
                            </div>
                            {/* Small Cards */}
                            <div className="col-span-12 md:col-span-3 bg-white border border-blue-100 p-stack-lg rounded-2xl hover:shadow-xl transition-all hover:border-blue-400 group">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-stack-md group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-2xl">language</span>
                                </div>
                                <h4 className="font-headline-sm text-headline-sm text-blue-900 mb-stack-sm font-bold">Aplikasi Web</h4>
                                <p className="font-body-sm text-body-sm text-slate-600 leading-relaxed">Aplikasi web berkinerja tinggi yang dibangun dengan framework terkini untuk jangkauan global.</p>
                            </div>
                            <div className="col-span-12 md:col-span-3 bg-white border border-blue-100 p-stack-lg rounded-2xl hover:shadow-xl transition-all hover:border-blue-400 group">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-stack-md group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-2xl">smartphone</span>
                                </div>
                                <h4 className="font-headline-sm text-headline-sm text-blue-900 mb-stack-sm font-bold">Aplikasi Mobile</h4>
                                <p className="font-body-sm text-body-sm text-slate-600 leading-relaxed">Pengalaman mobile native dan cross-platform untuk operasional lapangan dan pelanggan akhir.</p>
                            </div>
                            <div className="col-span-12 md:col-span-4 bg-white border border-blue-100 p-stack-lg rounded-2xl hover:shadow-xl transition-all hover:border-blue-400 group">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-stack-md group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-2xl">cloud_done</span>
                                </div>
                                <h4 className="font-headline-sm text-headline-sm text-blue-900 mb-stack-sm font-bold">Platform SaaS</h4>
                                <p className="font-body-sm text-body-sm text-slate-600 leading-relaxed">Membangun arsitektur multi-tenant yang dapat diskalakan dari 10 hingga 1.000.000+ pengguna dengan mulus.</p>
                            </div>
                            <div className="col-span-12 md:col-span-8 bg-blue-50 border border-blue-100 p-stack-xl rounded-2xl relative overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="relative z-10 h-full flex flex-col justify-center">
                                    <h4 className="font-headline-md text-headline-md text-blue-900 mb-stack-md font-bold">Otomatisasi Bisnis</h4>
                                    <p className="font-body-md text-body-md text-slate-700 max-w-lg mb-stack-lg leading-relaxed">Mengintegrasikan AI dan machine learning untuk mengotomatisasi alur kerja data yang berulang dan pemeliharaan prediktif.</p>
                                    <Link href="/layanan" className="text-blue-700 font-button text-button flex items-center gap-2 font-bold hover:text-blue-800 transition-colors w-fit">Pelajari lebih lanjut <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">chevron_right</span></Link>
                                </div>
                                <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity translate-x-10 translate-y-10 text-blue-600">
                                    <span className="material-symbols-outlined text-[240px]">robot_2</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Industry Expertise */}
                <section className="py-stack-xl px-margin-desktop max-w-container-max mx-auto border-t border-blue-50">
                    <h2 className="font-headline-md text-headline-md text-blue-900 mb-stack-xl text-center font-bold">Keahlian Industri</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-6 gap-gutter">
                        <div className="text-center group cursor-pointer">
                            <div className="w-20 h-20 mx-auto mb-stack-md rounded-2xl bg-white border border-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm group-hover:shadow-lg group-hover:-translate-y-1">
                                <span className="material-symbols-outlined text-4xl">factory</span>
                            </div>
                            <span className="font-label-md text-label-md text-slate-700 font-bold group-hover:text-blue-700 transition-colors">Manufaktur</span>
                        </div>
                        <div className="text-center group cursor-pointer">
                            <div className="w-20 h-20 mx-auto mb-stack-md rounded-2xl bg-white border border-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm group-hover:shadow-lg group-hover:-translate-y-1">
                                <span className="material-symbols-outlined text-4xl">shopping_cart</span>
                            </div>
                            <span className="font-label-md text-label-md text-slate-700 font-bold group-hover:text-blue-700 transition-colors">Ritel & Grosir</span>
                        </div>
                        <div className="text-center group cursor-pointer">
                            <div className="w-20 h-20 mx-auto mb-stack-md rounded-2xl bg-white border border-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm group-hover:shadow-lg group-hover:-translate-y-1">
                                <span className="material-symbols-outlined text-4xl">medical_services</span>
                            </div>
                            <span className="font-label-md text-label-md text-slate-700 font-bold group-hover:text-blue-700 transition-colors">Kesehatan</span>
                        </div>
                        <div className="text-center group cursor-pointer">
                            <div className="w-20 h-20 mx-auto mb-stack-md rounded-2xl bg-white border border-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm group-hover:shadow-lg group-hover:-translate-y-1">
                                <span className="material-symbols-outlined text-4xl">school</span>
                            </div>
                            <span className="font-label-md text-label-md text-slate-700 font-bold group-hover:text-blue-700 transition-colors">Pendidikan</span>
                        </div>
                        <div className="text-center group cursor-pointer">
                            <div className="w-20 h-20 mx-auto mb-stack-md rounded-2xl bg-white border border-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm group-hover:shadow-lg group-hover:-translate-y-1">
                                <span className="material-symbols-outlined text-4xl">hotel</span>
                            </div>
                            <span className="font-label-md text-label-md text-slate-700 font-bold group-hover:text-blue-700 transition-colors">Perhotelan</span>
                        </div>
                        <div className="text-center group cursor-pointer">
                            <div className="w-20 h-20 mx-auto mb-stack-md rounded-2xl bg-white border border-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm group-hover:shadow-lg group-hover:-translate-y-1">
                                <span className="material-symbols-outlined text-4xl">business_center</span>
                            </div>
                            <span className="font-label-md text-label-md text-slate-700 font-bold group-hover:text-blue-700 transition-colors">Layanan Korporat</span>
                        </div>
                    </div>
                </section>

                {/* Case Studies */}
                <section className="py-stack-xl bg-slate-50 border-y border-blue-100">
                    <div className="max-w-container-max mx-auto px-margin-desktop">
                        <h2 className="font-headline-md text-headline-md text-blue-900 mb-stack-xl text-center md:text-left font-bold">Kisah Sukses (Portofolio)</h2>
                        <div className="grid md:grid-cols-2 gap-stack-xl">
                            <div className="bg-white rounded-2xl overflow-hidden border border-blue-100 shadow-md hover:shadow-xl transition-all flex flex-col md:flex-row h-full group">
                                <div className="md:w-1/2 p-stack-lg flex flex-col justify-between">
                                    <div>
                                        <div className="text-blue-600 font-label-md text-label-md mb-stack-sm font-black tracking-wider">RITEL & DISTRIBUSI</div>
                                        <h3 className="font-headline-sm text-headline-sm text-blue-900 mb-stack-md font-bold group-hover:text-blue-700 transition-colors">Sistem ERP & POS Multicabang</h3>
                                        <p className="font-body-sm text-body-sm text-slate-600 mb-stack-lg leading-relaxed">Otomatisasi manajemen stok dan penjualan untuk jaringan ritel berskala besar, memangkas proses rekonsiliasi manual hingga tuntas.</p>
                                    </div>
                                    <div className="flex gap-stack-lg pt-4 border-t border-blue-50">
                                        <div>
                                            <div className="font-headline-sm text-headline-sm text-blue-700 font-black">99%</div>
                                            <div className="font-label-md text-label-md text-slate-500 font-semibold tracking-wide">AKURASI STOK</div>
                                        </div>
                                        <div>
                                            <div className="font-headline-sm text-headline-sm text-blue-700 font-black">85%</div>
                                            <div className="font-label-md text-label-md text-slate-500 font-semibold tracking-wide">LEBIH CEPAT</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:w-1/2 bg-blue-50 flex items-center justify-center p-stack-lg border-l border-blue-50">
                                    <div className="w-full h-full bg-blue-200/50 rounded-xl animate-pulse"></div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl overflow-hidden border border-blue-100 shadow-md hover:shadow-xl transition-all flex flex-col md:flex-row h-full group">
                                <div className="md:w-1/2 p-stack-lg flex flex-col justify-between">
                                    <div>
                                        <div className="text-blue-600 font-label-md text-label-md mb-stack-sm font-black tracking-wider">EVENT MANAGEMENT</div>
                                        <h3 className="font-headline-sm text-headline-sm text-blue-900 mb-stack-md font-bold group-hover:text-blue-700 transition-colors">Software Photobooth Terintegrasi</h3>
                                        <p className="font-body-sm text-body-sm text-slate-600 mb-stack-lg leading-relaxed">Platform photobooth cerdas dengan integrasi cloud realtime untuk perusahaan event organizer berskala nasional.</p>
                                    </div>
                                    <div className="flex gap-stack-lg pt-4 border-t border-blue-50">
                                        <div>
                                            <div className="font-headline-sm text-headline-sm text-blue-700 font-black">300%</div>
                                            <div className="font-label-md text-label-md text-slate-500 font-semibold tracking-wide">KAPASITAS SESI</div>
                                        </div>
                                        <div>
                                            <div className="font-headline-sm text-headline-sm text-blue-700 font-black">4.9/5</div>
                                            <div className="font-label-md text-label-md text-slate-500 font-semibold tracking-wide">UX SCORE</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:w-1/2 bg-blue-50 flex items-center justify-center p-stack-lg border-l border-blue-50">
                                    <div className="w-full h-full bg-blue-200/50 rounded-xl animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Development Process Timeline */}
                <section id="process" className="py-stack-xl px-margin-desktop max-w-container-max mx-auto overflow-x-auto">
                    <h2 className="font-headline-md text-headline-md text-blue-900 mb-12 text-center font-bold">Proses Pengembangan CTECH</h2>
                    <div className="relative min-w-[1000px] py-4 mt-8">
                        <div className="absolute top-[35px] left-0 w-full h-1 process-line z-0"></div>
                        <div className="flex justify-between relative z-10">
                            {[
                                { num: 1, title: 'Discovery', desc: 'Menentukan Tujuan' },
                                { num: 2, title: 'Architecture', desc: 'Pembuatan Blueprint' },
                                { num: 3, title: 'Design', desc: 'Sistem UI/UX' },
                                { num: 4, title: 'Development', desc: 'Sprint Agile' },
                                { num: 5, title: 'QA Testing', desc: 'Pengujian Ketat' },
                                { num: 6, title: 'Deployment', desc: 'Peluncuran Sistem' },
                                { num: 7, title: 'Support', desc: 'Pemantauan 24/7' }
                            ].map((step) => (
                                <div key={step.num} className="flex flex-col items-center gap-4 bg-white px-4 group">
                                    <div className="w-14 h-14 rounded-full bg-white border-4 border-blue-100 text-blue-700 flex items-center justify-center font-black text-xl shadow-md transition-all group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-blue-200">
                                        {step.num}
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-blue-900 text-lg">{step.title}</div>
                                        <div className="text-sm text-slate-500 font-medium">{step.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="relative py-32 my-stack-xl text-white overflow-hidden bg-blue-900">
                    <div className="absolute inset-0 z-0">
                        <img alt="Corporate Office" className="w-full h-full object-cover opacity-10 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTKaEdlsJo_lKclf_nxoWzPOKrdwEULlrlFrkcS4BM93Xpg9SIbU4XB5joXVj1EvQd4CP9PoCBuuzaIPUOtZ2fqGkywQkHAeWnx3tKgjSjrG3i6MLK6BRoPcBQyZEBmqzUrAKkHPAfuFQHPIjhLZntyZwgIizw673wYEvoLWA6B30e7mIh5pcoZgHP0zQzkJeh9WBKNhd9q5R39jiOvjJoBlu4eFINO6QBKymp_eZl6HLD0Fg9zxgvHNCIQR2kKFE4h3ihNcBvIlm7" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/95 to-blue-800/80"></div>
                    </div>
                    <div className="relative z-10 max-w-container-max mx-auto px-margin-desktop">
                        <div className="max-w-3xl">
                            <h2 className="font-display-lg text-display-lg max-md:text-display-lg-mobile mb-stack-xl text-white font-bold tracking-tight">Mengapa Perusahaan Memilih CTECH?</h2>
                            <div className="grid sm:grid-cols-2 gap-stack-xl">
                                <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4 mb-stack-md">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-blue-300 text-2xl">handshake</span>
                                        </div>
                                        <h4 className="font-headline-sm text-headline-sm text-white font-bold">Fokus Bisnis</h4>
                                    </div>
                                    <p className="text-blue-100 opacity-90 leading-relaxed text-lg">Kami tidak sekadar menulis baris kode; kami memecahkan masalah bisnis dengan target ROI yang terukur.</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4 mb-stack-md">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-blue-300 text-2xl">forum</span>
                                        </div>
                                        <h4 className="font-headline-sm text-headline-sm text-white font-bold">Transparan</h4>
                                    </div>
                                    <p className="text-blue-100 opacity-90 leading-relaxed text-lg">Komunikasi yang sangat jelas dengan pembaruan progres intensif dan akses langsung ke engineer inti.</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4 mb-stack-md">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-blue-300 text-2xl">architecture</span>
                                        </div>
                                        <h4 className="font-headline-sm text-headline-sm text-white font-bold">Skalabel</h4>
                                    </div>
                                    <p className="text-blue-100 opacity-90 leading-relaxed text-lg">Arsitektur aplikasi cerdas yang tangguh dan siap tumbuh seiring dengan lonjakan pengguna Anda.</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4 mb-stack-md">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-blue-300 text-2xl">support_agent</span>
                                        </div>
                                        <h4 className="font-headline-sm text-headline-sm text-white font-bold">Jangka Panjang</h4>
                                    </div>
                                    <p className="text-blue-100 opacity-90 leading-relaxed text-lg">Dukungan pasca-peluncuran eksklusif yang memastikan sistem Anda selalu mutakhir dan sangat aman.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-stack-xl px-margin-desktop max-w-container-max mx-auto">
                    <h2 className="font-headline-md text-headline-md text-blue-900 mb-stack-xl text-center font-bold">Apa Kata Klien Eksekutif Kami</h2>
                    <div className="grid md:grid-cols-2 gap-gutter">
                        <div className="p-stack-xl bg-white border border-blue-100 rounded-2xl relative shadow-md hover:shadow-xl transition-shadow">
                            <span className="material-symbols-outlined text-6xl text-blue-100 absolute top-6 right-6">format_quote</span>
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined text-yellow-400 text-xl" style={{fontVariationSettings: "'FILL' 1"}}>star</span>)}
                            </div>
                            <p className="font-body-lg text-body-lg text-slate-700 italic mb-stack-xl leading-relaxed relative z-10 text-lg">
                                "CTECH tidak sekadar menyediakan tim developer; mereka memberikan kemitraan strategis yang nyata. Arsitektur cloud yang mereka rancang memungkinkan kami melipatgandakan volume transaksi checkout harian tanpa mengalami downtime sedikitpun. Benar-benar game changer!"
                            </p>
                            <div className="flex items-center gap-stack-md border-t border-slate-100 pt-6">
                                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-xl">BS</div>
                                <div>
                                    <div className="font-bold text-blue-900 text-lg">Budi Santoso</div>
                                    <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Direktur Operasional, Retail Nasional</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-stack-xl bg-white border border-blue-100 rounded-2xl relative shadow-md hover:shadow-xl transition-shadow">
                            <span className="material-symbols-outlined text-6xl text-blue-100 absolute top-6 right-6">format_quote</span>
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined text-yellow-400 text-xl" style={{fontVariationSettings: "'FILL' 1"}}>star</span>)}
                            </div>
                            <p className="font-body-lg text-body-lg text-slate-700 italic mb-stack-xl leading-relaxed relative z-10 text-lg">
                                "Software house paling profesional yang pernah berkolaborasi dengan holding kami. Dari tahap discovery masalah saja mereka berhasil mengungkap potensi efisiensi biaya luar biasa yang tidak pernah kami sadari sebelumnya. Pengiriman proyek tepat waktu."
                            </p>
                            <div className="flex items-center gap-stack-md border-t border-slate-100 pt-6">
                                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-xl">AP</div>
                                <div>
                                    <div className="font-bold text-blue-900 text-lg">Andi Pratama</div>
                                    <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">CEO, Enterprise Corporation</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-stack-xl bg-slate-50 border-t border-blue-100">
                    <div className="max-w-3xl mx-auto px-margin-desktop">
                        <h2 className="font-headline-md text-headline-md text-blue-900 mb-stack-xl text-center font-bold">Pertanyaan Umum (FAQ)</h2>
                        <div className="space-y-4">
                            <details className="group bg-white border border-blue-100 rounded-xl p-6 cursor-pointer shadow-sm hover:shadow-md transition-all">
                                <summary className="flex justify-between items-center font-headline-sm text-headline-sm text-blue-900 hover:text-blue-700 transition-colors list-none font-bold">
                                    Berapa lama waktu pengerjaan sebuah proyek enterprise?
                                    <span className="material-symbols-outlined text-blue-600 bg-blue-50 w-8 h-8 rounded-full flex items-center justify-center group-open:rotate-180 transition-transform">expand_more</span>
                                </summary>
                                <p className="mt-6 pt-6 border-t border-blue-50 text-slate-600 font-body-md text-body-md leading-relaxed text-lg">
                                    Meskipun kompleksitas sistem sangat bervariasi, sebagian besar solusi enterprise kami memakan waktu antara 2 hingga 6 bulan sejak tahap analisis hingga peluncuran final. Kami selalu memprioritaskan pendekatan rilis bertahap (Agile) untuk memastikan Anda merasakan benefit sistem lebih awal.
                                </p>
                            </details>
                            <details className="group bg-white border border-blue-100 rounded-xl p-6 cursor-pointer shadow-sm hover:shadow-md transition-all">
                                <summary className="flex justify-between items-center font-headline-sm text-headline-sm text-blue-900 hover:text-blue-700 transition-colors list-none font-bold">
                                    Apakah CTECH menyediakan dukungan perbaikan setelah aplikasi diluncurkan?
                                    <span className="material-symbols-outlined text-blue-600 bg-blue-50 w-8 h-8 rounded-full flex items-center justify-center group-open:rotate-180 transition-transform">expand_more</span>
                                </summary>
                                <p className="mt-6 pt-6 border-t border-blue-50 text-slate-600 font-body-md text-body-md leading-relaxed text-lg">
                                    Tentu saja. Kami menyediakan perjanjian kerja tingkat layanan (SLA) untuk dukungan dan perbaikan jangka panjang, mencakup pemantauan server 24/7, pembaruan keamanan framework, perbaikan bug seketika, serta perilisan fitur-fitur tambahan secara rutin.
                                </p>
                            </details>
                            <details className="group bg-white border border-blue-100 rounded-xl p-6 cursor-pointer shadow-sm hover:shadow-md transition-all">
                                <summary className="flex justify-between items-center font-headline-sm text-headline-sm text-blue-900 hover:text-blue-700 transition-colors list-none font-bold">
                                    Bisakah sistem baru ini diintegrasikan dengan sistem lawas (legacy) yang kami gunakan?
                                    <span className="material-symbols-outlined text-blue-600 bg-blue-50 w-8 h-8 rounded-full flex items-center justify-center group-open:rotate-180 transition-transform">expand_more</span>
                                </summary>
                                <p className="mt-6 pt-6 border-t border-blue-50 text-slate-600 font-body-md text-body-md leading-relaxed text-lg">
                                    Integrasi data merupakan salah satu keunggulan teknis utama kami. Tim engineer kami sangat handal dalam membangun layer middleware dan API secure untuk menyambungkan aplikasi baru dengan sistem database eksisting seperti SAP, Oracle, atau server on-premise eksklusif lainnya.
                                </p>
                            </details>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24 px-margin-desktop max-w-container-max mx-auto text-center">
                    <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white rounded-[2rem] py-20 px-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-30"></div>
                        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
                        <div className="relative z-10">
                            <h2 className="font-display-lg text-display-lg max-md:text-display-lg-mobile mb-6 text-white font-black tracking-tight">Siap Mempercepat Laju Bisnis Anda?</h2>
                            <p className="font-body-lg text-body-lg text-blue-100 max-w-3xl mx-auto mb-12 text-xl leading-relaxed">
                                Jangan biarkan masalah IT menghambat pertumbuhan Anda. Bermitralah dengan pakar teknologi yang memahami bahasa strategi bisnis sama fasihnya dengan bahasa pemrograman.
                            </p>
                            <Link href="/kontak" className="inline-flex items-center gap-3 bg-white text-blue-800 px-12 py-5 font-button text-button rounded-xl hover:bg-blue-50 hover:shadow-xl transition-all text-xl font-bold group">
                                Jadwalkan Konsultasi Gratis
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-white pt-20 pb-10 border-t border-blue-100">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 px-margin-desktop max-w-container-max mx-auto">
                        <div className="col-span-1 md:col-span-4">
                            <div className="font-headline-sm text-headline-sm font-black text-blue-900 tracking-tight mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-blue-200 text-sm">CT</div>
                                CTECH
                            </div>
                            <p className="text-slate-600 font-body-md text-body-md leading-relaxed pr-8">PT Kreatif Teknologi Maju Bersama.<br/>Mewujudkan transformasi digital enterprise melalui arsitektur teknologi berkelas dunia dan pendekatan berpusat pada ROI.</p>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <h5 className="font-label-md text-label-md font-bold text-blue-900 mb-6 uppercase tracking-wider">Layanan Utama</h5>
                            <ul className="space-y-4 text-slate-600 font-body-sm text-body-sm">
                                <li><Link className="hover:text-blue-600 font-medium transition-colors" href="/layanan">Software Enterprise</Link></li>
                                <li><Link className="hover:text-blue-600 font-medium transition-colors" href="/industri">Sistem Multicabang</Link></li>
                                <li><Link className="hover:text-blue-600 font-medium transition-colors" href="/solusi/photobooth">Cloud Infrastructure</Link></li>
                                <li><Link className="hover:text-blue-600 font-medium transition-colors" href="/solusi/photobooth">Aplikasi Mobile Android & iOS</Link></li>
                            </ul>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <h5 className="font-label-md text-label-md font-bold text-blue-900 mb-6 uppercase tracking-wider">Perusahaan</h5>
                            <ul className="space-y-4 text-slate-600 font-body-sm text-body-sm">
                                <li><Link className="hover:text-blue-600 font-medium transition-colors" href="/tentang">Tentang Kami</Link></li>
                                <li><Link className="hover:text-blue-600 font-medium transition-colors" href="/portfolio">Portofolio & Studi Kasus</Link></li>
                                <li><Link className="hover:text-blue-600 font-medium transition-colors" href="/berita">Insight Teknologi</Link></li>
                                <li><Link className="hover:text-blue-600 font-medium transition-colors" href="/karir">Karir</Link></li>
                            </ul>
                        </div>
                        <div className="col-span-1 md:col-span-4">
                            <h5 className="font-label-md text-label-md font-bold text-blue-900 mb-6 uppercase tracking-wider">Hubungi Kami Hari Ini</h5>
                            <ul className="space-y-4 text-slate-600 font-body-sm text-body-sm bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-blue-700 bg-white p-2 rounded-lg shadow-sm">location_on</span>
                                    <span className="mt-1 font-medium text-slate-700">BTN UNHALU BLOK L NO 10, Kendari, Sulawesi Tenggara, 93231</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-blue-700 bg-white p-2 rounded-lg shadow-sm">mail</span>
                                    <span className="font-medium text-slate-700">halo@ctech.co.id</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-blue-700 bg-white p-2 rounded-lg shadow-sm">call</span>
                                    <span className="font-bold text-blue-900 text-lg">+62 822-9311-8410</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-16 pt-8 border-t border-slate-200 px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-slate-500 font-body-sm text-body-sm font-medium">© {new Date().getFullYear()} PT Kreatif Teknologi Maju Bersama (CTECH). All rights reserved.</div>
                        <div className="flex gap-8 text-slate-500 font-label-md text-label-md font-semibold">
                            <a className="hover:text-blue-700 transition-colors" href="#">Kebijakan Privasi</a>
                            <a className="hover:text-blue-700 transition-colors" href="#">Syarat & Ketentuan</a>
                            <a className="hover:text-blue-700 transition-colors flex items-center gap-1" href="#"><span className="material-symbols-outlined text-sm">open_in_new</span> LinkedIn</a>
                            <a className="hover:text-blue-700 transition-colors flex items-center gap-1" href="#"><span className="material-symbols-outlined text-sm">open_in_new</span> Instagram</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
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
                    background: repeating-linear-gradient(90deg, #c6c6cd 0, #c6c6cd 4px, transparent 4px, transparent 8px);
                }
                @media (max-width: 768px) {
                    .bento-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}} />

            <div className="bg-background text-on-surface selection:bg-secondary selection:text-white font-body-md overflow-x-hidden pt-20">
                <PublicNavbar />

                {/* Hero Section */}
                <section className="pt-32 pb-stack-xl px-margin-desktop max-w-container-max mx-auto overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-stack-xl items-center">
                        <div className="space-y-stack-lg">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded-full">
                                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                                <span className="font-label-md text-label-md text-on-surface-variant">SIAP MENERIMA PROYEK BARU</span>
                            </div>
                            <h1 className="font-display-lg text-display-lg md:text-display-lg max-md:font-display-lg-mobile max-md:text-display-lg-mobile text-primary tracking-tight">
                                Kami Membangun Software yang Menyelesaikan Masalah Bisnis Nyata
                            </h1>
                            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                                Dirancang untuk performa, dibangun untuk skala besar. Kami menghadirkan solusi enterprise custom yang mengubah kerumitan operasional menjadi keunggulan kompetitif.
                            </p>
                            <div className="flex flex-wrap gap-stack-md pt-stack-sm">
                                <Link href="/kontak" className="bg-primary text-on-primary px-8 py-4 font-button text-button rounded-lg flex items-center gap-2 group">
                                    Konsultasi Gratis
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </Link>
                                <Link href="/portfolio" className="border border-outline-variant text-primary px-8 py-4 font-button text-button rounded-lg hover:bg-surface-container-low transition-colors">
                                    Lihat Portofolio
                                </Link>
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-secondary/5 rounded-3xl blur-2xl group-hover:bg-secondary/10 transition-colors"></div>
                            <div className="relative border border-outline-variant rounded-xl overflow-hidden bg-white shadow-2xl transition-transform duration-500 hover:-translate-y-2">
                                <img alt="Enterprise Dashboard" className="w-full h-auto object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg9TpkBO74LrL8da0rH4yVhDiP1ddUK9CLTumeFNt0i8_XEwNdYI4fne8EFLzN04qtpCqVxz6Sf_PZtXmr2oYHu5KGku0Xos4f2x2DQLEiaNpWZcUudJgtVMqMg2NteiHEfecpF6W-J5ZVVeHn8ki0aCAm-hY-0PsIDBbl4BQOAa-uXRcAgEARVMjAarQ8PE5Rk6oq7MiEO7Yb7ke3_YDV9R-9iCTQwb0GmcAP57_ux-YN8KdhYWyDDj4R1u3ipxsuiwR_BSvwtv38" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Client Trust & Stats */}
                <section className="py-stack-xl bg-surface-container-lowest border-y border-outline-variant">
                    <div className="max-w-container-max mx-auto px-margin-desktop">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-stack-xl">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-xl flex-grow opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                                <img src="/logos/company1.png" alt="Company 1" className="h-12 object-contain" />
                                <img src="/logos/company2.png" alt="Company 2" className="h-12 object-contain" />
                                <img src="/logos/company3.png" alt="Company 3" className="h-12 object-contain" />
                                <img src="/logos/company4.png" alt="Company 4" className="h-12 object-contain" />
                            </div>
                            <div className="flex gap-stack-xl border-l border-outline-variant pl-stack-xl max-md:border-l-0 max-md:pl-0">
                                <div className="text-center">
                                    <div className="font-headline-md text-headline-md text-primary">250+</div>
                                    <div className="font-label-md text-label-md text-on-surface-variant uppercase">Proyek Selesai</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-headline-md text-headline-md text-primary">10+</div>
                                    <div className="font-label-md text-label-md text-on-surface-variant uppercase">Tahun Pengalaman</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-headline-md text-headline-md text-primary">98%</div>
                                    <div className="font-label-md text-label-md text-on-surface-variant uppercase">Kepuasan Klien</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Problems We Solve */}
                <section className="py-stack-xl px-margin-desktop max-w-container-max mx-auto">
                    <div className="text-center mb-stack-xl">
                        <h2 className="font-headline-md text-headline-md text-primary mb-stack-sm">Tantangan yang Kami Selesaikan</h2>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">Mengidentifikasi dan mengatasi hambatan teknis yang menahan potensi maksimal perusahaan Anda.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-gutter">
                        <div className="p-stack-lg border border-outline-variant rounded-lg hover:border-secondary transition-colors group">
                            <span className="material-symbols-outlined text-secondary text-4xl mb-stack-md block group-hover:scale-110 transition-transform">speed</span>
                            <h3 className="font-headline-sm text-headline-sm mb-stack-sm">Inefisiensi Operasional</h3>
                            <p className="font-body-md text-body-md text-on-surface-variant">Alur kerja terfragmentasi dan sistem usang yang menguras sumber daya serta memperlambat kelincahan organisasi.</p>
                        </div>
                        <div className="p-stack-lg border border-outline-variant rounded-lg hover:border-secondary transition-colors group">
                            <span className="material-symbols-outlined text-secondary text-4xl mb-stack-md block group-hover:scale-110 transition-transform">touch_app</span>
                            <h3 className="font-headline-sm text-headline-sm mb-stack-sm">Proses Manual</h3>
                            <p className="font-body-md text-body-md text-on-surface-variant">Tugas yang rentan terhadap human-error yang seharusnya bisa diotomatisasi untuk membebaskan tim Anda fokus pada inisiatif strategis.</p>
                        </div>
                        <div className="p-stack-lg border border-outline-variant rounded-lg hover:border-secondary transition-colors group">
                            <span className="material-symbols-outlined text-secondary text-4xl mb-stack-md block group-hover:scale-110 transition-transform">trending_up</span>
                            <h3 className="font-headline-sm text-headline-sm mb-stack-sm">Hambatan Skalabilitas</h3>
                            <p className="font-body-md text-body-md text-on-surface-variant">Infrastruktur yang goyah saat beban tinggi, mencegah bisnis Anda menangkap peluang pasar baru yang lebih besar.</p>
                        </div>
                    </div>
                </section>

                {/* Solutions Bento */}
                <section className="py-stack-xl bg-surface-container-low">
                    <div className="max-w-container-max mx-auto px-margin-desktop">
                        <div className="mb-stack-xl flex justify-between items-end">
                            <div>
                                <h2 className="font-headline-md text-headline-md text-primary mb-stack-sm">Solusi Utama Kami</h2>
                                <p className="font-body-md text-body-md text-on-surface-variant">Layanan modular yang dirancang untuk ekosistem B2B modern.</p>
                            </div>
                        </div>
                        <div className="bento-grid">
                            {/* Main Card */}
                            <div className="col-span-12 md:col-span-6 bg-primary-container p-stack-xl rounded-xl text-on-primary flex flex-col justify-between min-h-[400px]">
                                <div>
                                    <div className="font-label-md text-label-md text-secondary-container mb-stack-md">LAYANAN INTI</div>
                                    <h3 className="font-display-lg text-display-lg max-md:text-display-lg-mobile mb-stack-md">Pengembangan Software Custom</h3>
                                    <p className="font-body-lg text-body-lg text-on-primary-container opacity-80 max-w-md">Rekayasa sistem eksklusif end-to-end yang akan menjadi aset paling berharga perusahaan Anda.</p>
                                </div>
                                <div className="flex gap-stack-md">
                                    <span className="px-3 py-1 bg-white/10 rounded-full text-label-md font-label-md">ARSITEKTUR</span>
                                    <span className="px-3 py-1 bg-white/10 rounded-full text-label-md font-label-md">ENGINEERING</span>
                                </div>
                            </div>
                            {/* Small Cards */}
                            <div className="col-span-12 md:col-span-3 bg-white border border-outline-variant p-stack-lg rounded-xl hover:shadow-xl transition-shadow">
                                <span className="material-symbols-outlined text-primary text-3xl mb-stack-md">language</span>
                                <h4 className="font-headline-sm text-headline-sm mb-stack-sm">Aplikasi Web</h4>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">Aplikasi web berkinerja tinggi yang dibangun dengan framework terkini untuk jangkauan global.</p>
                            </div>
                            <div className="col-span-12 md:col-span-3 bg-white border border-outline-variant p-stack-lg rounded-xl hover:shadow-xl transition-shadow">
                                <span className="material-symbols-outlined text-primary text-3xl mb-stack-md">smartphone</span>
                                <h4 className="font-headline-sm text-headline-sm mb-stack-sm">Aplikasi Mobile</h4>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">Pengalaman mobile native dan cross-platform untuk operasional lapangan dan pelanggan akhir.</p>
                            </div>
                            <div className="col-span-12 md:col-span-4 bg-white border border-outline-variant p-stack-lg rounded-xl hover:shadow-xl transition-shadow">
                                <span className="material-symbols-outlined text-primary text-3xl mb-stack-md">cloud_done</span>
                                <h4 className="font-headline-sm text-headline-sm mb-stack-sm">Platform SaaS</h4>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">Membangun arsitektur multi-tenant yang dapat diskalakan dari 10 hingga 1.000.000+ pengguna dengan mulus.</p>
                            </div>
                            <div className="col-span-12 md:col-span-8 bg-surface-container-highest p-stack-xl rounded-xl relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h4 className="font-headline-md text-headline-md mb-stack-md">Otomatisasi Bisnis</h4>
                                    <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mb-stack-lg">Mengintegrasikan AI dan machine learning untuk mengotomatisasi alur kerja data yang berulang dan pemeliharaan prediktif.</p>
                                    <Link href="/layanan" className="text-primary font-button text-button flex items-center gap-2">Pelajari lebih lanjut <span className="material-symbols-outlined">chevron_right</span></Link>
                                </div>
                                <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity translate-x-10 translate-y-10">
                                    <span className="material-symbols-outlined text-[200px]">robot_2</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Industry Expertise */}
                <section className="py-stack-xl px-margin-desktop max-w-container-max mx-auto">
                    <h2 className="font-headline-md text-headline-md text-primary mb-stack-xl text-center">Keahlian Industri</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-6 gap-gutter">
                        <div className="text-center group">
                            <div className="w-16 h-16 mx-auto mb-stack-md rounded-xl bg-surface-container-low flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                <span className="material-symbols-outlined text-3xl">factory</span>
                            </div>
                            <span className="font-label-md text-label-md">Manufaktur</span>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 mx-auto mb-stack-md rounded-xl bg-surface-container-low flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                <span className="material-symbols-outlined text-3xl">shopping_cart</span>
                            </div>
                            <span className="font-label-md text-label-md">Ritel & Grosir</span>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 mx-auto mb-stack-md rounded-xl bg-surface-container-low flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                <span className="material-symbols-outlined text-3xl">medical_services</span>
                            </div>
                            <span className="font-label-md text-label-md">Kesehatan</span>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 mx-auto mb-stack-md rounded-xl bg-surface-container-low flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                <span className="material-symbols-outlined text-3xl">school</span>
                            </div>
                            <span className="font-label-md text-label-md">Pendidikan</span>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 mx-auto mb-stack-md rounded-xl bg-surface-container-low flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                <span className="material-symbols-outlined text-3xl">hotel</span>
                            </div>
                            <span className="font-label-md text-label-md">Perhotelan</span>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 mx-auto mb-stack-md rounded-xl bg-surface-container-low flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                <span className="material-symbols-outlined text-3xl">business_center</span>
                            </div>
                            <span className="font-label-md text-label-md">Layanan Korporat</span>
                        </div>
                    </div>
                </section>

                {/* Case Studies */}
                <section className="py-stack-xl bg-surface-container-highest">
                    <div className="max-w-container-max mx-auto px-margin-desktop">
                        <h2 className="font-headline-md text-headline-md text-primary mb-stack-xl">Kisah Sukses (Portofolio)</h2>
                        <div className="grid md:grid-cols-2 gap-stack-xl">
                            <div className="bg-white rounded-xl overflow-hidden border border-outline-variant flex flex-col md:flex-row h-full">
                                <div className="md:w-1/2 p-stack-lg flex flex-col justify-between">
                                    <div>
                                        <div className="text-secondary font-label-md text-label-md mb-stack-sm">RITEL & DISTRIBUSI</div>
                                        <h3 className="font-headline-sm text-headline-sm mb-stack-md">Sistem ERP & POS Multicabang</h3>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-stack-lg">Otomatisasi manajemen stok dan penjualan untuk jaringan ritel berskala besar, memangkas proses rekonsiliasi manual.</p>
                                    </div>
                                    <div className="flex gap-stack-lg">
                                        <div>
                                            <div className="font-headline-sm text-headline-sm text-secondary">99%</div>
                                            <div className="font-label-md text-label-md opacity-60">AKURASI STOK</div>
                                        </div>
                                        <div>
                                            <div className="font-headline-sm text-headline-sm text-secondary">85%</div>
                                            <div className="font-label-md text-label-md opacity-60">LEBIH CEPAT</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:w-1/2 bg-surface-container-low flex items-center justify-center p-stack-lg">
                                    <div className="w-full h-full bg-slate-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl overflow-hidden border border-outline-variant flex flex-col md:flex-row h-full">
                                <div className="md:w-1/2 p-stack-lg flex flex-col justify-between">
                                    <div>
                                        <div className="text-secondary font-label-md text-label-md mb-stack-sm">EVENT MANAGEMENT</div>
                                        <h3 className="font-headline-sm text-headline-sm mb-stack-md">Software Photobooth Terintegrasi</h3>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-stack-lg">Platform photobooth cerdas dengan integrasi cloud untuk perusahaan event organizer terkemuka.</p>
                                    </div>
                                    <div className="flex gap-stack-lg">
                                        <div>
                                            <div className="font-headline-sm text-headline-sm text-secondary">300%</div>
                                            <div className="font-label-md text-label-md opacity-60">KAPASITAS SESI</div>
                                        </div>
                                        <div>
                                            <div className="font-headline-sm text-headline-sm text-secondary">4.9/5</div>
                                            <div className="font-label-md text-label-md opacity-60">UX SCORE</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:w-1/2 bg-surface-container-low flex items-center justify-center p-stack-lg">
                                    <div className="w-full h-full bg-slate-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Development Process Timeline */}
                <section id="process" className="py-stack-xl px-margin-desktop max-w-container-max mx-auto overflow-x-auto">
                    <h2 className="font-headline-md text-headline-md text-primary mb-12 text-center">Proses Pengembangan Kami</h2>
                    <div className="relative min-w-[1000px] py-4">
                        <div className="absolute top-[35px] left-0 w-full h-0.5 process-line z-0"></div>
                        <div className="flex justify-between relative z-10">
                            <div className="flex flex-col items-center gap-4 bg-background px-2">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
                                <div className="text-center">
                                    <div className="font-bold">Discovery</div>
                                    <div className="text-xs text-on-surface-variant">Menentukan Tujuan</div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-4 bg-background px-2">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
                                <div className="text-center">
                                    <div className="font-bold">Architecture</div>
                                    <div className="text-xs text-on-surface-variant">Pembuatan Blueprint</div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-4 bg-background px-2">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
                                <div className="text-center">
                                    <div className="font-bold">Design</div>
                                    <div className="text-xs text-on-surface-variant">Sistem UI/UX</div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-4 bg-background px-2">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">4</div>
                                <div className="text-center">
                                    <div className="font-bold">Development</div>
                                    <div className="text-xs text-on-surface-variant">Sprint Agile</div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-4 bg-background px-2">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">5</div>
                                <div className="text-center">
                                    <div className="font-bold">QA Testing</div>
                                    <div className="text-xs text-on-surface-variant">Pengujian Ketat</div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-4 bg-background px-2">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">6</div>
                                <div className="text-center">
                                    <div className="font-bold">Deployment</div>
                                    <div className="text-xs text-on-surface-variant">Peluncuran Sistem</div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-4 bg-background px-2">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">7</div>
                                <div className="text-center">
                                    <div className="font-bold">Support</div>
                                    <div className="text-xs text-on-surface-variant">Pemantauan 24/7</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="relative py-24 my-stack-xl text-white overflow-hidden bg-primary">
                    <div className="absolute inset-0 z-0">
                        <img alt="Corporate Office" className="w-full h-full object-cover opacity-20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTKaEdlsJo_lKclf_nxoWzPOKrdwEULlrlFrkcS4BM93Xpg9SIbU4XB5joXVj1EvQd4CP9PoCBuuzaIPUOtZ2fqGkywQkHAeWnx3tKgjSjrG3i6MLK6BRoPcBQyZEBmqzUrAKkHPAfuFQHPIjhLZntyZwgIizw673wYEvoLWA6B30e7mIh5pcoZgHP0zQzkJeh9WBKNhd9q5R39jiOvjJoBlu4eFINO6QBKymp_eZl6HLD0Fg9zxgvHNCIQR2kKFE4h3ihNcBvIlm7" />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
                    </div>
                    <div className="relative z-10 max-w-container-max mx-auto px-margin-desktop">
                        <div className="max-w-2xl">
                            <h2 className="font-display-lg text-display-lg max-md:text-display-lg-mobile mb-stack-xl">Mengapa Memilih CTECH?</h2>
                            <div className="grid sm:grid-cols-2 gap-stack-lg">
                                <div>
                                    <div className="flex items-center gap-3 mb-stack-sm">
                                        <span className="material-symbols-outlined text-secondary">handshake</span>
                                        <h4 className="font-headline-sm text-headline-sm">Fokus pada Bisnis</h4>
                                    </div>
                                    <p className="text-on-primary-container opacity-80">Kami tidak sekadar menulis baris kode; kami memecahkan masalah bisnis dengan target ROI (Return of Investment).</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-stack-sm">
                                        <span className="material-symbols-outlined text-secondary">forum</span>
                                        <h4 className="font-headline-sm text-headline-sm">Transparan</h4>
                                    </div>
                                    <p className="text-on-primary-container opacity-80">Komunikasi yang jelas dengan pembaruan progres yang intensif dan akses langsung ke tim engineer.</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-stack-sm">
                                        <span className="material-symbols-outlined text-secondary">architecture</span>
                                        <h4 className="font-headline-sm text-headline-sm">Skalabel</h4>
                                    </div>
                                    <p className="text-on-primary-container opacity-80">Arsitektur aplikasi yang tangguh dan siap tumbuh seiring dengan peningkatan skala dan permintaan perusahaan Anda.</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-stack-sm">
                                        <span className="material-symbols-outlined text-secondary">support_agent</span>
                                        <h4 className="font-headline-sm text-headline-sm">Jangka Panjang</h4>
                                    </div>
                                    <p className="text-on-primary-container opacity-80">Dukungan pasca-peluncuran yang memastikan sistem Anda tetap mutakhir, terawat, dan sangat aman digunakan.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-stack-xl px-margin-desktop max-w-container-max mx-auto">
                    <h2 className="font-headline-md text-headline-md text-primary mb-stack-xl text-center">Apa Kata Klien Kami</h2>
                    <div className="grid md:grid-cols-2 gap-gutter">
                        <div className="p-stack-xl bg-surface-container-low rounded-xl relative">
                            <span className="material-symbols-outlined text-6xl text-outline-variant absolute top-4 right-4">format_quote</span>
                            <p className="font-body-lg text-body-lg text-primary italic mb-stack-lg leading-relaxed">
                                "CTECH tidak sekadar menyediakan tim developer; mereka memberikan kemitraan strategis yang nyata. Arsitektur yang mereka rancang memungkinkan kami melipatgandakan volume transaksi harian tanpa mengalami downtime sedikitpun."
                            </p>
                            <div className="flex items-center gap-stack-md">
                                <div className="w-12 h-12 rounded-full bg-outline-variant"></div>
                                <div>
                                    <div className="font-bold text-primary">Budi Santoso</div>
                                    <div className="text-label-md text-on-surface-variant uppercase">Direktur Operasional, Retail Nasional</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-stack-xl bg-surface-container-low rounded-xl relative">
                            <span className="material-symbols-outlined text-6xl text-outline-variant absolute top-4 right-4">format_quote</span>
                            <p className="font-body-lg text-body-lg text-primary italic mb-stack-lg leading-relaxed">
                                "Software house paling profesional yang pernah berkolaborasi dengan kami. Dari tahap discovery masalah saja mereka berhasil mengungkap potensi efisiensi biaya luar biasa yang tidak kami sadari sebelumnya."
                            </p>
                            <div className="flex items-center gap-stack-md">
                                <div className="w-12 h-12 rounded-full bg-outline-variant"></div>
                                <div>
                                    <div className="font-bold text-primary">Andi Pratama</div>
                                    <div className="text-label-md text-on-surface-variant uppercase">CEO, Enterprise Corporation</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-stack-xl bg-surface-container-lowest">
                    <div className="max-w-3xl mx-auto px-margin-desktop">
                        <h2 className="font-headline-md text-headline-md text-primary mb-stack-xl text-center">Pertanyaan yang Sering Diajukan</h2>
                        <div className="space-y-stack-md">
                            <details className="group border-b border-outline-variant pb-stack-md cursor-pointer">
                                <summary className="flex justify-between items-center font-headline-sm text-headline-sm list-none">
                                    Berapa lama waktu pengerjaan sebuah proyek enterprise?
                                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                                </summary>
                                <p className="mt-stack-sm text-on-surface-variant font-body-md text-body-md">
                                    Meskipun kompleksitas sistem sangat bervariasi, sebagian besar solusi enterprise kami memakan waktu antara 2 hingga 6 bulan sejak tahap analisis hingga peluncuran final. Kami selalu memprioritaskan pendekatan rilis bertahap untuk memastikan Anda merasakan benefit sistem lebih awal.
                                </p>
                            </details>
                            <details className="group border-b border-outline-variant pb-stack-md cursor-pointer">
                                <summary className="flex justify-between items-center font-headline-sm text-headline-sm list-none">
                                    Apakah CTECH menyediakan dukungan perbaikan setelah aplikasi diluncurkan?
                                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                                </summary>
                                <p className="mt-stack-sm text-on-surface-variant font-body-md text-body-md">
                                    Tentu saja. Kami menyediakan perjanjian kerja tingkat layanan (SLA) untuk dukungan dan perbaikan jangka panjang, mencakup pemantauan server 24/7, pembaruan keamanan, perbaikan bug seketika, serta perilisan fitur-fitur baru secara rutin.
                                </p>
                            </details>
                            <details className="group border-b border-outline-variant pb-stack-md cursor-pointer">
                                <summary className="flex justify-between items-center font-headline-sm text-headline-sm list-none">
                                    Bisakah sistem baru ini diintegrasikan dengan sistem lawas (legacy) yang kami gunakan saat ini?
                                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                                </summary>
                                <p className="mt-stack-sm text-on-surface-variant font-body-md text-body-md">
                                    Integrasi data merupakan salah satu keunggulan teknis kami. Tim kami sangat berpengalaman dalam membangun layer middleware dan API untuk menyambungkan aplikasi baru dengan sistem database ERP eksisting seperti SAP, Oracle, atau server on-premise eksklusif lainnya.
                                </p>
                            </details>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-stack-xl px-margin-desktop max-w-container-max mx-auto text-center">
                    <div className="bg-primary text-on-primary rounded-2xl py-stack-xl px-stack-lg">
                        <h2 className="font-display-lg text-display-lg max-md:text-display-lg-mobile mb-stack-md">Siap Mengubah Bisnis Anda?</h2>
                        <p className="font-body-lg text-body-lg opacity-80 max-w-2xl mx-auto mb-stack-xl">
                            Bermitralah dengan tim teknologi handal yang memahami bahasa bisnis Anda sama fasihnya dengan bahasa pemrograman.
                        </p>
                        <Link href="/kontak" className="inline-block bg-secondary text-white px-10 py-5 font-button text-button rounded-lg hover:brightness-110 transition-all text-lg">
                            Jadwalkan Konsultasi Sekarang
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-surface-container-low py-stack-xl border-t border-outline-variant">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop max-w-container-max mx-auto">
                        <div className="col-span-1 md:col-span-1">
                            <div className="font-headline-sm text-headline-sm font-black text-primary tracking-tight mb-stack-md">CTECH</div>
                            <p className="text-on-surface-variant font-body-sm text-body-sm">PT Kreatif Teknologi Maju Bersama.<br/>Mewujudkan transformasi digital perusahaan Anda melalui teknologi canggih dan desain elegan.</p>
                        </div>
                        <div>
                            <h5 className="font-label-md text-label-md font-semibold mb-stack-md">Layanan & Solusi</h5>
                            <ul className="space-y-stack-sm text-on-surface-variant font-body-sm text-body-sm">
                                <li><Link className="hover:text-secondary transition-colors" href="/layanan">Pengembangan Software Custom</Link></li>
                                <li><Link className="hover:text-secondary transition-colors" href="/industri">Sistem ERP & POS Multicabang</Link></li>
                                <li><Link className="hover:text-secondary transition-colors" href="/solusi/photobooth">Software Photobooth Interaktif</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-label-md text-label-md font-semibold mb-stack-md">Perusahaan</h5>
                            <ul className="space-y-stack-sm text-on-surface-variant font-body-sm text-body-sm">
                                <li><Link className="hover:text-secondary transition-colors" href="/tentang">Tentang Kami</Link></li>
                                <li><Link className="hover:text-secondary transition-colors" href="/portfolio">Portofolio Klien</Link></li>
                                <li><Link className="hover:text-secondary transition-colors" href="/berita">Berita & Insight</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-label-md text-label-md font-semibold mb-stack-md">Hubungi Kami</h5>
                            <ul className="space-y-stack-sm text-on-surface-variant font-body-sm text-body-sm">
                                <li>BTN UNHALU BLOK L NO 10, Kendari</li>
                                <li>ptkreatifteknologimajubersama@gmail.com</li>
                                <li>+62 822-9311-8410</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-stack-xl pt-stack-lg border-t border-outline-variant px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-stack-md">
                        <div className="text-on-surface-variant font-body-sm text-body-sm">© {new Date().getFullYear()} PT Kreatif Teknologi Maju Bersama (CTECH). All rights reserved.</div>
                        <div className="flex gap-stack-lg text-on-surface-variant font-label-md text-label-md">
                            <a className="hover:text-secondary transition-colors" href="#">Kebijakan Privasi</a>
                            <a className="hover:text-secondary transition-colors" href="#">Syarat & Ketentuan</a>
                            <a className="hover:text-secondary transition-colors" href="#">LinkedIn</a>
                            <a className="hover:text-secondary transition-colors" href="#">Instagram</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
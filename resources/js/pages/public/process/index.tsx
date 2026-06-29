import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import { PremiumNavbar as PublicNavbar } from '@/components/ui/PremiumNavbar';

export default function Process() {
    useEffect(() => {
        // Micro-interactions for Timeline
        const observerOptions = {
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-10');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.relative.group').forEach(step => {
            step.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
            observer.observe(step);
        });
    }, []);

    return (
        <>
            <Head>
                <title>Proses & Metodologi | CTECH</title>
                <style dangerouslySetInnerHTML={{ __html: `
                    .material-symbols-outlined {
                        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                        vertical-align: middle;
                    }
                    .step-active { border-left: 2px solid #0051d5; }
                    .hide-scrollbar::-webkit-scrollbar { display: none; }
                `}} />
            </Head>

            <div className="bg-white text-slate-900 font-body-md selection:bg-blue-600-fixed selection:text-on-secondary-fixed min-h-screen">
                <PublicNavbar />

                <main className="pt-20">
                    {/* Hero Section */}
                    <section className="py-stack-xl bg-white border-b border-blue-100">
                        <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
                            <div className="space-y-stack-lg">
                                <span className="font-label-md text-label-md text-blue-600 uppercase tracking-widest">Metodologi Kami</span>
                                <h1 className="font-display-lg text-display-lg md:text-display-lg text-slate-900 max-w-xl">Rekayasa Presisi untuk Skala Enterprise</h1>
                                <p className="font-body-lg text-body-lg text-slate-600 max-w-lg">Kami menggabungkan ketelitian profesional dengan eksekusi tangkas (agile). Kerangka kerja 7 langkah kami memastikan software berkinerja tinggi yang selaras dengan standar keamanan global.</p>
                            </div>
                            <div className="relative h-[400px] overflow-hidden rounded-xl border border-blue-100">
                                <img alt="Enterprise Process" className="w-full h-full object-cover grayscale-[0.5] contrast-[1.1]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD--aifEihErmn_JlSKkhG55zfXnJfozZ-9kgsMr_Evyg4n2KNbVL8RTZdK8navG7b99W6Iy7ZIP04CSZpIAjqYGsACQLMZUf2ViBrP8l-9-TLKyzl8hcDqy7ghCqip_P8XkOk1gp4VNg9to2aZ1xbjf72U-QFAFccTMz_BEpWCbUClkhmoknN3D96nISuX3CbeEQL4xccrI_pcSPx4fQlhfYgm07RBDt82ZCIt4RImNK1uYObEconXeBgXlcoXDtzdxzHRLWzNqTn_" />
                            </div>
                        </div>
                    </section>

                    {/* The Journey Timeline */}
                    <section className="py-stack-xl bg-surface">
                        <div className="max-w-container-max mx-auto px-margin-desktop">
                            <div className="text-center mb-stack-xl">
                                <h2 className="font-headline-md text-headline-md text-slate-900 mb-stack-sm">Kerangka Kerja Pengiriman 7 Langkah</h2>
                                <p className="font-body-md text-body-md text-slate-600 max-w-2xl mx-auto">Mulai dari penemuan peta jalan awal hingga dukungan jangka panjang, kami menjaga siklus hidup yang transparan dan berbasis data.</p>
                            </div>
                            {/* Timeline Layout */}
                            <div className="relative space-y-gutter">
                                {/* Vertical Line (Desktop only) */}
                                <div className="hidden md:block absolute left-[31px] top-0 bottom-0 w-px bg-outline-variant"></div>
                                
                                {/* Step 1 */}
                                <div className="relative flex flex-col md:flex-row gap-gutter items-start group">
                                    <div className="z-10 flex-shrink-0 w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-headline-sm border-4 border-surface shadow-sm transition-transform group-hover:scale-110">
                                        01
                                    </div>
                                    <div className="bg-white p-stack-lg rounded-lg border border-blue-100 flex-grow hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-stack-sm">
                                            <h3 className="font-headline-sm text-headline-sm text-slate-900">Penemuan & Audit</h3>
                                            <span className="material-symbols-outlined text-blue-600" data-icon="search_insights">search_insights</span>
                                        </div>
                                        <p className="font-body-md text-body-md text-slate-600 mb-stack-md">Kami mulai dengan menyelami infrastruktur dan tujuan bisnis Anda. Arsitek kami melakukan audit komprehensif terhadap hambatan saat ini dan kebutuhan skalabilitas.</p>
                                        <div className="flex flex-wrap gap-stack-sm">
                                            <span className="bg-blue-50 px-stack-sm py-1 rounded text-label-md font-label-md text-slate-600">Audit Infrastruktur</span>
                                            <span className="bg-blue-50 px-stack-sm py-1 rounded text-label-md font-label-md text-slate-600">Penyelarasan Pemangku Kepentingan</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="relative flex flex-col md:flex-row gap-gutter items-start group">
                                    <div className="z-10 flex-shrink-0 w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-900 font-bold text-headline-sm border-4 border-surface shadow-sm transition-transform group-hover:scale-110">
                                        02
                                    </div>
                                    <div className="bg-white p-stack-lg rounded-lg border border-blue-100 flex-grow hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-stack-sm">
                                            <h3 className="font-headline-sm text-headline-sm text-slate-900">Perencanaan Strategis</h3>
                                            <span className="material-symbols-outlined text-blue-600" data-icon="architecture">architecture</span>
                                        </div>
                                        <p className="font-body-md text-body-md text-slate-600 mb-stack-md">Blueprint teknis terperinci dan peta jalan produk ditetapkan. Kami menentukan teknologi yang digunakan, protokol keamanan, dan fase perilisan yang disesuaikan dengan target ROI Anda.</p>
                                        <div className="flex flex-wrap gap-stack-sm">
                                            <span className="bg-blue-50 px-stack-sm py-1 rounded text-label-md font-label-md text-slate-600">Pemilihan Teknologi</span>
                                            <span className="bg-blue-50 px-stack-sm py-1 rounded text-label-md font-label-md text-slate-600">Penyusunan Peta Jalan</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="relative flex flex-col md:flex-row gap-gutter items-start group">
                                    <div className="z-10 flex-shrink-0 w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-900 font-bold text-headline-sm border-4 border-surface shadow-sm transition-transform group-hover:scale-110">
                                        03
                                    </div>
                                    <div className="bg-white p-stack-lg rounded-lg border border-blue-100 flex-grow hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-stack-sm">
                                            <h3 className="font-headline-sm text-headline-sm text-slate-900">Desain Pengalaman (UX/UI)</h3>
                                            <span className="material-symbols-outlined text-blue-600" data-icon="grid_view">grid_view</span>
                                        </div>
                                        <p className="font-body-md text-body-md text-slate-600 mb-stack-md">Pusat perhatian pada pengguna bertemu dengan kompleksitas fungsional. Kami membuat prototipe antarmuka beresolusi tinggi yang memprioritaskan efisiensi operasional.</p>
                                        <div className="flex flex-wrap gap-stack-sm">
                                            <span className="bg-blue-50 px-stack-sm py-1 rounded text-label-md font-label-md text-slate-600">Sistem Desain</span>
                                            <span className="bg-blue-50 px-stack-sm py-1 rounded text-label-md font-label-md text-slate-600">Logika UX</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 4 */}
                                <div className="relative flex flex-col md:flex-row gap-gutter items-start group">
                                    <div className="z-10 flex-shrink-0 w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-900 font-bold text-headline-sm border-4 border-surface shadow-sm transition-transform group-hover:scale-110">
                                        04
                                    </div>
                                    <div className="bg-white p-stack-lg rounded-lg border border-blue-100 flex-grow hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-stack-sm">
                                            <h3 className="font-headline-sm text-headline-sm text-slate-900">Sprint Agile (Pengembangan)</h3>
                                            <span className="material-symbols-outlined text-blue-600" data-icon="data_object">data_object</span>
                                        </div>
                                        <p className="font-body-md text-body-md text-slate-600 mb-stack-md">Proses engineering mengikuti siklus sprint 2 minggu yang ketat. Kualitas kode dipastikan melalui pipeline CI/CD, pengujian otomatis, dan tinjauan sejawat.</p>
                                        <div className="flex flex-wrap gap-stack-sm">
                                            <span className="bg-blue-50 px-stack-sm py-1 rounded text-label-md font-label-md text-slate-600">Pipeline CI/CD</span>
                                            <span className="bg-blue-50 px-stack-sm py-1 rounded text-label-md font-label-md text-slate-600">Kode Bersih</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 5 */}
                                <div className="relative flex flex-col md:flex-row gap-gutter items-start group">
                                    <div className="z-10 flex-shrink-0 w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-900 font-bold text-headline-sm border-4 border-surface shadow-sm transition-transform group-hover:scale-110">
                                        05
                                    </div>
                                    <div className="bg-white p-stack-lg rounded-lg border border-blue-100 flex-grow hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-stack-sm">
                                            <h3 className="font-headline-sm text-headline-sm text-slate-900">Jaminan Kualitas (QA)</h3>
                                            <span className="material-symbols-outlined text-blue-600" data-icon="verified_user">verified_user</span>
                                        </div>
                                        <p className="font-body-md text-body-md text-slate-600 mb-stack-md">Pengujian penetrasi keamanan yang ketat, tolak ukur performa, dan pengujian penerimaan pengguna (UAT) dilakukan untuk mencapai target peluncuran tanpa cacat.</p>
                                        <div className="flex flex-wrap gap-stack-sm">
                                            <span className="bg-blue-50 px-stack-sm py-1 rounded text-label-md font-label-md text-slate-600">Uji Penetrasi</span>
                                            <span className="bg-blue-50 px-stack-sm py-1 rounded text-label-md font-label-md text-slate-600">Fase UAT</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 6 */}
                                <div className="relative flex flex-col md:flex-row gap-gutter items-start group">
                                    <div className="z-10 flex-shrink-0 w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-900 font-bold text-headline-sm border-4 border-surface shadow-sm transition-transform group-hover:scale-110">
                                        06
                                    </div>
                                    <div className="bg-white p-stack-lg rounded-lg border border-blue-100 flex-grow hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-stack-sm">
                                            <h3 className="font-headline-sm text-headline-sm text-slate-900">Peluncuran & Rilis</h3>
                                            <span className="material-symbols-outlined text-blue-600" data-icon="rocket_launch">rocket_launch</span>
                                        </div>
                                        <p className="font-body-md text-body-md text-slate-600 mb-stack-md">Transisi mulus ke tahap produksi tanpa waktu henti (downtime). Kami mengelola orkestrasi cloud, migrasi data, dan ketersediaan sistem global.</p>
                                        <div className="flex flex-wrap gap-stack-sm">
                                            <span className="bg-blue-50 px-stack-sm py-1 rounded text-label-md font-label-md text-slate-600">Tanpa Downtime</span>
                                            <span className="bg-blue-50 px-stack-sm py-1 rounded text-label-md font-label-md text-slate-600">Konfigurasi Cloud</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 7 */}
                                <div className="relative flex flex-col md:flex-row gap-gutter items-start group">
                                    <div className="z-10 flex-shrink-0 w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-900 font-bold text-headline-sm border-4 border-surface shadow-sm transition-transform group-hover:scale-110">
                                        07
                                    </div>
                                    <div className="bg-white p-stack-lg rounded-lg border border-blue-100 flex-grow hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-stack-sm">
                                            <h3 className="font-headline-sm text-headline-sm text-slate-900">Pemeliharaan & Dukungan</h3>
                                            <span className="material-symbols-outlined text-blue-600" data-icon="support_agent">support_agent</span>
                                        </div>
                                        <p className="font-body-md text-body-md text-slate-600 mb-stack-md">Pemeliharaan berkelanjutan, dukungan teknis bergaransi SLA, dan peningkatan fitur iteratif untuk memastikan software berkembang seiring bisnis Anda.</p>
                                        <div className="flex flex-wrap gap-stack-sm">
                                            <span className="bg-blue-50 px-stack-sm py-1 rounded text-label-md font-label-md text-slate-600">SLA 24/7</span>
                                            <span className="bg-blue-50 px-stack-sm py-1 rounded text-label-md font-label-md text-slate-600">Optimasi Berkelanjutan</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Methodology Bento Grid */}
                    <section className="py-stack-xl bg-slate-50">
                        <div className="max-w-container-max mx-auto px-margin-desktop">
                            <div className="flex flex-col md:flex-row justify-between items-end mb-stack-xl gap-gutter">
                                <div className="max-w-xl">
                                    <h2 className="font-headline-md text-headline-md text-slate-900 mb-stack-sm">Metodologi Standar Institusi</h2>
                                    <p className="font-body-md text-body-md text-slate-600">Kami tidak sekadar menulis kode; kami merancang sistem. Metodologi kami dibangun di atas tiga pilar utama: keamanan sejak desain, transparansi radikal, dan rekayasa performa.</p>
                                </div>
                                <button className="font-button text-button border border-outline px-stack-lg py-stack-sm rounded hover:bg-surface-container transition-colors">Unduh Panduan PDF</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                                {/* Security Card */}
                                <div className="bg-white p-stack-lg border border-blue-100 rounded-lg md:col-span-2">
                                    <div className="flex items-center gap-stack-sm mb-stack-md">
                                        <span className="material-symbols-outlined text-blue-600" style={{fontVariationSettings: "'FILL' 1"}}>shield</span>
                                        <h4 className="font-headline-sm text-headline-sm text-slate-900">Arsitektur Berbasis Keamanan</h4>
                                    </div>
                                    <p className="font-body-md text-body-md text-slate-600 mb-stack-xl">Semua pengembangan mematuhi standar ISO/IEC 27001 dan keamanan global. Kami mengimplementasikan analisis kode di pipeline kami untuk mencegah celah keamanan sejak baris kode pertama.</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-md">
                                        <div className="text-center p-stack-sm border border-blue-100 rounded">
                                            <div className="font-bold text-blue-900">ISO 27001</div>
                                            <div className="text-label-md font-label-md text-slate-600">Sertifikasi</div>
                                        </div>
                                        <div className="text-center p-stack-sm border border-blue-100 rounded">
                                            <div className="font-bold text-blue-900">GDPR</div>
                                            <div className="text-label-md font-label-md text-slate-600">Sesuai</div>
                                        </div>
                                        <div className="text-center p-stack-sm border border-blue-100 rounded">
                                            <div className="font-bold text-blue-900">SOC2</div>
                                            <div className="text-label-md font-label-md text-slate-600">Standar</div>
                                        </div>
                                        <div className="text-center p-stack-sm border border-blue-100 rounded">
                                            <div className="font-bold text-blue-900">SAST</div>
                                            <div className="text-label-md font-label-md text-slate-600">Berkelanjutan</div>
                                        </div>
                                    </div>
                                </div>
                                {/* Tech Stack Card */}
                                <div className="text-white bg-blue-700 p-stack-lg rounded-lg flex flex-col justify-between overflow-hidden relative">
                                    <div className="z-10">
                                        <h4 className="font-headline-sm text-headline-sm text-blue-50 mb-stack-sm">Teknologi Terkini</h4>
                                        <p className="font-body-sm text-body-sm text-blue-50/80">Kami memanfaatkan bahasa dan framework terbaik di industri untuk stabilitas.</p>
                                    </div>
                                    <div className="mt-stack-xl flex flex-wrap gap-stack-xs opacity-60 z-10">
                                        <span className="bg-surface-container px-2 py-1 rounded text-label-md text-slate-900 font-label-md">Kubernetes</span>
                                        <span className="bg-surface-container px-2 py-1 rounded text-label-md text-slate-900 font-label-md">Rust</span>
                                        <span className="bg-surface-container px-2 py-1 rounded text-label-md text-slate-900 font-label-md">Go</span>
                                        <span class="bg-surface-container px-2 py-1 rounded text-label-md text-slate-900 font-label-md">TypeScript</span>
                                        <span className="bg-surface-container px-2 py-1 rounded text-label-md text-slate-900 font-label-md">PostgreSQL</span>
                                        <span className="bg-surface-container px-2 py-1 rounded text-label-md text-slate-900 font-label-md">React</span>
                                        <span className="bg-surface-container px-2 py-1 rounded text-label-md text-slate-900 font-label-md">Laravel</span>
                                    </div>
                                    <div className="absolute -right-10 -bottom-10 opacity-10">
                                        <span className="material-symbols-outlined text-[120px]" data-icon="developer_board">developer_board</span>
                                    </div>
                                </div>
                                {/* Transparency Card */}
                                <div className="bg-white p-stack-lg border border-blue-100 rounded-lg">
                                    <span className="material-symbols-outlined text-blue-600 mb-stack-md" data-icon="analytics">analytics</span>
                                    <h4 className="font-headline-sm text-headline-sm text-slate-900 mb-stack-sm">Transparansi Total</h4>
                                    <p className="font-body-md text-body-md text-slate-600">Akses real-time ke alat manajemen proyek kami. Anda melihat apa yang kami lihat, memberikan pengawasan tak tertandingi terhadap progres proyek Anda.</p>
                                </div>
                                {/* Global Delivery Card */}
                                <div className="bg-white p-stack-lg border border-blue-100 rounded-lg md:col-span-2 relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h4 className="font-headline-sm text-headline-sm text-slate-900 mb-stack-sm">Pusat Pengembangan Global</h4>
                                        <p className="font-body-md text-body-md text-slate-600 max-w-md">Model pengiriman hybrid kami menggabungkan strategi lokal dengan pusat teknis terdistribusi untuk siklus pengembangan cepat dan struktur biaya yang dioptimalkan.</p>
                                    </div>
                                    <div className="mt-stack-lg h-32 w-full bg-surface-container border border-blue-100 rounded flex items-center justify-center">
                                        <span className="font-label-md text-label-md text-outline">Peta Pusat Pengembangan (Placeholder)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-stack-xl">
                        <div className="max-w-container-max mx-auto px-margin-desktop bg-blue-700 text-white p-stack-xl rounded-xl text-center relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="font-display-lg text-display-lg mb-stack-md">Siap meningkatkan skala bisnis inti Anda?</h2>
                                <p className="font-body-lg text-body-lg text-white/80 mb-stack-xl max-w-xl mx-auto">Jadwalkan panggilan discovery teknis dengan arsitek senior kami untuk mengaudit teknologi Anda saat ini dan menjelajahi peluang pertumbuhan.</p>
                                <div className="flex flex-col md:flex-row gap-stack-md justify-center">
                                    <Link href="/kontak" className="inline-block bg-white text-blue-900 font-button text-button px-stack-xl py-stack-md rounded hover:bg-slate-50 transition-colors">Jadwalkan Konsultasi</Link>
                                    <Link href="/portfolio" className="inline-block border border-on-primary/30 text-white font-button text-button px-stack-xl py-stack-md rounded hover:bg-white/10 transition-colors">Lihat Studi Kasus</Link>
                                </div>
                            </div>
                            {/* Background Decoration */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2"></div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="bg-surface-container py-stack-xl border-t border-blue-100">
                    <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter">
                        <div className="col-span-1 md:col-span-1">
                            <div className="font-headline-sm text-headline-sm font-bold text-blue-900 mb-stack-md tracking-tight">CTECH</div>
                            <p className="font-body-sm text-body-sm text-slate-600">Solusi software B2B dan enterprise terkemuka. Mewujudkan kepercayaan melalui keunggulan teknis.</p>
                        </div>
                        <div>
                            <h5 className="font-button text-button text-blue-900 uppercase mb-6">Solusi</h5>
                            <ul className="space-y-4">
                                <li><Link className="font-body-sm text-body-sm text-slate-600 hover:text-blue-900 transition-colors" href="/layanan">Pengembangan Software Custom</Link></li>
                                <li><Link className="font-body-sm text-body-sm text-slate-600 hover:text-blue-900 transition-colors" href="/industri">Sistem ERP & POS Multicabang</Link></li>
                                <li><Link className="font-body-sm text-body-sm text-slate-600 hover:text-blue-900 transition-colors" href="/solusi/photobooth">Software Photobooth Interaktif</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-button text-button text-blue-900 uppercase mb-6">Perusahaan</h5>
                            <ul className="space-y-4">
                                <li><Link className="font-body-sm text-body-sm text-slate-600 hover:text-blue-900 transition-colors" href="/tentang">Tentang Kami</Link></li>
                                <li><Link className="font-body-sm text-body-sm text-slate-600 hover:text-blue-900 transition-colors" href="/portfolio">Kisah Sukses</Link></li>
                                <li><Link className="font-body-sm text-body-sm text-slate-600 hover:text-blue-900 transition-colors" href="/proses">Proses Development</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-button text-button text-blue-900 uppercase mb-6">Kontak & Bantuan</h5>
                            <ul className="space-y-4">
                                <li><Link className="font-body-sm text-body-sm text-slate-600 hover:text-blue-900 transition-colors" href="/kontak">Hubungi Kami</Link></li>
                                <li><span className="font-body-sm text-body-sm text-slate-600">ptkreatifteknologimajubersama@gmail.com</span></li>
                                <li><span className="font-body-sm text-body-sm text-slate-600">+62 822-9311-8410</span></li>
                            </ul>
                        </div>
                    </div>
                    <div className="max-w-container-max mx-auto px-margin-desktop mt-stack-xl pt-stack-md border-t border-blue-100 flex flex-col md:flex-row justify-between items-center gap-stack-md">
                        <p className="font-body-sm text-body-sm text-slate-600">© {new Date().getFullYear()} PT Kreatif Teknologi Maju Bersama (CTECH). All rights reserved.</p>
                        <div className="flex gap-stack-lg text-slate-600">
                            <a className="hover:text-blue-600 transition-colors" href="#"><span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>language</span></a>
                            <a className="hover:text-blue-600 transition-colors" href="#"><span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>hub</span></a>
                            <a className="hover:text-blue-600 transition-colors" href="#"><span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span></a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

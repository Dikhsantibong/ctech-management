import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import PublicNavbar from '@/components/public-navbar';

export default function CaseStudies() {
    useEffect(() => {
        // Simple intersection observer for reveal animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-10');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.case-study-card').forEach(card => {
            card.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700');
            observer.observe(card);
        });
    }, []);

    return (
        <>
            <Head>
                <title>Case Studi | CTECH</title>
                <style dangerouslySetInnerHTML={{ __html: `
                    .material-symbols-outlined {
                        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                        display: inline-block;
                        vertical-align: middle;
                    }
                    body {
                        background-color: #f7f9fb;
                        color: #191c1e;
                        -webkit-font-smoothing: antialiased;
                    }
                    .case-study-card {
                        transition: transform 0.3s ease, border-color 0.3s ease;
                    }
                    .case-study-card:hover {
                        transform: translateY(-4px);
                        border-color: #0051d5;
                    }
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}} />
            </Head>

            <div className="font-body-md text-body-md min-h-screen flex flex-col">
                <PublicNavbar />

                <main className="pt-32 pb-stack-xl flex-grow">
                    {/* Hero Section */}
                    <header className="max-w-container-max mx-auto px-margin-desktop mb-stack-xl">
                        <div className="max-w-3xl">
                            <span className="font-label-md text-label-md text-secondary tracking-widest uppercase mb-stack-sm block">Dampak Global</span>
                            <h1 className="font-display-lg text-display-lg text-on-surface mb-stack-md">Hasil strategis yang diberikan untuk perusahaan kelas dunia.</h1>
                            <p className="font-body-lg text-body-lg text-on-surface-variant">Kami bermitra dengan para pemimpin industri untuk memecahkan tantangan teknis kompleks dan mendorong keunggulan operasional yang terukur.</p>
                        </div>
                    </header>

                    {/* Filter Bar */}
                    <section className="max-w-container-max mx-auto px-margin-desktop mb-stack-lg">
                        <div className="flex flex-wrap items-center justify-between gap-stack-md py-4 border-y border-outline-variant">
                            <div className="flex gap-stack-md overflow-x-auto no-scrollbar pb-2 md:pb-0">
                                <button className="px-4 py-1.5 bg-primary text-on-primary text-label-md font-label-md rounded-full whitespace-nowrap">Semua Industri</button>
                                <button className="px-4 py-1.5 text-on-surface-variant hover:bg-surface-container-high text-label-md font-label-md rounded-full transition-colors whitespace-nowrap">FinTech</button>
                                <button className="px-4 py-1.5 text-on-surface-variant hover:bg-surface-container-high text-label-md font-label-md rounded-full transition-colors whitespace-nowrap">Rantai Pasok</button>
                                <button className="px-4 py-1.5 text-on-surface-variant hover:bg-surface-container-high text-label-md font-label-md rounded-full transition-colors whitespace-nowrap">Kesehatan</button>
                                <button className="px-4 py-1.5 text-on-surface-variant hover:bg-surface-container-high text-label-md font-label-md rounded-full transition-colors whitespace-nowrap">Manufaktur</button>
                            </div>
                            <div className="flex items-center text-on-surface-variant text-label-md font-label-md whitespace-nowrap">
                                <span className="mr-2">Menampilkan 12 hasil</span>
                                <span className="material-symbols-outlined">filter_list</span>
                            </div>
                        </div>
                    </section>

                    {/* Case Studies Grid */}
                    <section className="max-w-container-max mx-auto px-margin-desktop">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                            {/* Card 1: Main Feature */}
                            <div className="case-study-card bg-surface-container-lowest border border-outline-variant p-stack-lg flex flex-col group md:col-span-2 rounded-lg">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-xl h-full">
                                    <div className="order-2 lg:order-1 flex flex-col justify-center">
                                        <div className="flex items-center gap-stack-sm mb-stack-md">
                                            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 text-label-md font-label-md rounded">Featured</span>
                                            <span className="text-on-surface-variant text-label-md font-label-md">Solusi FinTech</span>
                                        </div>
                                        <h2 className="font-headline-md text-headline-md mb-stack-md">Meningkatkan Likuiditas Global untuk NeoBank International</h2>
                                        <p className="text-on-surface-variant mb-stack-lg leading-relaxed">Migrasi mesin transaksi monolitik lama ke arsitektur layanan mikro ketersediaan tinggi untuk mendukung lebih dari 15 juta pengguna aktif harian di berbagai pasar.</p>
                                        <div className="grid grid-cols-2 gap-stack-md mb-stack-lg">
                                            <div className="bg-surface-container p-stack-md rounded">
                                                <div className="text-secondary font-headline-sm text-headline-sm">99.99%</div>
                                                <div className="text-on-surface-variant text-label-md font-label-md uppercase">Keandalan Uptime</div>
                                            </div>
                                            <div className="bg-surface-container p-stack-md rounded">
                                                <div className="text-secondary font-headline-sm text-headline-sm">40%</div>
                                                <div className="text-on-surface-variant text-label-md font-label-md uppercase">Pengurangan Latensi</div>
                                            </div>
                                        </div>
                                        <Link className="flex items-center text-secondary font-button text-button group/btn w-fit" href="#">
                                            Lihat Detail Studi Kasus 
                                            <span className="material-symbols-outlined ml-2 transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                                        </Link>
                                    </div>
                                    <div className="order-1 lg:order-2 h-full min-h-[300px]">
                                        <div className="relative overflow-hidden rounded-lg bg-primary-container border border-outline-variant h-full">
                                            <img alt="Dashboard Mockup" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida/AP1WRLvVRb3EL0X_e8Hmgaj5SMWD2uZjnrpvqOINVmVq1dEIWguIFNbBSSM4_5tCbTprXylJtgfSE2-RTFWypUPln0xtG03i5nz1_ySC5qJpmMNgfr-FwSzjRbosnBBakiJ83vnw-8NT1lqENTlpt7m9EJnIgI6mTxIhG1VraJ-n6TVBS_4bYo4mDA6VhmtiTqbc4KB-HNkfS7lukI8kUOHLuxdVmM4E7t4_MuYvuH3-K5jE4LnYBzko1c23E9E" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="case-study-card bg-surface-container-lowest border border-outline-variant p-stack-lg flex flex-col rounded-lg group">
                                <div className="mb-stack-lg h-48 overflow-hidden rounded bg-surface-container relative">
                                    <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Logistics Infrastructure" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5KnHILKNmCILTrmbi6EA4IpxyfKB2UzsIsVYJlNCpcUgs5B_F5MRvJBhnCKoJp6JpP6Hp7q4wsTs3-DLRqZ21xLrAFwkdl5eHl8Ant978Z3ttHb_a7sLd0ICTGLu3eJWVdSy8E7hhNfBktZMk9CVb0yc4VlWt_uxjOvQRht2tPc7j_PxuqnEXkJoXfSJTTE0hNeWlBOiN0XA89YhurGleLtgTvc6D7swDMepk-5MjdYtPEFFDTnboT-jMDK2khu_Y8o4i7l8MBe2l" />
                                </div>
                                <span className="text-on-surface-variant text-label-md font-label-md mb-stack-xs uppercase">Logistik & Rantai Pasok</span>
                                <h3 className="font-headline-sm text-headline-sm mb-stack-sm">Sistem Kecerdasan Armada Real-Time</h3>
                                <p className="text-on-surface-variant text-body-sm mb-stack-lg grow">Perutean terintegrasi berbasis AI untuk konglomerat pengiriman global, mengoptimalkan konsumsi bahan bakar dan kepadatan rute.</p>
                                <div className="flex items-center justify-between pt-stack-md border-t border-outline-variant">
                                    <div className="text-secondary font-bold text-headline-sm">22%</div>
                                    <div className="text-on-surface-variant text-label-md font-label-md">Penghematan Biaya</div>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="case-study-card bg-surface-container-lowest border border-outline-variant p-stack-lg flex flex-col rounded-lg group">
                                <div className="mb-stack-lg h-48 overflow-hidden rounded bg-surface-container relative">
                                    <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Healthcare Systems" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDd1ZNN-mJloa8orZNDAbhGlDjHqwjhu8rna2nEc7dsOSae6Ez8oio_q4d3gXTvg7oJ4SqVzzkoPvAjAQnHDw3_icoJU9YTJqw-fo6kmrBloUETsqTENgzYpf3BGYKs_iSrLeIGrGAWQWO2CJlrqiPnPyoR0yDnPy6FFhD9789zZswi7yUo1KuHRIzBA3AFpspU17onVgKmC4cTlJ7LfDILVcdF5tUFANeL8B9lIzFjztB3OvESd3JfGEjZgJpIjlaFz4svcXVdhikp" />
                                </div>
                                <span className="text-on-surface-variant text-label-md font-label-md mb-stack-xs uppercase">Sistem Kesehatan</span>
                                <h3 className="font-headline-sm text-headline-sm mb-stack-sm">Manajemen Siklus Hidup Pasien</h3>
                                <p className="text-on-surface-variant text-body-sm mb-stack-lg grow">Pusat data yang aman untuk jaringan rumah sakit, memungkinkan pemodelan hasil pasien prediktif.</p>
                                <div className="flex items-center justify-between pt-stack-md border-t border-outline-variant">
                                    <div className="text-secondary font-bold text-headline-sm">80%</div>
                                    <div className="text-on-surface-variant text-label-md font-label-md">Peningkatan Efisiensi</div>
                                </div>
                            </div>

                            {/* Card 4 */}
                            <div className="case-study-card bg-surface-container-lowest border border-outline-variant p-stack-lg flex flex-col rounded-lg group">
                                <div className="mb-stack-lg h-48 overflow-hidden rounded bg-surface-container relative">
                                    <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Urban Infrastructure" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBJpc-KWRnNtdl_6meb1GnMD_g8eS6xkq1B_Gr0D26HRu20uLKlXr8aZ82eKcgX1X0ZxmJ7L_VqYFO-BPw5GoLCthroTnfPRulSVRmxZYLD6aXcU5yNHGhpz3jaJAoCbQ5Nr1ZwXUJhwZ4g78PMOvZu5HTQ8bvTDFVPLhXA84zqEkJEieVFvjp8BCiTLenXt1qyvisZsDzemTfoYVlzwAyPwzgONrGnFNsqHMf-7G8cD-KzWWhutskVDiAJsgdUXRP46O6k5G2Faa9" />
                                </div>
                                <span className="text-on-surface-variant text-label-md font-label-md mb-stack-xs uppercase">Infrastruktur Perkotaan</span>
                                <h3 className="font-headline-sm text-headline-sm mb-stack-sm">Pusat Data IoT Kota Pintar</h3>
                                <p className="text-on-surface-variant text-body-sm mb-stack-lg grow">Platform orkestrasi data terpusat untuk sensor kota, meningkatkan waktu tanggap darurat di seluruh area.</p>
                                <div className="flex items-center justify-between pt-stack-md border-t border-outline-variant">
                                    <div className="text-secondary font-bold text-headline-sm">15min</div>
                                    <div className="text-on-surface-variant text-label-md font-label-md">Pemotongan Waktu Respon</div>
                                </div>
                            </div>

                            {/* Card 5 */}
                            <div className="case-study-card bg-surface-container-lowest border border-outline-variant p-stack-lg flex flex-col rounded-lg group">
                                <div className="mb-stack-lg h-48 overflow-hidden rounded bg-surface-container relative">
                                    <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Enterprise SaaS" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsBWp84gCY8McZPoW2G6_Qz4C5iTDJYL43NKtmchz7sOLQsz_fDWd_9_Mlv7hADZDHmt6himLV4D5BroHF9J_MZokDfxot05TWjhJbODEIDbIr66sxqKfvKv0vchW8nhzchS2uoGpf3-DeWKFmJ_4yxPeLUiut0PS2F7u63s6_KMkeMBLMDrwSbKtIzPmBdpNWDpO0fDfUy_VkYBHEzyVl8YqN1TPDj_0Mul7RtDCtGaCkirsvR9ftCqcpeIjaQJcMuyACzywpRp5E" />
                                </div>
                                <span className="text-on-surface-variant text-label-md font-label-md mb-stack-xs uppercase">Enterprise SaaS</span>
                                <h3 className="font-headline-sm text-headline-sm mb-stack-sm">Skalabilitas Infrastruktur Cloud</h3>
                                <p className="text-on-surface-variant text-body-sm mb-stack-lg grow">Pipeline DevOps otomatis dan implementasi logika auto-scaling untuk platform SDM global selama fase pertumbuhan 300%.</p>
                                <div className="flex items-center justify-between pt-stack-md border-t border-outline-variant">
                                    <div className="text-secondary font-bold text-headline-sm">3x</div>
                                    <div className="text-on-surface-variant text-label-md font-label-md">Dukungan Pertumbuhan</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="max-w-container-max mx-auto px-margin-desktop mt-stack-xl">
                        <div className="bg-primary-container p-stack-xl rounded-lg text-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary to-transparent"></div>
                            <h2 className="font-headline-md text-headline-md text-on-primary-container mb-stack-md relative z-10">Siap membangun kisah sukses Anda?</h2>
                            <p className="text-on-primary-container/80 mb-stack-lg max-w-xl mx-auto relative z-10">Konsultan kami siap mengaudit ekosistem Anda saat ini dan mengusulkan peta jalan untuk pertumbuhan.</p>
                            <div className="flex flex-col sm:flex-row justify-center gap-stack-md relative z-10">
                                <Link href="/kontak" className="inline-block bg-secondary text-on-secondary px-8 py-3 font-button text-button rounded hover:brightness-110 transition-all">Jadwalkan Konsultasi</Link>
                                <button className="border border-outline-variant text-on-primary-container px-8 py-3 font-button text-button rounded hover:bg-on-primary-container/10 transition-all">Unduh Profil Perusahaan</button>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="bg-surface-container w-full py-stack-xl mt-auto">
                    <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter">
                        <div className="col-span-1 md:col-span-1">
                            <span className="font-headline-sm text-headline-sm font-bold text-primary mb-stack-sm block">CTECH</span>
                            <p className="text-on-surface-variant text-body-sm mb-stack-md">Solusi software B2B dan enterprise terkemuka. Mewujudkan kepercayaan melalui keunggulan teknis.</p>
                        </div>
                        <div>
                            <h4 className="font-button text-button text-on-surface mb-stack-md uppercase">Solusi</h4>
                            <ul className="space-y-stack-sm">
                                <li><Link className="text-on-surface-variant hover:text-primary transition-colors text-body-sm" href="/layanan">Pengembangan Software Custom</Link></li>
                                <li><Link className="text-on-surface-variant hover:text-primary transition-colors text-body-sm" href="/industri">Sistem ERP & POS Multicabang</Link></li>
                                <li><Link className="text-on-surface-variant hover:text-primary transition-colors text-body-sm" href="/solusi/photobooth">Software Photobooth Interaktif</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-button text-button text-on-surface mb-stack-md uppercase">Perusahaan</h4>
                            <ul className="space-y-stack-sm">
                                <li><Link className="text-on-surface-variant hover:text-primary transition-colors text-body-sm" href="/tentang">Tentang Kami</Link></li>
                                <li><Link className="text-primary underline text-body-sm" href="/case-studi">Kisah Sukses</Link></li>
                                <li><Link className="text-on-surface-variant hover:text-primary transition-colors text-body-sm" href="/proses">Proses Development</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-button text-button text-on-surface mb-stack-md uppercase">Kontak & Bantuan</h4>
                            <ul className="space-y-stack-sm">
                                <li><Link className="text-on-surface-variant hover:text-primary transition-colors text-body-sm" href="/kontak">Hubungi Kami</Link></li>
                                <li><span className="text-on-surface-variant text-body-sm">ptkreatifteknologimajubersama@gmail.com</span></li>
                                <li><span className="text-on-surface-variant text-body-sm">+62 822-9311-8410</span></li>
                            </ul>
                        </div>
                    </div>
                    <div className="max-w-container-max mx-auto px-margin-desktop pt-stack-xl mt-stack-xl border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-stack-md">
                        <p className="font-body-sm text-body-sm text-on-surface-variant">© {new Date().getFullYear()} PT Kreatif Teknologi Maju Bersama (CTECH). All rights reserved.</p>
                        <div className="flex gap-stack-md">
                            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary" style={{fontVariationSettings: "'FILL' 1"}}>language</span>
                            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary" style={{fontVariationSettings: "'FILL' 1"}}>hub</span>
                            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

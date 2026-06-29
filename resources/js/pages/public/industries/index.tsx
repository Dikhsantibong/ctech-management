import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import { PremiumNavbar as PublicNavbar } from '@/components/ui/PremiumNavbar';

export default function Industries({ portfolios }: { portfolios: any[] }) {
    useEffect(() => {
        // Micro-interaction for smooth scrolling and header transparency change
        const handleScroll = () => {
            const nav = document.querySelector('nav');
            if (nav) {
                if (window.scrollY > 50) {
                    nav.classList.add('shadow-md');
                } else {
                    nav.classList.remove('shadow-md');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Add intersection observer for reveal effects
        const observerOptions = {
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('opacity-0', 'translate-y-8');
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                }
            });
        }, observerOptions);

        document.querySelectorAll('section > div > div').forEach(el => {
            el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-8');
            revealObserver.observe(el);
        });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head>
                <title>Keahlian Industri | CTECH</title>
                <style dangerouslySetInnerHTML={{ __html: `
                    .material-symbols-outlined {
                        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                        vertical-align: middle;
                    }
                    .industry-card-overlay {
                        background: linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%);
                    }
                `}} />
            </Head>

            <div className="bg-white text-slate-900 font-body-md antialiased min-h-screen">
                <PublicNavbar />

                <main className="pt-20">
                    {/* Hero Section */}
                    <header className="relative h-[614px] flex items-center overflow-hidden bg-[#131b2e]">
                        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBk0fPUiJA5G18Zw4ZpGQUiaMVAU815dMCO-zjrIzyNn64jhSSnf9gKkE4BcM9Y_xSehvZCXDt5y_XY2OPa0J8DkAaeUOUqgbwmPQn7nBtUraSj16fxJH82eBaWrHmJVVqiSM6CmyioBDu9abaB46CmQdhWLsP2ZfLPlHfA89Bii6idROijHmd6bFZDJuB8kTTFwJBsn6DjptjKqL9IGOMTgVaDnyn_bOwDs5G4z45rXhPSpI7iX_55zPsKTWDkRRUPskBl1qnoSfOT')"}}></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-[#131b2e]/60 to-[#131b2e]/90"></div>
                        <div className="relative z-10 max-w-container-max mx-auto px-margin-desktop w-full">
                            <div className="max-w-2xl">
                                <span className="inline-block font-label-md text-label-md text-blue-600-fixed mb-stack-md uppercase tracking-widest">Keahlian Industri</span>
                                <h1 className="font-display-lg text-display-lg text-white mb-stack-lg leading-tight">Software yang Disesuaikan dengan Ambisi Industri Anda.</h1>
                                <p className="font-body-lg text-body-lg text-white/80 max-w-xl">Kami merekayasa ekosistem digital berkinerja tinggi untuk memecahkan kerumitan operasional industri berskala global.</p>
                            </div>
                        </div>
                    </header>

                    {/* Bento Grid Industries */}
                    <section className="py-stack-xl bg-surface">
                        <div className="max-w-container-max mx-auto px-margin-desktop">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                                {(portfolios || []).map((portfolio, index) => {
                                    const isFirst = index === 0;
                                    const isSecond = index === 1;
                                    const isThirdOrFourth = index === 2 || index === 3;
                                    const isFifthOrSixth = index === 4 || index === 5;

                                    return (
                                        <div
                                            key={portfolio.id}
                                            className={`group relative overflow-hidden rounded-lg border border-blue-100 transition-all hover:shadow-lg ${
                                                isFirst ? 'md:col-span-8 aspect-[16/9]' :
                                                isSecond ? 'md:col-span-4' :
                                                isThirdOrFourth ? 'md:col-span-6 aspect-[4/3]' :
                                                isFifthOrSixth ? 'md:col-span-6 aspect-[16/9]' :
                                                'md:col-span-6 aspect-[16/9]'
                                            }`}
                                        >
                                            {portfolio.image && (
                                                <img
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    src={`/storage/${portfolio.image}`}
                                                    alt={portfolio.title}
                                                />
                                            )}
                                            <div className="industry-card-overlay absolute inset-0 flex flex-col justify-end p-8 text-white">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>business</span>
                                                    <span className="font-label-md text-label-md uppercase tracking-wider">{portfolio.category}</span>
                                                </div>
                                                <h3 className={`${isFirst || isThirdOrFourth ? 'font-headline-md text-headline-md' : 'font-headline-sm text-headline-sm'} mb-4`}>{portfolio.title}</h3>
                                                <p className={`${isSecond ? 'font-body-sm text-body-sm' : 'font-body-md text-body-md'} mb-6 text-white/80 max-w-lg line-clamp-3`}>{portfolio.description}</p>
                                                {portfolio.link ? (
                                                    <a
                                                        href={portfolio.link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center gap-2 font-button text-button group/btn"
                                                    >
                                                        Lihat Solusi <span className="material-symbols-outlined transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                                                    </a>
                                                ) : (
                                                    <Link href={`/portfolio/${portfolio.id}`} className="flex items-center gap-2 font-button text-button group/btn">
                                                        Lihat Detail <span className="material-symbols-outlined transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {(!portfolios || portfolios.length === 0) && (
                                    <div className="md:col-span-12 text-center py-12">
                                        <p className="text-slate-600">Belum ada portfolio yang ditampilkan.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Solutions Methodology */}
                    <section className="py-stack-xl bg-slate-50">
                        <div className="max-w-container-max mx-auto px-margin-desktop">
                            <div className="mb-stack-xl text-center">
                                <h2 className="font-headline-md text-headline-md text-blue-900 mb-stack-md">Dirancang Sesuai Realita Bisnis Anda</h2>
                                <p className="font-body-lg text-body-lg text-slate-600 max-w-2xl mx-auto">Kami tidak percaya pada satu solusi untuk semua. Pendekatan kami menargetkan titik masalah mendasar yang unik di sektor Anda.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                                {/* Feature 1 */}
                                <div className="p-8 bg-white border border-blue-100 rounded-lg">
                                    <div className="w-12 h-12 text-white bg-blue-700 text-blue-600-fixed flex items-center justify-center rounded-full mb-6">
                                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>encrypted</span>
                                    </div>
                                    <h4 className="font-headline-sm text-headline-sm mb-4">Keamanan Sangat Kritis</h4>
                                    <p className="font-body-md text-body-md text-slate-600">Infrastruktur kami dibangun dengan menjadikan kepatuhan dan standar keamanan tinggi sebagai pilar utama, bukan sekadar renungan.</p>
                                </div>
                                {/* Feature 2 */}
                                <div className="p-8 bg-white border border-blue-100 rounded-lg">
                                    <div className="w-12 h-12 text-white bg-blue-700 text-blue-600-fixed flex items-center justify-center rounded-full mb-6">
                                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>hub</span>
                                    </div>
                                    <h4 className="font-headline-sm text-headline-sm mb-4">Modernisasi Sistem Lama (Legacy)</h4>
                                    <p className="font-body-md text-body-md text-slate-600">Kami menjembatani kesenjangan antara sistem legacy Anda dengan infrastruktur cloud-native modern melalui orkestrasi API cerdas.</p>
                                </div>
                                {/* Feature 3 */}
                                <div className="p-8 bg-white border border-blue-100 rounded-lg">
                                    <div className="w-12 h-12 text-white bg-blue-700 text-blue-600-fixed flex items-center justify-center rounded-full mb-6">
                                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>monitoring</span>
                                    </div>
                                    <h4 className="font-headline-sm text-headline-sm mb-4">Kecerdasan Real-Time</h4>
                                    <p className="font-body-md text-body-md text-slate-600">Ubah aliran data mentah menjadi wawasan eksekutif yang dapat ditindaklanjuti dengan dasbor khusus dan pemodelan prediktif.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-stack-xl bg-blue-700 text-white">
                        <div className="max-w-container-max mx-auto px-margin-desktop text-center">
                            <h2 className="font-display-lg text-display-lg mb-stack-lg">Siap mendefinisikan ulang standar industri Anda?</h2>
                            <p className="font-body-lg text-body-lg text-white/70 mb-stack-xl max-w-2xl mx-auto">Konsultasikan dengan spesialis sektor kami untuk merancang peta jalan software yang mendorong pertumbuhan terukur.</p>
                            <div className="flex flex-col md:flex-row gap-gutter justify-center">
                                <Link href="/kontak" className="bg-blue-600 text-white px-8 py-4 font-button text-button rounded-full hover:opacity-90 transition-opacity">
                                    Jadwalkan Konsultasi
                                </Link>
                                <button className="border border-on-primary text-white px-8 py-4 font-button text-button rounded-full hover:bg-on-primary hover:text-blue-900 transition-all">
                                    Unduh Wawasan Industri
                                </button>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="bg-surface-container dark:bg-slate-100 w-full py-stack-xl">
                    <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter">
                        <div className="col-span-1 md:col-span-1">
                            <div className="font-headline-sm text-headline-sm font-bold text-blue-900 dark:text-inverse-primary mb-6 tracking-tight">
                                CTECH
                            </div>
                            <p className="font-body-sm text-body-sm text-slate-600 dark:text-slate-600/80 mb-6">
                                Solusi software B2B dan enterprise terkemuka. Mewujudkan kepercayaan melalui keunggulan teknis.
                            </p>
                        </div>
                        <div>
                            <h5 className="font-button text-button text-blue-900 dark:text-inverse-primary uppercase mb-6">Solusi</h5>
                            <ul className="space-y-4">
                                <li><Link className="font-body-sm text-body-sm text-slate-600 dark:text-slate-600/80 hover:text-blue-900 dark:hover:text-inverse-primary transition-colors" href="/layanan">Pengembangan Software Custom</Link></li>
                                <li><Link className="font-body-sm text-body-sm text-slate-600 dark:text-slate-600/80 hover:text-blue-900 dark:hover:text-inverse-primary transition-colors" href="/industri">Sistem ERP & POS Multicabang</Link></li>
                                <li><Link className="font-body-sm text-body-sm text-slate-600 dark:text-slate-600/80 hover:text-blue-900 dark:hover:text-inverse-primary transition-colors" href="/solusi/photobooth">Software Photobooth Interaktif</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-button text-button text-blue-900 dark:text-inverse-primary uppercase mb-6">Perusahaan</h5>
                            <ul className="space-y-4">
                                <li><Link className="font-body-sm text-body-sm text-slate-600 dark:text-slate-600/80 hover:text-blue-900 dark:hover:text-inverse-primary transition-colors" href="/tentang">Tentang Kami</Link></li>
                                <li><Link className="font-body-sm text-body-sm text-slate-600 dark:text-slate-600/80 hover:text-blue-900 dark:hover:text-inverse-primary transition-colors" href="/portfolio">Kisah Sukses</Link></li>
                                <li><Link className="font-body-sm text-body-sm text-slate-600 dark:text-slate-600/80 hover:text-blue-900 dark:hover:text-inverse-primary transition-colors" href="/#process">Proses Development</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-button text-button text-blue-900 dark:text-inverse-primary uppercase mb-6">Kontak & Bantuan</h5>
                            <ul className="space-y-4">
                                <li><Link className="font-body-sm text-body-sm text-slate-600 dark:text-slate-600/80 hover:text-blue-900 dark:hover:text-inverse-primary transition-colors" href="/kontak">Hubungi Kami</Link></li>
                                <li><span className="font-body-sm text-body-sm text-slate-600 dark:text-slate-600/80">ptkreatifteknologimajubersama@gmail.com</span></li>
                                <li><span className="font-body-sm text-body-sm text-slate-600 dark:text-slate-600/80">+62 822-9311-8410</span></li>
                            </ul>
                        </div>
                    </div>
                    <div className="max-w-container-max mx-auto px-margin-desktop mt-stack-xl pt-stack-md border-t border-blue-100 flex flex-col md:flex-row justify-between items-center gap-stack-md">
                        <p className="font-body-sm text-body-sm text-slate-600 dark:text-slate-600/80">
                            © {new Date().getFullYear()} PT Kreatif Teknologi Maju Bersama (CTECH). All rights reserved.
                        </p>
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

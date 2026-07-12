import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import { PremiumNavbar as PublicNavbar } from '@/components/ui/PremiumNavbar';

export default function CaseStudies({ portfolios, categories, filters }: { portfolios: any[], categories: string[], filters: any }) {
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
                <PublicNavbar isLandingPage={false} />

                <main className="pt-32 pb-stack-xl flex-grow">
                    {/* Hero Section */}
                    <header className="max-w-container-max mx-auto px-margin-desktop mb-stack-xl">
                        <div className="max-w-3xl">
                            <span className="font-label-md text-label-md text-blue-600 tracking-widest uppercase mb-stack-sm block">Dampak Global</span>
                            <h1 className="font-display-lg text-display-lg text-slate-900 mb-stack-md">Hasil strategis yang diberikan untuk perusahaan kelas dunia.</h1>
                            <p className="font-body-lg text-body-lg text-slate-600">Kami bermitra dengan para pemimpin industri untuk memecahkan tantangan teknis kompleks dan mendorong keunggulan operasional yang terukur.</p>
                        </div>
                    </header>

                    {/* Filter Bar */}
                    <section className="max-w-container-max mx-auto px-margin-desktop mb-stack-lg">
                        <div className="flex flex-wrap items-center justify-between gap-stack-md py-4 border-y border-blue-100">
                            <div className="flex gap-stack-md overflow-x-auto no-scrollbar pb-2 md:pb-0">
                                <Link
                                    href="/case-studi"
                                    className={`px-4 py-1.5 text-label-md font-label-md rounded-full whitespace-nowrap transition-colors ${!filters.category ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-blue-50'}`}
                                >
                                    Semua Industri
                                </Link>
                                {(categories || []).map((category) => (
                                    <Link
                                        key={category}
                                        href={`/case-studi?category=${category}`}
                                        className={`px-4 py-1.5 text-label-md font-label-md rounded-full whitespace-nowrap transition-colors ${filters.category === category ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-blue-50'}`}
                                    >
                                        {category}
                                    </Link>
                                ))}
                            </div>
                            <div className="flex items-center text-slate-600 text-label-md font-label-md whitespace-nowrap">
                                <span className="mr-2">Menampilkan {portfolios?.length || 0} hasil</span>
                                <span className="material-symbols-outlined">filter_list</span>
                            </div>
                        </div>
                    </section>

                    {/* Case Studies Grid */}
                    <section className="max-w-container-max mx-auto px-margin-desktop">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                            {(portfolios || []).map((portfolio, index) => {
                                const isFirst = index === 0;

                                return isFirst ? (
                                    <div key={portfolio.id} className="case-study-card bg-white border border-blue-100 p-stack-lg flex flex-col group md:col-span-2 rounded-lg">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-xl h-full">
                                            <div className="order-2 lg:order-1 flex flex-col justify-center">
                                                <div className="flex items-center gap-stack-sm mb-stack-md">
                                                    <span className="bg-blue-600-container text-on-secondary-container px-3 py-1 text-label-md font-label-md rounded">Featured</span>
                                                    <span className="text-slate-600 text-label-md font-label-md">{portfolio.category}</span>
                                                </div>
                                                <h2 className="font-headline-md text-headline-md mb-stack-md">{portfolio.title}</h2>
                                                <p className="text-slate-600 mb-stack-lg leading-relaxed">{portfolio.description}</p>
                                                <Link
                                                    className="flex items-center text-blue-600 font-button text-button group/btn w-fit"
                                                    href={portfolio.link || `/portfolio/${portfolio.id}`}
                                                    target={portfolio.link ? '_blank' : undefined}
                                                    rel={portfolio.link ? 'noreferrer' : undefined}
                                                >
                                                    Lihat Detail Studi Kasus
                                                    <span className="material-symbols-outlined ml-2 transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                                                </Link>
                                            </div>
                                            {portfolio.image && (
                                                <div className="order-1 lg:order-2 h-full min-h-[300px]">
                                                    <div className="relative overflow-hidden rounded-lg text-white bg-blue-700 border border-blue-100 h-full">
                                                        <img
                                                            alt={portfolio.title}
                                                            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                                                            src={`/storage/${portfolio.image}`}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div key={portfolio.id} className="case-study-card bg-white border border-blue-100 p-stack-lg flex flex-col rounded-lg group">
                                        {portfolio.image && (
                                            <div className="mb-stack-lg h-48 overflow-hidden rounded bg-surface-container relative">
                                                <img
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                    alt={portfolio.title}
                                                    src={`/storage/${portfolio.image}`}
                                                />
                                            </div>
                                        )}
                                        <span className="text-slate-600 text-label-md font-label-md mb-stack-xs uppercase">{portfolio.category}</span>
                                        <h3 className="font-headline-sm text-headline-sm mb-stack-sm">{portfolio.title}</h3>
                                        <p className="text-slate-600 text-body-sm mb-stack-lg grow">{portfolio.description}</p>
                                        <div className="flex items-center justify-between pt-stack-md border-t border-blue-100">
                                            <Link
                                                className="text-blue-600 font-button text-button group/btn"
                                                href={portfolio.link || `/portfolio/${portfolio.id}`}
                                                target={portfolio.link ? '_blank' : undefined}
                                                rel={portfolio.link ? 'noreferrer' : undefined}
                                            >
                                                Lihat Detail
                                                <span className="material-symbols-outlined ml-1 text-sm transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                            {(!portfolios || portfolios.length === 0) && (
                                <div className="md:col-span-2 text-center py-12">
                                    <p className="text-slate-600">Belum ada case study yang ditampilkan.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="max-w-container-max mx-auto px-margin-desktop mt-stack-xl">
                        <div className="text-white bg-blue-700 p-stack-xl rounded-lg text-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary to-transparent"></div>
                            <h2 className="font-headline-md text-headline-md text-blue-50 mb-stack-md relative z-10">Siap membangun kisah sukses Anda?</h2>
                            <p className="text-blue-50/80 mb-stack-lg max-w-xl mx-auto relative z-10">Konsultan kami siap mengaudit ekosistem Anda saat ini dan mengusulkan peta jalan untuk pertumbuhan.</p>
                            <div className="flex flex-col sm:flex-row justify-center gap-stack-md relative z-10">
                                <Link href="/kontak" className="inline-block bg-blue-600 text-on-secondary px-8 py-3 font-button text-button rounded hover:brightness-110 transition-all">Jadwalkan Konsultasi</Link>
                                <button className="border border-blue-100 text-blue-50 px-8 py-3 font-button text-button rounded hover:bg-on-primary-container/10 transition-all">Unduh Profil Perusahaan</button>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="bg-surface-container w-full py-stack-xl mt-auto">
                    <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter">
                        <div className="col-span-1 md:col-span-1">
                            <span className="font-headline-sm text-headline-sm font-bold text-blue-900 mb-stack-sm block">CTECH</span>
                            <p className="text-slate-600 text-body-sm mb-stack-md">Solusi software B2B dan enterprise terkemuka. Mewujudkan kepercayaan melalui keunggulan teknis.</p>
                        </div>
                        <div>
                            <h4 className="font-button text-button text-slate-900 mb-stack-md uppercase">Solusi</h4>
                            <ul className="space-y-stack-sm">
                                <li><Link className="text-slate-600 hover:text-blue-900 transition-colors text-body-sm" href="/layanan">Pengembangan Software Custom</Link></li>
                                <li><Link className="text-slate-600 hover:text-blue-900 transition-colors text-body-sm" href="/industri">Sistem ERP & POS Multicabang</Link></li>
                                <li><Link className="text-slate-600 hover:text-blue-900 transition-colors text-body-sm" href="/solusi/photobooth">Software Photobooth Interaktif</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-button text-button text-slate-900 mb-stack-md uppercase">Perusahaan</h4>
                            <ul className="space-y-stack-sm">
                                <li><Link className="text-slate-600 hover:text-blue-900 transition-colors text-body-sm" href="/tentang">Tentang Kami</Link></li>
                                <li><Link className="text-blue-900 underline text-body-sm" href="/case-studi">Kisah Sukses</Link></li>
                                <li><Link className="text-slate-600 hover:text-blue-900 transition-colors text-body-sm" href="/proses">Proses Development</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-button text-button text-slate-900 mb-stack-md uppercase">Kontak & Bantuan</h4>
                            <ul className="space-y-stack-sm">
                                <li><Link className="text-slate-600 hover:text-blue-900 transition-colors text-body-sm" href="/kontak">Hubungi Kami</Link></li>
                                <li><span className="text-slate-600 text-body-sm">ptkreatifteknologimajubersama@gmail.com</span></li>
                                <li><span className="text-slate-600 text-body-sm">+62 822-9311-8410</span></li>
                            </ul>
                        </div>
                    </div>
                    <div className="max-w-container-max mx-auto px-margin-desktop pt-stack-xl mt-stack-xl border-t border-blue-100 flex flex-col md:flex-row justify-between items-center gap-stack-md">
                        <p className="font-body-sm text-body-sm text-slate-600">© {new Date().getFullYear()} PT Kreatif Teknologi Maju Bersama (CTECH). All rights reserved.</p>
                        <div className="flex gap-stack-md">
                            <span className="material-symbols-outlined text-slate-600 cursor-pointer hover:text-blue-900" style={{fontVariationSettings: "'FILL' 1"}}>language</span>
                            <span className="material-symbols-outlined text-slate-600 cursor-pointer hover:text-blue-900" style={{fontVariationSettings: "'FILL' 1"}}>hub</span>
                            <span className="material-symbols-outlined text-slate-600 cursor-pointer hover:text-blue-900" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

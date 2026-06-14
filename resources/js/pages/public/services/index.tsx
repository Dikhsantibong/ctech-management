import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import PublicNavbar from '@/components/public-navbar';

export default function Services() {
    useEffect(() => {
        // Simple scroll micro-interaction for the header
        const handleScroll = () => {
            const header = document.querySelector('header');
            if (header) {
                if (window.scrollY > 20) {
                    header.classList.add('shadow-sm');
                } else {
                    header.classList.remove('shadow-sm');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head>
                <title>Layanan & Solusi | CTECH</title>
                <style dangerouslySetInnerHTML={{ __html: `
                    .material-symbols-outlined {
                        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                        display: inline-block;
                        line-height: 1;
                    }
                    .text-balance { text-wrap: balance; }
                `}} />
            </Head>

            <div className="bg-white text-slate-900 font-body-md antialiased selection:bg-blue-600/20 selection:text-blue-600 min-h-screen">
                <PublicNavbar />
                <main className="pt-20">
                    {/* Hero Section */}
                    <section className="relative bg-surface py-stack-xl border-b border-blue-100">
                        <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-gutter items-center min-h-[614px]">
                            <div className="flex flex-col gap-stack-lg">
                                <div className="inline-flex items-center gap-stack-sm bg-blue-600-fixed text-on-secondary-fixed px-stack-md py-stack-xs rounded-full w-fit">
                                    <span className="font-label-md text-label-md">SOLUSI SKALA ENTERPRISE</span>
                                </div>
                                <h1 className="font-display-lg text-display-lg text-balance">Arsitektur yang dibangun untuk performa global.</h1>
                                <p className="font-body-lg text-body-lg text-slate-600 max-w-[540px]">Kami merekayasa solusi software B2B berkepadatan tinggi yang mengubah logika bisnis yang kompleks menjadi platform digital yang intuitif dan dapat diskalakan. Menggabungkan ketelitian profesional dengan keunggulan teknis.</p>
                                <div className="flex gap-stack-md pt-stack-md">
                                    <Link href="/portfolio" className="bg-blue-700 text-white px-stack-xl py-3 rounded font-button text-button flex items-center gap-stack-sm hover:opacity-90 transition-opacity">
                                        Lihat Metodologi
                                        <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
                                    </Link>
                                    <button className="border border-blue-100 text-slate-900 px-stack-xl py-3 rounded font-button text-button hover:bg-surface-container transition-colors">
                                        Teknologi Kami
                                    </button>
                                </div>
                            </div>
                            <div className="relative hidden md:block aspect-square">
                                <div className="absolute inset-0 bg-gradient-to-tr from-secondary-container/20 to-transparent rounded-xl"></div>
                                <img className="w-full h-full object-cover rounded-xl shadow-sm border border-blue-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWOXnnR4mLGDpppDuFcrwUCE9B7ljkNivOpznMUJkEgNkLunMjyViCRlN5lC0pCguxOOPirlsQcEddHArk9KD2NuEKF0tJyseoVNGPJrljMEXImRn2MKLyYEDSsnzI1ko_mrY5yZGTepZQBbrEbQ6djyX9CncGMgCZe5jquVieqG6fFo8kgCcb1U4aOMXuxSERqpVWidFlRLuFNMvn3dH_t3Gb23DAE_atA6ZgBB453w5iV3cJmRn-eptb5cCx_fPn38pZPEHFug4t" alt="Enterprise Data Center" />
                            </div>
                        </div>
                    </section>

                    {/* Core Solutions Bento Grid */}
                    <section className="py-stack-xl bg-white">
                        <div className="max-w-container-max mx-auto px-margin-desktop">
                            <div className="flex flex-col items-center text-center gap-stack-sm mb-stack-xl">
                                <h2 className="font-headline-md text-headline-md">Layanan Rekayasa Khusus</h2>
                                <p className="font-body-md text-body-md text-slate-600 max-w-[700px]">Alat digital strategis yang dirancang untuk mendorong ROI operasional dan menangani volume data institusional berskala besar.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                                {/* Custom Software Development (Large Card) */}
                                <div className="md:col-span-8 bg-white border border-blue-100 p-stack-xl rounded-xl flex flex-col md:flex-row gap-stack-xl items-center hover:border-blue-600 transition-colors group">
                                    <div className="flex-1 space-y-stack-md">
                                        <span className="material-symbols-outlined text-blue-600 text-4xl" data-icon="developer_board">developer_board</span>
                                        <h3 className="font-headline-sm text-headline-sm">Pengembangan Software Custom</h3>
                                        <p className="font-body-md text-body-md text-slate-600">Kami membangun kerangka arsitektur khusus yang disesuaikan dengan ekosistem bisnis Anda. Tanpa kompromi dengan solusi instan.</p>
                                        <ul className="space-y-stack-sm">
                                            <li className="flex items-center gap-stack-sm font-label-md text-label-md text-blue-600">
                                                <span className="material-symbols-outlined text-sm" data-icon="check_circle">check_circle</span>
                                                ARSITEKTUR BEBAS HUTANG TEKNIS
                                            </li>
                                            <li className="flex items-center gap-stack-sm font-label-md text-label-md text-blue-600">
                                                <span className="material-symbols-outlined text-sm" data-icon="check_circle">check_circle</span>
                                                INTEGRASI SISTEM LEGACY (LAMA)
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="flex-1 w-full aspect-video rounded-lg overflow-hidden border border-blue-100 transform group-hover:-translate-y-1 transition-transform">
                                        <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5a9KKoMZoglMcJufJnuimXQyxEMW8lZTl1t49RT125wSyZP8iNrlWQlJDH5Sna4KY8l8IlzywJI43Moe--8V7pmccyPlwFa8D5lqAaY_6DRqyvEEZzRbl-18emt10RnuxxGlHtg0AbwI3l7Ok-I1NBHUQZNO-nhWuS66ONh3Rap6NVJluVMEVA9fd7Z-NBY5I_QuzbuEGuKBnnZCW0IFeG4G9FEwZ5lhY3TCOXxtzxiG5CPH4zkU9hggtGGXKDgNgIDEsUUfCJVdr" alt="Code Environment" />
                                    </div>
                                </div>
                                {/* Web/Mobile Apps (Tall Card) */}
                                <div className="md:col-span-4 bg-white border border-blue-100 p-stack-xl rounded-xl flex flex-col gap-stack-lg hover:border-blue-600 transition-colors group">
                                    <span className="material-symbols-outlined text-blue-600 text-4xl transform group-hover:scale-110 transition-transform" data-icon="devices">devices</span>
                                    <h3 className="font-headline-sm text-headline-sm">Ekosistem Web & Mobile</h3>
                                    <p className="font-body-md text-body-md text-slate-600">Pengalaman lintas platform tanpa hambatan yang menjaga integritas merek dan performa di setiap titik interaksi pengguna.</p>
                                    <div className="mt-auto pt-stack-lg border-t border-blue-100">
                                        <div className="flex justify-between items-center">
                                            <span className="font-label-md text-label-md text-slate-600">METRIK ROI</span>
                                            <span className="font-label-md text-label-md text-blue-600">+42% Interaksi</span>
                                        </div>
                                    </div>
                                </div>
                                {/* SaaS Platforms (Medium Card) */}
                                <div className="md:col-span-6 bg-white border border-blue-100 p-stack-xl rounded-xl flex flex-col gap-stack-lg hover:border-blue-600 transition-colors group">
                                    <div className="flex justify-between items-start">
                                        <span className="material-symbols-outlined text-blue-600 text-4xl transform group-hover:scale-110 transition-transform" data-icon="cloud_done">cloud_done</span>
                                        <span className="bg-blue-50 px-stack-sm py-1 rounded font-label-md text-label-md">MULTI-TENANT</span>
                                    </div>
                                    <h3 className="font-headline-sm text-headline-sm">Rekayasa Platform SaaS</h3>
                                    <p className="font-body-md text-body-md text-slate-600">Arsitektur multi-tenant cloud-native yang dirancang untuk skalabilitas cepat dan kepatuhan keamanan global.</p>
                                    <div className="grid grid-cols-2 gap-stack-md mt-auto">
                                        <div className="p-stack-md bg-slate-50 rounded">
                                            <div className="font-headline-sm text-headline-sm text-blue-600">99.9%</div>
                                            <div className="font-label-md text-label-md text-slate-600">JAMINAN UPTIME SLA</div>
                                        </div>
                                        <div className="p-stack-md bg-slate-50 rounded">
                                            <div className="font-headline-sm text-headline-sm text-blue-600">SEC</div>
                                            <div className="font-label-md text-label-md text-slate-600">KEPATUHAN KEAMANAN</div>
                                        </div>
                                    </div>
                                </div>
                                {/* Business Automation (Medium Card) */}
                                <div className="md:col-span-6 text-white bg-blue-700 border border-blue-100 p-stack-xl rounded-xl flex flex-col gap-stack-lg text-blue-50 hover:bg-blue-700 transition-colors duration-300 group">
                                    <span className="material-symbols-outlined text-blue-600 text-4xl transform group-hover:scale-110 transition-transform" data-icon="precision_manufacturing">precision_manufacturing</span>
                                    <h3 className="font-headline-sm text-headline-sm text-white">Otomatisasi Bisnis</h3>
                                    <p className="font-body-md text-body-md opacity-80">Hilangkan hambatan manual dengan RPA cerdas dan sistem alur kerja custom. Maksimalkan efisiensi SDM melalui presisi teknis.</p>
                                    <div className="flex flex-wrap gap-stack-sm mt-auto">
                                        <span className="border border-on-primary-container/30 px-stack-sm py-1 rounded font-label-md text-label-md">RPA</span>
                                        <span className="border border-on-primary-container/30 px-stack-sm py-1 rounded font-label-md text-label-md">ALUR KERJA AI</span>
                                        <span className="border border-on-primary-container/30 px-stack-sm py-1 rounded font-label-md text-label-md">SINKRONISASI ERP</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Value Proposition Section */}
                    <section className="py-stack-xl bg-surface border-y border-blue-100 overflow-hidden">
                        <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-stack-xl items-center">
                            <div className="relative">
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
                                <h2 className="font-display-lg text-display-lg text-balance mb-stack-lg">Dibangun untuk Skalabilitas Enterprise.</h2>
                                <div className="space-y-stack-xl">
                                    <div className="flex gap-stack-lg">
                                        <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-blue-600-fixed rounded-full text-blue-600">
                                            <span className="material-symbols-outlined" data-icon="shield_lock">shield_lock</span>
                                        </div>
                                        <div>
                                            <h4 className="font-button text-button mb-stack-xs uppercase tracking-wider text-blue-600">Keamanan Sejak Desain Awal</h4>
                                            <p className="font-body-md text-body-md text-slate-600">Setiap baris kode melalui audit keamanan yang ketat, memastikan perlindungan data tingkat tinggi untuk perusahaan Anda.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-stack-lg">
                                        <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-blue-600-fixed rounded-full text-blue-600">
                                            <span className="material-symbols-outlined" data-icon="trending_up">trending_up</span>
                                        </div>
                                        <div>
                                            <h4 className="font-button text-button mb-stack-xs uppercase tracking-wider text-blue-600">ROI yang Terukur</h4>
                                            <p className="font-body-md text-body-md text-slate-600">Kami tidak hanya merilis fitur; kami memberikan hasil bisnis. Proyek kami rata-rata mencapai pengurangan biaya operasional sebesar 30% di tahun pertama.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative h-[500px]">
                                <div className="absolute inset-0 grid grid-cols-2 gap-stack-md">
                                    <div className="pt-stack-xl">
                                        <div className="bg-white p-stack-lg border border-blue-100 rounded-xl shadow-sm mb-stack-md hover:-translate-y-1 transition-transform">
                                            <span className="font-label-md text-label-md text-slate-600 block mb-2">INFRASTRUKTUR</span>
                                            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-600 w-4/5"></div>
                                            </div>
                                            <div className="mt-4 flex justify-between">
                                                <span className="font-headline-sm text-headline-sm">80%</span>
                                                <span className="font-body-sm text-body-sm">Efisiensi</span>
                                            </div>
                                        </div>
                                        <img className="w-full h-64 object-cover rounded-xl border border-blue-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGWqMtLWENJ7QYs9kSh35EeLZD9AFMyQyzpbSrG0WGcy6GP4T8RGWWcfH6k69xo-Sg8wLH4r3zl2oTRmqktpIIovVQHDmxEiZrksLA5jppDMvqiTrKskJtt60O09BGjcNIK4BkwywZUQ3gacXO3FHwl_rI6XLCuTOqMCyN6DnaMlwWHLtMgFDGjFYyJtOkOQP4c6aXVIu9BP1Gy3bJ1BbFfoYtByCBsMHb1b-KXPTQZobzuU-J5bth_esofU0YSil5tQs9KgF0fMQf" alt="Dashboard View" />
                                    </div>
                                    <div>
                                        <img className="w-full h-64 object-cover rounded-xl border border-blue-100 mb-stack-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-7zFwBwdn9vM7O8m_ilp76jO68J817xG2YPQ-6VkxRbPs-0R0b-484j0wKbANRsvUgTGXyvfMq-Jq8-KdWyvDsV7Y1Orj3Auk4HZe6Qu3Q0xkTCD1X3oPbk8rMgLabXq_zOB81ujDs2JZlwywHxpVh4nuFu1GvVNgugn9O1SDa2prkR3V08YL7eHrMhNEOoQDdsNsoD_ZXX63W7PbdF6tlWSpcuJxmZYeiILbQi96sn6Fbk98wW0ymD1wLAoZ4NTorZpnyEfbwQR1" alt="Corporate Office Lobby" />
                                        <div className="bg-blue-700 p-stack-lg rounded-xl text-white hover:-translate-y-1 transition-transform">
                                            <span className="material-symbols-outlined text-3xl mb-stack-sm" data-icon="analytics">analytics</span>
                                            <p className="font-button text-button">Siap untuk Peluncuran Global</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-stack-xl">
                        <div className="max-w-container-max mx-auto px-margin-desktop text-center">
                            <div className="bg-blue-50 p-stack-xl rounded-2xl flex flex-col items-center gap-stack-lg">
                                <h2 className="font-headline-md text-headline-md max-w-2xl">Siap meningkatkan skala operasional enterprise Anda?</h2>
                                <p className="font-body-lg text-body-lg text-slate-600 max-w-xl">Konsultasikan dengan arsitek solusi kami untuk memetakan roadmap transformasi digital Anda.</p>
                                <div className="flex gap-stack-md">
                                    <Link href="/kontak" className="bg-blue-600 text-on-secondary px-stack-xl py-4 rounded-lg font-button text-button hover:opacity-90 transition-opacity">
                                        Jadwalkan Konsultasi
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="bg-surface-container border-t border-blue-100 py-stack-xl">
                    <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter">
                        <div className="flex flex-col gap-stack-md">
                            <div className="font-headline-sm text-headline-sm font-bold text-blue-900">CTECH</div>
                            <p className="font-body-sm text-body-sm text-slate-600">Solusi software B2B dan enterprise terkemuka. Mewujudkan kepercayaan melalui keunggulan teknis.</p>
                        </div>
                        <div className="flex flex-col gap-stack-sm">
                            <h5 className="font-button text-button text-blue-900 uppercase mb-2">Solusi</h5>
                            <Link className="font-body-sm text-body-sm text-slate-600 hover:text-blue-900 transition-colors" href="/layanan">Pengembangan Software Custom</Link>
                            <Link className="font-body-sm text-body-sm text-slate-600 hover:text-blue-900 transition-colors" href="/industri">Sistem ERP & POS Multicabang</Link>
                            <Link className="font-body-sm text-body-sm text-slate-600 hover:text-blue-900 transition-colors" href="/solusi/photobooth">Software Photobooth Interaktif</Link>
                        </div>
                        <div className="flex flex-col gap-stack-sm">
                            <h5 className="font-button text-button text-blue-900 uppercase mb-2">Perusahaan</h5>
                            <Link className="font-body-sm text-body-sm text-slate-600 hover:text-blue-900 transition-colors" href="/tentang">Tentang Kami</Link>
                            <Link className="font-body-sm text-body-sm text-slate-600 hover:text-blue-900 transition-colors" href="/portfolio">Kisah Sukses</Link>
                            <Link className="font-body-sm text-body-sm text-slate-600 hover:text-blue-900 transition-colors" href="/#process">Proses Development</Link>
                        </div>
                        <div className="flex flex-col gap-stack-sm">
                            <h5 className="font-button text-button text-blue-900 uppercase mb-2">Kontak & Bantuan</h5>
                            <Link className="font-body-sm text-body-sm text-slate-600 hover:text-blue-900 transition-colors" href="/kontak">Hubungi Kami</Link>
                            <span className="font-body-sm text-body-sm text-slate-600">ptkreatifteknologimajubersama@gmail.com</span>
                            <span className="font-body-sm text-body-sm text-slate-600">+62 822-9311-8410</span>
                        </div>
                    </div>
                    <div className="max-w-container-max mx-auto px-margin-desktop mt-stack-xl pt-stack-lg border-t border-blue-100 flex flex-col md:flex-row justify-between items-center gap-stack-md">
                        <p className="font-body-sm text-body-sm text-slate-600">© {new Date().getFullYear()} PT Kreatif Teknologi Maju Bersama (CTECH). All rights reserved.</p>
                        <div className="flex gap-stack-lg">
                            <a className="text-slate-600 hover:text-blue-600" href="#"><span className="material-symbols-outlined" data-icon="language">language</span></a>
                            <a className="text-slate-600 hover:text-blue-600" href="#"><span className="material-symbols-outlined" data-icon="hub">hub</span></a>
                            <a className="text-slate-600 hover:text-blue-600" href="#"><span class="material-symbols-outlined" data-icon="terminal">terminal</span></a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

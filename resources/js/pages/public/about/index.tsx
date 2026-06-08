import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PublicNavbar from '@/components/public-navbar';
import { ChevronDown, ChevronUp } from 'lucide-react';

/* ─────────── DATA ─────────── */
const faqs = [
    { q: 'Apa saja layanan yang ditawarkan CTECH?', a: 'CTECH menyediakan layanan lengkap mulai dari Web Development, Mobile App Development, UI/UX Design, Produksi Video & Animasi, Digital Marketing & Branding, hingga sistem internal seperti ERP dan CRM.' },
    { q: 'Berapa lama waktu pengerjaan project rata-rata?', a: 'Tergantung kompleksitas, website company profile bisa selesai dalam 2-4 minggu. Aplikasi mobile atau sistem internal biasanya membutuhkan 2-6 bulan. Kami selalu memberikan estimasi timeline yang transparan di awal.' },
    { q: 'Apakah CTECH melayani klien di luar Kendari?', a: 'Tentu! Meskipun berkantor pusat di Kendari, kami melayani klien dari seluruh Indonesia. Komunikasi bisa dilakukan secara remote melalui video call dan project management tools.' },
    { q: 'Bagaimana sistem pembayaran project?', a: 'Kami menerapkan sistem pembayaran bertahap: Down Payment (DP) di awal, lalu pembayaran sesuai milestone project. Ini memastikan transparansi dan kenyamanan kedua belah pihak.' },
    { q: 'Apakah ada garansi setelah project selesai?', a: 'Ya, setiap project mendapatkan masa garansi maintenance gratis selama 1-3 bulan (tergantung paket). Setelah itu, kami menawarkan paket maintenance bulanan dengan harga terjangkau.' },
    { q: 'Apa itu CTECH Paylo?', a: 'CTECH Paylo adalah produk unggulan kami — paket lengkap aplikasi bisnis all-in-one yang mencakup sistem absensi karyawan, kasir offline-first, inventory management, aplikasi akuntan, dan dashboard analisis bisnis untuk owner.' },
];

/* ─────────── COMPONENTS ─────────── */
function FAQItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-outline-variant rounded-xl overflow-hidden transition-all bg-surface-container-lowest hover:border-secondary">
            <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-6 text-left gap-4">
                <span className="font-button text-button text-on-surface text-lg">{q}</span>
                <span className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${open ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant'}`}>
                    {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-6 text-on-surface-variant font-body-md text-body-md">{a}</div>
            </div>
        </div>
    );
}

export default function About() {
    useEffect(() => {
        // Simple scroll interaction for the navbar
        const handleScroll = () => {
            const nav = document.querySelector('nav');
            if (nav) {
                if (window.scrollY > 20) {
                    nav.classList.add('shadow-sm');
                } else {
                    nav.classList.remove('shadow-sm');
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        
        // Hover effect for Bento cards
        document.querySelectorAll('.grid-bento > div').forEach(card => {
            card.addEventListener('mouseenter', () => {
                (card as HTMLElement).style.transform = 'translateY(-4px)';
                (card as HTMLElement).style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
            });
            card.addEventListener('mouseleave', () => {
                (card as HTMLElement).style.transform = 'translateY(0)';
            });
        });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head>
                <title>About Us | CTECH</title>
                <style dangerouslySetInnerHTML={{ __html: `
                    .material-symbols-outlined {
                        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                    }
                    .text-balance { text-wrap: balance; }
                    .grid-bento {
                        display: grid;
                        grid-template-columns: repeat(12, 1fr);
                        gap: 24px;
                    }
                `}} />
            </Head>

            <div className="bg-background text-on-surface font-body-md selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen flex flex-col">
                <PublicNavbar />

                <main className="pt-20 flex-grow">
                    {/* Hero Section */}
                    <section className="relative bg-surface overflow-hidden">
                        <div className="max-w-container-max mx-auto px-margin-desktop pt-stack-xl pb-stack-xl">
                            <div className="grid lg:grid-cols-2 gap-gutter items-center">
                                <div className="z-10">
                                    <span className="font-label-md text-label-md text-secondary uppercase tracking-widest block mb-stack-md">Creative Agency & Tech Branding</span>
                                    <h1 className="font-display-lg text-display-lg text-on-surface mb-stack-lg leading-tight">Kami membangun masa depan digital yang scalable untuk bisnis Anda.</h1>
                                    <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-xl max-w-xl">PT Kreatif Teknologi Maju Bersama — Creative agency & software house yang menghadirkan solusi teknologi inovatif, desain premium, dan strategi branding yang mengubah cara bisnis Anda beroperasi.</p>
                                    <div className="flex flex-wrap gap-stack-md">
                                        <div className="bg-surface-container-high px-stack-lg py-stack-md rounded-lg border border-outline-variant flex items-center gap-stack-sm">
                                            <span className="material-symbols-outlined text-secondary">verified</span>
                                            <span className="font-button text-button">Dipercaya 30+ Klien</span>
                                        </div>
                                        <div className="bg-surface-container-high px-stack-lg py-stack-md rounded-lg border border-outline-variant flex items-center gap-stack-sm">
                                            <span className="material-symbols-outlined text-secondary">groups</span>
                                            <span className="font-button text-button">15+ Tim Profesional</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative h-[500px] rounded-xl overflow-hidden shadow-sm">
                                    <img alt="CTECH Workspace" className="w-full h-full object-cover" src="/our-story/photo1.jpeg" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
                                </div>
                            </div>
                        </div>
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-surface-container-low -z-0 transform skew-x-12 translate-x-1/2"></div>
                    </section>

                    {/* Mission & Values Bento */}
                    <section className="py-stack-xl bg-background">
                        <div className="max-w-container-max mx-auto px-margin-desktop">
                            <div className="flex flex-col md:flex-row justify-between items-end mb-stack-xl gap-stack-lg">
                                <div className="max-w-2xl">
                                    <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">Mitra Transformasi Bisnis Anda.</h2>
                                    <p className="font-body-md text-body-md text-on-surface-variant">Kami menggabungkan kekuatan teknologi, kreativitas visual, dan strategi konversi untuk merancang solusi yang memangkas biaya operasional dan meningkatkan pendapatan Anda secara signifikan.</p>
                                </div>
                                <div className="flex gap-stack-sm">
                                    <div className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center">
                                        <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary">
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Bento Grid for Values */}
                            <div className="grid-bento">
                                {/* Inovasi Tanpa Batas */}
                                <div className="col-span-1 md:col-span-12 lg:col-span-8 bg-surface-container-lowest p-stack-xl rounded-xl border border-outline-variant hover:border-secondary transition-colors group">
                                    <div className="flex flex-col h-full justify-between">
                                        <div>
                                            <div className="w-14 h-14 bg-secondary-fixed rounded-lg flex items-center justify-center mb-stack-lg group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                                                <span className="material-symbols-outlined text-[32px]">speed</span>
                                            </div>
                                            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-stack-md">Inovasi Tanpa Batas</h3>
                                            <p className="font-body-md text-body-md text-on-surface-variant max-w-lg">Kami tidak hanya merancang produk; kami selalu mengadopsi teknologi terbaru dan pendekatan kreatif. Setiap baris kode dioptimalkan untuk performa maksimal dan skalabilitas saat pengguna Anda berkembang pesat.</p>
                                        </div>
                                        <div className="mt-stack-xl flex gap-stack-lg border-t border-outline-variant pt-stack-lg">
                                            <div>
                                                <span className="font-headline-sm text-headline-sm block text-primary">99.99%</span>
                                                <span className="font-label-md text-label-md text-on-surface-variant uppercase">Uptime SLA</span>
                                            </div>
                                            <div>
                                                <span className="font-headline-sm text-headline-sm block text-primary">Sub-50ms</span>
                                                <span className="font-label-md text-label-md text-on-surface-variant uppercase">Latensi</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Fokus pada Hasil */}
                                <div className="col-span-1 md:col-span-12 lg:col-span-4 bg-primary p-stack-xl rounded-xl border border-primary flex flex-col justify-between text-on-primary relative overflow-hidden">
                                    <div className="z-10">
                                        <div className="w-14 h-14 bg-white/10 rounded-lg flex items-center justify-center mb-stack-lg backdrop-blur-sm">
                                            <span className="material-symbols-outlined text-[32px] text-white">visibility</span>
                                        </div>
                                        <h3 className="font-headline-sm text-headline-sm mb-stack-md">Fokus pada Hasil</h3>
                                        <p className="font-body-sm text-body-sm text-on-primary/80">Kejujuran radikal dalam pengiriman kami. Bukan sekadar produk jadi — kami memastikan setiap solusi memberikan dampak nyata bagi bisnis Anda dengan transparansi penuh. Tanpa biaya tersembunyi.</p>
                                    </div>
                                    <div className="absolute -bottom-10 -right-10 opacity-10">
                                        <span className="material-symbols-outlined text-[200px]">hub</span>
                                    </div>
                                </div>

                                {/* Eksekusi Cepat */}
                                <div className="col-span-1 md:col-span-12 lg:col-span-4 bg-surface-container-high p-stack-xl rounded-xl border border-outline-variant flex flex-col items-center text-center">
                                    <div className="w-14 h-14 bg-surface-container-lowest rounded-full flex items-center justify-center mb-stack-lg shadow-sm">
                                        <span className="material-symbols-outlined text-secondary">handshake</span>
                                    </div>
                                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-stack-md">Eksekusi Cepat & Tepat</h3>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant">Workflow agile memungkinkan kami mengirimkan hasil dengan cepat tanpa mengorbankan kualitas. Kami tumbuh bersama kesuksesan jangka panjang Anda.</p>
                                </div>

                                {/* Expertise */}
                                <div className="col-span-1 md:col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-gutter">
                                    <div className="bg-surface-container-lowest p-stack-lg rounded-xl border border-outline-variant flex flex-col gap-stack-md">
                                        <img className="w-full h-32 object-cover rounded-lg" alt="Full-Stack Development" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7KQPV5uCBYBVS8_RJPsSIIx8DhKzJ4diCm_NeNQ9IdXTQbM-qp-PAIh2IHtnpOcycOM85-fE8sF-skxpYbwXTyGk2OB8fr9T5W95RxvmI44b9owgSkLUkbdw7JVnLSnIGfmCrDM3qpxxmDZED1mnfubX-UJGIednY-E2h3Qp7WlUc-8jJ7Zlhq_mFi7KNTOmVcVkDKi-Z2Mv33qI2NHkhstv15HnQH-CbW_SusNYbMbJTSruKmm1g3pawOsuF_vsu_JosBVQIeV6u" />
                                        <h4 className="font-button text-button text-on-surface">Full-Stack Development</h4>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant">Arsitektur scalable, API aman, dan antarmuka web modern menggunakan Laravel, React, dan Node.js.</p>
                                    </div>
                                    <div className="bg-surface-container-lowest p-stack-lg rounded-xl border border-outline-variant flex flex-col gap-stack-md">
                                        <img className="w-full h-32 object-cover rounded-lg" alt="UI/UX Design" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDACaPP1SbQ4tPZAIR-a9FMnxCiL0PRC-5bOmw_QCeRji8DebstpHmpnPJrVuNmi_jijBCiqb8UamzvWn5aLLQEc_khxk7xebARlK8Fe7UpCficR-ZooVNLKrcwLEGTwpNtHYyd7EKvLApyKwP6-x9m8M4fArbvJ7vQwKGnll9JbCm-cNYYvuFiif-YBc6c_taoGJE4jnGlg0-Bn-HXtmWyuDKvXY6waPNt90CvwJRYmUbVbKLD7paU8yNeAbbkUmQH20a-9l-i_vBL" />
                                        <h4 className="font-button text-button text-on-surface">UI/UX Design & Research</h4>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant">Bukan sekadar desain cantik. Kami melakukan riset perilaku untuk merancang antarmuka yang berorientasi pada konversi.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Stats Section */}
                    <section className="py-stack-xl bg-surface-container-lowest border-y border-outline-variant">
                        <div className="max-w-container-max mx-auto px-margin-desktop">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter text-center">
                                <div className="p-stack-lg">
                                    <div className="font-display-lg text-display-lg text-primary mb-stack-xs">5+</div>
                                    <div className="font-label-md text-label-md text-on-surface-variant uppercase">Tahun Pengalaman</div>
                                </div>
                                <div className="p-stack-lg">
                                    <div className="font-display-lg text-display-lg text-primary mb-stack-xs">50+</div>
                                    <div className="font-label-md text-label-md text-on-surface-variant uppercase">Project Selesai</div>
                                </div>
                                <div className="p-stack-lg">
                                    <div className="font-display-lg text-display-lg text-primary mb-stack-xs">30+</div>
                                    <div className="font-label-md text-label-md text-on-surface-variant uppercase">Klien Puas</div>
                                </div>
                                <div className="p-stack-lg">
                                    <div className="font-display-lg text-display-lg text-primary mb-stack-xs">15+</div>
                                    <div className="font-label-md text-label-md text-on-surface-variant uppercase">Tim Profesional</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Video Showcase (Preserved from old info) */}
                    <section className="py-stack-xl bg-surface">
                        <div className="max-w-container-max mx-auto px-margin-desktop">
                            <div className="text-center max-w-3xl mx-auto mb-stack-lg">
                                <span className="font-label-md text-label-md text-secondary uppercase tracking-widest block mb-stack-sm">Lihat Aksi Kami</span>
                                <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">Cerita di Balik Layar</h2>
                                <p className="font-body-md text-body-md text-on-surface-variant">Saksikan bagaimana tim CTECH bekerja, berinovasi, dan membangun solusi digital untuk klien-klien kami.</p>
                            </div>
                            <div className="relative rounded-2xl overflow-hidden border border-outline-variant max-w-4xl mx-auto shadow-sm">
                                <div className="aspect-video">
                                    <iframe
                                        className="w-full h-full"
                                        src="https://www.youtube.com/embed/HPmPDnmNnf0"
                                        title="CTECH Company Profile"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Team Quote/Highlight */}
                    <section className="py-stack-xl border-y border-outline-variant bg-surface-container-low">
                        <div className="max-w-container-max mx-auto px-margin-desktop">
                            <div className="bg-surface-container-lowest p-stack-xl rounded-xl relative shadow-sm border border-outline-variant">
                                <div className="max-w-3xl mx-auto text-center">
                                    <span className="material-symbols-outlined text-secondary text-[48px] mb-stack-lg" style={{fontVariationSettings: "'FILL' 1"}}>format_quote</span>
                                    <p className="font-headline-md text-headline-md italic text-on-surface mb-stack-xl">"Kami bukan sekadar vendor teknologi — kami adalah arsitek transformasi digital yang membangun fondasi untuk membantu bisnis Anda tumbuh dengan ketangkasan startup."</p>
                                    <div className="flex items-center justify-center gap-stack-md">
                                        <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xl">C</div>
                                        <div className="text-left">
                                            <div className="font-button text-button text-on-surface">Tim CTECH</div>
                                            <div className="font-body-sm text-body-sm text-on-surface-variant">Core Engineers & Strategists</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section (Preserved from old info) */}
                    <section className="py-stack-xl bg-background">
                        <div className="max-w-3xl mx-auto px-margin-desktop">
                            <div className="text-center mb-stack-xl">
                                <span className="font-label-md text-label-md text-secondary uppercase tracking-widest block mb-stack-sm">FAQ</span>
                                <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">Pertanyaan yang Sering Ditanyakan</h2>
                                <p className="font-body-md text-body-md text-on-surface-variant">Beberapa pertanyaan umum seputar layanan dan proses kerja kami.</p>
                            </div>
                            
                            <div className="space-y-stack-sm">
                                {faqs.map((faq, idx) => (
                                    <FAQItem key={idx} q={faq.q} a={faq.a} />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-stack-xl bg-primary text-on-primary">
                        <div className="max-w-container-max mx-auto px-margin-desktop text-center">
                            <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-stack-lg">Siap membangun transformasi digital Anda?</h2>
                            <p className="font-body-lg text-body-lg text-on-primary/70 mb-stack-xl max-w-2xl mx-auto">Bergabunglah dengan puluhan klien yang telah mempercayakan inisiatif software misi-kritis mereka kepada CTECH.</p>
                            <div className="flex flex-col sm:flex-row gap-stack-md justify-center">
                                <Link href="/kontak" className="inline-block bg-secondary text-on-secondary font-button text-button px-10 py-stack-lg rounded-lg hover:bg-secondary/90 transition-colors text-center">Mulai Project</Link>
                                <Link href="/case-studi" className="inline-block border border-on-primary/30 text-on-primary font-button text-button px-10 py-stack-lg rounded-lg hover:bg-white/10 transition-colors text-center">Lihat Case Studi</Link>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="bg-surface-container dark:bg-surface-container-highest w-full py-stack-xl mt-auto border-t border-outline-variant">
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
                                <li><Link className="text-on-surface-variant hover:text-primary transition-colors text-body-sm" href="/case-studi">Kisah Sukses</Link></li>
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

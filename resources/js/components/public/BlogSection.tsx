import { Link } from '@inertiajs/react';

export default function BlogSection({ news }: { news: any[] }) {
    // For demo purposes, we will use placeholders if no news is passed
    const displayNews = news && news.length > 0 ? news : [
        { slug: '5-tren-teknologi-2024', title: '5 Tren Teknologi Web Development di 2024', category: 'Software', date: '12 Mei 2024', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80' },
        { slug: 'tips-video-company-profile', title: 'Tips Membuat Video Company Profile yang Efektif', category: 'Video', date: '10 Mei 2024', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80' },
        { slug: 'mengapa-3d-visualisasi', title: 'Mengapa 3D Visualisasi Penting untuk Arsitektur?', category: '3D Design', date: '05 Mei 2024', image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80' },
    ];

    return (
        <section id="blog" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="mb-4">
                    <span className="text-blue-600 font-bold tracking-wider text-sm">BLOG / ARTIKEL</span>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                            Artikel & Insight
                        </h2>
                        <p className="text-slate-600 text-lg max-w-xl leading-relaxed">
                            Insight, tips, dan informasi terbaru seputar teknologi dan industri kreatif.
                        </p>
                    </div>
                    <Link href="/berita" className="hidden md:inline-flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-all font-semibold whitespace-nowrap">
                        Lihat Semua Artikel
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {displayNews.slice(0,3).map((item, idx) => (
                        <Link href={`/berita/${item.slug}`} key={idx} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="h-52 overflow-hidden relative">
                                <img src={item.image || item.featured_image || 'https://via.placeholder.com/600x400'} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {item.category}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="text-slate-400 text-sm mb-3 font-medium flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">calendar_today</span>
                                    {item.date || new Date(item.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-snug">
                                    {item.title}
                                </h3>
                                <div className="mt-auto inline-flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                                    Baca Selengkapnya <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">arrow_forward</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-10 text-center md:hidden">
                    <Link href="/berita" className="inline-flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-all font-semibold w-full">
                        Lihat Semua Artikel
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

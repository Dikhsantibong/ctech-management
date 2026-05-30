import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PublicNavbar from '@/components/public-navbar';

export default function PublicNewsIndex({ news }: { news: any }) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
            <Head title="Berita & Artikel" />
            
            <PublicNavbar isLandingPage={false} />

            <main className="max-w-7xl mx-auto px-6 py-16 pt-32">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Berita & Artikel</h1>
                    <p className="text-slate-600 text-lg">Ikuti perkembangan terbaru, update produk, dan cerita di balik layar dari tim CTECH.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {news.data.map((item: any) => (
                        <Link key={item.id} href={`/berita/${item.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col">
                            <div className="relative h-56 overflow-hidden bg-slate-100">
                                {item.image ? (
                                    <img src={`/storage/${item.image}`} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full">
                                    {item.category || 'Berita'}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                                    <span>{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    <span>•</span>
                                    <span>{item.author?.name || 'Admin'}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {item.title}
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
                                    {item.content.replace(/<[^>]+>/g, '')}
                                </p>
                                <span className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm mt-auto group-hover:gap-2 transition-all">
                                    Baca Selengkapnya &rarr;
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pagination */}
                {news.last_page > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                        {news.links.map((link: any, i: number) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    link.active 
                                        ? 'bg-blue-600 text-white shadow-md' 
                                        : !link.url 
                                            ? 'text-slate-400 cursor-not-allowed' 
                                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

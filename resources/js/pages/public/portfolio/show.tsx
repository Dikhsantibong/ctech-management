import { Head, Link } from '@inertiajs/react';
import { User, Calendar, ExternalLink, Tag } from 'lucide-react';
import PublicNavbar from '@/components/public-navbar';

export default function PublicPortfolioShow({ portfolio, relatedPortfolios }: { portfolio: any, relatedPortfolios: any[] }) {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
            <Head title={portfolio.title} />
            
            <PublicNavbar isLandingPage={false} />

            <main className="max-w-5xl mx-auto px-6 py-16 pt-32">
                <div className="grid md:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="md:col-span-2">
                        {portfolio.image && (
                            <div className="mb-10 rounded-2xl overflow-hidden shadow-xl border border-slate-100">
                                <img src={`/storage/${portfolio.image}`} alt={portfolio.title} className="w-full h-auto object-cover" />
                            </div>
                        )}
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                            {portfolio.title}
                        </h1>
                        <div className="prose prose-lg prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: portfolio.description || 'Tidak ada deskripsi.' }} />
                    </div>

                    {/* Sidebar Info */}
                    <div className="md:col-span-1">
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 sticky top-32">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4">Detail Project</h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm text-slate-500 font-medium mb-1">Klien</p>
                                    <p className="font-semibold text-slate-900">{portfolio.client_name}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-slate-500 font-medium mb-1">Kategori</p>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mt-1">
                                        <Tag className="w-3.5 h-3.5" /> {portfolio.category}
                                    </span>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-slate-500 font-medium mb-1">Tanggal Selesai</p>
                                    <p className="font-semibold text-slate-900">{new Date(portfolio.completion_date || portfolio.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
                                </div>

                                {portfolio.link && (
                                    <div className="pt-4 mt-6 border-t border-slate-200">
                                        <a href={portfolio.link} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-bold transition-colors shadow-lg shadow-blue-600/20">
                                            Kunjungi Website <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Related Portfolios */}
            {relatedPortfolios.length > 0 && (
                <section className="bg-slate-50 py-16 border-t border-slate-100">
                    <div className="max-w-7xl mx-auto px-6">
                        <h3 className="text-2xl font-bold text-slate-900 mb-8">Karya Serupa</h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedPortfolios.map((item: any) => (
                                <Link key={item.id} href={`/portfolio/${item.id}`} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 block">
                                    <div className="relative h-48 overflow-hidden bg-slate-100">
                                        {item.image ? (
                                            <img src={`/storage/${item.image}`} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                                        
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-300 transition-colors line-clamp-1">{item.title}</h3>
                                            <p className="text-slate-300 text-sm line-clamp-1">{item.client_name}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

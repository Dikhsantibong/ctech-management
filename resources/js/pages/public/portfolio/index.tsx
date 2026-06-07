import { Head, Link, router } from '@inertiajs/react';
import { ExternalLink, Code2, Paintbrush, MonitorPlay, FolderOpen } from 'lucide-react';
import PublicNavbar from '@/components/public-navbar';
import PublicFooter from '@/components/public-footer';
import { useState, useEffect } from 'react';

const categoryIcons: Record<string, any> = {
    'Web Development': <Code2 className="w-5 h-5" />,
    'Mobile App': <Code2 className="w-5 h-5" />,
    'UI/UX Design': <Paintbrush className="w-5 h-5" />,
    'Video Animation': <MonitorPlay className="w-5 h-5" />
};

export default function PublicPortfolioIndex({ portfolios, categories, filters }: { portfolios: any, categories: string[], filters: any }) {
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (selectedCategory !== (filters.category || '')) {
                router.get('/portfolio', { category: selectedCategory }, { preserveState: true, replace: true, preserveScroll: true });
            }
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [selectedCategory]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
            <Head title="Portfolio" />
            
            <PublicNavbar isLandingPage={false} />

            <main className="max-w-7xl mx-auto px-6 py-16 pt-32">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
                        Success Stories
                    </span>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Case Study & Portfolio</h1>
                    <p className="text-slate-600 text-lg">Eksplorasi berbagai solusi digital dan hasil nyata yang telah kami capai untuk klien kami.</p>
                </div>

                {/* Categories Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    <button
                        onClick={() => setSelectedCategory('')}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${
                            selectedCategory === ''
                                ? 'bg-blue-600 text-white shadow-blue-500/20'
                                : 'bg-white text-slate-600 hover:text-blue-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                    >
                        Semua Karya
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm flex items-center gap-2 ${
                                selectedCategory === cat
                                    ? 'bg-blue-600 text-white shadow-blue-500/20'
                                    : 'bg-white text-slate-600 hover:text-blue-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            {categoryIcons[cat] || <FolderOpen className="w-4 h-4" />}
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Portfolio Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {portfolios.data.map((item: any) => (
                        <Link key={item.id} href={`/portfolio/${item.id}`} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 block">
                            <div className="relative h-64 overflow-hidden bg-slate-100">
                                {item.image ? (
                                    <img src={`/storage/${item.image}`} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                                
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-bold text-blue-300 tracking-wider uppercase px-2 py-1 bg-blue-900/50 backdrop-blur rounded-md">
                                            {item.category}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">{item.title}</h3>
                                    <p className="text-slate-300 text-sm line-clamp-2">{item.client_name}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {portfolios.data.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-700">Tidak ada portfolio ditemukan</h3>
                        <p className="text-slate-500 mt-2">Belum ada karya untuk kategori ini.</p>
                    </div>
                )}

                {/* Pagination */}
                {portfolios.last_page > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                        {portfolios.links.map((link: any, i: number) => (
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
            <PublicFooter />
        </div>
    );
}

import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function PortfolioSection({ portfolios }: { portfolios: any[] }) {
    const [activeTab, setActiveTab] = useState('Semua');
    const tabs = ['Semua', 'Software Development', 'Video Production', '3D Design', '3D Artist'];

    // For demo purposes, we will just show the portfolios passed or a few placeholders if empty
    const displayPortfolios = portfolios && portfolios.length > 0 ? portfolios : [
        { id: 1, title: 'Sistem Manajemen Sekolah', category: 'Software Development', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80' },
        { id: 2, title: 'Company Profile PT. Inovasi', category: 'Video Production', image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80' },
        { id: 3, title: 'Desain Rumah Minimalis', category: '3D Design', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' },
        { id: 4, title: 'E-Commerce Mobile App', category: 'Software Development', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80' },
        { id: 5, title: 'Iklan Produk Skincare', category: 'Video Production', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80' },
        { id: 6, title: 'Game Character - Warrior', category: '3D Artist', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80' },
    ];

    const filteredPortfolios = activeTab === 'Semua' 
        ? displayPortfolios 
        : displayPortfolios.filter(p => p.category === activeTab);

    return (
        <section id="portfolio" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="mb-4">
                    <span className="text-blue-600 font-bold tracking-wider text-sm">PORTOFOLIO</span>
                </div>
                
                <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                    Portofolio Kami
                </h2>
                <p className="text-slate-600 text-lg mb-10 max-w-2xl leading-relaxed">
                    Beberapa proyek yang telah kami kerjakan bersama klien terbaik.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-10">
                    {tabs.map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                                activeTab === tab 
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-600 hover:text-blue-600'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {filteredPortfolios.slice(0,6).map((portfolio, idx) => (
                        <Link href={`/portfolio/${portfolio.id}`} key={idx} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
                            <div className="h-60 overflow-hidden">
                                <img src={portfolio.image || portfolio.featured_image || 'https://via.placeholder.com/600x400'} alt={portfolio.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{portfolio.title}</h3>
                                <p className="text-sm font-semibold text-blue-600">{portfolio.category}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center">
                    <Link href="/portfolio" className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md shadow-blue-200">
                        Lihat Semua Portofolio
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

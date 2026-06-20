export default function TeamSection() {
    const team = [
        { name: 'Andika Pratama', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=400&q=80' },
        { name: 'Rina Marliana', role: 'Project Manager', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80' },
        { name: 'Dimas Aditya', role: 'Lead Developer', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80' },
        { name: 'Naufal Hidayat', role: '3D Artist Lead', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80' },
        { name: 'Siti Aisyah', role: 'Video Producer', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=400&q=80' },
    ];

    return (
        <section id="tim-kami" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="mb-4">
                    <span className="text-blue-600 font-bold tracking-wider text-sm">TIM KAMI</span>
                </div>
                
                <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                    Tim Profesional Kami
                </h2>
                <p className="text-slate-600 text-lg mb-16 max-w-2xl leading-relaxed">
                    Berpengalaman, kreatif, dan berdedikasi untuk memberikan hasil terbaik.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-20">
                    {team.map((member, idx) => (
                        <div key={idx} className="group text-center">
                            <div className="relative mb-4 overflow-hidden rounded-2xl aspect-square">
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-3">
                                    <a href="#" className="w-8 h-8 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center hover:bg-blue-600 transition-colors">
                                        <i className="fa-brands fa-linkedin-in text-sm"></i>
                                    </a>
                                </div>
                            </div>
                            <h4 className="font-bold text-slate-900 text-lg">{member.name}</h4>
                            <p className="text-blue-600 text-sm font-semibold">{member.role}</p>
                        </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
                        <div className="w-12 h-12 shrink-0 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined">workspace_premium</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-2">Berpengalaman</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">Tim kami memiliki pengalaman di berbagai industri.</p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
                        <div className="w-12 h-12 shrink-0 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined">psychology</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-2">Kompeten</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">Menguasai teknologi dan tools terbaru di bidangnya.</p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
                        <div className="w-12 h-12 shrink-0 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined">favorite</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-2">Berdedikasi</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">Siap memberikan yang terbaik untuk setiap proyek.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

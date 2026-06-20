import { useForm } from '@inertiajs/react';

export default function ContactSection() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission, e.g., post('/contact', data)
        // For now just prevent default and alert
        alert("Pesan berhasil dikirim!");
        reset();
    };

    return (
        <section id="kontak" className="py-24 bg-slate-50 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="mb-4">
                    <span className="text-blue-600 font-bold tracking-wider text-sm">KONTAK</span>
                </div>
                
                <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                    Hubungi Kami
                </h2>
                <p className="text-slate-600 text-lg mb-16 max-w-2xl leading-relaxed">
                    Punya pertanyaan atau ingin berdiskusi tentang proyek Anda?<br/>
                    Kami siap membantu!
                </p>
                
                <div className="grid lg:grid-cols-2 gap-16">
                    <div className="space-y-8">
                        <div className="flex gap-6">
                            <div className="w-14 h-14 shrink-0 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl">mail</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">Email</h4>
                                <p className="text-slate-600">hello@ctechagency.com</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="w-14 h-14 shrink-0 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl">call</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">Telepon</h4>
                                <p className="text-slate-600">+62 812-3456-7890</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="w-14 h-14 shrink-0 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl">location_on</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">Alamat</h4>
                                <p className="text-slate-600 leading-relaxed max-w-sm">Jl. Teknologi No. 10, Jakarta Selatan,<br/>DKI Jakarta 12345</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="w-14 h-14 shrink-0 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl">schedule</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">Jam Operasional</h4>
                                <p className="text-slate-600">Senin - Jumat: 09:00 - 18:00 WIB</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-100 shadow-xl shadow-blue-900/5">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
                                    placeholder="Masukkan nama Anda"
                                    required 
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
                                    placeholder="Masukkan email Anda"
                                    required 
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">Nomor Telepon</label>
                                <input 
                                    type="tel" 
                                    id="phone" 
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
                                    placeholder="Masukkan nomor telepon Anda"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">Pesan</label>
                                <textarea 
                                    id="message" 
                                    rows={4}
                                    value={data.message}
                                    onChange={e => setData('message', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none" 
                                    placeholder="Ceritakan detail proyek Anda..."
                                    required 
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-70 flex justify-center items-center gap-2"
                            >
                                Kirim Pesan
                                <span className="material-symbols-outlined text-sm">send</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

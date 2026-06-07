import { Head } from '@inertiajs/react';
import PublicNavbar from '@/components/public-navbar';
import PublicFooter from '@/components/public-footer';
import { Mail, MapPin, Phone, MessageCircle, Clock, Send, Shield, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        interest: 'software',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Buat pesan WhatsApp dari form
        const text = `Halo CTECH, saya ingin konsultasi.
        
Nama: ${formData.name}
Perusahaan: ${formData.company || '-'}
Email: ${formData.email}
Layanan: ${formData.interest}
Pesan: ${formData.message}`;

        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/6282293118410?text=${encodedText}`, '_blank');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-600 selection:text-white flex flex-col">
            <Head title="Hubungi Kami - CTECH" />
            
            <PublicNavbar isLandingPage={false} />

            <main className="flex-grow pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
                            Konsultasi Gratis
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                            Mari Diskusikan Solusi untuk Bisnis Anda
                        </h1>
                        <p className="text-lg text-slate-600">
                            Kami siap membantu Anda mengidentifikasi masalah operasional dan merancang solusi digital yang tepat sasaran. Tidak ada komitmen di awal.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        
                        {/* Contact Info (Left) */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                                <h3 className="text-xl font-bold text-slate-900 mb-6">Informasi Kontak</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                            <Phone className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Telepon / WhatsApp</h4>
                                            <p className="text-slate-600 mt-1">+62 822 9311 8410</p>
                                            <a href="https://wa.me/6282293118410" target="_blank" rel="noreferrer" className="text-blue-600 text-sm font-semibold mt-2 inline-block hover:underline">
                                                Chat Sekarang →
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                            <Mail className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Email</h4>
                                            <p className="text-slate-600 mt-1">ptkreatifteknologimajubersama@gmail.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Alamat Kantor</h4>
                                            <p className="text-slate-600 mt-1 leading-relaxed">
                                                BTN UNHALU BLOK L NO 10<br/>
                                                Kendari, Sulawesi Tenggara
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                            <Clock className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Jam Operasional</h4>
                                            <p className="text-slate-600 mt-1">Senin - Jumat: 09.00 - 17.00 WITA</p>
                                            <p className="text-sm text-green-600 font-medium mt-1">SLA Response &lt; 1 jam</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                                <Shield className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-800 opacity-50" />
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-4">Privasi Terjamin</h3>
                                    <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                                        Ide dan data bisnis Anda adalah aset berharga. Kami siap menandatangani Non-Disclosure Agreement (NDA) sebelum diskusi lebih lanjut.
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-blue-400 font-semibold">
                                        <CheckCircle2 className="w-5 h-5" /> 100% Data Aman
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inquiry Form (Right) */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl p-8 md:p-12 border border-slate-100 shadow-xl">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Kirim Pesan</h3>
                                <p className="text-slate-600 mb-8">Isi form di bawah ini dan tim kami akan segera menghubungi Anda melalui WhatsApp atau Email.</p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap *</label>
                                            <input 
                                                type="text" 
                                                id="name" 
                                                name="name" 
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                                placeholder="Cth: Budi Santoso"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">Nama Perusahaan</label>
                                            <input 
                                                type="text" 
                                                id="company" 
                                                name="company" 
                                                value={formData.company}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                                placeholder="Cth: PT Sukses Makmur"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                                            <input 
                                                type="email" 
                                                id="email" 
                                                name="email" 
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                                placeholder="budi@perusahaan.com"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">No. WhatsApp *</label>
                                            <input 
                                                type="tel" 
                                                id="phone" 
                                                name="phone" 
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                                placeholder="081234567890"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="interest" className="block text-sm font-medium text-slate-700 mb-2">Layanan yang Dibutuhkan</label>
                                        <select 
                                            id="interest" 
                                            name="interest"
                                            value={formData.interest}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-white"
                                        >
                                            <option value="software">Custom Software Development</option>
                                            <option value="erp_pos">Sistem ERP & POS (Retail/F&B)</option>
                                            <option value="mobile">Mobile App Development</option>
                                            <option value="creative">Creative Agency (Video/Desain)</option>
                                            <option value="other">Lainnya / Belum Tahu</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Ceritakan Masalah / Kebutuhan Anda *</label>
                                        <textarea 
                                            id="message" 
                                            name="message" 
                                            rows={5}
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none"
                                            placeholder="Contoh: Saya sedang mencari solusi untuk mengotomasi pencatatan stok di 5 cabang toko saya..."
                                        ></textarea>
                                    </div>

                                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5">
                                        <Send className="w-5 h-5" /> Kirim via WhatsApp
                                    </button>
                                    <p className="text-center text-sm text-slate-500 mt-4">
                                        * Dengan mengirim form ini, Anda akan diarahkan ke WhatsApp kami.
                                    </p>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}

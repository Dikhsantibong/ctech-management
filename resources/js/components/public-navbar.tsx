import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function PublicNavbar({ isLandingPage = false }: { isLandingPage?: boolean }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getLink = (hash: string) => isLandingPage ? hash : `/${hash}`;
    
    // Using purely Tailwind for the glass effect and underline animation
    const navClass = isScrolled 
        ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/60 py-3 shadow-sm' 
        : 'bg-transparent py-5';

    const linkClass = "relative hover:text-blue-600 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full";

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navClass}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    <img src="/logo/logo-web.png" alt="CTECH Logo" className="h-8" />
                    <span className="font-bold text-xl tracking-tight text-slate-900">CTECH</span>
                </Link>
                
                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <a href={getLink('#home')} className={linkClass}>Home</a>
                    <a href={getLink('#layanan')} className={linkClass}>Layanan</a>
                    <Link href="/tentang" className={linkClass}>Tentang Kami</Link>
                    <Link href="/produk" className={linkClass}>Produk</Link>
                    <Link href="/portfolio" className={linkClass}>Portfolio</Link>
                    <Link href="/berita" className={linkClass}>Berita</Link>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <a href={getLink('#kontak')} className="bg-slate-900 hover:bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5">
                        Konsultasi Gratis
                    </a>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Content */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-lg py-4 px-6 flex flex-col gap-4">
                    <a href={getLink('#home')} className="text-slate-600 font-medium py-2 border-b">Home</a>
                    <a href={getLink('#layanan')} className="text-slate-600 font-medium py-2 border-b">Layanan</a>
                    <Link href="/tentang" className="text-slate-600 font-medium py-2 border-b">Tentang Kami</Link>
                    <Link href="/produk" className="text-slate-600 font-medium py-2 border-b">Produk</Link>
                    <Link href="/portfolio" className="text-slate-600 font-medium py-2 border-b">Portfolio</Link>
                    <Link href="/berita" className="text-slate-600 font-medium py-2 border-b">Berita</Link>
                    <a href={getLink('#kontak')} className="bg-blue-600 text-white px-5 py-3 rounded-xl text-center font-semibold mt-2">Konsultasi Gratis</a>
                </div>
            )}
        </nav>
    );
}

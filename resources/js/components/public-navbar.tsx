import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function PublicNavbar() {
    const { url } = usePage();
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

    const navClass = isScrolled 
        ? 'bg-surface/95 backdrop-blur-md border-b border-outline-variant shadow-sm' 
        : 'bg-surface/95 backdrop-blur-md border-b border-outline-variant';

    const getLinkClass = (path: string) => {
        // Handle exact match for home, or prefix match for others
        const isActive = (path === '/' && url === '/') || (path !== '/' && url.startsWith(path));
        
        return isActive
            ? "font-button text-button text-primary font-bold border-b-2 border-primary flex items-center h-20"
            : "font-button text-button text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center h-20";
    };

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navClass}`}>
            <div className="max-w-container-max mx-auto px-margin-desktop flex items-center h-20">
                {/* Logo - Left aligned */}
                <div className="flex-1 flex justify-start h-full items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/logo/logo-web.png" alt="CTECH Logo" className="h-8" />
                        <span className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight">CTECH</span>
                    </Link>
                </div>

                {/* Desktop Menu - Centered */}
                <div className="hidden lg:flex justify-center items-center gap-stack-lg h-full">
                    <Link href="/layanan" className={getLinkClass('/layanan')}>Solusi</Link>
                    <Link href="/industri" className={getLinkClass('/industri')}>Industri</Link>
                    <Link href="/case-studi" className={getLinkClass('/case-studi')}>Case Studi</Link>
                    <Link href="/proses" className={getLinkClass('/proses')}>Proses</Link>
                    <Link href="/tentang" className={getLinkClass('/tentang')}>About</Link>
                </div>

                {/* Actions - Right aligned */}
                <div className="flex-1 flex justify-end items-center gap-stack-md">
                    <button className="hidden xl:flex items-center gap-stack-sm font-button text-button px-stack-lg py-stack-sm border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container transition-all">
                        <span className="material-symbols-outlined text-[20px]">search</span>
                        <span>Cari Informasi</span>
                    </button>
                    <Link href="/kontak" className="hidden md:inline-block bg-primary text-on-primary font-button text-button px-stack-lg py-stack-md rounded-lg cursor-pointer active:opacity-80 transition-all text-center">
                        Konsultasi Gratis
                    </Link>
                    
                    {/* Mobile Menu Toggle */}
                    <button className="lg:hidden text-on-surface-variant ml-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Content */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-surface border-b border-outline-variant shadow-lg py-4 px-margin-desktop flex flex-col gap-4">
                    <Link href="/layanan" className="text-on-surface font-button text-button py-2 border-b border-outline-variant/50">Solusi</Link>
                    <Link href="/industri" className="text-on-surface font-button text-button py-2 border-b border-outline-variant/50">Industri</Link>
                    <Link href="/case-studi" className="text-on-surface font-button text-button py-2 border-b border-outline-variant/50">Case Studi</Link>
                    <Link href="/proses" className="text-on-surface font-button text-button py-2 border-b border-outline-variant/50">Proses</Link>
                    <Link href="/tentang" className="text-on-surface font-button text-button py-2 border-b border-outline-variant/50">About</Link>
                    <Link href="/kontak" className="bg-primary text-on-primary px-5 py-3 rounded-xl text-center font-button text-button mt-2">Konsultasi Gratis</Link>
                </div>
            )}
        </nav>
    );
}

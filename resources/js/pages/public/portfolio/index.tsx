import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { PremiumNavbar } from '@/components/ui/PremiumNavbar';
import { Footer } from '@/components/public/sections/Footer';
import { PortfolioGallery } from '@/components/public/sections/PortfolioGallery';

export default function PortfolioIndex({ portfolios = [] }: { portfolios?: any[] }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    return (
        <div className="bg-[var(--premium-bg)] text-[var(--premium-text)] selection:bg-[var(--premium-gold)] selection:text-[var(--premium-dark)] font-['Inter',_sans-serif]">
            <Head>
                <title>Portfolio | CTECH</title>
            </Head>

            <div className="fixed top-0 w-full z-50 mix-blend-difference text-white">
                <PremiumNavbar />
            </div>

            <main className="w-full overflow-hidden pt-12">
                <PortfolioGallery portfolios={portfolios} />
            </main>

            <Footer />
        </div>
    );
}

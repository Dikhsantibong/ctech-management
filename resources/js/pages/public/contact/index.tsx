import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { PremiumNavbar } from '@/components/ui/PremiumNavbar';
import { Footer } from '@/components/public/sections/Footer';
import { Contact } from '@/components/public/sections/Contact';

import { SEO } from '@/components/SEO';

export default function ContactIndex() {
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
            <SEO 
                title="Hubungi Kami | CTECH Creative" 
                description="Mulai proyek Anda hari ini. Hubungi tim ahli kami untuk mendiskusikan kebutuhan sistem, aplikasi, dan desain UI/UX Anda."
                url="/kontak"
            />

            <div className="fixed top-0 w-full z-50 mix-blend-difference text-white">
                <PremiumNavbar />
            </div>

            <main className="w-full overflow-hidden pt-20 bg-[var(--premium-dark)]">
                <Contact />
            </main>

            <Footer />
        </div>
    );
}

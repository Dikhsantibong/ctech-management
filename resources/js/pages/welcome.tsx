import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import Lenis from 'lenis';
import PublicNavbar from '@/components/public-navbar';

import { Hero } from '@/components/public/sections/Hero';
import { About } from '@/components/public/sections/About';
import { Process } from '@/components/public/sections/Process';
import { PortfolioGallery } from '@/components/public/sections/PortfolioGallery';
import { Statistics } from '@/components/public/sections/Statistics';
import { ClientMarquee } from '@/components/public/sections/ClientMarquee';
import { Testimonials } from '@/components/public/sections/Testimonials';
import { Contact } from '@/components/public/sections/Contact';
import { Footer } from '@/components/public/sections/Footer';

export default function Welcome() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <div className="bg-[var(--premium-bg)] text-[var(--premium-text)] selection:bg-[var(--premium-gold)] selection:text-[var(--premium-dark)] font-['Inter',_sans-serif]">
            <Head>
                <title>CTECH | Award-Winning Digital Agency</title>
                <meta name="description" content="We don't just build software. We craft digital legacies." />
            </Head>

            {/* A transparent or blur nav if needed, reusing the existing one or modifying it */}
            <div className="fixed top-0 w-full z-50 mix-blend-difference text-white">
                <PublicNavbar />
            </div>

            <main className="w-full overflow-hidden">
                <Hero />
                <About />
                <Process />
                <PortfolioGallery />
                <Statistics />
                <ClientMarquee />
                <Testimonials />
                <Contact />
            </main>

            <Footer />
        </div>
    );
}
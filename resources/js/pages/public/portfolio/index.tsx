import { PremiumNavbar } from '@/components/ui/PremiumNavbar';
import { Footer } from '@/components/public/sections/Footer';
import { PageHeader } from '@/components/public/PageHeader';
import { PortfolioGallery } from '@/components/public/sections/PortfolioGallery';
import { useLenis } from '@/hooks/use-lenis';
import { SEO } from '@/components/SEO';

export default function PortfolioIndex({ portfolios }: { portfolios?: any }) {
    useLenis();

    return (
        <div className="bg-white text-[var(--premium-text)] selection:bg-[var(--premium-gold)] selection:text-white font-body">
            <SEO
                title="Karya Pilihan | CTECH Creative"
                description="Jelajahi karya pilihan kami, mulai dari arsitektur e-commerce yang kompleks hingga dasbor fintech modern. Bukti nyata keahlian digital kami."
                url="/portfolio"
            />

            <PremiumNavbar />

            <main className="w-full overflow-hidden">
                <PageHeader
                    eyebrow="Karya Pilihan"
                    title="Portfolio Imersif."
                    description="Bukti nyata keahlian digital kami — dari arsitektur e-commerce yang kompleks hingga dasbor fintech modern."
                />
                <PortfolioGallery portfolios={portfolios} />
            </main>

            <Footer />
        </div>
    );
}

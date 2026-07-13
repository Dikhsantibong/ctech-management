import { PremiumNavbar } from '@/components/ui/PremiumNavbar';
import { useLenis } from '@/hooks/use-lenis';

import { Hero } from '@/components/public/sections/Hero';
import { ServicesOverview } from '@/components/public/sections/ServicesOverview';
import { About } from '@/components/public/sections/About';
import { Process } from '@/components/public/sections/Process';
import { ProjectsShowcase } from '@/components/public/sections/ProjectsShowcase';
import { Statistics } from '@/components/public/sections/Statistics';
import { ClientMarquee } from '@/components/public/sections/ClientMarquee';
import { Testimonials } from '@/components/public/sections/Testimonials';
import { NewsHighlight } from '@/components/public/sections/NewsHighlight';
import { Contact } from '@/components/public/sections/Contact';
import { Footer } from '@/components/public/sections/Footer';

import { SEO } from '@/components/SEO';

export default function Welcome({ portfolios = [], news = [] }: { portfolios?: any[]; news?: any[] }) {
    useLenis();

    return (
        <div className="bg-white text-[var(--premium-text)] selection:bg-[var(--premium-gold)] selection:text-white font-body">
            <SEO
                title="CTECH | Agensi Digital Pemenang Penghargaan"
                description="CTECH Creative adalah agensi digital premium yang berfokus pada pengembangan software enterprise, aplikasi web memukau, dan desain UI/UX kelas dunia."
                url="/"
            />

            <PremiumNavbar />

            <main className="w-full overflow-hidden">
                <Hero />
                <ServicesOverview />
                <About />
                <Process />
                <ProjectsShowcase portfolios={portfolios} />
                <Statistics />
                <ClientMarquee />
                <Testimonials />
                <NewsHighlight news={news} />
                <Contact />
            </main>

            <Footer />
        </div>
    );
}

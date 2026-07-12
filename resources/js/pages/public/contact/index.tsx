import { PremiumNavbar } from '@/components/ui/PremiumNavbar';
import { Footer } from '@/components/public/sections/Footer';
import { Contact } from '@/components/public/sections/Contact';
import { useLenis } from '@/hooks/use-lenis';
import { SEO } from '@/components/SEO';

export default function ContactIndex() {
    useLenis();

    return (
        <div className="bg-[#0d0d0d] text-white selection:bg-[var(--premium-gold)] selection:text-white font-body">
            <SEO
                title="Hubungi Kami | CTECH Creative"
                description="Mulai proyek Anda hari ini. Hubungi tim ahli kami untuk mendiskusikan kebutuhan sistem, aplikasi, dan desain UI/UX Anda."
                url="/kontak"
            />

            <PremiumNavbar />

            <main className="w-full overflow-hidden pt-20 md:pt-24 bg-[#0d0d0d]">
                <Contact />
            </main>

            <Footer />
        </div>
    );
}

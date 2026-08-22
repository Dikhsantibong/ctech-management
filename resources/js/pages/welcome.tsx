import { PremiumNavbar } from '@/components/ui/PremiumNavbar';
import { useLenis } from '@/hooks/use-lenis';

import { Hero } from '@/components/public/sections/Hero';
import { About } from '@/components/public/sections/About';
import { ServicesOverview } from '@/components/public/sections/ServicesOverview';
import { Process } from '@/components/public/sections/Process';
import { ProjectsShowcase } from '@/components/public/sections/ProjectsShowcase';
import { Statistics } from '@/components/public/sections/Statistics';
import { NewsHighlight } from '@/components/public/sections/NewsHighlight';
import { Contact } from '@/components/public/sections/Contact';
import { Footer } from '@/components/public/sections/Footer';

import { ClientMarquee } from '@/components/public/sections/ClientMarquee';

import { SEO } from '@/components/SEO';

type Company = {
    legal_name?: string | null;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
};

/**
 * Halaman utama.
 *
 * Urutan bagian mengikuti cara calon klien korporat menilai vendor:
 * siapa (Hero) → apa dasarnya (Profil) → apa yang dikerjakan (Layanan) →
 * bagaimana caranya (Tahapan) → buktinya (Portofolio, Angka) → kabar terbaru →
 * cara menghubungi.
 *
 * Bagian Testimonials dan ClientMarquee sengaja tidak disertakan: isinya masih
 * berupa nama dan kutipan buatan, yang justru merusak kredibilitas pada situs
 * korporat. Komponennya tetap ada dan siap dipasang kembali begitu tersedia
 * testimoni serta daftar klien yang sungguhan.
 */
export default function Welcome({
    portfolios = [],
    news = [],
    company,
    metrics = [],
    capabilities = [],
}: {
    portfolios?: any[];
    news?: any[];
    company?: Company;
    metrics?: { value: number; label: string }[];
    capabilities?: string[];
}) {
    useLenis();

    const legalName = company?.legal_name ?? 'PT Kreatif Teknologi Maju Bersama';

    return (
        <div className="bg-white font-body text-[#0f1115]">
            <SEO
                title={`${legalName} | Pengembangan Sistem Informasi & Aplikasi Web`}
                description="Perusahaan pengembang perangkat lunak untuk kebutuhan operasional instansi dan korporasi: sistem informasi manajemen, aplikasi web, serta integrasi dan migrasi data."
                url="/"
            />

            <PremiumNavbar />

            <main className="w-full">
                <Hero company={company} metrics={metrics} />
                <About company={company} capabilities={capabilities} />
                <ClientMarquee />
                <ServicesOverview />
                <Process />
                <ProjectsShowcase portfolios={portfolios} />
                <Statistics metrics={metrics} />
                <NewsHighlight news={news} />
                <Contact company={company} />
            </main>

            <Footer company={company} />
        </div>
    );
}

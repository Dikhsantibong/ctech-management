import { PremiumNavbar } from '@/components/ui/PremiumNavbar';
import { Footer } from '@/components/public/sections/Footer';
import { PageHeader } from '@/components/public/PageHeader';
import { PortfolioGallery } from '@/components/public/sections/PortfolioGallery';
import { useLenis } from '@/hooks/use-lenis';
import { SEO } from '@/components/SEO';

type Company = {
    legal_name?: string | null;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
};

export default function PortfolioIndex({
    portfolios,
    categories = [],
    company,
}: {
    portfolios?: any;
    categories?: string[];
    company?: Company;
}) {
    useLenis();

    const legalName = company?.legal_name ?? 'PT Kreatif Teknologi Maju Bersama';
    const total = portfolios?.total ?? portfolios?.data?.length ?? 0;

    const meta = [
        ...(total ? [{ label: 'Pekerjaan Terdokumentasi', value: String(total) }] : []),
        ...(categories.length ? [{ label: 'Bidang', value: categories.join(' · ') }] : []),
        { label: 'Keterangan', value: 'Ditampilkan atas persetujuan pemilik pekerjaan' },
    ];

    return (
        <div className="bg-white font-body text-[#0f1115]">
            <SEO
                title={`Rekam Jejak Pekerjaan | ${legalName}`}
                description="Daftar pekerjaan yang telah kami tangani beserta bidangnya — dasar penilaian atas pengalaman dan cakupan kemampuan perusahaan."
                url="/portfolio"
            />

            <PremiumNavbar />

            <main className="w-full">
                <PageHeader
                    eyebrow="Rekam Jejak"
                    title="Pekerjaan yang telah kami tangani."
                    description="Daftar ini menjadi dasar penilaian atas pengalaman dan cakupan kemampuan kami. Rincian teknis tiap pekerjaan dapat kami sampaikan atas permintaan."
                    meta={meta}
                />

                <PortfolioGallery portfolios={portfolios} />
            </main>

            <Footer company={company} />
        </div>
    );
}

import { PremiumNavbar } from '@/components/ui/PremiumNavbar';
import { Footer } from '@/components/public/sections/Footer';
import { Contact } from '@/components/public/sections/Contact';
import { PageHeader } from '@/components/public/PageHeader';
import { useLenis } from '@/hooks/use-lenis';
import { SEO } from '@/components/SEO';

type Company = {
    legal_name?: string | null;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
};

export default function ContactIndex({ company }: { company?: Company }) {
    useLenis();

    const legalName = company?.legal_name ?? 'PT Kreatif Teknologi Maju Bersama';

    const meta = [
        ...(company?.phone ? [{ label: 'Telepon', value: company.phone }] : []),
        ...(company?.email ? [{ label: 'Surel', value: company.email }] : []),
        { label: 'Jam Layanan', value: 'Senin–Jumat, 08.00–17.00 WITA' },
    ];

    return (
        <div className="bg-[#0f1115] font-body text-white">
            <SEO
                title={`Hubungi Kami | ${legalName}`}
                description="Ajukan kebutuhan pengembangan sistem informasi atau aplikasi web. Permohonan ditinjau pada hari kerja dan dibalas dengan lingkup serta estimasi."
                url="/kontak"
            />

            <PremiumNavbar />

            <main className="w-full">
                <PageHeader
                    eyebrow="Hubungi Kami"
                    title="Sampaikan kebutuhan Anda kepada kami."
                    description="Lengkapi keterangan pada formulir agar peninjauan lebih cepat. Semakin jelas proses yang ingin dibenahi, semakin akurat estimasi yang dapat kami susun."
                    meta={meta}
                />

                <Contact company={company} />
            </main>

            <Footer company={company} />
        </div>
    );
}

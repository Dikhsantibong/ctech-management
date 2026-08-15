import { Link } from "@inertiajs/react";

const NAV_LINKS = [
    { name: "Beranda", href: "/" },
    { name: "Tentang Kami", href: "/tentang" },
    { name: "Layanan", href: "/layanan" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Berita", href: "/berita" },
    { name: "Kontak", href: "/kontak" },
];

const SOCIAL_LINKS = [
    { name: "Instagram", href: "https://www.instagram.com/ctech.agency/" },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/pt-creativetech/" },
];

type Company = {
    legal_name?: string | null;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
};

/**
 * Kaki halaman bergaya dokumen korporat: identitas badan usaha ditempatkan
 * sebagai informasi utama, bukan sekadar baris hak cipta.
 */
export function Footer({ company }: { company?: Company }) {
    const legalName = company?.legal_name ?? "PT Kreatif Teknologi Maju Bersama";

    return (
        <footer className="border-t border-white/10 bg-[#0f1115] text-white">
            <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12 md:py-20">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
                    {/* Identitas badan usaha */}
                    <div className="md:col-span-5">
                        <img src="/logo/sidebar-logo.png" alt={legalName} className="h-11 w-auto" />
                        <p className="mt-6 font-display text-base font-semibold leading-snug">{legalName}</p>
                        {company?.address && (
                            <p className="mt-3 max-w-sm font-body text-sm leading-relaxed text-white/50">{company.address}</p>
                        )}
                        <dl className="mt-6 space-y-1.5 font-body text-sm text-white/60">
                            {company?.phone && (
                                <div className="flex gap-2">
                                    <dt className="text-white/35">Telepon</dt>
                                    <dd>
                                        <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="underline-offset-4 hover:text-white hover:underline">
                                            {company.phone}
                                        </a>
                                    </dd>
                                </div>
                            )}
                            {company?.email && (
                                <div className="flex gap-2">
                                    <dt className="text-white/35">Surel</dt>
                                    <dd>
                                        <a href={`mailto:${company.email}`} className="break-all underline-offset-4 hover:text-white hover:underline">
                                            {company.email}
                                        </a>
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    <nav className="md:col-span-3">
                        <p className="font-body text-[10px] uppercase tracking-[0.24em] text-white/35">Navigasi</p>
                        <ul className="mt-5 space-y-2.5 font-body text-sm">
                            {NAV_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-white/65 underline-offset-4 transition-colors hover:text-white hover:underline">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="md:col-span-2">
                        <p className="font-body text-[10px] uppercase tracking-[0.24em] text-white/35">Kanal Resmi</p>
                        <ul className="mt-5 space-y-2.5 font-body text-sm">
                            {SOCIAL_LINKS.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-white/65 underline-offset-4 transition-colors hover:text-white hover:underline"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <p className="font-body text-[10px] uppercase tracking-[0.24em] text-white/35">Jam Layanan</p>
                        <p className="mt-5 font-body text-sm leading-relaxed text-white/65">
                            Senin–Jumat
                            <br />
                            08.00–17.00 WITA
                        </p>
                    </div>
                </div>

                <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/10 pt-7 font-body text-xs text-white/40 md:flex-row">
                    <p>
                        &copy; {new Date().getFullYear()} {legalName}. Seluruh hak dilindungi undang-undang.
                    </p>
                    {company?.website && <p>{company.website}</p>}
                </div>
            </div>
        </footer>
    );
}

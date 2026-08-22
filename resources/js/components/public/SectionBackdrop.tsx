/**
 * Latar foto untuk bagian bertema gelap.
 *
 * Memakai dokumentasi kegiatan perusahaan sendiri (public/our-story), bukan foto
 * stok. Foto ditutup lapisan warna solid — bukan gradient — agar teks tetap
 * terbaca dan tampilan tidak berubah menjadi ramai.
 */

export const STORY_PHOTOS = [
    '/our-story/photo1.jpeg',
    '/our-story/photo2.jpeg',
    '/our-story/photo3.jpeg',
    '/our-story/photo4.jpeg',
    '/our-story/photo5.jpeg',
] as const;

interface SectionBackdropProps {
    /** Berkas foto dari public/. */
    image: string;
    /** Kepekatan lapisan penutup, 0–100. Makin tinggi makin redup fotonya. */
    overlay?: number;
    /** Posisi fokus foto, mis. "center", "top", "50% 30%". */
    position?: string;
    className?: string;
}

export function SectionBackdrop({
    image,
    overlay = 88,
    position = 'center',
    className = '',
}: SectionBackdropProps) {
    return (
        <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
            <img
                src={image}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
                style={{ objectPosition: position }}
            />
            {/* Lapisan warna rata; sengaja bukan gradient */}
            <div className="absolute inset-0 bg-[#0f1115]" style={{ opacity: overlay / 100 }} />
        </div>
    );
}

/**
 * Deretan dokumentasi kegiatan.
 * Diberi keterangan apa adanya — foto ini memang milik perusahaan, sehingga
 * tidak perlu klaim tambahan.
 */
export function DocumentationStrip({
    photos = STORY_PHOTOS.slice(0, 4),
    caption = 'Dokumentasi kegiatan tim di kantor dan lokasi klien.',
    tone = 'light',
}: {
    photos?: readonly string[];
    caption?: string;
    tone?: 'light' | 'dark';
}) {
    const isDark = tone === 'dark';

    return (
        <section
            className={`border-t py-16 md:py-20 ${
                isDark ? 'border-white/10 bg-[#0f1115] text-white' : 'border-gray-200 bg-white text-[#0f1115]'
            }`}
        >
            <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                <p
                    className={`font-body text-[11px] uppercase tracking-[0.28em] ${
                        isDark ? 'text-white/40' : 'text-gray-400'
                    }`}
                >
                    Dokumentasi
                </p>

                <div className="mt-6 grid grid-cols-2 gap-px bg-gray-200 lg:grid-cols-4 dark:bg-white/10">
                    {photos.map((photo, i) => (
                        <div key={photo} className={`relative aspect-[4/5] overflow-hidden ${i > 1 ? 'hidden lg:block' : ''} sm:block`}>
                            <img
                                src={photo}
                                alt={`Dokumentasi kegiatan tim ${i + 1}`}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover grayscale transition-[filter] duration-500 hover:grayscale-0"
                            />
                        </div>
                    ))}
                </div>

                <p className={`mt-5 font-body text-xs ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{caption}</p>
            </div>
        </section>
    );
}

import { router } from '@inertiajs/react';
import { PenLine, Stamp, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Asset = 'signature' | 'stamp';

const ASSETS: Record<Asset, { title: string; hint: string; icon: typeof PenLine }> = {
    signature: {
        title: 'Tanda tangan Direktur Utama',
        hint: 'PNG latar transparan, tinta gelap, ±600 × 240 px.',
        icon: PenLine,
    },
    stamp: {
        title: 'Cap perusahaan',
        hint: 'PNG latar transparan, ±400 × 400 px. Opsional.',
        icon: Stamp,
    },
};

/**
 * Unggah gambar tanda tangan & cap untuk tanda tangan elektronik dokumen.
 * File disimpan privat; pratinjau diambil lewat route terautentikasi khusus Direktur Utama.
 */
export function SignatureAssetsCard({ settings }: { settings: any }) {
    const [version, setVersion] = useState(() => Date.now());

    return (
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <PenLine className="h-5 w-5 text-primary" />
                    Tanda Tangan Elektronik
                </CardTitle>
                <CardDescription>
                    Dipakai saat Anda mengesahkan surat, penawaran/RAB, dan kwitansi. Mengganti gambar tidak mengubah dokumen yang sudah ditandatangani.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
                {(Object.keys(ASSETS) as Asset[]).map((asset) => (
                    <AssetSlot
                        key={asset}
                        asset={asset}
                        exists={asset === 'signature' ? !!settings?.has_signature_image : !!settings?.has_stamp_image}
                        version={version}
                        onChanged={() => setVersion(Date.now())}
                    />
                ))}
            </CardContent>
        </Card>
    );
}

function AssetSlot({ asset, exists, version, onChanged }: { asset: Asset; exists: boolean; version: number; onChanged: () => void }) {
    const input = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const { title, hint, icon: Icon } = ASSETS[asset];

    const upload = (file: File | undefined) => {
        if (!file) {
            return;
        }

        router.post('/settings/signature-assets', { asset, file }, {
            forceFormData: true,
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => {
                setProcessing(false);

                if (input.current) {
                    input.current.value = '';
                }
            },
            onError: (errors) => setError(errors.file || errors.asset || 'Gagal mengunggah gambar.'),
            onSuccess: () => {
                setError(null);
                onChanged();
            },
        });
    };

    const remove = () => {
        router.delete(`/settings/signature-assets/${asset}`, { preserveScroll: true, onSuccess: onChanged });
    };

    return (
        <div className="space-y-3 rounded-lg border p-4">
            <div>
                <p className="text-[15px] font-semibold">{title}</p>
                <p className="text-[13px] text-muted-foreground">{hint}</p>
            </div>
            {/* Latar putih agar pratinjau sama dengan kertas PDF, juga di dark mode */}
            <div className="flex h-32 items-center justify-center rounded-md border bg-white">
                {exists ? (
                    <img src={`/settings/signature-assets/${asset}?v=${version}`} alt={title} className="max-h-28 max-w-full object-contain" />
                ) : (
                    <Icon className="size-5 text-[#98A2B3]" />
                )}
            </div>
            {error && <p className="text-[13px] text-destructive">{error}</p>}
            <input ref={input} type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
            <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" disabled={processing} onClick={() => input.current?.click()}>
                    <Upload /> {exists ? 'Ganti' : 'Unggah'}
                </Button>
                {exists && (
                    <Button type="button" variant="ghost" size="sm" onClick={remove}>
                        <Trash2 /> Hapus
                    </Button>
                )}
            </div>
        </div>
    );
}

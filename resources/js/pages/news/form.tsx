import { Head, Link, useForm } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, CheckCircle2, ExternalLink, Image as ImageIcon, Save, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { LinkPreviews } from '@/components/news/LinkPreviews';
import { SharePreviewDialog } from '@/components/news/SharePreviewDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ShareMeta {
    title: string;
    description: string;
    url: string;
    image: { url: string; is_default: boolean };
    story_image_url: string;
}

const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 160;

const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'image', 'video'],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ['clean'],
    ],
};

const quillFormats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'video', 'align', 'color', 'background'];

function plainText(html: string): string {
    const element = document.createElement('div');
    element.innerHTML = html;

    return (element.textContent || '').replace(/\s+/g, ' ').trim();
}

function truncate(text: string, limit: number): string {
    return text.length > limit ? `${text.slice(0, limit - 1).trimEnd()}…` : text;
}

/** Object URL untuk file yang dipilih, dibersihkan saat berganti. */
function useFilePreview(file: File | null): string | null {
    const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

    useEffect(() => () => {
        if (url) {
            URL.revokeObjectURL(url);
        }
    }, [url]);

    return url;
}

function CharCount({ value, limit }: { value: string; limit: number }) {
    return <span className={`text-xs ${value.length > limit ? 'text-amber-600' : 'text-muted-foreground'}`}>{value.length}/{limit}</span>;
}

export default function NewsForm({ news, share, siteUrl }: { news: any | null; share: ShareMeta | null; siteUrl: string }) {
    const isEdit = !!news;
    const [serverCheckOpen, setServerCheckOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        title: news?.title || '',
        content: news?.content || '',
        category: news?.category || 'Pengumuman',
        status: news?.status || 'Draft',
        image: null as File | null,
        excerpt: news?.excerpt || '',
        seo_title: news?.seo_title || '',
        seo_description: news?.seo_description || '',
        story_image: null as File | null,
        remove_story_image: false,
    });

    const imagePreview = useFilePreview(data.image);
    const storyPreview = useFilePreview(data.story_image);

    const existingImage = news?.social_image || news?.image ? `/storage/${news.social_image || news.image}` : null;
    const existingStory = news?.story_image && !data.remove_story_image ? `/storage/${news.story_image}` : null;

    const preview = useMemo(() => {
        const description = data.seo_description || data.excerpt || truncate(plainText(data.content), DESCRIPTION_LIMIT);

        return {
            title: data.seo_title || data.title || 'Judul artikel',
            description: description || 'Deskripsi artikel akan tampil di sini.',
            imageUrl: imagePreview || existingImage || '/images/og-default.jpg',
            url: share?.url || `${siteUrl}/berita/${data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
        };
    }, [data.seo_title, data.title, data.seo_description, data.excerpt, data.content, imagePreview, existingImage, share, siteUrl]);

    const checks = [
        { label: 'Featured image', ok: !!(data.image || news?.image), hint: 'Tanpa gambar, dipakai gambar default CTECH.' },
        { label: 'SEO title', ok: !!data.seo_title && data.seo_title.length <= TITLE_LIMIT, hint: `Isi maksimal ${TITLE_LIMIT} karakter.` },
        { label: 'Meta description', ok: !!(data.seo_description || data.excerpt), hint: 'Jika kosong, diambil dari isi artikel.' },
        { label: 'Isi artikel', ok: plainText(data.content).length > 0, hint: 'Isi berita wajib diisi.' },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // File upload + PUT: pakai POST dengan method spoofing.
        post(isEdit ? `/news/${news.id}?_method=PUT` : '/news', { forceFormData: true, preserveScroll: true });
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Berita' : 'Buat Berita'} />
            <form onSubmit={submit} className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/news">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit Berita' : 'Buat Berita Baru'}</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {isEdit ? 'Ubah konten, SEO, dan aset sharing artikel.' : 'Tulis berita atau pengumuman baru untuk dipublikasikan.'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isEdit && news.status === 'Published' && (
                            <Button variant="outline" asChild>
                                <a href={`/berita/${news.slug}`} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-2 h-4 w-4" /> Lihat
                                </a>
                            </Button>
                        )}
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" /> {isEdit ? 'Simpan Perubahan' : 'Simpan Berita'}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Konten</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Judul Berita</Label>
                                    <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                                    {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Kategori</Label>
                                        <Input id="category" value={data.category} onChange={(e) => setData('category', e.target.value)} placeholder="Contoh: Pengumuman, Event, Artikel" />
                                        {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                            <SelectTrigger id="status">
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Draft">Draft</SelectItem>
                                                <SelectItem value="Published">Published</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Isi Berita</Label>
                                    <div className="rounded-md border border-input bg-white">
                                        <ReactQuill
                                            theme="snow"
                                            value={data.content}
                                            onChange={(content) => setData('content', content)}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            className="mb-12 h-[480px]"
                                        />
                                    </div>
                                    {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Gambar</CardTitle>
                                <CardDescription>Featured image untuk halaman berita dan preview link, serta story image portrait.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_180px]">
                                <div className="space-y-2">
                                    <Label htmlFor="image">Featured Image {isEdit && <span className="text-xs text-muted-foreground">(kosongkan jika tidak diganti)</span>}</Label>
                                    <div className="flex aspect-[1.91/1] items-center justify-center overflow-hidden rounded-md border bg-muted">
                                        {imagePreview || existingImage ? (
                                            <img src={imagePreview || existingImage!} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                        )}
                                    </div>
                                    <Input id="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setData('image', e.target.files?.[0] || null)} />
                                    {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
                                    <p className="text-xs text-muted-foreground">JPG, PNG, atau WebP, maks 5MB. Rekomendasi 1200 × 630 px (1.91:1); thumbnail sosial dibuat otomatis.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="story_image">Story Image</Label>
                                    <div className="flex aspect-[9/16] items-center justify-center overflow-hidden rounded-md border bg-muted">
                                        {storyPreview || existingStory ? (
                                            <img src={storyPreview || existingStory!} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="px-3 text-center text-xs text-muted-foreground">Otomatis dari featured image + judul</span>
                                        )}
                                    </div>
                                    <Input id="story_image" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setData('story_image', e.target.files?.[0] || null)} />
                                    {errors.story_image && <p className="text-sm text-destructive">{errors.story_image}</p>}
                                    <p className="text-xs text-muted-foreground">Opsional, 1080 × 1920 px.</p>
                                    {news?.story_image && (
                                        <label className="flex items-center gap-2 text-xs">
                                            <input type="checkbox" checked={data.remove_story_image} onChange={(e) => setData('remove_story_image', e.target.checked)} />
                                            Hapus (pakai versi otomatis)
                                        </label>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>SEO & Social Sharing</CardTitle>
                                <CardDescription>Kosongkan untuk memakai judul dan isi artikel.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="seo_title">SEO Title</Label>
                                        <CharCount value={data.seo_title} limit={TITLE_LIMIT} />
                                    </div>
                                    <Input id="seo_title" value={data.seo_title} maxLength={90} onChange={(e) => setData('seo_title', e.target.value)} placeholder={data.title} />
                                    {errors.seo_title && <p className="text-sm text-destructive">{errors.seo_title}</p>}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="seo_description">Meta Description</Label>
                                        <CharCount value={data.seo_description} limit={DESCRIPTION_LIMIT} />
                                    </div>
                                    <Textarea id="seo_description" value={data.seo_description} maxLength={300} rows={3} onChange={(e) => setData('seo_description', e.target.value)} />
                                    {errors.seo_description && <p className="text-sm text-destructive">{errors.seo_description}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="excerpt">Ringkasan (Excerpt)</Label>
                                    <Textarea id="excerpt" value={data.excerpt} maxLength={500} rows={3} onChange={(e) => setData('excerpt', e.target.value)} />
                                    {errors.excerpt && <p className="text-sm text-destructive">{errors.excerpt}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Kesiapan Sharing</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {checks.map((check) => (
                                    <div key={check.label} className="flex gap-2 text-sm">
                                        {check.ok ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> : <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />}
                                        <div>
                                            <p className="font-medium">{check.label}</p>
                                            {!check.ok && <p className="text-xs text-muted-foreground">{check.hint}</p>}
                                        </div>
                                    </div>
                                ))}
                                {isEdit ? (
                                    <Button type="button" variant="outline" className="w-full" onClick={() => setServerCheckOpen(true)}>
                                        <ShieldCheck className="mr-2 h-4 w-4" /> Validasi Metadata Server
                                    </Button>
                                ) : (
                                    <p className="text-xs text-muted-foreground">Simpan sebagai Draft untuk menjalankan validasi metadata server (canonical URL & akses publik gambar).</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Preview Link</CardTitle>
                                    <Badge variant="outline">Live</Badge>
                                </div>
                                <CardDescription>Perkiraan tampilan saat URL dibagikan. Simpan untuk menerapkan ke halaman publik.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <LinkPreviews {...preview} compact />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>

            {isEdit && <SharePreviewDialog newsId={news.id} open={serverCheckOpen} onOpenChange={setServerCheckOpen} />}
        </>
    );
}

NewsForm.layout = {
    breadcrumbs: [
        { title: 'Berita', href: '/news' },
        { title: 'Form', href: '#' },
    ],
};

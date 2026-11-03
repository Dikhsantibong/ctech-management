<?php

namespace App\Services\News;

use App\Models\News;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Sumber tunggal metadata sharing artikel: Open Graph, Twitter/X Card, dan JSON-LD.
 * Dirender di Blade (HTML awal) agar crawler yang tidak menjalankan JavaScript tetap membacanya.
 */
class NewsShareMeta
{
    public const SITE_NAME = 'CTECH';

    public const DEFAULT_IMAGE = 'images/og-default.jpg';

    public const TITLE_LIMIT = 60;

    public const DESCRIPTION_LIMIT = 160;

    /**
     * @return array{
     *     title: string,
     *     description: string,
     *     url: string,
     *     site_name: string,
     *     locale: string,
     *     image: array{url: string, width: int|null, height: int|null, type: string|null, alt: string, is_default: bool},
     *     story_image_url: string,
     *     article: array{published_time: string|null, modified_time: string|null, author: string, section: string|null, tags: list<string>},
     *     twitter: array{card: string, site: string|null},
     *     json_ld: array<string, mixed>
     * }
     */
    public function build(News $news): array
    {
        $url = $this->canonicalUrl($news);
        $title = $this->title($news);
        $description = $this->description($news);
        $image = $this->image($news);
        $author = $news->author?->name ?? self::SITE_NAME;

        return [
            'title' => $title,
            'description' => $description,
            'url' => $url,
            'site_name' => self::SITE_NAME,
            'locale' => 'id_ID',
            'image' => $image,
            'story_image_url' => $url.'/story.jpg',
            'article' => [
                'published_time' => $news->published_at?->toIso8601String(),
                'modified_time' => $news->updated_at?->toIso8601String(),
                'author' => $author,
                'section' => $news->category,
                'tags' => array_values(array_filter([$news->category])),
            ],
            'twitter' => [
                'card' => 'summary_large_image',
                'site' => config('services.twitter.site'),
            ],
            'json_ld' => [
                '@context' => 'https://schema.org',
                '@type' => $this->schemaType($news),
                'headline' => Str::limit($news->title, 110, '…'),
                'description' => $description,
                'image' => [$image['url']],
                'author' => ['@type' => $news->author ? 'Person' : 'Organization', 'name' => $author],
                'publisher' => [
                    '@type' => 'Organization',
                    'name' => self::SITE_NAME,
                    'logo' => ['@type' => 'ImageObject', 'url' => $this->absoluteUrl('logo/logo-web.png')],
                ],
                'datePublished' => $news->published_at?->toIso8601String(),
                'dateModified' => $news->updated_at?->toIso8601String(),
                'mainEntityOfPage' => ['@type' => 'WebPage', '@id' => $url],
                'articleSection' => $news->category,
                'inLanguage' => 'id-ID',
            ],
        ];
    }

    /**
     * Pemeriksaan kesiapan sharing sebelum/sesudah publikasi.
     *
     * @return list<array{key: string, label: string, status: 'pass'|'warn'|'fail', message: string}>
     */
    public function checks(News $news, bool $probeImage = true): array
    {
        $meta = $this->build($news);
        $checks = [];

        $checks[] = $this->check('published', 'Status Published', $news->status === 'Published' ? 'pass' : 'warn',
            $news->status === 'Published'
                ? 'Artikel dapat diakses crawler publik.'
                : 'Masih Draft: URL publik mengembalikan 404 sampai dipublikasikan.');

        $checks[] = $this->check('featured_image', 'Featured image', $news->image ? 'pass' : 'warn',
            $news->image ? 'Featured image tersedia.' : 'Belum ada featured image; preview memakai gambar default CTECH.');

        $checks[] = $this->check('social_image', 'Thumbnail 1200 × 630', $news->social_image ? 'pass' : 'warn', $news->social_image
            ? 'Thumbnail rasio 1.91:1 (JPEG) sudah dibuat dari featured image.'
            : 'Thumbnail teroptimasi belum dibuat; jalankan php artisan news:social-images atau unggah ulang gambar.');

        $checks[] = $this->check('seo_title', 'SEO title', match (true) {
            blank($news->seo_title) => 'warn',
            Str::length($news->seo_title) > self::TITLE_LIMIT => 'warn',
            default => 'pass',
        }, blank($news->seo_title)
            ? 'SEO title kosong; judul artikel dipakai sebagai og:title.'
            : 'Panjang '.Str::length($news->seo_title).' karakter (disarankan ≤ '.self::TITLE_LIMIT.').');

        $hasDescription = filled($news->seo_description) || filled($news->excerpt);
        $checks[] = $this->check('description', 'Meta description', $hasDescription ? 'pass' : 'warn',
            $hasDescription
                ? 'Panjang '.Str::length($meta['description']).' karakter (disarankan ≤ '.self::DESCRIPTION_LIMIT.').'
                : 'Belum diisi; deskripsi diambil otomatis dari isi artikel.');

        $isAbsolute = Str::startsWith($meta['url'], ['https://', 'http://']);
        $checks[] = $this->check('canonical', 'Canonical URL', match (true) {
            ! $isAbsolute => 'fail',
            ! Str::startsWith($meta['url'], 'https://') => 'warn',
            default => 'pass',
        }, $isAbsolute ? $meta['url'] : 'Canonical URL tidak absolut; periksa APP_URL.');

        $checks[] = $this->check('open_graph', 'Open Graph metadata',
            filled($meta['title']) && filled($meta['description']) && filled($meta['image']['url']) ? 'pass' : 'fail',
            'og:title, og:description, og:image, og:url, og:type=article dirender di HTML awal.');

        $checks[] = $probeImage ? $this->probeImage($meta['image']['url']) : $this->check('image_public', 'Gambar dapat diakses publik', 'warn', 'Tidak diperiksa.');

        return $checks;
    }

    public function canonicalUrl(News $news): string
    {
        return rtrim(config('app.url'), '/').route('public.news.show', $news->slug, false);
    }

    public function title(News $news): string
    {
        return filled($news->seo_title) ? $news->seo_title : $news->title;
    }

    public function description(News $news): string
    {
        foreach ([$news->seo_description, $news->excerpt] as $candidate) {
            if (filled($candidate)) {
                return Str::limit(trim($candidate), 300, '…');
            }
        }

        $plain = preg_replace('/\s+/u', ' ', html_entity_decode(strip_tags((string) $news->content), ENT_QUOTES | ENT_HTML5, 'UTF-8'));

        return Str::limit(trim($plain), self::DESCRIPTION_LIMIT, '…');
    }

    /**
     * NewsArticle untuk berita; BlogPosting untuk kategori artikel umum/blog/tips.
     */
    public function schemaType(News $news): string
    {
        return preg_match('/artikel|article|blog|tips|insight|tutorial|opini/i', (string) $news->category)
            ? 'BlogPosting'
            : 'NewsArticle';
    }

    /**
     * @return array{url: string, width: int|null, height: int|null, type: string|null, alt: string, is_default: bool}
     */
    private function image(News $news): array
    {
        $disk = Storage::disk('public');

        foreach ([$news->social_image, $news->image] as $path) {
            if ($path && $disk->exists($path)) {
                $size = @getimagesize($disk->path($path)) ?: null;

                return [
                    'url' => $this->absoluteUrl($disk->url($path)),
                    'width' => $size[0] ?? null,
                    'height' => $size[1] ?? null,
                    'type' => $size['mime'] ?? null,
                    'alt' => $news->title,
                    'is_default' => false,
                ];
            }
        }

        return [
            'url' => $this->absoluteUrl(self::DEFAULT_IMAGE),
            'width' => SocialImageGenerator::SHARE_WIDTH,
            'height' => SocialImageGenerator::SHARE_HEIGHT,
            'type' => 'image/jpeg',
            'alt' => self::SITE_NAME,
            'is_default' => true,
        ];
    }

    private function absoluteUrl(string $path): string
    {
        if (Str::startsWith($path, ['http://', 'https://'])) {
            return $path;
        }

        return rtrim(config('app.url'), '/').'/'.ltrim($path, '/');
    }

    /**
     * @return array{key: string, label: string, status: 'pass'|'warn'|'fail', message: string}
     */
    private function probeImage(string $url): array
    {
        try {
            $response = Http::timeout(5)->withHeaders(['User-Agent' => 'facebookexternalhit/1.1'])->head($url);
            $contentType = (string) $response->header('Content-Type');

            if ($response->status() === 200 && Str::startsWith($contentType, 'image/')) {
                return $this->check('image_public', 'Gambar dapat diakses publik', 'pass', "HTTP 200, {$contentType}.");
            }

            return $this->check('image_public', 'Gambar dapat diakses publik', 'fail',
                "Server mengembalikan HTTP {$response->status()} ".($contentType ?: 'tanpa Content-Type').'.');
        } catch (\Throwable) {
            return $this->check('image_public', 'Gambar dapat diakses publik', 'warn',
                'Tidak dapat dihubungi dari server ini (normal di lingkungan lokal). Verifikasi dengan Facebook Sharing Debugger.');
        }
    }

    /**
     * @param  'pass'|'warn'|'fail'  $status
     * @return array{key: string, label: string, status: 'pass'|'warn'|'fail', message: string}
     */
    private function check(string $key, string $label, string $status, string $message): array
    {
        return compact('key', 'label', 'status', 'message');
    }
}

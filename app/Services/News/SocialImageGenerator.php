<?php

namespace App\Services\News;

use App\Models\News;
use GdImage;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Membuat aset gambar untuk sharing media sosial memakai GD (tanpa dependency baru):
 * - thumbnail Open Graph 1200 × 630 (1.91:1, JPEG) dari featured image;
 * - story image portrait 1080 × 1920 berisi gambar, judul, branding CTECH, dan URL artikel.
 */
class SocialImageGenerator
{
    public const SHARE_WIDTH = 1200;

    public const SHARE_HEIGHT = 630;

    public const STORY_WIDTH = 1080;

    public const STORY_HEIGHT = 1920;

    private const JPEG_QUALITY = 82;

    private const ACCENT = [59, 130, 246];

    /**
     * Crop proporsional (cover) featured image ke 1200 × 630 JPEG agar tidak terpotong
     * aneh di preview dan kompatibel dengan semua crawler (WebP tidak selalu didukung).
     *
     * @return string|null Path di disk public, atau null bila gambar sumber tidak bisa dibaca.
     */
    public function makeShareImage(string $sourcePath): ?string
    {
        $source = $this->load($sourcePath);

        if (! $source) {
            return null;
        }

        $canvas = imagecreatetruecolor(self::SHARE_WIDTH, self::SHARE_HEIGHT);
        $this->copyCover($source, $canvas, 0, 0, self::SHARE_WIDTH, self::SHARE_HEIGHT);

        $path = 'news-images/social/'.pathinfo($sourcePath, PATHINFO_FILENAME).'-'.Str::random(6).'.jpg';
        $this->storeJpeg($canvas, $path);

        return $path;
    }

    /**
     * Story image portrait hasil generate. Disimpan dengan kunci updated_at sehingga
     * otomatis dibuat ulang setelah artikel diubah.
     *
     * @return string Path di disk public.
     */
    public function makeStoryImage(News $news, string $articleUrl): string
    {
        $disk = Storage::disk('public');
        $path = "news-images/story/generated-{$news->id}-{$news->updated_at?->timestamp}.jpg";

        if ($disk->exists($path)) {
            return $path;
        }

        foreach ($disk->files('news-images/story') as $stale) {
            if (str_starts_with(basename($stale), "generated-{$news->id}-")) {
                $disk->delete($stale);
            }
        }

        $canvas = imagecreatetruecolor(self::STORY_WIDTH, self::STORY_HEIGHT);
        imagefill($canvas, 0, 0, imagecolorallocate($canvas, 13, 13, 13));

        $imageHeight = 1150;
        $source = $news->image ? $this->load($news->image) : null;

        if ($source) {
            $this->copyCover($source, $canvas, 0, 0, self::STORY_WIDTH, $imageHeight);
            $this->fadeToDark($canvas, $imageHeight - 420, $imageHeight);
        }

        $white = imagecolorallocate($canvas, 255, 255, 255);
        $muted = imagecolorallocate($canvas, 170, 170, 170);
        $accent = imagecolorallocate($canvas, ...self::ACCENT);

        $this->drawLogo($canvas, 72, 72, 96);
        imagettftext($canvas, 34, 0, 192, 136, $white, $this->font(true), 'CTECH');

        $y = $source ? $imageHeight - 40 : 620;

        if ($news->category) {
            imagettftext($canvas, 26, 0, 72, $y, $accent, $this->font(true), Str::upper($news->category));
            $y += 40;
        }

        foreach ($this->wrap($news->title, 54, self::STORY_WIDTH - 144, 6) as $line) {
            $y += 78;
            imagettftext($canvas, 54, 0, 72, $y, $white, $this->font(true), $line);
        }

        imagefilledrectangle($canvas, 72, self::STORY_HEIGHT - 250, 192, self::STORY_HEIGHT - 244, $accent);
        imagettftext($canvas, 28, 0, 72, self::STORY_HEIGHT - 180, $white, $this->font(true), 'Baca selengkapnya');

        $displayUrl = preg_replace('#^https?://(www\.)?#', '', $articleUrl);
        // URL tidak berspasi, jadi diperkecil sampai muat satu baris.
        $urlSize = 24;
        while ($urlSize > 12 && $this->textWidth($displayUrl, $urlSize) > self::STORY_WIDTH - 144) {
            $urlSize--;
        }
        imagettftext($canvas, $urlSize, 0, 72, self::STORY_HEIGHT - 130, $muted, $this->font(), $displayUrl);

        $this->storeJpeg($canvas, $path);

        return $path;
    }

    private function load(string $path): ?GdImage
    {
        $disk = Storage::disk('public');

        if (! $disk->exists($path)) {
            return null;
        }

        $image = @imagecreatefromstring($disk->get($path));

        return $image ?: null;
    }

    /**
     * Salin gambar ke area tujuan dengan skala "cover": rasio dipertahankan, sisi berlebih dipotong di tengah.
     */
    private function copyCover(GdImage $source, GdImage $target, int $x, int $y, int $width, int $height): void
    {
        $sourceWidth = imagesx($source);
        $sourceHeight = imagesy($source);
        $scale = max($width / $sourceWidth, $height / $sourceHeight);
        $cropWidth = (int) round($width / $scale);
        $cropHeight = (int) round($height / $scale);

        imagecopyresampled(
            $target, $source,
            $x, $y,
            (int) (($sourceWidth - $cropWidth) / 2), (int) (($sourceHeight - $cropHeight) / 2),
            $width, $height,
            $cropWidth, $cropHeight,
        );
    }

    private function fadeToDark(GdImage $canvas, int $from, int $to): void
    {
        $steps = $to - $from;

        for ($row = 0; $row < $steps; $row++) {
            $alpha = (int) round(127 - (127 * $row / $steps));
            $color = imagecolorallocatealpha($canvas, 13, 13, 13, $alpha);
            imageline($canvas, 0, $from + $row, self::STORY_WIDTH, $from + $row, $color);
        }

        imagefilledrectangle($canvas, 0, $to, self::STORY_WIDTH, self::STORY_HEIGHT, imagecolorallocate($canvas, 13, 13, 13));
    }

    private function drawLogo(GdImage $canvas, int $x, int $y, int $size): void
    {
        $logo = @imagecreatefrompng(public_path('logo/logo-web.png'));

        if ($logo) {
            imagecopyresampled($canvas, $logo, $x, $y, 0, 0, $size, $size, imagesx($logo), imagesy($logo));
        }
    }

    /**
     * Pecah teks menjadi baris yang muat pada lebar tertentu.
     *
     * @return list<string>
     */
    private function wrap(string $text, int $size, int $maxWidth, int $maxLines): array
    {
        $lines = [];
        $current = '';

        foreach (preg_split('/\s+/', trim($text)) as $word) {
            $candidate = $current === '' ? $word : "{$current} {$word}";

            if ($current !== '' && $this->textWidth($candidate, $size, true) > $maxWidth) {
                $lines[] = $current;
                $current = $word;
            } else {
                $current = $candidate;
            }
        }

        if ($current !== '') {
            $lines[] = $current;
        }

        if (count($lines) > $maxLines) {
            $lines = array_slice($lines, 0, $maxLines);
            $lines[$maxLines - 1] = rtrim($lines[$maxLines - 1], '.,;: ').'…';
        }

        return $lines;
    }

    private function textWidth(string $text, int $size, bool $bold = false): int
    {
        $box = imagettfbbox($size, 0, $this->font($bold), $text);

        return $box[2] - $box[0];
    }

    private function font(bool $bold = false): string
    {
        return resource_path($bold ? 'fonts/DejaVuSans-Bold.ttf' : 'fonts/DejaVuSans.ttf');
    }

    private function storeJpeg(GdImage $canvas, string $path): void
    {
        imageinterlace($canvas, true);

        ob_start();
        imagejpeg($canvas, null, self::JPEG_QUALITY);
        Storage::disk('public')->put($path, ob_get_clean());
    }
}

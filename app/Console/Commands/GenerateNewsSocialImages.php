<?php

namespace App\Console\Commands;

use App\Models\News;
use App\Services\News\SocialImageGenerator;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

#[Signature('news:social-images {--force : Buat ulang meskipun thumbnail sudah ada}')]
#[Description('Buat thumbnail Open Graph 1200 × 630 untuk berita yang memiliki featured image')]
class GenerateNewsSocialImages extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(SocialImageGenerator $images): int
    {
        $query = News::whereNotNull('image');

        if (! $this->option('force')) {
            $query->whereNull('social_image');
        }

        $generated = 0;

        foreach ($query->lazyById() as $news) {
            $path = $images->makeShareImage($news->image);

            if (! $path) {
                $this->warn("Lewati #{$news->id}: featured image tidak dapat dibaca.");

                continue;
            }

            if ($news->social_image) {
                Storage::disk('public')->delete($news->social_image);
            }

            $news->forceFill(['social_image' => $path])->saveQuietly();
            $generated++;
        }

        $this->info("{$generated} thumbnail dibuat.");

        return self::SUCCESS;
    }
}

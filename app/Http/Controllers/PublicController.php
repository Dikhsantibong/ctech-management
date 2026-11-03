<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\CompanySetting;
use App\Models\News;
use App\Models\Portfolio;
use App\Models\Project;
use App\Services\News\NewsShareMeta;
use App\Services\News\SocialImageGenerator;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PublicController extends Controller
{
    /**
     * Identitas perusahaan untuk seluruh halaman publik.
     * Diambil dari Company Settings agar pembaruan di panel admin langsung
     * tercermin di situs tanpa mengubah kode.
     */
    private function companyProfile(): array
    {
        $settings = CompanySetting::first();

        return [
            'legal_name' => $settings->company_name ?? 'PT Kreatif Teknologi Maju Bersama',
            'address' => $settings->address ?? null,
            'phone' => $settings->phone ?? null,
            'email' => $settings->email ?? null,
            'website' => $settings->website ?? null,
        ];
    }

    /**
     * Angka perusahaan, dihitung dari database.
     *
     * Sebelumnya berupa nilai bulat statis (250+, 98%, 50+) yang tidak bisa
     * diverifikasi. Angka yang kosong tidak dikirim sama sekali agar halaman
     * tidak menampilkan nol atau klaim yang keliru.
     */
    private function companyMetrics(): array
    {
        $firstProject = Project::min('created_at');

        return collect([
            ['value' => Project::where('status', 'Completed')->count(), 'label' => 'Proyek Diselesaikan'],
            ['value' => Client::count(), 'label' => 'Klien Terlayani'],
            ['value' => Portfolio::count(), 'label' => 'Karya Terdokumentasi'],
            [
                'value' => $firstProject ? max(1, now()->year - Carbon::parse($firstProject)->year + 1) : null,
                'label' => 'Tahun Beroperasi',
            ],
        ])->filter(fn ($m) => ! empty($m['value']))->values()->all();
    }

    /** Kategori pekerjaan yang benar-benar ada di portofolio. */
    private function capabilities(): array
    {
        return Portfolio::select('category')
            ->whereNotNull('category')
            ->distinct()
            ->pluck('category')
            ->all();
    }

    public function home()
    {
        return inertia('welcome', [
            'news' => News::where('status', 'Published')->latest()->take(3)->get(),
            'portfolios' => Portfolio::latest()->take(6)->get(),
            'company' => $this->companyProfile(),
            'metrics' => $this->companyMetrics(),
            'capabilities' => $this->capabilities(),
        ]);
    }

    public function about()
    {
        return inertia('public/about/index', [
            'company' => $this->companyProfile(),
            'metrics' => $this->companyMetrics(),
            'capabilities' => $this->capabilities(),
        ]);
    }

    public function services()
    {
        return inertia('public/services/index', [
            'company' => $this->companyProfile(),
        ]);
    }

    public function contact()
    {
        return inertia('public/contact/index', [
            'company' => $this->companyProfile(),
        ]);
    }

    public function newsIndex(Request $request)
    {
        $news = News::with('author')
            ->where('status', 'Published')
            ->latest()
            ->paginate(12);

        return Inertia::render('public/news/index', [
            'news' => $news,
        ]);
    }

    public function newsShow(string $slug, NewsShareMeta $shareMeta)
    {
        $news = $this->publishedNews($slug);
        $meta = $shareMeta->build($news);

        $relatedNews = News::where('status', 'Published')
            ->where('id', '!=', $news->id)
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('public/news/show', [
            'news' => $news,
            'relatedNews' => $relatedNews,
            'share' => [
                'url' => $meta['url'],
                'title' => $meta['title'],
                'storyImageUrl' => $meta['story_image_url'],
            ],
        ])->withViewData(['shareMeta' => $meta]);
    }

    /**
     * Story image portrait 1080 × 1920: hasil unggahan terpisah, atau dibuat otomatis
     * dari featured image + judul + branding CTECH + URL artikel.
     */
    public function newsStory(string $slug, NewsShareMeta $shareMeta, SocialImageGenerator $images): BinaryFileResponse
    {
        $news = $this->publishedNews($slug);
        $disk = Storage::disk('public');

        $path = $news->story_image && $disk->exists($news->story_image)
            ? $news->story_image
            : $images->makeStoryImage($news, $shareMeta->canonicalUrl($news));

        return response()->file($disk->path($path), [
            'Cache-Control' => 'public, max-age=3600',
            'Content-Disposition' => 'inline; filename="ctech-story-'.$news->id.'.'.pathinfo($path, PATHINFO_EXTENSION).'"',
        ]);
    }

    /**
     * Hanya artikel Published yang boleh diakses publik (termasuk oleh crawler preview).
     */
    private function publishedNews(string $slug): News
    {
        return News::with('author')
            ->where('slug', $slug)
            ->where('status', 'Published')
            ->firstOrFail();
    }

    public function portfolioIndex(Request $request)
    {
        $category = $request->input('category');

        $portfolios = Portfolio::when($category, function ($query, $category) {
            return $query->where('category', $category);
        })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $categories = Portfolio::select('category')->distinct()->pluck('category');

        return Inertia::render('public/portfolio/index', [
            'portfolios' => $portfolios,
            'categories' => $categories,
            'filters' => ['category' => $category],
            'company' => $this->companyProfile(),
        ]);
    }

    public function portfolioShow($id)
    {
        $portfolio = Portfolio::findOrFail($id);

        $relatedPortfolios = Portfolio::where('category', $portfolio->category)
            ->where('id', '!=', $portfolio->id)
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('public/portfolio/show', [
            'portfolio' => $portfolio,
            'relatedPortfolios' => $relatedPortfolios,
        ]);
    }
}

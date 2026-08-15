<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicController extends Controller
{
    /**
     * Identitas perusahaan untuk seluruh halaman publik.
     * Diambil dari Company Settings agar pembaruan di panel admin langsung
     * tercermin di situs tanpa mengubah kode.
     */
    private function companyProfile(): array
    {
        $settings = \App\Models\CompanySetting::first();

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
        $firstProject = \App\Models\Project::min('created_at');

        return collect([
            ['value' => \App\Models\Project::where('status', 'Completed')->count(), 'label' => 'Proyek Diselesaikan'],
            ['value' => \App\Models\Client::count(), 'label' => 'Klien Terlayani'],
            ['value' => \App\Models\Portfolio::count(), 'label' => 'Karya Terdokumentasi'],
            [
                'value' => $firstProject ? max(1, now()->year - \Carbon\Carbon::parse($firstProject)->year + 1) : null,
                'label' => 'Tahun Beroperasi',
            ],
        ])->filter(fn ($m) => ! empty($m['value']))->values()->all();
    }

    /** Kategori pekerjaan yang benar-benar ada di portofolio. */
    private function capabilities(): array
    {
        return \App\Models\Portfolio::select('category')
            ->whereNotNull('category')
            ->distinct()
            ->pluck('category')
            ->all();
    }

    public function home()
    {
        return inertia('welcome', [
            'news' => \App\Models\News::where('status', 'Published')->latest()->take(3)->get(),
            'portfolios' => \App\Models\Portfolio::latest()->take(6)->get(),
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
            'news' => $news
        ]);
    }
    
    public function newsShow($slug)
    {
        $news = News::with('author')
            ->where('slug', $slug)
            ->where('status', 'Published')
            ->firstOrFail();
            
        $relatedNews = News::where('status', 'Published')
            ->where('id', '!=', $news->id)
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('public/news/show', [
            'news' => $news,
            'relatedNews' => $relatedNews
        ]);
    }

    public function portfolioIndex(Request $request)
    {
        $category = $request->input('category');
        
        $portfolios = Portfolio::when($category, function($query, $category) {
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
            'relatedPortfolios' => $relatedPortfolios
        ]);
    }
}

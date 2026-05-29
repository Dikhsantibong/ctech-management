<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicController extends Controller
{
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
            'filters' => ['category' => $category]
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

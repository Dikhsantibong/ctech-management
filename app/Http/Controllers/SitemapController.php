<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Portfolio;
use Illuminate\Http\Request;

class SitemapController extends Controller
{
    public function index(Request $request)
    {
        $baseUrl = config('app.url') ?? 'https://ctechcreative.com';
        
        $urls = [
            '/',
            '/tentang',
            '/layanan',
            '/portfolio',
            '/kontak',
        ];

        // Add published news
        $news = News::where('status', 'Published')->latest()->get();
        foreach ($news as $item) {
            $urls[] = '/berita/' . $item->slug;
        }

        // Add portfolios
        $portfolios = Portfolio::latest()->get();
        foreach ($portfolios as $item) {
            $urls[] = '/portfolio/' . $item->id;
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        foreach ($urls as $url) {
            $xml .= '<url>';
            $xml .= '<loc>' . $baseUrl . $url . '</loc>';
            $xml .= '<changefreq>weekly</changefreq>';
            $xml .= '<priority>' . ($url === '/' ? '1.0' : '0.8') . '</priority>';
            $xml .= '</url>';
        }

        $xml .= '</urlset>';

        return response($xml)->header('Content-Type', 'text/xml');
    }
}

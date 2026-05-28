<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PortfolioController extends Controller
{
    public function index()
    {
        $portfolios = Portfolio::latest()->get();
        return Inertia::render('portfolios/index', [
            'portfolios' => $portfolios
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'link' => 'nullable|url|max:255',
            'image' => 'nullable|image|max:5120',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('portfolio-images', 'public');
        }

        $portfolio = Portfolio::create([
            'title' => $validated['title'],
            'category' => $validated['category'] ?? null,
            'description' => $validated['description'] ?? null,
            'link' => $validated['link'] ?? null,
            'image' => $imagePath,
        ]);

        $portfolio->logActivity('created', 'Portfolio', $portfolio->id, "Menambahkan portfolio baru: {$portfolio->title}");

        return redirect()->back()->with('success', 'Portfolio berhasil dibuat.');
    }

    public function update(Request $request, Portfolio $portfolio)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'link' => 'nullable|url|max:255',
            'image' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            if ($portfolio->image) {
                Storage::disk('public')->delete($portfolio->image);
            }
            $portfolio->image = $request->file('image')->store('portfolio-images', 'public');
        }

        $portfolio->title = $validated['title'];
        $portfolio->category = $validated['category'] ?? null;
        $portfolio->description = $validated['description'] ?? null;
        $portfolio->link = $validated['link'] ?? null;
        
        $portfolio->save();

        $portfolio->logActivity('updated', 'Portfolio', $portfolio->id, "Memperbarui portfolio: {$portfolio->title}");

        return redirect()->back()->with('success', 'Portfolio berhasil diperbarui.');
    }

    public function destroy(Portfolio $portfolio)
    {
        if ($portfolio->image) {
            Storage::disk('public')->delete($portfolio->image);
        }
        
        $portfolio->logActivity('deleted', 'Portfolio', $portfolio->id, "Menghapus portfolio: {$portfolio->title}");
        
        $portfolio->delete();
        
        return redirect()->back()->with('success', 'Portfolio berhasil dihapus.');
    }
}

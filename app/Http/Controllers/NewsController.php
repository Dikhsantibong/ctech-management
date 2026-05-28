<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    public function index()
    {
        $news = News::with('author')->latest()->get();
        return Inertia::render('news/index', [
            'news' => $news
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'nullable|string|max:255',
            'status' => 'required|in:Draft,Published',
            'image' => 'nullable|image|max:5120',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('news-images', 'public');
        }

        $news = News::create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . uniqid(),
            'content' => $validated['content'],
            'category' => $validated['category'] ?? null,
            'status' => $validated['status'],
            'image' => $imagePath,
            'author_id' => Auth::id(),
            'published_at' => $validated['status'] === 'Published' ? now() : null,
        ]);

        $news->logActivity('created', 'News', $news->id, "Menambahkan berita baru: {$news->title}");

        return redirect()->back()->with('success', 'Berita berhasil dibuat.');
    }

    public function update(Request $request, News $news)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'nullable|string|max:255',
            'status' => 'required|in:Draft,Published',
            'image' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            if ($news->image) {
                Storage::disk('public')->delete($news->image);
            }
            $news->image = $request->file('image')->store('news-images', 'public');
        }

        $news->title = $validated['title'];
        $news->slug = Str::slug($validated['title']) . '-' . uniqid();
        $news->content = $validated['content'];
        $news->category = $validated['category'] ?? null;
        
        if ($news->status === 'Draft' && $validated['status'] === 'Published') {
            $news->published_at = now();
        } elseif ($validated['status'] === 'Draft') {
            $news->published_at = null;
        }
        $news->status = $validated['status'];
        
        $news->save();

        $news->logActivity('updated', 'News', $news->id, "Memperbarui berita: {$news->title}");

        return redirect()->back()->with('success', 'Berita berhasil diperbarui.');
    }

    public function destroy(News $news)
    {
        if ($news->image) {
            Storage::disk('public')->delete($news->image);
        }
        
        $news->logActivity('deleted', 'News', $news->id, "Menghapus berita: {$news->title}");
        
        $news->delete();
        
        return redirect()->back()->with('success', 'Berita berhasil dihapus.');
    }
}

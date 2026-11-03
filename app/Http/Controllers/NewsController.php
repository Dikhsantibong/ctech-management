<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Services\News\NewsShareMeta;
use App\Services\News\SocialImageGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class NewsController extends Controller
{
    public function __construct(private SocialImageGenerator $images) {}

    public function index(Request $request)
    {
        $search = $request->input('search');

        $news = News::with('author')
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('news/index', [
            'news' => $news,
            'filters' => ['search' => $search],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('news-images', 'public');
        }

        $news = News::create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']).'-'.uniqid(),
            'content' => $validated['content'],
            'excerpt' => $validated['excerpt'] ?? null,
            'seo_title' => $validated['seo_title'] ?? null,
            'seo_description' => $validated['seo_description'] ?? null,
            'category' => $validated['category'] ?? null,
            'status' => $validated['status'],
            'image' => $imagePath,
            'social_image' => $imagePath ? $this->images->makeShareImage($imagePath) : null,
            'story_image' => $request->hasFile('story_image') ? $request->file('story_image')->store('news-images/story', 'public') : null,
            'author_id' => Auth::id(),
            'published_at' => $validated['status'] === 'Published' ? now() : null,
        ]);

        $news->logActivity('created', 'News', $news->id, "Menambahkan berita baru: {$news->title}");

        return redirect()->back()->with('success', 'Berita berhasil dibuat.');
    }

    public function update(Request $request, News $news)
    {
        $validated = $request->validate($this->rules());

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete(array_filter([$news->image, $news->social_image]));
            $news->image = $request->file('image')->store('news-images', 'public');
            $news->social_image = $this->images->makeShareImage($news->image);
        }

        if ($request->boolean('remove_story_image') || $request->hasFile('story_image')) {
            if ($news->story_image) {
                Storage::disk('public')->delete($news->story_image);
            }
            $news->story_image = $request->hasFile('story_image')
                ? $request->file('story_image')->store('news-images/story', 'public')
                : null;
        }

        // Slug dikunci setelah pernah dipublikasikan agar link yang sudah dibagikan tidak rusak.
        if ($news->title !== $validated['title'] && $news->published_at === null && $news->status === 'Draft') {
            $news->slug = Str::slug($validated['title']).'-'.uniqid();
        }

        $news->title = $validated['title'];
        $news->content = $validated['content'];
        $news->excerpt = $validated['excerpt'] ?? null;
        $news->seo_title = $validated['seo_title'] ?? null;
        $news->seo_description = $validated['seo_description'] ?? null;
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

    /**
     * Metadata sharing yang benar-benar dirender di halaman publik, plus hasil validasinya.
     */
    public function sharePreview(News $news, NewsShareMeta $shareMeta): JsonResponse
    {
        $news->load('author');

        return response()->json([
            'meta' => $shareMeta->build($news),
            'checks' => $shareMeta->checks($news),
        ]);
    }

    public function destroy(News $news)
    {
        Storage::disk('public')->delete(array_filter([$news->image, $news->social_image, $news->story_image]));

        $news->logActivity('deleted', 'News', $news->id, "Menghapus berita: {$news->title}");

        $news->delete();

        return redirect()->back()->with('success', 'Berita berhasil dihapus.');
    }

    /**
     * @return array<string, string>
     */
    private function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'seo_title' => 'nullable|string|max:90',
            'seo_description' => 'nullable|string|max:300',
            'category' => 'nullable|string|max:255',
            'status' => 'required|in:Draft,Published',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'story_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ];
    }
}

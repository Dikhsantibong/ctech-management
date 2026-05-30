<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Announcement::query();

        // Filter by user role
        if ($user->role !== 'direktur_utama') {
            $query->forRole($user->role);
        }

        $query->active()->latest();

        return inertia('announcements/index', [
            'announcements' => $query->get(),
            'canManage' => $user->role === 'direktur_utama',
        ]);
    }

    public function create()
    {
        return inertia('announcements/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'visible_to_roles' => 'required|array',
            'visible_to_roles.*' => 'in:staff,admin_operasional,direktur_operasional,direktur_utama',
            'type' => 'required|in:info,warning,success,error',
            'is_active' => 'boolean',
            'published_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:published_at',
        ]);

        Announcement::create([
            ...$validated,
            'created_by' => Auth::id(),
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('announcements.index')->with('success', 'Pengumuman berhasil dibuat');
    }

    public function show(Announcement $announcement)
    {
        $user = Auth::user();

        // Check if user can view this announcement
        if ($user->role !== 'direktur_utama' && !$announcement->isVisibleToRole($user->role)) {
            abort(403, 'Unauthorized');
        }

        return inertia('announcements/show', [
            'announcement' => $announcement->load('creator'),
            'canManage' => $user->role === 'direktur_utama',
        ]);
    }

    public function edit(Announcement $announcement)
    {
        return inertia('announcements/edit', [
            'announcement' => $announcement,
        ]);
    }

    public function update(Request $request, Announcement $announcement)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'visible_to_roles' => 'required|array',
            'visible_to_roles.*' => 'in:staff,admin_operasional,direktur_operasional,direktur_utama',
            'type' => 'required|in:info,warning,success,error',
            'is_active' => 'boolean',
            'published_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:published_at',
        ]);

        $announcement->update($validated);

        return redirect()->route('announcements.index')->with('success', 'Pengumuman berhasil diperbarui');
    }

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();

        return redirect()->route('announcements.index')->with('success', 'Pengumuman berhasil dihapus');
    }
}

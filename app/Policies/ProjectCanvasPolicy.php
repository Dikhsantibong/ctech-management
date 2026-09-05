<?php

namespace App\Policies;

use App\Models\ProjectCanvas;
use App\Models\User;
use App\Services\MenuAccess;

/**
 * Canvas mengikuti otorisasi Project yang sudah ada: siapa pun yang punya akses
 * menu "projects" boleh melihat/mengubah canvas project. Auto-discovered oleh
 * Laravel (ProjectCanvas => ProjectCanvasPolicy).
 */
class ProjectCanvasPolicy
{
    public function __construct(private readonly MenuAccess $menuAccess) {}

    public function view(User $user, ProjectCanvas $canvas): bool
    {
        return $this->menuAccess->allows($user->role, 'projects');
    }

    public function update(User $user, ProjectCanvas $canvas): bool
    {
        return $this->menuAccess->allows($user->role, 'projects');
    }
}

<?php

namespace App\Support;

/**
 * Sumber kebenaran tunggal untuk seluruh menu aplikasi.
 *
 * Dipakai bersama oleh tiga hal sekaligus agar tidak pernah berbeda:
 *  - middleware `menu:<key>` yang menjaga route
 *  - sidebar yang dirender frontend
 *  - halaman pengaturan hak akses milik direktur utama
 */
class MenuRegistry
{
    /** Role yang selalu punya akses penuh dan tidak bisa dicabut. */
    public const SUPER_ROLE = 'direktur_utama';

    /** Menu yang wajib ada untuk semua orang, tidak bisa diatur. */
    public const ALWAYS_ALLOWED = ['dashboard', 'announcements', 'settings'];

    /**
     * key      : dipakai middleware `menu:<key>` dan tabel role_menu_permissions
     * group    : pengelompokan di sidebar
     * icon     : nama ikon lucide-react
     * defaults : role yang mendapat akses saat sistem pertama kali dipasang
     * sensitive: ditandai di UI karena membuka kendali atas pengguna/hak akses
     */
    public static function all(): array
    {
        return [
            // ===== Operations =====
            'calendar' => [
                'label' => 'Calendar', 'href' => '/calendar', 'group' => 'Operations', 'icon' => 'Calendar',
                'defaults' => ['operation'],
            ],
            'projects' => [
                'label' => 'Projects', 'href' => '/projects', 'group' => 'Operations', 'icon' => 'Briefcase',
                'defaults' => ['operation'],
            ],
            'tasks' => [
                'label' => 'Tasks', 'href' => '/tasks', 'group' => 'Operations', 'icon' => 'ListTodo',
                'defaults' => ['operation'],
            ],
            'works' => [
                'label' => 'Work', 'href' => '/works', 'group' => 'Operations', 'icon' => 'ClipboardList',
                'defaults' => ['operation'],
            ],
            'daily-reports' => [
                'label' => 'Daily Reports', 'href' => '/daily-reports', 'group' => 'Operations', 'icon' => 'FileStack',
                'defaults' => ['operation'],
            ],
            'clients' => [
                'label' => 'Clients', 'href' => '/clients', 'group' => 'Operations', 'icon' => 'Building2',
                'defaults' => ['operation', 'marketing'],
            ],

            // ===== Finance =====
            'invoices' => [
                'label' => 'Invoices', 'href' => '/invoices', 'group' => 'Finance', 'icon' => 'Receipt',
                'defaults' => ['administrasi'],
            ],

            // ===== Marketing =====
            'news' => [
                'label' => 'Berita', 'href' => '/news', 'group' => 'Marketing', 'icon' => 'Newspaper',
                'defaults' => ['marketing'],
            ],
            'portfolios' => [
                'label' => 'Portfolio', 'href' => '/portfolios', 'group' => 'Marketing', 'icon' => 'Briefcase',
                'defaults' => ['marketing'],
            ],
            'content-plans' => [
                'label' => 'Content Planning', 'href' => '/content-plans', 'group' => 'Marketing', 'icon' => 'Megaphone',
                'defaults' => ['marketing'],
            ],

            // ===== Administration =====
            'letters' => [
                'label' => 'Surat Keluar', 'href' => '/letters', 'group' => 'Administration', 'icon' => 'Mail',
                'defaults' => ['administrasi'],
            ],
            'incoming-letters' => [
                'label' => 'Surat Masuk', 'href' => '/incoming-letters', 'group' => 'Administration', 'icon' => 'MailOpen',
                'defaults' => ['administrasi'],
            ],
            'documents' => [
                'label' => 'Documents', 'href' => '/documents', 'group' => 'Administration', 'icon' => 'FileStack',
                'defaults' => ['administrasi'],
            ],
            'files' => [
                'label' => 'Files', 'href' => '/files', 'group' => 'Administration', 'icon' => 'Files',
                'defaults' => ['administrasi'],
            ],

            // ===== System =====
            'kpi' => [
                'label' => 'Monitoring KPI', 'href' => '/kpi', 'group' => 'System', 'icon' => 'Gauge',
                'defaults' => [],
            ],
            'activity-logs' => [
                'label' => 'Activity Logs', 'href' => '/activity-logs', 'group' => 'System', 'icon' => 'Activity',
                'defaults' => [],
            ],
            'users' => [
                'label' => 'Team', 'href' => '/users', 'group' => 'System', 'icon' => 'Users',
                'defaults' => [], 'sensitive' => true,
            ],
            // Dikunci: bila role lain bisa membuka halaman ini, mereka dapat memberi
            // hak akses apa pun kepada dirinya sendiri dan seluruh pengaturan jadi tak berarti.
            'role-permissions' => [
                'label' => 'Hak Akses Menu', 'href' => '/role-permissions', 'group' => 'System', 'icon' => 'ShieldCheck',
                'defaults' => [], 'locked' => true,
            ],
        ];
    }

    public static function keys(): array
    {
        return array_keys(self::all());
    }

    public static function has(string $key): bool
    {
        return array_key_exists($key, self::all());
    }

    /** Urutan grup saat dirender di sidebar. */
    public static function groups(): array
    {
        return ['Operations', 'Finance', 'Marketing', 'Administration', 'System'];
    }

    /** Pasangan role => daftar menu bawaan. */
    public static function defaultsByRole(): array
    {
        $result = [];

        foreach (self::all() as $key => $menu) {
            foreach ($menu['defaults'] as $role) {
                $result[$role][] = $key;
            }
        }

        return $result;
    }
}

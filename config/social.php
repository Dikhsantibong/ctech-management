<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Sakelar utama
    |--------------------------------------------------------------------------
    |
    | Bila false, tidak ada satu pun permintaan dikirim ke media sosial dan
    | menu pengaturannya disembunyikan. Fitur bisa dimatikan total kapan saja
    | tanpa memengaruhi bagian lain aplikasi.
    |
    */
    'enabled' => env('SOCIAL_PUBLISHING_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Mode simulasi
    |--------------------------------------------------------------------------
    |
    | Saat aktif, seluruh proses berjalan normal (antrean, status, riwayat)
    | tetapi tidak ada panggilan sungguhan ke API media sosial. Dipakai untuk
    | menguji alur sebelum kredensial tersedia. Platform yang kredensialnya
    | belum lengkap otomatis disimulasikan meski mode ini dimatikan.
    |
    */
    'simulate' => env('SOCIAL_PUBLISHING_SIMULATE', true),

    /*
    |--------------------------------------------------------------------------
    | Platform yang didukung
    |--------------------------------------------------------------------------
    |
    | credentials : kolom yang wajib diisi agar posting sungguhan bisa jalan
    | media       : required | optional | video
    |
    */
    'platforms' => [

        'facebook' => [
            'label' => 'Facebook Page',
            'publisher' => App\Services\Social\Publishers\FacebookPagePublisher::class,
            'media' => 'optional',
            'credentials' => [
                'page_id' => 'ID Halaman Facebook',
                'access_token' => 'Page Access Token (long-lived)',
            ],
            'docs' => 'https://developers.facebook.com/docs/pages-api/posts',
            'setup_hint' => 'Buat Meta App, tautkan Halaman Facebook, lalu ambil Page Access Token berumur panjang dengan izin pages_manage_posts.',
        ],

        'instagram' => [
            'label' => 'Instagram Business',
            'publisher' => App\Services\Social\Publishers\InstagramPublisher::class,
            'media' => 'required',
            'credentials' => [
                'ig_user_id' => 'Instagram Business Account ID',
                'access_token' => 'Access Token (dari Meta App yang sama)',
            ],
            'docs' => 'https://developers.facebook.com/docs/instagram-api/guides/content-publishing',
            'setup_hint' => 'Akun Instagram harus tipe Business/Creator dan tertaut ke Halaman Facebook. Perlu izin instagram_content_publish. Gambar wajib ada dan harus bisa diakses publik.',
        ],

        'tiktok' => [
            'label' => 'TikTok',
            'publisher' => App\Services\Social\Publishers\TikTokPublisher::class,
            'media' => 'video',
            'credentials' => [
                'access_token' => 'Access Token',
                'open_id' => 'Open ID akun',
            ],
            'docs' => 'https://developers.tiktok.com/doc/content-posting-api-get-started',
            'setup_hint' => 'Daftarkan aplikasi di TikTok for Developers dan ajukan audit Content Posting API. Hanya menerima video.',
        ],

        'linkedin' => [
            'label' => 'LinkedIn Page',
            'publisher' => App\Services\Social\Publishers\LinkedInPublisher::class,
            'media' => 'optional',
            'credentials' => [
                'organization_id' => 'ID Organisasi (angka saja)',
                'access_token' => 'Access Token',
            ],
            'docs' => 'https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api',
            'setup_hint' => 'Ajukan produk Community Management API pada aplikasi LinkedIn Anda, lalu berikan izin w_organization_social.',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Batas percobaan ulang
    |--------------------------------------------------------------------------
    */
    'max_attempts' => env('SOCIAL_PUBLISHING_MAX_ATTEMPTS', 3),

    /** Jeda antar percobaan dalam detik. */
    'retry_backoff' => [60, 300, 900],

    /** Batas waktu satu panggilan API. */
    'timeout' => 30,
];

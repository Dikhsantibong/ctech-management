<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Fitur posting otomatis ke media sosial.
 *
 * Seluruhnya memakai tabel dan kolom baru — tidak ada struktur lama yang diubah,
 * sehingga fitur ini bisa dimatikan tanpa memengaruhi apa pun.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Akun/halaman media sosial beserta kredensialnya
        Schema::create('social_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('platform')->unique();     // facebook, instagram, tiktok, linkedin
            $table->string('display_name')->nullable();
            $table->boolean('is_enabled')->default(false);
            $table->text('credentials')->nullable();  // dienkripsi lewat cast model
            $table->string('external_id')->nullable();
            $table->timestamp('token_expires_at')->nullable();
            $table->timestamp('last_verified_at')->nullable();
            $table->text('last_error')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // Riwayat pengiriman per platform — satu content plan bisa punya banyak baris
        Schema::create('social_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('content_plan_id')->constrained()->cascadeOnDelete();
            $table->string('platform');
            $table->string('status')->default('pending'); // pending, processing, published, failed, skipped
            $table->boolean('simulated')->default(false);
            $table->string('external_post_id')->nullable();
            $table->string('permalink')->nullable();
            $table->text('message')->nullable();
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->unique(['content_plan_id', 'platform']);
            $table->index('status');
        });

        Schema::table('content_plans', function (Blueprint $table) {
            $table->string('media_path')->nullable()->after('visual_assets_url');
            $table->string('media_mime')->nullable()->after('media_path');
            $table->json('publish_targets')->nullable()->after('media_mime');
            $table->boolean('auto_publish')->default(false)->after('publish_targets');
        });
    }

    public function down(): void
    {
        Schema::table('content_plans', function (Blueprint $table) {
            $table->dropColumn(['media_path', 'media_mime', 'publish_targets', 'auto_publish']);
        });

        Schema::dropIfExists('social_posts');
        Schema::dropIfExists('social_accounts');
    }
};

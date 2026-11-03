<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->text('excerpt')->nullable()->after('content');
            $table->string('seo_title')->nullable()->after('excerpt');
            $table->string('seo_description', 500)->nullable()->after('seo_title');
            $table->string('social_image')->nullable()->after('image');
            $table->string('story_image')->nullable()->after('social_image');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->dropColumn(['excerpt', 'seo_title', 'seo_description', 'social_image', 'story_image']);
        });
    }
};

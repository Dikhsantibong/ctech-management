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
        Schema::create('content_plans', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('platform'); // Instagram, Facebook, Twitter/X, TikTok, LinkedIn, YouTube, Website/Blog
            $table->string('content_type'); // Post, Story, Reel, Video, Article, Carousel
            $table->string('status')->default('Draft'); // Draft, Scheduled, Published, Cancelled
            $table->date('scheduled_date')->nullable();
            $table->date('published_date')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('content_plans');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_canvases', function (Blueprint $table) {
            $table->id();
            // Satu project = satu canvas utama.
            $table->foreignId('project_id')->unique()->constrained('projects')->cascadeOnDelete();
            $table->string('name')->nullable();
            $table->json('viewport')->nullable();
            $table->json('settings')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_canvases');
    }
};

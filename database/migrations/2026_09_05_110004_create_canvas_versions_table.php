<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('canvas_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('canvas_id')->constrained('project_canvases')->cascadeOnDelete();
            $table->unsignedInteger('version_number');
            $table->string('name')->nullable();
            $table->text('description')->nullable();
            // Snapshot penuh (nodes + edges + viewport) agar bisa di-restore tanpa kehilangan versi lain.
            $table->json('snapshot');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('canvas_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('canvas_versions');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('canvas_nodes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('canvas_id')->constrained('project_canvases')->cascadeOnDelete();
            // Kunci stabil dari frontend (React Flow node id) — edge merujuk ke sini, bukan ke id DB.
            $table->string('node_key');
            $table->string('type')->default('process');
            $table->text('label')->nullable();
            $table->double('position_x')->default(0);
            $table->double('position_y')->default(0);
            $table->double('width')->nullable();
            $table->double('height')->nullable();
            $table->json('data')->nullable();
            $table->json('style')->nullable();
            // Jejak asal node bila dibuat dari import dokumen.
            $table->unsignedBigInteger('source_document_id')->nullable();
            $table->string('source_type')->nullable();
            $table->string('source_reference')->nullable();
            $table->timestamps();

            $table->unique(['canvas_id', 'node_key']);
            $table->index('canvas_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('canvas_nodes');
    }
};

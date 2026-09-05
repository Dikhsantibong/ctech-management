<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('canvas_edges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('canvas_id')->constrained('project_canvases')->cascadeOnDelete();
            $table->string('edge_key');
            // Merujuk ke canvas_nodes.node_key (bukan id DB) agar konsisten dengan React Flow.
            $table->string('source_node');
            $table->string('target_node');
            $table->string('source_handle')->nullable();
            $table->string('target_handle')->nullable();
            $table->text('label')->nullable();
            $table->string('type')->nullable();
            $table->json('data')->nullable();
            $table->json('style')->nullable();
            $table->timestamps();

            $table->unique(['canvas_id', 'edge_key']);
            $table->index('canvas_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('canvas_edges');
    }
};

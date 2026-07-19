<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_milestone_checklists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_milestone_id')->constrained('project_milestones')->cascadeOnDelete();
            $table->string('title');
            $table->boolean('is_checked')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_milestone_checklists');
    }
};

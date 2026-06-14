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
        Schema::create('works', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category');
            $table->enum('priority', ['Low', 'Medium', 'High', 'Critical'])->default('Medium');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null'); // Assigned To
            $table->date('start_date')->nullable();
            $table->date('due_date')->nullable();
            $table->string('estimated_duration')->nullable();
            $table->foreignId('client_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('project_id')->nullable()->constrained()->onDelete('set null');
            $table->text('description')->nullable();
            $table->json('checklist')->nullable();
            $table->json('attachments')->nullable();
            $table->string('reminder')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->string('recurring_frequency')->nullable();
            $table->enum('status', ['Inbox', 'Todo', 'In Progress', 'Waiting', 'Review', 'Done'])->default('Inbox');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('works');
    }
};

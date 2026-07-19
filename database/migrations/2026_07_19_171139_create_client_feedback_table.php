<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client_feedbacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('client_id')->nullable()->constrained()->nullOnDelete(); // Reference to clients table
            $table->string('subject');
            $table->text('message');
            $table->string('attachment_path')->nullable();
            $table->enum('status', ['New', 'Reviewed', 'Resolved'])->default('New');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_feedbacks'); // Note: Laravel created client_feedback but I will rename table to client_feedbacks
    }
};

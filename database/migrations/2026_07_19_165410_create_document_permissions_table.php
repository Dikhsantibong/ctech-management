<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')->constrained('project_documents')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->string('role')->nullable(); // Can grant permission by user or role
            $table->enum('access_level', ['view', 'edit', 'download']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_permissions');
    }
};

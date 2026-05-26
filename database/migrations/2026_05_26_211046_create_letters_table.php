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
        Schema::create('letters', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number')->unique();
            $table->string('type'); // Surat Tugas, Surat Keterangan, etc.
            $table->string('recipient');
            $table->string('subject');
            $table->text('content')->nullable();
            $table->enum('status', ['Draft', 'Final'])->default('Draft');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('letters');
    }
};

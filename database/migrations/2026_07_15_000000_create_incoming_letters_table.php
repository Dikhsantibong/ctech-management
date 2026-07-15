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
        Schema::create('incoming_letters', function (Blueprint $table) {
            $table->id();
            $table->string('agenda_number')->unique();
            $table->string('reference_number'); // Nomor surat dari pengirim
            $table->string('sender');
            $table->date('letter_date');
            $table->date('received_date');
            $table->string('subject');
            $table->string('sifat')->default('Biasa');
            $table->text('disposition')->nullable();
            $table->text('notes')->nullable();
            $table->string('attachment_path')->nullable();
            $table->enum('status', ['Diterima', 'Diproses', 'Selesai', 'Diarsipkan'])->default('Diterima');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incoming_letters');
    }
};

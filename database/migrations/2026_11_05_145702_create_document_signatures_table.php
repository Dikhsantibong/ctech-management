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
        Schema::create('document_signatures', function (Blueprint $table) {
            $table->id();
            // Surat keluar, penawaran/RAB, kwitansi (lihat App\Services\Documents\SignableDocument)
            $table->morphs('signable');
            $table->string('document_type', 30);
            $table->foreignId('signer_id')->constrained('users');
            $table->string('signer_name');
            $table->string('signer_title');
            // Token acak untuk URL verifikasi publik (QR); tidak bisa ditebak dari data dokumen
            $table->string('token', 64)->unique();
            $table->string('pdf_path');
            $table->char('pdf_hash', 64);
            $table->timestamp('signed_at');
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamp('revoked_at')->nullable();
            $table->foreignId('revoked_by')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_signatures');
    }
};

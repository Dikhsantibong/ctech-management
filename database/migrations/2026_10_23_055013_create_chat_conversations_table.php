<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Percakapan pribadi antara tepat dua pengguna.
 *
 * Pasangan disimpan terurut (id kecil di user_low_id) sehingga satu pasangan
 * hanya punya satu percakapan, siapa pun yang memulainya.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_low_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('user_high_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();

            $table->unique(['user_low_id', 'user_high_id']);
            $table->index('user_high_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_conversations');
    }
};

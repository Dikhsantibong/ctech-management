<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quotations', function (Blueprint $table) {
            $table->id();
            $table->string('quotation_number')->unique();
            $table->string('client_name');
            $table->string('client_pic')->nullable();
            $table->text('client_address')->nullable();
            $table->date('quotation_date');
            $table->date('valid_until')->nullable();
            $table->string('subject');
            $table->text('intro')->nullable();
            $table->text('terms')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('use_tax')->default(false);
            $table->decimal('tax_rate', 5, 2)->default(0);
            $table->decimal('discount', 15, 2)->default(0);
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('tax', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);
            $table->enum('status', ['Draft', 'Terkirim', 'Diterima', 'Ditolak'])->default('Draft');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotations');
    }
};

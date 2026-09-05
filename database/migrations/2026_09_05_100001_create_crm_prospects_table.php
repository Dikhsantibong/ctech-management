<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crm_prospects', function (Blueprint $table) {
            $table->id();

            // Perusahaan
            $table->string('company_name');
            $table->string('brand_name')->nullable();
            $table->string('company_type')->nullable();
            $table->string('industry')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('country')->nullable()->default('Indonesia');
            $table->string('website')->nullable();
            $table->string('company_email')->nullable();
            $table->string('company_phone')->nullable();
            $table->string('company_whatsapp')->nullable();

            // PIC (kontak di sisi prospek)
            $table->string('pic_name')->nullable();
            $table->string('pic_position')->nullable();
            $table->string('pic_email')->nullable();
            $table->string('pic_phone')->nullable();
            $table->string('pic_whatsapp')->nullable();
            $table->string('pic_linkedin')->nullable();

            // Sales & kualifikasi
            $table->string('source')->nullable();
            $table->foreignId('sales_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('priority')->default('Sedang');
            $table->string('stage')->default('Prospek Baru');
            $table->string('status')->default('Aktif');
            $table->text('products_interest')->nullable();
            $table->text('notes')->nullable();

            // Opportunity (muncul setelah lolos tahap awal)
            $table->decimal('estimated_value', 18, 2)->nullable();
            $table->date('expected_close_date')->nullable();

            // Kebutuhan konsultatif (progressive disclosure) sebagai JSON
            $table->json('needs')->nullable();

            // Next action / follow-up
            $table->string('next_action')->nullable();
            $table->dateTime('next_follow_up_at')->nullable();
            $table->dateTime('last_activity_at')->nullable();

            // Konversi ke Customer existing
            $table->foreignId('client_id')->nullable()->constrained('clients')->nullOnDelete();
            $table->dateTime('converted_at')->nullable();

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('stage');
            $table->index('status');
            $table->index('sales_id');
            $table->index('next_follow_up_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crm_prospects');
    }
};

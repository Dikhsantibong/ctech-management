<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crm_prospect_stage_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prospect_id')->constrained('crm_prospects')->cascadeOnDelete();
            $table->string('from_stage')->nullable();
            $table->string('to_stage');
            $table->text('note')->nullable();
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('prospect_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crm_prospect_stage_histories');
    }
};

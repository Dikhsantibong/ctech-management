<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_financials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->decimal('contract_value', 15, 2)->default(0);
            $table->decimal('cost', 15, 2)->default(0);
            $table->decimal('profit', 15, 2)->default(0);
            $table->decimal('margin', 5, 2)->default(0);
            $table->string('payment_status')->default('Unpaid');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_financials');
    }
};

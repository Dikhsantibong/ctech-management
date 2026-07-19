<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First we drop the old enums to change them to strings for flexibility
        // or just use DB statements if using MySQL
        
        // Adjust project_revisions
        Schema::table('project_revisions', function (Blueprint $table) {
            $table->string('category')->nullable()->after('description');
        });

        // Adjust client_feedbacks
        // The easiest way to change enum is to alter table directly to string
        DB::statement("ALTER TABLE client_feedbacks CHANGE COLUMN status status VARCHAR(255) DEFAULT 'Open'");
        
        Schema::table('client_feedbacks', function (Blueprint $table) {
            $table->string('priority')->default('Medium')->after('message');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_revisions', function (Blueprint $table) {
            $table->dropColumn('category');
        });

        Schema::table('client_feedbacks', function (Blueprint $table) {
            $table->dropColumn('priority');
        });
        
        DB::statement("ALTER TABLE client_feedbacks CHANGE COLUMN status status ENUM('New', 'Reviewed', 'Resolved') DEFAULT 'New'");
    }
};

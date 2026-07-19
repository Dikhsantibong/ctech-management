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
        Schema::table('tasks', function (Blueprint $table) {
            $table->foreignId('project_milestone_id')->nullable()->after('project_id')->constrained()->nullOnDelete();
            $table->foreignId('client_feedback_id')->nullable()->after('project_milestone_id')->constrained('client_feedbacks')->nullOnDelete();
            $table->foreignId('meeting_id')->nullable()->after('client_feedback_id')->constrained('meetings')->nullOnDelete();
            $table->date('start_date')->nullable()->after('priority');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['project_milestone_id']);
            $table->dropForeign(['client_feedback_id']);
            $table->dropForeign(['meeting_id']);
            $table->dropColumn(['project_milestone_id', 'client_feedback_id', 'meeting_id', 'start_date']);
        });
    }
};

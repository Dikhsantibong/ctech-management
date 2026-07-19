<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_reminder_logs', function (Blueprint $table) {
            $table->id();
            $table->morphs('remindable'); // Can be Project or Task
            $table->string('reminder_type'); // e.g. 'H-7', 'H-3', 'H-1', 'Overdue'
            $table->date('sent_date');
            $table->timestamps();

            // Prevent duplicate reminders for the same entity and type
            $table->unique(['remindable_id', 'remindable_type', 'reminder_type'], 'reminder_log_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_reminder_logs');
    }
};

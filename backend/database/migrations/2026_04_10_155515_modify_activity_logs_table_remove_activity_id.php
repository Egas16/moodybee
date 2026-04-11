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
        // Remove activity_id from activity_logs
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropForeign(['activity_id']);
            $table->dropColumn('activity_id');
        });

        // Create activity_log_activities table
        Schema::create('activity_log_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_log_id')->constrained('activity_logs')->onDelete('cascade');
            $table->foreignId('activity_id')->constrained('activities', 'id_activity')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_log_activities');

        Schema::table('activity_logs', function (Blueprint $table) {
            $table->foreignId('activity_id')->constrained('activities', 'id_activity')->onDelete('cascade');
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('journal_collections', function (Blueprint $table) {
            $table->id('id_collection');
            $table->foreignId('id_user')
                  ->constrained('users', 'id_user')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            $table->string('name', 100);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journal_collections');
    }
};

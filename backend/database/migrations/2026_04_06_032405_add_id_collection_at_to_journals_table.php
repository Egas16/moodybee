<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /*
     * Tambah kolom id_collection ke tabel journals yang sudah ada.
     * Nullable supaya journal lama yang belum punya koleksi tidak error.
     */
    public function up(): void
    {
        Schema::table('journals', function (Blueprint $table) {
            $table->foreignId('id_collection')
                  ->nullable()
                  ->after('id_mood')
                  ->constrained('journal_collections', 'id_collection')
                  ->onDelete('set null')
                  ->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('journals', function (Blueprint $table) {
            $table->dropForeign(['id_collection']);
            $table->dropColumn('id_collection');
        });
    }
};

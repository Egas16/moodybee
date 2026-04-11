<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MoodSeeder extends Seeder
{
    public function run(): void
    {
        /*
         * Kolom icon diisi dengan ID yang sama persis dengan yang dipakai
         * frontend di moods array: "happy", "good", "neutral", "bad", "sad"
         *
         * Frontend nanti tinggal map: icon value dari API → komponen icon SVG
         * Level mood: 1 = paling buruk, 5 = paling baik
         */
        $moods = [
            ['nama_mood' => 'Sad',     'icon' => 'sad',     'level_mood' => 1],
            ['nama_mood' => 'Bad',     'icon' => 'bad',     'level_mood' => 2],
            ['nama_mood' => 'Neutral', 'icon' => 'neutral', 'level_mood' => 3],
            ['nama_mood' => 'Good',    'icon' => 'good',    'level_mood' => 4],
            ['nama_mood' => 'Happy',   'icon' => 'happy',   'level_mood' => 5],
        ];

        foreach ($moods as $mood) {
            DB::table('moods')->updateOrInsert(
                ['icon' => $mood['icon']],   // cek by icon supaya tidak dobel kalau di-seed ulang
                array_merge($mood, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }
    }
}

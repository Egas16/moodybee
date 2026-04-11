<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mood;
use App\Models\MoodLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class MoodStatController extends Controller
{
    /**
     * Mengembalikan jumlah mood per kategori dalam 1 bulan.
     */
    public function monthly(Request $request)
    {
        $validated = $request->validate([
            'year'  => ['required', 'integer'],
            'month' => ['required', 'integer'],
        ]);

        $userId = $request->user()->id_user;

        // Ambil data count dari database
        $rawCounts = MoodLog::where('id_user', $userId)
            ->whereYear('tanggal', $validated['year'])
            ->whereMonth('tanggal', $validated['month'])
            ->select('id_mood', DB::raw('count(*) as count'))
            ->groupBy('id_mood')
            ->pluck('count', 'id_mood');

        // Mapping agar semua mood (1-5) muncul meskipun jumlahnya 0
        $counts = Mood::orderBy('level_mood', 'asc')
            ->get(['id_mood', 'nama_mood', 'icon', 'level_mood'])
            ->map(function ($mood) use ($rawCounts) {
                return [
                    'id_mood'    => $mood->id_mood,
                    'nama_mood'  => $mood->nama_mood,
                    'icon'       => $mood->icon,
                    'level_mood' => $mood->level_mood,
                    'count'      => (int) ($rawCounts[$mood->id_mood] ?? 0),
                ];
            });

        return response()->json([
            'data' => [
                'year'   => (int)$validated['year'],
                'month'  => (int)$validated['month'],
                'counts' => $counts
            ]
        ]);
    }

    /**
     * Mengembalikan list mood harian untuk kalender.
     */
    public function history(Request $request)
    {
        $userId = $request->user()->id_user;

        // Ambil input atau default ke bulan/tahun sekarang jika kosong
        $month = $request->query('month', date('m'));
        $year = $request->query('year', date('Y'));

        $logs = MoodLog::where('id_user', $userId)
            ->whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month)
            ->with(['mood' => function($query) {
                $query->select('id_mood', 'icon', 'nama_mood');
            }])
            ->get(['id_log', 'id_mood', 'tanggal'])
            ->map(function ($log) {
                // PENTING: Memastikan format tanggal hanya YYYY-MM-DD agar Next.js gampang cocokkinnya
                return [
                    'id_log'  => $log->id_log,
                    'id_mood' => $log->id_mood,
                    'tanggal' => date('Y-m-d', strtotime($log->tanggal)),
                    'mood'    => $log->mood
                ];
            });

        return response()->json(['data' => $logs]);
    }
}

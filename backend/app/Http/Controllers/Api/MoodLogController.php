<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mood;
use App\Models\MoodLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MoodLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'year'  => ['required', 'integer', 'min:2000', 'max:2100'],
            'month' => ['required', 'integer', 'min:1', 'max:12'],
        ]);

        $userId = $request->user()->id_user;

        $logs = MoodLog::forMonth($userId, $validated['year'], $validated['month'])
            ->with('mood:id_mood,nama_mood,icon,level_mood')
            ->orderBy('tanggal')
            ->get(['id_log', 'tanggal', 'catatan', 'id_mood']);

        return response()->json(['data' => $logs]);
    }

    /**
     * POST /api/mood/entries
     *
     * Menyimpan mood log untuk hari ini (atau tanggal yang dikirim).
     * Jika user sudah ada log di tanggal yang sama, log lama akan di-UPDATE.
     * Satu user hanya bisa punya 1 log per hari.
     *
     * Request body:
     * {
     *   "id_mood": 2,                    // required — FK ke tabel moods
     *   "tanggal": "2026-03-30",         // optional, default: hari ini
     *   "catatan": "Hari yang seru"      // optional
     * }
     *
     * Response 201 (baru) / 200 (update):
     * {
     *   "message": "Mood berhasil disimpan",
     *   "data": {
     *     "id_log": 1,
     *     "tanggal": "2026-03-30",
     *     "catatan": "Hari yang seru",
     *     "mood": { "id_mood": 2, "nama_mood": "Senang", "icon": "happy.png", "level_mood": 4 }
     *   }
     * }
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id_mood' => ['required', 'integer', 'exists:moods,id_mood'],
            'tanggal' => ['sometimes', 'date', 'date_format:Y-m-d'],
            'catatan' => ['nullable', 'string', 'max:500'],
        ]);

        // TODO (setelah auth di-push): $userId = $request->user()->id_user;
        $userId = $request->user()->id_user;

        $tanggal = $validated['tanggal'] ?? now()->toDateString();

        $log = MoodLog::updateOrCreate(
            [
                'id_user' => $userId,
                'tanggal' => $tanggal,
            ],
            [
                'id_mood' => $validated['id_mood'],
                'catatan' => $validated['catatan'] ?? null,
            ]
        );

        // Load relasi mood untuk dikembalikan ke frontend
        $log->load('mood:id_mood,nama_mood,icon,level_mood');

        $statusCode = $log->wasRecentlyCreated ? 201 : 200;
        $message    = $log->wasRecentlyCreated ? 'Mood berhasil disimpan' : 'Mood berhasil diperbarui';

        return response()->json([
            'message' => $message,
            'data'    => [
                'id_log'  => $log->id_log,
                'tanggal' => $log->tanggal,
                'catatan' => $log->catatan,
                'mood'    => $log->mood,
            ],
        ], $statusCode);
    }

    /**
     * GET /api/mood/available
     *
     * Mengembalikan daftar semua mood yang tersedia dari tabel moods.
     * Dipakai frontend untuk render pilihan mood (emoji picker) di form input.
     *
     * Response:
     * {
     *   "data": [
     *     { "id_mood": 1, "nama_mood": "Sangat Buruk", "icon": "awful.png", "level_mood": 1 },
     *     { "id_mood": 2, "nama_mood": "Buruk",        "icon": "bad.png",   "level_mood": 2 },
     *     ...
     *   ]
     * }
     */
    public function availableMoods(): JsonResponse
    {
        $moods = Mood::orderBy('level_mood')
            ->get(['id_mood', 'nama_mood', 'icon', 'level_mood']);

        return response()->json(['data' => $moods]);
    }
}

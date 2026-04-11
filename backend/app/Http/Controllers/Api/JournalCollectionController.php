<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JournalCollection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JournalCollectionController extends Controller
{
    /**
     * GET /api/journal/collections
     *
     * List semua koleksi milik user yang login.
     * Dipakai di halaman /diary untuk render card koleksi,
     * dan di modal "Konfirmasi Papan" saat save journal.
     *
     * Response:
     * {
     *   "data": [
     *     { "id_collection": 1, "name": "Koleksi Diaries A", "journal_count": 3 },
     *     ...
     *   ]
     * }
     */
    public function index(Request $request): JsonResponse
    {
        $collections = JournalCollection::where('id_user', $request->user()->id_user)
            ->withCount('journals') // tambah field journal_count otomatis
            ->orderBy('created_at', 'desc')
            ->get(['id_collection', 'name', 'created_at']);

        return response()->json(['data' => $collections]);
    }

    /**
     * POST /api/journal/collections
     *
     * Buat koleksi baru.
     * Dipakai saat user klik tombol "+" di modal Konfirmasi Papan.
     *
     * Request body: { "name": "Koleksi Baru" }
     *
     * Response 201:
     * { "data": { "id_collection": 4, "name": "Koleksi Baru", "journal_count": 0 } }
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
        ]);

        $collection = JournalCollection::create([
            'id_user' => $request->user()->id_user,
            'name'    => $validated['name'],
        ]);

        return response()->json([
            'data' => [
                'id_collection' => $collection->id_collection,
                'name'          => $collection->name,
                'journals_count' => 0,
            ],
        ], 201);
    }

    /**
     * DELETE /api/journal/collections/{id}
     *
     * Hapus koleksi. Journal di dalamnya ikut terhapus.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $collection = JournalCollection::where('id_collection', $id)
            ->where('id_user', $request->user()->id_user)
            ->firstOrFail();

        // Hapus journals dulu
        $collection->journals()->delete();

        $collection->delete();

        return response()->json(['message' => 'Koleksi berhasil dihapus']);
    }
}

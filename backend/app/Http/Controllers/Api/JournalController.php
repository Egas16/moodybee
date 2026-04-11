<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Journal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JournalController extends Controller
{
    /**
     * GET /api/journal/collections/{id}/journals
     *
     * List semua journal dalam 1 koleksi.
     * Dipakai di halaman /diary/[id].
     *
     * Response:
     * {
     *   "data": [
     *     {
     *       "id_journal": 1,
     *       "title": "Hari yang menyenangkan",
     *       "content": "Hari ini aku...",
     *       "created_at": "2026-03-16T00:00:00Z",
     *       "mood": { "id_mood": 4, "nama_mood": "Senang", "icon": "good" }
     *     },
     *     ...
     *   ]
     * }
     */
    public function index(Request $request, string $collectionId): JsonResponse
    {
        $collectionId = (int) $collectionId;
        if ($collectionId <= 0) {
            return response()->json(['data' => []]);
        }

        $journals = Journal::where('id_user', $request->user()->id_user)
            ->where('id_collection', $collectionId)
            ->with('mood:id_mood,nama_mood,icon')
            ->with('collection:id_collection,name')
            ->orderBy('created_at', 'desc')
            ->get(['id_journal', 'title', 'content', 'id_mood', 'created_at']);

        return response()->json(['data' => $journals]);
    }

    /**
     * GET /api/journal/journals/{id}
     *
     * Detail 1 journal (untuk halaman baca/edit).
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $journal = Journal::where('id_journal', $id)
            ->where('id_user', $request->user()->id_user)
            ->with('mood:id_mood,nama_mood,icon')
            ->with('collection:id_collection,name')
            ->firstOrFail();

        return response()->json(['data' => $journal]);
    }

    /**
     * POST /api/journal/journals
     *
     * Simpan journal baru.
     * Dipanggil saat user klik koleksi di modal "Konfirmasi Papan".
     *
     * Request body:
     * {
     *   "title": "Judul journal",
     *   "content": "Isi journal...",
     *   "id_collection": 2,   // required — dipilih dari modal
     *   "id_mood": 4          // optional — mood saat menulis
     * }
     *
     * Response 201:
     * { "message": "Journal berhasil disimpan", "data": { ... } }
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'         => ['required', 'string', 'max:200'],
            'content'       => ['required', 'string'],
            'id_collection' => ['required', 'integer', 'exists:journal_collections,id_collection'],
            'id_mood'       => ['nullable', 'integer', 'exists:moods,id_mood'],
        ]);

        $journal = Journal::create([
            'id_user'       => $request->user()->id_user,
            'title'         => $validated['title'],
            'content'       => $validated['content'],
            'id_collection' => $validated['id_collection'],
            'id_mood'       => $validated['id_mood'] ?? null,
        ]);

        $journal->load('mood:id_mood,nama_mood,icon', 'collection:id_collection,name');

        return response()->json([
            'message' => 'Journal berhasil disimpan',
            'data'    => $journal,
        ], 201);
    }

    /**
     * PUT /api/journal/journals/{id}
     *
     * Update journal yang sudah ada.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $journal = Journal::where('id_journal', $id)
            ->where('id_user', $request->user()->id_user)
            ->firstOrFail();

        $validated = $request->validate([
            'title'         => ['sometimes', 'string', 'max:200'],
            'content'       => ['sometimes', 'string'],
            'id_collection' => ['sometimes', 'integer', 'exists:journal_collections,id_collection'],
            'id_mood'       => ['nullable', 'integer', 'exists:moods,id_mood'],
        ]);

        $journal->update($validated);
        $journal->load('mood:id_mood,nama_mood,icon', 'collection:id_collection,name');

        return response()->json([
            'message' => 'Journal berhasil diperbarui',
            'data'    => $journal,
        ]);
    }

    /**
     * DELETE /api/journal/journals/{id}
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $journal = Journal::where('id_journal', $id)
            ->where('id_user', $request->user()->id_user)
            ->firstOrFail();

        $journal->delete();

        return response()->json(['message' => 'Journal berhasil dihapus']);
    }
}

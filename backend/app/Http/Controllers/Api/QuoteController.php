<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class QuoteController extends Controller
{
    /**
     * GET /api/quotes/today
     *
     * Mengembalikan 1 quote yang berubah setiap hari.
     * Quote dipilih berdasarkan tanggal, bukan random murni —
     * sehingga semua user yang buka di hari yang sama mendapat quote yang sama,
     * dan quote tidak berubah kalau di-refresh di hari yang sama.
     *
     * Teknik: date-seeded index
     *   index = (jumlah hari sejak epoch) % total quotes
     *
     * Response shape:
     * {
     *   "data": {
     *     "id": 12,
     *     "text": "Never let the fear of striking out...",
     *     "author": "Babe Ruth",
     *     "date": "2026-03-30"
     *   }
     * }
     */
    public function today(): JsonResponse
    {
        $quotes = $this->loadQuotes();

        if (empty($quotes)) {
            return response()->json(['message' => 'No quotes available'], 404);
        }

        /*
         * Carbon::today()->dayOfYear() mengembalikan 1-365.
         * Dikombinasikan dengan tahun supaya tidak loop di hari yang sama tiap tahun.
         * Formula: (tahun * 1000 + dayOfYear) % total_quotes
         * Ini memastikan urutan terasa bervariasi antar tahun.
         */
        $today      = Carbon::today();
        $seed       = ($today->year * 1000) + $today->dayOfYear;
        $index      = $seed % count($quotes);
        $quote      = $quotes[$index];

        return response()->json([
            'data' => [
                'id'     => $quote['id'],
                'text'   => $quote['text'],
                'author' => $quote['author'],
                'date'   => $today->toDateString(),
            ],
        ]);
    }

    /**
     * Load quotes dari JSON file.
     * File diletakkan di resources/data/quotes.json
     * Bisa diganti dengan DB query kalau PM minta quotes bisa di-manage via admin panel.
     */
    private function loadQuotes(): array
    {
        $path = resource_path('data/quotes.json');

        if (!file_exists($path)) {
            return [];
        }

        $json = file_get_contents($path);
        return json_decode($json, true) ?? [];
    }
}

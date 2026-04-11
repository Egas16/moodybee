<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MoodLogController;
use App\Http\Controllers\Api\MoodStatController;
use App\Http\Controllers\Api\QuoteController;
use App\Http\Controllers\Api\JournalCollectionController;
use App\Http\Controllers\Api\JournalController;
use App\Http\Controllers\Api\ActivityController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- 1. AUTHENTICATION ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- 2. EMAIL VERIFICATION ---
Route::get('/email/verify/{id}/{hash}', function (Request $request) {
    $user = User::find($request->route('id'));

    if (!$user) return redirect('http://localhost:3000/login?error=user_not_found');

    if (!hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
        return redirect('http://localhost:3000/login?error=invalid_link');
    }

    if (!$user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
        event(new \Illuminate\Auth\Events\Verified($user));
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return redirect("http://localhost:3000/dashboard?token={$token}&verified=true");

})->middleware(['signed'])->name('verification.verify');

// --- 3. PUBLIC ---
Route::get('quotes/today', [QuoteController::class, 'today']);

// Debug: Get test token
Route::get('/debug/login', function (Request $request) {
    $user = User::where('username', 'test')->first();
    if (!$user) {
        return response()->json(['error' => 'Test user not found'], 404);
    }
    $token = $user->createToken('test_token')->plainTextToken;
    return response()->json([
        'access_token' => $token,
        'user' => $user,
    ]);
});

// --- 4. PROTECTED ---
Route::middleware('auth:sanctum')->group(function () {

    // Debug endpoint
    Route::get('/debug/me', function (Request $request) {
        return response()->json([
            'status' => 'success',
            'user' => $request->user(),
            'auth_header' => $request->header('Authorization'),
        ]);
    });

    // User info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Kirim ulang verifikasi
    Route::post('/email/verification-notification', function (Request $request) {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email sudah terverifikasi.'], 400);
        }
        $request->user()->sendEmailVerificationNotification();
        return response()->json(['message' => 'Link verifikasi baru telah dikirim!']);
    })->name('verification.send');

    // Mood fitur
    Route::prefix('mood')->group(function () {
        Route::get('available', [MoodLogController::class, 'availableMoods']);
        Route::post('entries',  [MoodLogController::class, 'store']);
        Route::get('entries',   [MoodLogController::class, 'index']);
        Route::get('stats',     [MoodStatController::class, 'monthly']);
    });

    // Mood history
    Route::get('/mood/history', [MoodStatController::class, 'history']);

    // Journal fitur
    Route::prefix('journal')->group(function () {
        Route::get('collections',               [JournalCollectionController::class, 'index']);
        Route::post('collections',              [JournalCollectionController::class, 'store']);
        Route::delete('collections/{id}',       [JournalCollectionController::class, 'destroy']);
        Route::get('collections/{id}/journals', [JournalController::class, 'index']);
        Route::get('journals/{id}',             [JournalController::class, 'show']);
        Route::post('journals',                 [JournalController::class, 'store']);
        Route::put('journals/{id}',             [JournalController::class, 'update']);
        Route::delete('journals/{id}',          [JournalController::class, 'destroy']);
    });

     // Activities
    Route::prefix('activities')->group(function () {
        Route::get('/',         [ActivityController::class, 'index']);   // GET  /activities
        Route::post('/attach',  [ActivityController::class, 'attach']);  // POST /activities/attach
        Route::get('/history',  [ActivityController::class, 'history']); // GET  /activities/history
        Route::get('/logs',     [ActivityController::class, 'logs']);    // GET  /activities/logs
        Route::post('/logs',    [ActivityController::class, 'storeLog']); // POST /activities/logs
    });
});

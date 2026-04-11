<?php

use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Auth;

// Route yang dipanggil saat tombol di email diklik
Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    // 1. Proses Verifikasi Email
    $request->fulfill();

    // 2. Login Otomatis User Tersebut
    $user = $request->user();
    Auth::login($user);

    // 3. Redirect ke Halaman Dashboard Next.js kamu
    // Ganti URL sesuai port Next.js kamu (biasanya 3000)
    return redirect('http://localhost:3000/dashboard?verified=1'); 
})->middleware(['auth', 'signed'])->name('verification.verify');

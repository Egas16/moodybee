<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Mail\WelcomeEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|unique:users,username',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'gender' => 'required|in:Laki-laki,Perempuan', 
            'dob' => 'required|date',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                // 1. Simpan User
                $user = User::create([
                    'username' => $request->username,
                    'email'    => $request->email,
                    'password' => Hash::make($request->password),
                    'gender'   => $request->gender ?? 'Laki-laki', 
                    'tanggal_lahir' => $request->tanggal_lahir ?? now()->format('Y-m-d'), 
                ]);

                // 2. Buat URL Verifikasi Berdasarkan ID
                $verificationUrl = URL::temporarySignedRoute(
                    'verification.verify',
                    now()->addMinutes(60),
                    ['id' => $user->id_user, 'hash' => sha1($user->email)]
                );

                // 3. Kirim Email
                Mail::to($user->email)->send(new WelcomeEmail($user, $verificationUrl));

                return response()->json([
                    'message' => 'Registrasi Berhasil! Silakan cek email kamu.',
                    'user' => $user
                ], 201);
            });

        } catch (\Exception $e) {
            Log::error("Error Register: " . $e->getMessage());
            return response()->json([
                'message' => 'Gagal mengirim email verifikasi. Cek koneksi SMTP.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Username atau password salah!'], 401);
        }

        if (!$user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email belum diverifikasi!'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login Berhasil!',
            'access_token' => $token,
            'user' => $user
        ]);
    }
}
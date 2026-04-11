<?php

namespace App\Models;

// 1. WAJIB IMPORT INI
use Illuminate\Contracts\Auth\MustVerifyEmail; 
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

// 2. WAJIB TAMBAHKAN 'implements MustVerifyEmail'
class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, Notifiable, HasFactory;

    protected $table = 'users';
    
    // Konfigurasi Primary Key Custom
    protected $primaryKey = 'id_user'; 
    public $incrementing = true; 
    protected $keyType = 'int';

    protected $fillable = [
        'username', 
        'email', 
        'password', 
        'gender', 
        'tanggal_lahir'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Menangani format data secara otomatis
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed', // Password otomatis di-hash oleh Laravel 10+
        'tanggal_lahir' => 'date',
    ];

    // Relasi ke tabel logs
    public function logs() {
        return $this->hasMany(MoodLog::class, 'id_user', 'id_user');
    }
}

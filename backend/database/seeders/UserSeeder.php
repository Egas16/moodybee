<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'id_user' => 1,
            'username' => 'test',
            'email' => 'test@test.com',
            'password' => bcrypt('123456'),
            'gender' => 'Laki-laki',
            'tanggal_lahir' => '2000-01-01',
            'email_verified_at' => now(),
        ]);
    }
}

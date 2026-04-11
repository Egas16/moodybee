<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user with verified email
        User::create([
            'id_user' => 1,
            'username' => 'test',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'gender' => 'Laki-laki',
            'tanggal_lahir' => '2000-01-01',
            'email_verified_at' => now(),
        ]);

        // Seeder manual
        $this->call([
            ActivitySeeder::class,
        ]);
    }
}

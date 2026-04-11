<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        $activities = [
            ['nama_aktivitas' => 'Sleep',     'icon' => 'Bed'],
            ['nama_aktivitas' => 'Eat',        'icon' => 'Utensils'],
            ['nama_aktivitas' => 'Exercise',   'icon' => 'Dumbbell'],
            ['nama_aktivitas' => 'Music',      'icon' => 'Music'],
            ['nama_aktivitas' => 'Sunny',      'icon' => 'Sun'],
            ['nama_aktivitas' => 'Coffee',     'icon' => 'Coffee'],
            ['nama_aktivitas' => 'Health',     'icon' => 'HeartPulse'],
            ['nama_aktivitas' => 'Read',       'icon' => 'BookOpen'],
            ['nama_aktivitas' => 'Bike',       'icon' => 'Bike'],
            ['nama_aktivitas' => 'Write',      'icon' => 'Pencil'],
            ['nama_aktivitas' => 'Gaming',     'icon' => 'Gamepad'],
            ['nama_aktivitas' => 'Shop',       'icon' => 'ShoppingBag'],
            ['nama_aktivitas' => 'Friends',    'icon' => 'Users'],
            ['nama_aktivitas' => 'Travel',     'icon' => 'Plane'],
            ['nama_aktivitas' => 'Nature',     'icon' => 'TreePine'],
            ['nama_aktivitas' => 'Home',       'icon' => 'Home'],
            ['nama_aktivitas' => 'Doctor',     'icon' => 'Stethoscope'],
            ['nama_aktivitas' => 'Happy',      'icon' => 'Smile'],
            ['nama_aktivitas' => 'Star',       'icon' => 'Star'],
            ['nama_aktivitas' => 'Night',      'icon' => 'Moon'],
            ['nama_aktivitas' => 'Study',      'icon' => 'Bookmark'],
            ['nama_aktivitas' => 'TV',         'icon' => 'Tv'],
            ['nama_aktivitas' => 'Cook',       'icon' => 'UtensilsCrossed'],
            ['nama_aktivitas' => 'Listen',     'icon' => 'Headphones'],
            ['nama_aktivitas' => 'Pet',        'icon' => 'Dog'],
            ['nama_aktivitas' => 'Relax',      'icon' => 'Bath'],
            ['nama_aktivitas' => 'Family',     'icon' => 'Baby'],
            ['nama_aktivitas' => 'Class',      'icon' => 'Glasses'],
            ['nama_aktivitas' => 'Haircut',    'icon' => 'Scissors'],
            ['nama_aktivitas' => 'Skincare',   'icon' => 'Flower'],
            ['nama_aktivitas' => 'Meditate',   'icon' => 'Wind'],
            ['nama_aktivitas' => 'Rainy',      'icon' => 'Umbrella'],
        ];

        DB::table('activities')->insert($activities);
    }
}

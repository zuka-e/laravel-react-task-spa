<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::factory()->create([
            'name' => 'ゲストユーザー',
            'email' => env('GUEST_EMAIL'),
            'password' => Hash::make(env('GUEST_PASSWORD')),
        ]);
    }
}

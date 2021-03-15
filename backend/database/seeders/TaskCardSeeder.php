<?php

namespace Database\Seeders;

use App\Models\TaskCard;
use App\Models\User;
use Illuminate\Database\Seeder;

class TaskCardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = User::factory()->create();

        // 'User'に属するデータを生成
        TaskCard::factory()->count(10)->for($user)->create();
    }
}

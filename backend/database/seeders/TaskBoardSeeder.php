<?php

namespace Database\Seeders;

use App\Models\TaskBoard;
use Illuminate\Database\Seeder;

class TaskBoardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = UserSeeder::$guestUser;
        $anotherUser = UserSeeder::$anotherUser;

        TaskBoard::factory()
            ->count(41)
            ->for($user)
            ->create();
        TaskBoard::factory()
            ->count(21)
            ->for($anotherUser)
            ->create();
    }
}

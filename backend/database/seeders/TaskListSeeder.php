<?php

namespace Database\Seeders;

use App\Models\TaskList;
use Illuminate\Database\Seeder;

class TaskListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = UserSeeder::$guestUser;
        $anotherUser =  UserSeeder::$anotherUser;

        foreach ($user->taskBoards()->get() as $board) {
            TaskList::factory()->count(21)->for($board)->for($user)->create();
        }

        foreach ($anotherUser->taskBoards()->get() as $board) {
            TaskList::factory()->count(21)->for($board)->for($user)->create();
        }
    }
}

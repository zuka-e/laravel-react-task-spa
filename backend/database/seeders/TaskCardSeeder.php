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
        $user = UserSeeder::$guestUser;
        $anotherUser = UserSeeder::$anotherUser;

        foreach ($user->taskBoards()->get() as $board) {
            foreach ($board->taskLists as $list) {
                TaskCard::factory()
                    ->count(5)
                    ->for($list)
                    ->for($user)
                    ->create();
            }
        }

        foreach ($anotherUser->taskBoards()->get() as $board) {
            foreach ($board->taskLists as $list) {
                TaskCard::factory()
                    ->count(5)
                    ->for($list)
                    ->for($anotherUser)
                    ->create();
            }
        }
    }
}

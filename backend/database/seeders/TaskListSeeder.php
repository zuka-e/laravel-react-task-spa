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
        TaskList::factory()
            ->for(UserSeeder::$anotherUser)
            ->for(UserSeeder::$anotherUser->taskBoards->first())
            ->create();
    }
}

<?php

namespace Database\Seeders;

use App\Models\TaskCard;
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
        TaskCard::factory()
            ->for(UserSeeder::$anotherUser)
            ->for(UserSeeder::$anotherUser->taskLists->first())
            ->create();
    }
}

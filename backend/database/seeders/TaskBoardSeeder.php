<?php

namespace Database\Seeders;

use App\Models\TaskBoard;
use App\Models\TaskCard;
use App\Models\TaskList;
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
        $guestCardFactory = TaskCard::factory()->for(UserSeeder::$guestUser);
        $guestListFactory = TaskList::factory()->for(UserSeeder::$guestUser);

        TaskBoard::factory()
            ->for(UserSeeder::$guestUser)
            ->has(
                $guestListFactory
                    ->state(['title' => 'List 1'])
                    ->has($guestCardFactory->state(['title' => 'Card 1']))
                    ->has($guestCardFactory->state(['title' => 'Card 2']))
                    ->has($guestCardFactory->state(['title' => 'Card 3'])),
            )
            ->has(
                $guestListFactory
                    ->state(['title' => 'List 2'])
                    ->has($guestCardFactory->state(['title' => 'Card 4']))
                    ->has($guestCardFactory->state(['title' => 'Card 5']))
                    ->has($guestCardFactory->state(['title' => 'Card 6'])),
            )
            ->create([
                'title' => 'Board 1',
                'description' => 'Board description',
            ]);

        TaskBoard::factory()
            ->for(UserSeeder::$anotherUser)
            ->create();
    }
}

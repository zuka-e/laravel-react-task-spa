<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // 'sail artisan db:seed' で実行可能にする
        $this->call(UserSeeder::class);
        $this->call(TaskBoardSeeder::class);
        $this->call(TaskListSeeder::class);
        $this->call(TaskCardSeeder::class);
    }
}

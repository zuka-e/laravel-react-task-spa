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
        $this->call(TaskCardSeeder::class);
    }
}

<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public static User $guestUser;
    public static User $anotherUser;

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // > Once the configuration has been cached, the .env file will not be loaded.
        // > https://laravel.com/docs/9.x/configuration#configuration-caching
        //
        //`env()` returns `null`, after running `php artisan config:cache`.
        // Use `config()` instead. To remove the cache, run `php artisan config:clear`
        // (The cached config is stored in `bootstrap/cache/config.php`)

        self::$guestUser = User::factory()->create([
            'name' => config('fortify.guest.name'),
            'email' => config('fortify.guest.email'),
            'password' => Hash::make(config('fortify.guest.password')),
        ]);

        self::$anotherUser = User::factory()->create();
    }
}

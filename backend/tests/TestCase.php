<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected string $urlPrefix;
    protected User $guestUser;
    protected User $otherUser;


    public function setUp(): void
    {
        parent::setUp();

        $this->urlPrefix = env('URL_PREFIX', '/api/v1');

        $this->guestUser = User::factory()->create([
            'name' => env('GUEST_NAME'),
            'email' => env('GUEST_EMAIL'),
        ]);

        $this->otherUser = User::factory()->create();
    }

    protected function login(User $user)
    {
        $response = $this->postJson('api/login', [
            'email' => $user->email,
            'password' => 'password'
        ]);
        $response->assertOk(); // 200
        return $response;
    }
}

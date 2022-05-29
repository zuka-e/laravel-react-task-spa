<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected string $routePrefix;
    protected User $guestUser;
    protected User $otherUser;

    public function setUp(): void
    {
        parent::setUp();

        $this->routePrefix =
            env('API_ROUTE_PREFIX', '/api/') . env('API_VERSION', 'v1');

        $this->guestUser = User::factory()->create([
            'name' => env('GUEST_NAME'),
            'email' => env('GUEST_EMAIL'),
        ]);

        $this->otherUser = User::factory()->create();
    }

    protected function login(User $user)
    {
        $response = $this->postJson($this->routePrefix . '/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);
        $response->assertOk(); // 200
        return $response;
    }
}

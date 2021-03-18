<?php

namespace Tests\Feature;

use App\Models\TaskCard;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TaskCardTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_example()
    {
        $user = User::factory()->create();

        TaskCard::factory()->count(10)->for($user)->create();

        $response = $this->get('/api/v1/users/1/task_cards');

        $response->assertStatus(200);
    }
}

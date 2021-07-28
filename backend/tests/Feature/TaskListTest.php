<?php

namespace Tests\Feature;

use App\Models\TaskBoard;
use App\Models\TaskList;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskListTest extends TestCase
{
    use RefreshDatabase; // DBリフレッシュ (`id`カラムの連番はリセットされない)

    public function setUp(): void
    {
        parent::setUp();

        TaskBoard::factory()->for($this->guestUser)->create();

        TaskList::factory()
            ->for($this->guestUser)
            ->for($this->guestUser->taskBoards[0])
            ->create();
    }

    public function test_unauthorized_unless_logged_in()
    {
        $boardId = $this->guestUser->taskBoards[0]->id;

        // create
        $url = $this->routePrefix . "/task_boards/${boardId}/task_lists";
        $response = $this->postJson($url, ['title' => 'testTitle']);

        $response->assertUnauthorized();

        $this->login($this->guestUser);
    }

    public function test_validate_request_when_created()
    {
        $this->login($this->guestUser);

        $boardId = $this->guestUser->taskBoards[0]->id;
        $url = $this->routePrefix . "/task_boards/${boardId}/task_lists";

        // `title`
        $emptyRequest = [];
        $response = $this->postJson($url, $emptyRequest);
        $response->assertStatus(422);

        $emptyRequest = ['title' => ''];
        $response = $this->postJson($url, $emptyRequest);
        $response->assertStatus(422);

        $tooLongRequest = ['title' => str_repeat('a', floor(191 / 3) + 1)];
        $response = $this->postJson($url, $tooLongRequest);
        $response->assertStatus(422);

        $successfulRequest = ['title' => str_repeat('亜', floor(191 / 3))];
        $response = $this->postJson($url, $successfulRequest);
        $response->assertSuccessful(); // 201

        // `description`
        $tooLongRequest = $successfulRequest +
            ['description' => str_repeat('a', floor(65535 / 3) + 1)];
        $response = $this->postJson($url, $tooLongRequest);
        $response->assertStatus(422);

        $successfulRequest = $successfulRequest +
            ['description' => str_repeat('亜', floor(65535 / 3))];
        $response = $this->postJson($url, $successfulRequest);
        $response->assertSuccessful();
    }
}

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
        $board = $this->guestUser->taskBoards[0];
        $boardId = $board->id;
        $listId = $board->taskLists[0]->id;

        // create
        $url = $this->routePrefix . "/task_boards/${boardId}/task_lists";
        $response = $this->postJson($url, ['title' => 'testTitle']);

        $response->assertUnauthorized();

        // update
        $url = $this->routePrefix . "/task_boards/${boardId}/task_lists/${listId}";
        $response = $this->patchJson($url, ['title' => 'testTitle']);
        $response->assertUnauthorized();
    }

    public function test_forbidden_from_accessing_others_data()
    {
        TaskBoard::factory()->for($this->otherUser)->create();

        TaskList::factory()
            ->for($this->otherUser)
            ->for($this->otherUser->taskBoards[0])
            ->create();

        $this->login($this->guestUser);

        $board = $this->guestUser->taskBoards[0];
        $listId = $board->taskLists[0]->id;

        $otherBoard = $this->otherUser->taskBoards[0];
        $otherBoardId = $otherBoard->id;

        // create
        $url = $this->routePrefix . "/task_boards/${otherBoardId}/task_lists";
        $response = $this->postJson($url, ['title' => 'testTitle']);
        $response->assertForbidden();

        // update
        $url = $this->routePrefix . "/task_boards/${otherBoardId}/task_lists/${listId}";
        $response = $this->patchJson($url, ['title' => 'testTitle']);
        $response->assertForbidden();
    }

    public function test_return_404_error_if_data_is_not_found()
    {
        $this->login($this->guestUser);

        /*
        |--------------------------------------------------------------
        | Non-existent `TaskBoard`
        |--------------------------------------------------------------
        */
        $boardId = (string)Str::uuid();
        $listId = $this->guestUser->taskBoards[0]->taskLists[0]->id;

        // update
        $url = $this->routePrefix . "/task_boards/${boardId}/task_lists/${listId}";
        $response = $this->patchJson($url, ['title' => 'testTitle']);
        $response->assertNotFound();

        /*
        |--------------------------------------------------------------
        | Non-existent `TaskList`
        |--------------------------------------------------------------
        */
        $boardId = $this->guestUser->taskBoards[0]->id;
        $listId =  (string)Str::uuid();

        // update
        $url = $this->routePrefix . "/task_boards/${boardId}/task_lists/${listId}";
        $response = $this->patchJson($url, ['title' => 'testTitle']);
        $response->assertNotFound();
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
        $response->assertStatus(201);

        // `description`
        $tooLongRequest = $successfulRequest +
            ['description' => str_repeat('a', floor(65535 / 3) + 1)];
        $response = $this->postJson($url, $tooLongRequest);
        $response->assertStatus(422);

        $successfulRequest = $successfulRequest +
            ['description' => str_repeat('亜', floor(65535 / 3))];
        $response = $this->postJson($url, $successfulRequest);
        $response->assertStatus(201);
    }

    public function test_validate_request_when_updated()
    {
        $this->login($this->guestUser);

        $board = $this->guestUser->taskBoards[0];
        $boardId = $board->id;
        $listId = $board->taskLists[0]->id;
        $url = $this->routePrefix . "/task_boards/${boardId}/task_lists/${listId}";

        // `title`
        $emptyRequest = [];
        $response = $this->patchJson($url, $emptyRequest);
        $response->assertStatus(422);

        $emptyRequest = ['title' => ''];
        $response = $this->patchJson($url, $emptyRequest);
        $response->assertStatus(422);

        $tooLongRequest = ['title' => str_repeat('a', floor(191 / 3) + 1)];
        $response = $this->patchJson($url, $tooLongRequest);
        $response->assertStatus(422);

        $successfulRequest = ['title' => str_repeat('亜', floor(191 / 3))];
        $response = $this->patchJson($url, $successfulRequest);
        $response->assertStatus(200);

        // `description`
        $tooLongRequest = $successfulRequest +
            ['description' => str_repeat('a', floor(65535 / 3) + 1)];
        $response = $this->patchJson($url, $tooLongRequest);
        $response->assertStatus(422);

        $successfulRequest = $successfulRequest +
            ['description' => str_repeat('亜', floor(65535 / 3))];
        $response = $this->patchJson($url, $successfulRequest);
        $response->assertStatus(200);
    }
}

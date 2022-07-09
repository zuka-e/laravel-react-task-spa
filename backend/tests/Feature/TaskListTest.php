<?php

namespace Tests\Feature;

use App\Models\TaskBoard;
use App\Models\TaskCard;
use App\Models\TaskList;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Tests\TestCase;

class TaskListTest extends TestCase
{
    use RefreshDatabase; // DBリフレッシュ (`id`カラムの連番はリセットされない)

    private TaskBoard $taskBoard;
    private TaskList $taskList;
    private TaskCard $taskCard;

    public function setUp(): void
    {
        parent::setUp();

        $this->taskBoard = TaskBoard::factory()
            ->for($this->guestUser)
            ->create();

        $this->taskList = TaskList::factory()
            ->for($this->guestUser)
            ->for($this->taskBoard)
            ->create();

        $this->taskCard = TaskCard::factory()
            ->for($this->guestUser)
            ->for($this->taskList)
            ->create();
    }

    public function test_unauthorized_unless_logged_in()
    {
        $board = $this->guestUser->taskBoards[0];
        $boardId = $board->id;
        $listId = $board->taskLists[0]->id;

        // create
        $url = $this->routePrefix . "/task-boards/${boardId}/task-lists";
        $response = $this->postJson($url, ['title' => 'testTitle']);
        $response->assertUnauthorized();

        // update
        $url =
            $this->routePrefix . "/task-boards/${boardId}/task-lists/${listId}";
        $response = $this->patchJson($url, ['title' => 'testTitle']);
        $response->assertUnauthorized();

        // destroy
        $url =
            $this->routePrefix . "/task-boards/${boardId}/task-lists/${listId}";
        $response = $this->deleteJson($url);
        $response->assertUnauthorized();
    }

    /**
     * @test accessing other's data should be forbidden (403) by policies
     */
    public function test_forbidden_from_accessing_others_board()
    {
        Auth::login($this->guestUser);

        $otherBoard = TaskBoard::factory()
            ->for($this->otherUser)
            ->create();

        $otherBoardId = $otherBoard->id;

        $urlWithOtherBoard =
            $this->routePrefix . "/task-boards/${otherBoardId}/task-lists";

        // create
        $this->postJson($urlWithOtherBoard)->assertForbidden();
    }

    /**
     * @test other's data shouldn't be queried (404) by scoping routes
     */
    public function test_others_data_is_not_found()
    {
        Auth::login($this->guestUser);

        $otherBoard = TaskBoard::factory()
            ->for($this->otherUser)
            ->create();

        $otherList = TaskList::factory()
            ->for($this->otherUser)
            ->for($otherBoard)
            ->create();

        $authUserBoardId = $this->guestUser->taskBoards->first()->id;
        $authUserListId = $this->guestUser->taskLists->first()->id;
        $otherBoardId = $otherBoard->id;
        $otherListId = $otherList->id;

        $urlWithOtherBoard =
            $this->routePrefix .
            "/task-boards/${otherBoardId}/task-lists/${authUserListId}";

        $urlWithOtherList =
            $this->routePrefix .
            "/task-boards/${authUserBoardId}/task-lists/${otherListId}";

        // update
        $this->patchJson($urlWithOtherBoard)->assertNotFound();
        $this->patchJson($urlWithOtherList)->assertNotFound();

        // destroy
        $this->deleteJson($urlWithOtherBoard)->assertNotFound();
        $this->deleteJson($urlWithOtherList)->assertNotFound();
    }

    public function test_return_404_error_if_data_is_not_found()
    {
        $this->login($this->guestUser);

        /*
        |--------------------------------------------------------------
        | Non-existent `TaskBoard`
        |--------------------------------------------------------------
        */
        $boardId = (string) Str::uuid();
        $listId = $this->guestUser->taskBoards[0]->taskLists[0]->id;

        // update
        $url =
            $this->routePrefix . "/task-boards/${boardId}/task-lists/${listId}";
        $response = $this->patchJson($url, ['title' => 'testTitle']);
        $response->assertNotFound();

        // destroy
        $url =
            $this->routePrefix . "/task-boards/${boardId}/task-lists/${listId}";
        $response = $this->deleteJson($url);
        $response->assertNotFound();

        /*
        |--------------------------------------------------------------
        | Non-existent `TaskList`
        |--------------------------------------------------------------
        */
        $boardId = $this->guestUser->taskBoards[0]->id;
        $listId = (string) Str::uuid();

        // update
        $url =
            $this->routePrefix . "/task-boards/${boardId}/task-lists/${listId}";
        $response = $this->patchJson($url, ['title' => 'testTitle']);
        $response->assertNotFound();

        // destroy
        $url =
            $this->routePrefix . "/task-boards/${boardId}/task-lists/${listId}";
        $response = $this->deleteJson($url);
        $response->assertNotFound();
    }

    public function test_validate_request_when_created()
    {
        $this->login($this->guestUser);

        $boardId = $this->guestUser->taskBoards[0]->id;
        $url = $this->routePrefix . "/task-boards/${boardId}/task-lists";

        $emptyRequest = [];
        $response = $this->postJson($url, $emptyRequest);
        $response->assertStatus(422);

        // `title`
        $emptyRequest = ['title' => ''];
        $response = $this->postJson($url, $emptyRequest);
        $response->assertStatus(422);

        $tooLongRequest = ['title' => str_repeat('a', 255 + 1)];
        $response = $this->postJson($url, $tooLongRequest);
        $response->assertStatus(422);

        $successfulRequest = ['title' => str_repeat('亜', 255)];
        $response = $this->postJson($url, $successfulRequest);
        $response->assertStatus(201);

        // `description`
        $emptyRequest = $successfulRequest + ['description' => ''];
        $response = $this->postJson($url, $emptyRequest);
        $response->assertStatus(201);

        $tooLongRequest = $successfulRequest + [
            'description' => str_repeat('a', 2000 + 1),
        ];
        $response = $this->postJson($url, $tooLongRequest);
        $response->assertStatus(422);

        $successfulRequest = $successfulRequest + [
            'description' => str_repeat('亜', 2000),
        ];
        $response = $this->postJson($url, $successfulRequest);
        $response->assertStatus(201);
    }

    public function test_validate_request_when_updated()
    {
        $this->login($this->guestUser);

        $board = $this->guestUser->taskBoards[0];
        $boardId = $board->id;
        $listId = $board->taskLists[0]->id;
        $url =
            $this->routePrefix . "/task-boards/${boardId}/task-lists/${listId}";

        $emptyRequest = [];
        $response = $this->patchJson($url, $emptyRequest);
        $response->assertStatus(200);

        // `title`
        $emptyRequest = ['title' => ''];
        $response = $this->patchJson($url, $emptyRequest);
        $response->assertStatus(422);

        $tooLongRequest = ['title' => str_repeat('a', 255 + 1)];
        $response = $this->patchJson($url, $tooLongRequest);
        $response->assertStatus(422);

        $successfulRequest = ['title' => str_repeat('亜', 255)];
        $response = $this->patchJson($url, $successfulRequest);
        $response->assertStatus(200);

        // `description`
        $emptyRequest = ['description' => ''];
        $response = $this->patchJson($url, $emptyRequest);
        $response->assertStatus(200);

        $tooLongRequest = [
            'description' => str_repeat('a', 2000 + 1),
        ];
        $response = $this->patchJson($url, $tooLongRequest);
        $response->assertStatus(422);

        $successfulRequest = [
            'description' => str_repeat('亜', 2000),
        ];
        $response = $this->patchJson($url, $successfulRequest);
        $response->assertStatus(200);
    }

    public function test_data_is_deleted_successfully()
    {
        $this->login($this->guestUser);

        $board = $this->guestUser->taskBoards[0];
        $boardId = $board->id;
        $list = $board->taskLists[0];
        $listId = $list->id;
        $url =
            $this->routePrefix . "/task-boards/${boardId}/task-lists/${listId}";

        $listBeforeDeleted = TaskList::find($listId);
        $cardsBeforeDeleted = TaskCard::where('task_list_id', $listId)->get();
        $this->assertNotNull($listBeforeDeleted);
        $this->assertNotEmpty($cardsBeforeDeleted);

        $response = $this->deleteJson($url);
        $response->assertOk();

        $listAfterDeleted = TaskList::find($listId);
        $cardsAfterDeleted = TaskCard::where('task_list_id', $listId)->get();
        $this->assertNull($listAfterDeleted);
        $this->assertEmpty($cardsAfterDeleted);
    }
}

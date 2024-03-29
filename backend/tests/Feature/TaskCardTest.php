<?php

namespace Tests\Feature;

use App\Models\TaskBoard;
use App\Models\TaskCard;
use App\Models\TaskList;
use DateInterval;
use DateTime;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Tests\TestCase;

class TaskCardTest extends TestCase
{
    use RefreshDatabase;

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
        $listId = $this->taskList->id;
        $cardId = $this->taskCard->id;

        // create
        $url = $this->routePrefix . "/task-lists/${listId}/task-cards";
        $response = $this->postJson($url, ['title' => 'testTitle']);
        $response->assertUnauthorized();

        // update
        $url =
            $this->routePrefix . "/task-lists/${listId}/task-cards/${cardId}";
        $response = $this->patchJson($url, ['title' => 'testTitle']);
        $response->assertUnauthorized();

        // destroy
        $response = $this->deleteJson($url);
        $response->assertUnauthorized();
    }

    /**
     * @test accessing other's data should be forbidden (403) by policies
     */
    public function test_forbidden_from_accessing_others_list()
    {
        Auth::login($this->guestUser);

        $otherList = TaskList::factory()
            ->for($this->otherUser)
            ->for(TaskBoard::factory()->for($this->otherUser))
            ->create();

        $otherListId = $otherList->id;

        $urlWithOtherList =
            $this->routePrefix . "/task-lists/${otherListId}/task-cards";

        // create
        $this->postJson($urlWithOtherList)->assertForbidden();
    }

    /**
     * @test other's data shouldn't be queried (404) by scoping routes
     */
    public function test_others_data_is_not_found()
    {
        Auth::login($this->guestUser);

        $otherList = TaskList::factory()
            ->for($this->otherUser)
            ->for(TaskBoard::factory()->for($this->otherUser))
            ->create();

        $otherCard = TaskCard::factory()
            ->for($this->otherUser)
            ->for($otherList)
            ->create();

        $authUserListId = $this->guestUser->taskLists->first()->id;
        $authUserCardId = $this->guestUser->taskCards->first()->id;
        $otherListId = $otherList->id;
        $otherCardId = $otherCard->id;

        $urlWithOtherList =
            $this->routePrefix .
            "/task-lists/${otherListId}/task-cards/${authUserCardId}";

        $urlWithOtherCard =
            $this->routePrefix .
            "/task-lists/${authUserListId}/task-cards/${otherCardId}";

        // update
        $this->patchJson($urlWithOtherList)->assertNotFound();
        $this->patchJson($urlWithOtherCard)->assertNotFound();

        // destroy
        $this->deleteJson($urlWithOtherList)->assertNotFound();
        $this->deleteJson($urlWithOtherCard)->assertNotFound();
    }

    public function test_return_404_error_if_data_is_not_found()
    {
        $this->login($this->guestUser);

        /*
        |--------------------------------------------------------------
        | Non-existent `TaskList`
        |--------------------------------------------------------------
        */
        $listId = (string) Str::uuid();

        // create
        $url = $this->routePrefix . "/task-lists/${listId}/task-cards";
        $response = $this->postJson($url, ['title' => 'testTitle']);
        $response->assertNotFound();

        /*
        |--------------------------------------------------------------
        | Non-existent `TaskCard`
        |--------------------------------------------------------------
        */
        $listId = $this->taskList->id;
        $cardId = (string) Str::uuid();
        $url =
            $this->routePrefix . "/task-lists/${listId}/task-cards/${cardId}";

        // update
        $response = $this->patchJson($url, ['title' => 'testTitle']);
        $response->assertNotFound();

        // destroy
        $response = $this->deleteJson($url);
        $response->assertNotFound();
    }

    public function test_validate_request_when_created()
    {
        $this->login($this->guestUser);

        $listId = $this->taskList->id;
        $url = $this->routePrefix . "/task-lists/${listId}/task-cards";

        // `title`
        $emptyRequest = [];
        $response = $this->postJson($url, $emptyRequest);
        $response->assertStatus(422);

        $emptyRequest = ['title' => ''];
        $response = $this->postJson($url, $emptyRequest);
        $response->assertStatus(422);

        $tooLongRequest = ['title' => str_repeat('a', 255 + 1)];
        $response = $this->postJson($url, $tooLongRequest);
        $response->assertStatus(422);

        $successfulRequest = ['title' => str_repeat('亜', 255)];
        $response = $this->postJson($url, $successfulRequest);
        $response->assertStatus(201);

        // `content`
        $tooLongRequest = $successfulRequest + [
            'content' => str_repeat('a', 2000 + 1),
        ];
        $response = $this->postJson($url, $tooLongRequest);
        $response->assertStatus(422);

        $successfulRequest = $successfulRequest + [
            'content' => str_repeat('亜', 2000),
        ];
        $response = $this->postJson($url, $successfulRequest);
        $response->assertStatus(201);

        // `deadline`
        $now = new DateTime();

        $invalidFormatRequest = $successfulRequest + ['deadline' => 1546268400];
        $response = $this->postJson($url, $invalidFormatRequest);
        $response->assertStatus(422);

        $invalidFormatRequest = $successfulRequest + [
            'deadline' => '1546268400',
        ];
        $response = $this->postJson($url, $invalidFormatRequest);
        $response->assertStatus(422);

        $pastDateRequest = $successfulRequest + [
            'deadline' => $now->sub(new DateInterval('PT1S')),
        ];
        $response = $this->postJson($url, $pastDateRequest);
        $response->assertStatus(422);

        $currentDateRequest = $successfulRequest + ['deadline' => $now];
        $response = $this->postJson($url, $currentDateRequest);
        $response->assertStatus(422);

        $futureDateRequest = $successfulRequest + [
            'deadline' => $now->add(new DateInterval('PT1S')),
        ];
        $response = $this->postJson($url, $futureDateRequest);
        $response->assertStatus(422);
    }

    public function test_validate_request_when_updated()
    {
        $this->login($this->guestUser);

        $listId = $this->taskList->id;
        $cardId = $this->taskCard->id;
        $url =
            $this->routePrefix . "/task-lists/${listId}/task-cards/${cardId}";

        // `title`
        $emptyRequest = [];
        $response = $this->patchJson($url, $emptyRequest);
        $response->assertStatus(200);

        $emptyRequest = ['title' => ''];
        $response = $this->patchJson($url, $emptyRequest);
        $response->assertStatus(422);

        $tooLongRequest = ['title' => str_repeat('a', 255 + 1)];
        $response = $this->patchJson($url, $tooLongRequest);
        $response->assertStatus(422);

        $successfulRequest = ['title' => str_repeat('亜', 255)];
        $response = $this->patchJson($url, $successfulRequest);
        $response->assertStatus(200);

        // `content`
        $tooLongRequest = $successfulRequest + [
            'content' => str_repeat('a', 2000 + 1),
        ];
        $response = $this->patchJson($url, $tooLongRequest);
        $response->assertStatus(422);

        $successfulRequest = $successfulRequest + [
            'content' => str_repeat('亜', 2000),
        ];
        $response = $this->patchJson($url, $successfulRequest);
        $response->assertStatus(200);

        // `deadline`
        $now = new DateTime();

        $invalidFormatRequest = $successfulRequest + ['deadline' => 1546268400];
        $response = $this->patchJson($url, $invalidFormatRequest);
        $response->assertStatus(422);

        $invalidFormatRequest = $successfulRequest + [
            'deadline' => '1546268400',
        ];
        $response = $this->patchJson($url, $invalidFormatRequest);
        $response->assertStatus(422);

        $pastDateRequest = $successfulRequest + [
            'deadline' => $now->sub(new DateInterval('PT1S')),
        ];
        $response = $this->patchJson($url, $pastDateRequest);
        $response->assertStatus(422);

        $currentDateRequest = $successfulRequest + ['deadline' => $now];
        $response = $this->patchJson($url, $currentDateRequest);
        $response->assertStatus(422);

        $futureDateRequest = $successfulRequest + [
            'deadline' => $now->add(new DateInterval('PT1S')),
        ];
        $response = $this->patchJson($url, $futureDateRequest);
        $response->assertStatus(422);
    }

    public function test_data_is_deleted_successfully()
    {
        $this->login($this->guestUser);

        $listId = $this->taskList->id;
        $cardId = $this->taskCard->id;
        $url =
            $this->routePrefix . "/task-lists/${listId}/task-cards/${cardId}";

        $cardBeforeDeleted = TaskCard::find($cardId);
        $this->assertNotNull($cardBeforeDeleted);

        $response = $this->deleteJson($url);
        $response->assertOk();

        $cardAfterDeleted = TaskCard::find($cardId);
        $this->assertNull($cardAfterDeleted);
    }
}

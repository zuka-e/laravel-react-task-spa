<?php

namespace Tests\Feature;

use App\Models\TaskBoard;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class TaskBoardTest extends TestCase
{
    use RefreshDatabase; // DBリフレッシュ (`id`カラムの連番はリセットされない)

    // クラス定数
    const TOTAL_NUM_OF_TASKS = 21; // テスト環境で作成するデータの総量
    const TOTAL_NUM_OF_TASKS_PER_PAGE = 20; // アクション内paginateメソッドの引数

    public function setUp(): void
    {
        parent::setUp();

        TaskBoard::factory()->count(self::TOTAL_NUM_OF_TASKS_PER_PAGE)
            ->for($this->guestUser)->create();
    }

    public function test_unauthorized_unless_logged_in()
    {
        TaskBoard::factory()->for($this->otherUser)->create();

        // index
        $otherUserId = $this->otherUser->id;
        $url = $this->routePrefix . "/users/${otherUserId}/task-boards";
        $response = $this->getJson($url);

        $response->assertUnauthorized();

        // create
        $url = $this->routePrefix . "/users/${otherUserId}/task-boards";
        $response = $this->postJson($url, ['title' => 'testTitle']);

        $response->assertUnauthorized();

        // show
        $boardId = $this->guestUser->taskBoards()->first()->id;
        $url = $this->routePrefix . "/users/${otherUserId}/task-boards/${boardId}";
        $response = $this->getJson($url);

        $response->assertUnauthorized();

        // update
        $boardId = $this->guestUser->taskBoards()->first()->id;
        $url = $this->routePrefix . "/users/${otherUserId}/task-boards/${boardId}";
        $response = $this->patchJson($url, ['title' => 'testTitle']);

        $response->assertUnauthorized();

        // delete
        $boardId = $this->guestUser->taskBoards()->first()->id;
        $url = $this->routePrefix . "/users/${otherUserId}/task-boards/${boardId}";
        $response = $this->deleteJson($url);

        $response->assertUnauthorized();
    }

    public function test_forbidden_from_accessing_others_data()
    {
        TaskBoard::factory()->for($this->otherUser)->create();

        $this->login($this->guestUser);

        // index
        $otherUserId = $this->otherUser->id;
        $url = $this->routePrefix . "/users/${otherUserId}/task-boards";
        $response = $this->getJson($url);

        $response->assertForbidden();

        // create
        $url = $this->routePrefix . "/users/${otherUserId}/task-boards";
        $response = $this->postJson($url, ['title' => 'testTitle']);

        $response->assertForbidden();

        // show
        $boardId = $this->guestUser->taskBoards()->first()->id;
        $url = $this->routePrefix . "/users/${otherUserId}/task-boards/${boardId}";
        $response = $this->getJson($url);

        $response->assertForbidden();

        // update
        $boardId = $this->guestUser->taskBoards()->first()->id;
        $url = $this->routePrefix . "/users/${otherUserId}/task-boards/${boardId}";
        $response = $this->patchJson($url, ['title' => 'testTitle']);

        $response->assertForbidden();

        // delete
        $boardId = $this->guestUser->taskBoards()->first()->id;
        $url = $this->routePrefix . "/users/${otherUserId}/task-boards/${boardId}";
        $response = $this->deleteJson($url);

        $response->assertForbidden();
    }

    public function test_limited_items_in_one_page()
    {
        $this->login($this->guestUser);

        $userId = $this->guestUser->id;
        $url = $this->routePrefix . "/users/${userId}/task-boards";
        $response = $this->getJson($url);

        $response->assertJson(
            fn (AssertableJson $json) =>
            $json->has('meta') // JSONのkey有無をテスト
                ->has('links')
                ->has('data', self::TOTAL_NUM_OF_TASKS_PER_PAGE)
        );
    }

    public function test_sort_in_descending_order_by_updated_at()
    {
        $this->login($this->guestUser);

        $firstBoard = TaskBoard::factory()->for($this->guestUser)->create([
            'title' => 'first board title',
            'updated_at' => Carbon::now()->addDay(-1)
        ]);

        $userId = $this->guestUser->id;
        $url = $this->routePrefix . "/users/${userId}/task-boards?page=2";
        $response = $this->getJson($url); // 2ページ目

        $response->assertJson(fn (AssertableJson $json) => $json->has(
            'data.0',
            fn ($json) =>
            $json->where('id', $firstBoard->id)
                ->where('title', $firstBoard->title)
                ->etc()
        ));
    }

    public function test_validate_request_when_created()
    {
        $this->login($this->guestUser);

        $userId = $this->guestUser->id;
        $url = $this->routePrefix . "/users/${userId}/task-boards";

        $emptyRequest = [];
        $response = $this->postJson($url, $emptyRequest);
        $response->assertStatus(422);

        // `title`
        $emptyRequest = ['title' => ''];
        $response = $this->postJson($url, $emptyRequest);
        $response->assertStatus(422);

        $tooLongRequest = ['title' => str_repeat('a', floor(191 / 3) + 1)];
        $response = $this->postJson($url, $tooLongRequest);
        $response->assertStatus(422);

        $successfulRequest = ['title' => str_repeat('亜', floor(191 / 3))];
        $response = $this->postJson($url, $successfulRequest);
        $response->assertStatus(201);

        // description
        $emptyRequest = $successfulRequest + ['description' => ''];
        $response = $this->postJson($url, $emptyRequest);
        $response->assertStatus(201);

        $tooLongRequest = $successfulRequest + ['description' => str_repeat('a', floor(65535 / 3) + 1)];
        $response = $this->postJson($url, $tooLongRequest);
        $response->assertStatus(422);

        $successfulRequest = $successfulRequest + ['description' => str_repeat('亜', floor(65535 / 3))];
        $response = $this->postJson($url, $successfulRequest);
        $response->assertStatus(201);
    }

    public function test_validate_request_when_updated()
    {
        $this->login($this->guestUser);

        $userId = $this->guestUser->id;
        $boardId = $this->guestUser->taskBoards()->first()->id;
        $url = $this->routePrefix . "/users/${userId}/task-boards/${boardId}";

        $emptyRequest = [];
        $response = $this->patchJson($url, $emptyRequest);
        $response->assertStatus(200);

        // `title`
        $emptyRequest = ['title' => ''];
        $response = $this->patchJson($url, $emptyRequest);
        $response->assertStatus(422);

        $tooLongRequest = ['title' => str_repeat('a', floor(191 / 3) + 1)];
        $response = $this->patchJson($url, $tooLongRequest);
        $response->assertStatus(422);

        $successfulRequest = ['title' => str_repeat('亜', floor(191 / 3))];
        $response = $this->patchJson($url, $successfulRequest);
        $response->assertStatus(200);

        // description
        $emptyRequest = ['description' => ''];
        $response = $this->patchJson($url, $emptyRequest);
        $response->assertStatus(200);

        $tooLongRequest = ['description' => str_repeat('a', floor(65535 / 3) + 1)];
        $response = $this->patchJson($url, $tooLongRequest);
        $response->assertStatus(422);

        $successfulRequest = ['description' => str_repeat('亜', floor(65535 / 3))];
        $response = $this->patchJson($url, $successfulRequest);
        $response->assertStatus(200);

        // 'list_index_map' => 'array'
        $emptyRequest = ['list_index_map' => []];
        $response = $this->patchJson($url, $emptyRequest);
        $response->assertStatus(200);

        $camelcaseRequest = ['listIndexMap' => []];
        $response = $this->patchJson($url, $camelcaseRequest);
        $response->assertStatus(200);

        $successfulRequest = ['list_index_map' => ['uuid' => 1]];
        $response = $this->patchJson($url, $successfulRequest);
        $response->assertStatus(200);

        $successfulRequest = ['list_index_map' => ['uuid' => '1']];
        $response = $this->patchJson($url, $successfulRequest);
        $response->assertStatus(200);

        $successfulRequest = ['list_index_map' => ['uuid' => 1, 'UUID' => 1]];
        $response = $this->patchJson($url, $successfulRequest);
        $response->assertStatus(200);

        // 'card_index_map' => 'array'
        $emptyRequest = ['card_index_map' => []];
        $response = $this->patchJson($url, $emptyRequest);
        $response->assertStatus(200);

        $successfulRequest = ['card_index_map' => ['uuid' => 1]];
        $response = $this->patchJson($url, $successfulRequest);
        $response->assertStatus(200);

        $successfulRequest = ['card_index_map' => ['uuid' => '1']];
        $response = $this->patchJson($url, $successfulRequest);
        $response->assertStatus(200);

        $successfulRequest = ['card_index_map' => ['uuid' => 1, 'UUID' => 1]];
        $response = $this->patchJson($url, $successfulRequest);
        $response->assertStatus(200);
    }

    public function test_return_404_error_if_data_is_not_found()
    {
        $this->login($this->guestUser);

        $userId = $this->guestUser->id;
        $boardId = (string)Str::uuid();
        $url = $this->routePrefix . "/users/${userId}/task-boards/${boardId}";

        $successfulRequest = ['title' => str_repeat('!', 20)];
        $response = $this->patchJson($url, $successfulRequest);
        $response->assertNotFound();
    }

    public function test_data_is_deleted_successfully()
    {
        $this->login($this->guestUser);

        $userId = $this->guestUser->id;
        $boardId = $this->guestUser->taskBoards()->first()->id;
        $url = $this->routePrefix . "/users/${userId}/task-boards/${boardId}";

        $response = $this->deleteJson($url);
        $response->assertOk();
    }
}

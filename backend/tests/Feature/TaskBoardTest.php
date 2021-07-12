<?php

namespace Tests\Feature;

use App\Models\TaskBoard;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
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


    public function test_forbidden_from_displaying_others_data()
    {
        TaskBoard::factory()->for($this->otherUser)->create();

        $this->login($this->guestUser);

        // index
        $otherUserId = $this->otherUser->id;
        $url = $this->urlPrefix . "/users/${otherUserId}/task_boards";
        $response = $this->getJson($url);

        $response->assertForbidden();

        // show
        $boardId = $this->guestUser->taskBoards()->first()->id;
        $url = $this->urlPrefix . "/users/${otherUserId}/task_boards/${boardId}";
        $response = $this->getJson($url);

        $response->assertForbidden();
    }

    public function test_limited_items_in_one_page()
    {
        $this->login($this->guestUser);

        $userId = $this->guestUser->id;
        $url = $this->urlPrefix . "/users/${userId}/task_boards";
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
        $url = $this->urlPrefix . "/users/${userId}/task_boards?page=2";
        $response = $this->getJson($url); // 2ページ目

        $response->assertJson(fn (AssertableJson $json) => $json->has(
            'data.0',
            fn ($json) =>
            $json->where('id', $firstBoard->id)
                ->where('title', $firstBoard->title)
                ->etc()
        ));
    }
}

<?php

namespace Tests\Feature;

use App\Models\TaskCard;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class TaskCardTest extends TestCase
{
    use RefreshDatabase; // DBリフレッシュ

    public function setUp(): void
    {
        parent::setUp();
        $this->TOTAL_NUMBER_OF_TASKS = 21; // テスト環境で作成するデータの総量
        $this->TOTAL_NUMBER_OF_TASKS_IN_ONE_PAGE = 20; // アクション内paginateメソッドの引数
        $this->FIRST_USER = User::factory()->create(['id' => 1]); // TaskCardが属するUser

        TaskCard::factory()->count($this->TOTAL_NUMBER_OF_TASKS - 1)
            ->for($this->FIRST_USER)->create();
    }

    public function test_20_items_in_one_page()
    {
        $response = $this->get('/api/v1/users/1/task_cards');
        $response->assertJson(
            fn (AssertableJson $json) =>
            $json->has('meta') // JSONのkey有無をテスト
                ->has('links')
                ->has('data', $this->TOTAL_NUMBER_OF_TASKS_IN_ONE_PAGE)
        );
    }

    public function test_sort_in_descending_order()
    {
        $first_task = TaskCard::factory()->for($this->FIRST_USER)->create([
            'title' => 'first task title',
            'created_at' => Carbon::now()->addDay(-1)
        ]);

        $response = $this->get('/api/v1/users/1/task_cards?page=2'); // 2ページ目
        $response->assertJson(fn (AssertableJson $json) => $json->has(
            'data.0',
            fn ($json) =>
            $json->where('id', $first_task->id)
                ->where('title', $first_task->title)
                ->where('done', false)
                ->etc()
        ));
    }

    public function test_cannot_create_task_without_auth()
    {
        $user = $this->FIRST_USER;

        // 認証前
        $response = $this->postJson('/api/v1/users/1/task_cards', [
            'title' => 'test',
            'user_id' => $user->id
        ]);
        $response->assertUnauthorized(); // 401

        // ログイン処理
        // $this->get('/sanctum/csrf-cookie');
        $response = $this->postJson('api/login', [
            'email' => $user->email,
            'password' => 'password'
        ]);
        $response->assertOk(); // 200

        // 認証後
        $this->assertDatabaseMissing('task_cards', [
            'title' => 'authenticated',
            'user_id' => $user->id
        ]);

        $response = $this->postJson('/api/v1/users/1/task_cards', [
            'title' => 'authenticated',
            'user_id' => $user->id
        ]);
        $response->assertCreated(); // 201

        $this->assertDatabaseHas('task_cards', [
            'title' => 'authenticated',
            'user_id' => $user->id
        ]);
    }
}

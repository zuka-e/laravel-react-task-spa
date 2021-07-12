<?php

namespace Tests\Feature;

use App\Models\TaskCard;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class TaskCardTest extends TestCase
{
    // use RefreshDatabase; // DBリフレッシュ (`id`カラムの連番はリセットされない)

    // // クラス定数
    // const TOTAL_NUMBER_OF_TASKS = 21; // テスト環境で作成するデータの総量
    // const TOTAL_NUMBER_OF_TASKS_IN_ONE_PAGE = 20; // アクション内paginateメソッドの引数

    // // クラス変数
    // private static string $URL_PREFIX;
    // private static User $FIRST_USER;

    // private function login(User $user)
    // {
    //     $response = $this->postJson('api/login', [
    //         'email' => $user->email,
    //         'password' => 'password'
    //     ]);
    //     $response->assertOk(); // 200
    //     return $response;
    // }

    // public function setUp(): void
    // {
    //     parent::setUp();

    //     self::$URL_PREFIX = env('URL_PREFIX', '/api/v1');
    //     self::$FIRST_USER = User::factory()->create(); // TaskCardが属するUser

    //     TaskCard::factory()->count(self::TOTAL_NUMBER_OF_TASKS - 1)
    //         ->for(self::$FIRST_USER)->create();
    // }

    // public function test_20_items_in_one_page()
    // {
    //     $user = self::$FIRST_USER;

    //     // ログイン
    //     $this->login($user);

    //     $user_id = $user->id;
    //     $url = self::$URL_PREFIX . "/users/${user_id}/task_cards";
    //     $response = $this->getJson($url);
    //     $response->assertJson(
    //         fn (AssertableJson $json) =>
    //         $json->has('meta') // JSONのkey有無をテスト
    //             ->has('links')
    //             ->has('data', self::TOTAL_NUMBER_OF_TASKS_IN_ONE_PAGE)
    //     );
    // }

    // public function test_sort_in_descending_order()
    // {
    //     $user = self::$FIRST_USER;

    //     // ログイン
    //     $this->login($user);

    //     $first_task = TaskCard::factory()->for($user)->create([
    //         'title' => 'first task title',
    //         'created_at' => Carbon::now()->addDay(-1)
    //     ]);

    //     $user_id = $user->id;
    //     $url = self::$URL_PREFIX . "/users/${user_id}/task_cards?page=2";
    //     $response = $this->getJson($url); // 2ページ目
    //     $response->assertJson(fn (AssertableJson $json) => $json->has(
    //         'data.0',
    //         fn ($json) =>
    //         $json->where('id', $first_task->id)
    //             ->where('title', $first_task->title)
    //             ->where('done', false)
    //             ->etc()
    //     ));
    // }

    // public function test_cannot_create_task_without_auth()
    // {
    //     $user = self::$FIRST_USER;
    //     $user_id = self::$FIRST_USER->id;
    //     $url = self::$URL_PREFIX . "/users/${user_id}/task_cards";

    //     // 認証前
    //     $response = $this->postJson($url, [
    //         'title' => 'test',
    //         'user_id' => $user->id
    //     ]);
    //     $response->assertUnauthorized(); // 401

    //     // ログイン
    //     $this->login($user);

    //     // 認証後
    //     $this->assertDatabaseMissing('task_cards', [
    //         'title' => 'authenticated',
    //         'user_id' => $user->id
    //     ]);

    //     $response = $this->postJson($url, [
    //         'title' => 'authenticated',
    //         'user_id' => $user->id
    //     ]);
    //     $response->assertCreated(); // 201

    //     $this->assertDatabaseHas('task_cards', [
    //         'title' => 'authenticated',
    //         'user_id' => $user->id
    //     ]);
    // }

    // public function test_cannot_create_task_without_verificarion()
    // {
    //     $unverifiedUser = User::factory()->unverified()->create();
    //     $user = self::$FIRST_USER;
    //     $user_id = self::$FIRST_USER->id;
    //     $url = self::$URL_PREFIX . "/users/${user_id}/task_cards";

    //     // ログイン
    //     $this->login($unverifiedUser);

    //     // メール認証なし
    //     $response = $this->postJson($url, [
    //         'title' => 'verification required',
    //         'user_id' => Auth::user()->id
    //     ]);
    //     $response->assertForbidden(); // 403

    //     // 認証済みユーザーとしてログイン
    //     $this->actingAs($user);

    //     // メール認証あり
    //     $response = $this->postJson($url, [
    //         'title' => 'verification required',
    //         'user_id' => Auth::user()->id
    //     ]);
    //     $response->assertCreated(); // 201
    // }
}

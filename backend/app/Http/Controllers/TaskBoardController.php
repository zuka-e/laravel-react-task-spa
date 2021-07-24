<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskBoardCollection;
use App\Http\Resources\TaskBoardResource;
use App\Http\Resources\TaskListResource;
use App\Http\Resources\TaskCardResource;
use App\Models\TaskBoard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskBoardController extends Controller
{
    public function __construct(Request $request)
    {
        $userId = $request->route('user');

        // `Controller`の各メソッドに`User $user` or `string $user`が必要
        // パラメータ `{user}` を取得し、`middleware`に渡すため`
        $this->middleware("authorize:${userId}");
    }

    /**
     * @param string $user パラメータの値 (ユーザーID)
     */
    public function index(string $user)
    {
        return new TaskBoardCollection(
            TaskBoard::where('user_id', $user)->orderBy('updated_at', 'desc')->paginate(20)
        );
    }

    public function store(Request $request)
    {
        //
    }

    public function show(string $user, TaskBoard $taskBoard)
    {
        // `TaskBoardResource`に`lists`を追加することでこれを含めて返却するようにする
        $taskBoard->lists = TaskListResource::collection(
            $taskBoard->taskLists()->orderBy('updated_at', 'desc')->get()
        );

        // 以下で使用するため、事前にデータを取得しておく (無駄なクエリの大量発行を防止)
        $taskBoard->cards = TaskCardResource::collection(
            $taskBoard->taskCards()->orderBy('updated_at', 'desc')->get()
        );

        // `$taskBoard`の各`list`に所属する`cards`を設定する
        // `TaskListResource`に`cards`を追加することでこれを含めて返却するようにする
        foreach ($taskBoard->lists as $list) {
            $list->cards = [];
            foreach ($taskBoard->cards as $card) {
                if ($list->id === $card->task_list_id) {
                    $list->cards[] = $card;
                }
            }
        }

        return new TaskBoardResource($taskBoard);
    }

    public function update(Request $request, TaskBoard $taskBoard)
    {
        //
    }

    public function destroy(TaskBoard $taskBoard)
    {
        //
    }
}

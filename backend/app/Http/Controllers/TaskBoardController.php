<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskBoardRequest;
use App\Http\Resources\TaskBoardResource;
use App\Http\Resources\TaskListResource;
use App\Http\Resources\TaskCardResource;
use App\Models\TaskBoard;
use App\Models\User;

class TaskBoardController extends Controller
{
    public function __construct()
    {
        // > This method will attach the appropriate can middleware definitions
        // > to the resource controller's methods.
        // > https://laravel.com/docs/9.x/authorization#authorizing-resource-controllers
        /** @see \App\Policies\TaskBoardPolicy */
        $this->authorizeResource(TaskBoard::class);
    }

    /**
     * Display a listing of the resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     * @see https://laravel.com/docs/9.x/eloquent-resources#resource-collections
     */
    public function index(User $user)
    {
        return TaskBoardResource::collection(
            TaskBoard::where('user_id', $user->id)
                ->orderBy('updated_at', 'desc')
                ->paginate(20),
        );
    }

    /**
     * @param TaskBoardRequest $request - バリデーション付リクエスト
     * @see https://laravel.com/docs/8.x/validation#form-request-validation
     * */
    public function store(TaskBoardRequest $request, User $user)
    {
        $validated = $request->validated();

        /** @see https://laravel.com/docs/8.x/eloquent-relationships#updating-belongs-to-relationships */
        $newBoard = new TaskBoard($validated);
        $newBoard->user()->associate($user);

        if ($newBoard->save()) {
            return new TaskBoardResource($newBoard);
        }
    }

    /**
     * Display the specified resource.
     *
     * Be sure to specify the parameter `$user` with `\App\Models\User`,
     * and only the user's `TaskBoard` will be queried.
     * it's not used here, but is required for `scoped()` in the routing.
     *
     * @param  \App\Models\User  $user  For Scoping Resource Routes
     * @param  \App\Models\TaskBoard  $taskBoard
     * @return \App\Http\Resources\TaskBoardResource
     */
    public function show(User $user, TaskBoard $taskBoard)
    {
        // `TaskBoardResource`に`lists`を追加することでこれを含めて返却するようにする
        $taskBoard->lists = TaskListResource::collection(
            $taskBoard
                ->taskLists()
                ->orderBy('updated_at', 'desc')
                ->get(),
        );

        // 以下で使用するため、事前にデータを取得しておく (無駄なクエリの大量発行を防止)
        $taskBoard->cards = TaskCardResource::collection(
            $taskBoard
                ->taskCards()
                ->orderBy('updated_at', 'desc')
                ->get(),
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

    public function update(
        TaskBoardRequest $request,
        User $user,
        TaskBoard $taskBoard,
    ) {
        $validated = $request->validated();

        if ($taskBoard->fill($validated)->save()) {
            return new TaskBoardResource($taskBoard);
        }
    }

    public function destroy(User $user, TaskBoard $taskBoard)
    {
        if ($taskBoard->delete()) {
            return new TaskBoardResource($taskBoard);
        }
    }
}

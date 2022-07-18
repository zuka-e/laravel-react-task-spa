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
     * @see https://laravel.com/docs/9.x/eloquent-resources#pagination
     * @see https://laravel.com/docs/9.x/pagination
     */
    public function index(User $user)
    {
        return TaskBoardResource::collection(
            $user
                ->taskBoards()
                ->getQuery()
                ->orderBy('updated_at', 'desc')
                ->paginate(20)
                ->withQueryString(),
        );
    }

    /**
     * @param TaskBoardRequest $request - バリデーション付リクエスト
     * @see https://laravel.com/docs/8.x/validation#form-request-validation
     * */
    public function store(TaskBoardRequest $request, User $user)
    {
        $validated = $request->validated();
        /**
         * @var \App\Models\TaskBoard $created Newly created `TaskBoard` of user
         * @see https://laravel.com/docs/9.x/eloquent-relationships#the-create-method
         * `create()` fill the model with fillable attributes and save it.
         */
        $created = $user->taskBoards()->create($validated);

        if ($created->save()) {
            return new TaskBoardResource($created);
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
        return new TaskBoardResource(
            $taskBoard->load([
                // > When using this feature, you should always include
                // > the id column and any relevant foreign key columns
                // see: https://laravel.com/docs/9.x/eloquent-relationships#eager-loading-specific-columns
                'taskLists:id,user_id,task_board_id,title,description,created_at,updated_at',
                // Nested eager loading with specific columns can be used like this.
                // see: https://laravel.com/docs/9.x/eloquent-relationships#nested-eager-loading
                'taskLists.taskCards:*',
            ]),
        );
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

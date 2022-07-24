<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskListRequest;
use App\Http\Requests\UpdateTaskListRequest;
use App\Http\Resources\TaskListResource;
use App\Models\TaskBoard;
use App\Models\TaskList;
use Illuminate\Support\Facades\Auth;

class TaskListController extends Controller
{
    public function __construct()
    {
        // > This method will attach the appropriate can middleware definitions
        // > to the resource controller's methods.
        // > https://laravel.com/docs/9.x/authorization#authorizing-resource-controllers
        /** @see \App\Policies\TaskListPolicy */
        $this->authorizeResource(TaskList::class);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreTaskListRequest  $request
     * @param  \App\Models\TaskBoard  $taskBoard
     * @return \App\Http\Resources\TaskListResource
     */
    public function store(StoreTaskListRequest $request, TaskBoard $taskBoard)
    {
        /**
         * @var array<string, mixed> $validated Array of only validated data
         * @see https://laravel.com/docs/9.x/validation#working-with-validated-input
         */
        $validated = $request->validated();
        /**
         * @var \App\Models\TaskList $created Newly created `TaskList`
         * @see https://laravel.com/docs/9.x/eloquent-relationships#the-create-method
         * `create()` fill the model with fillable attributes and save it.
         */
        $created = $taskBoard->taskLists()->make($validated);
        $created->user()->associate(Auth::id());
        $created->save();

        return new TaskListResource($created);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateTaskListRequest  $request  Validation
     * @param  \App\Models\TaskBoard  $taskBoard  For Scoping Resource Routes
     * @param  \App\Models\TaskList  $taskList
     * @return \App\Http\Resources\TaskListResource
     */
    public function update(
        UpdateTaskListRequest $request,
        TaskBoard $taskBoard,
        TaskList $taskList,
    ) {
        /** @var array<string, mixed> $validated Array of only validated data */
        $validated = $request->validated();

        $taskList->fill($validated)->save();

        return new TaskListResource($taskList);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TaskBoard  $taskBoard  For Scoping Resource Routes
     * @param  \App\Models\TaskList  $taskList
     * @return \App\Http\Resources\TaskListResource
     */
    public function destroy(TaskBoard $taskBoard, TaskList $taskList)
    {
        $taskList->delete();

        return new TaskListResource($taskList);
    }
}

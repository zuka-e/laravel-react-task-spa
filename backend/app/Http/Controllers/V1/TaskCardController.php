<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskCardRequest;
use App\Http\Requests\UpdateTaskCardRequest;
use App\Http\Resources\TaskCardResource;
use App\Models\TaskCard;
use App\Models\TaskList;
use Illuminate\Support\Facades\Auth;

class TaskCardController extends Controller
{
    public function __construct()
    {
        // > This method will attach the appropriate can middleware definitions
        // > to the resource controller's methods.
        // > https://laravel.com/docs/9.x/authorization#authorizing-resource-controllers
        /** @see \App\Policies\TaskCardPolicy */
        $this->authorizeResource(TaskCard::class);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreTaskCardRequest  $request
     * @param  \App\Models\TaskList  $taskList
     * @return \App\Http\Resources\TaskCardResource
     */
    public function store(StoreTaskCardRequest $request, TaskList $taskList)
    {
        /**
         * @var array<string, mixed> $validated Array of only validated data
         * @see https://laravel.com/docs/9.x/validation#working-with-validated-input
         */
        $validated = $request->validated();
        /**
         * @var \App\Models\TaskCard $created Newly created `TaskCard`
         * @see https://laravel.com/docs/9.x/eloquent-relationships#the-create-method
         * `create()` fill the model with fillable attributes and save it.
         */
        $created = $taskList->taskCards()->make($validated);
        $created->user()->associate(Auth::id());
        $created->save();

        return new TaskCardResource($created);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateTaskCardRequest  $request  Validation
     * @param  \App\Models\TaskList  $taskList  For Scoping Resource Routes
     * @param  \App\Models\TaskCard  $taskCard
     * @return \App\Http\Resources\TaskCardResource
     */
    public function update(
        UpdateTaskCardRequest $request,
        TaskList $taskList,
        TaskCard $taskCard,
    ) {
        /** @var array<string, mixed> $validated Array of only validated data */
        $validated = $request->validated();

        isset($validated['list_id']) &&
            $taskCard->taskList()->associate($validated['list_id']);

        $taskCard->fill($validated)->save();

        return new TaskCardResource($taskCard);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TaskList  $taskList  For Scoping Resource Routes
     * @param  \App\Models\TaskCard  $taskCard
     * @return \App\Http\Resources\TaskCardResource
     */
    public function destroy(TaskList $taskList, TaskCard $taskCard)
    {
        $taskCard->delete();

        return new TaskCardResource($taskCard);
    }
}

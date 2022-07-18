<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskCardRequest;
use App\Http\Resources\TaskCardResource;
use App\Models\TaskCard;
use App\Models\TaskList;
use App\Models\User;
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

    public function index(User $user)
    {
        //
    }

    public function store(TaskCardRequest $request, TaskList $taskList)
    {
        $validated = $request->validated();
        /**
         * @var \App\Models\TaskCard $created Newly created `TaskCard`
         * @see https://laravel.com/docs/9.x/eloquent-relationships#the-create-method
         * `create()` fill the model with fillable attributes and save it.
         */
        $created = $taskList->taskCards()->make($validated);
        $created->user()->associate(Auth::id());

        if ($created->save()) {
            return new TaskCardResource($created);
        }
    }

    public function show(User $user, TaskCard $taskCard)
    {
        //
    }

    public function update(
        TaskCardRequest $request,
        TaskList $taskList,
        TaskCard $taskCard,
    ) {
        $validated = $request->validated();

        if (array_key_exists('list_id', $validated)) {
            $parent = TaskList::find($validated['list_id']);
            if (!$parent) {
                abort(500, '指定されたリストは存在しません');
            }

            $taskCard->taskList()->disassociate();
            $taskCard->taskList()->associate($parent);
        }

        if ($taskCard->fill($validated)->save()) {
            return new TaskCardResource($taskCard);
        }
    }

    public function destroy(TaskList $taskList, TaskCard $taskCard)
    {
        if ($taskCard->delete()) {
            return new TaskCardResource($taskCard);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskCardRequest;
use App\Http\Resources\TaskCardResource;
use App\Models\TaskCard;
use App\Models\TaskList;
use App\Models\User;

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
        $newCard = new TaskCard($validated);

        $newCard->user()->associate($taskList->taskBoard->user);
        $newCard->taskList()->associate($taskList);

        if ($newCard->save()) {
            return new TaskCardResource($newCard);
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

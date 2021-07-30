<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskCardRequest;
use App\Http\Resources\TaskCardResource;
use App\Models\TaskBoard;
use App\Models\TaskCard;
use App\Models\TaskList;
use App\Models\User;
use Illuminate\Http\Request;

class TaskCardController extends Controller
{
    public function __construct(Request $request)
    {
        $taskListId = $request->route('task_list');
        $taskList = TaskList::find($taskListId);

        $taskBoardId = $taskList ? $taskList->taskBoard->id : '';
        $taskBoard = TaskBoard::find($taskBoardId);

        $userId = $taskBoard ? $taskBoard->user_id : '';

        $this->middleware("authorize:${userId}");
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

        if ($newCard->save()) return new TaskCardResource($newCard);
    }


    public function show(User $user, TaskCard $taskCard)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TaskCard  $taskCard
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TaskCard $taskCard)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TaskCard  $taskCard
     * @return \Illuminate\Http\Response
     */
    public function destroy(TaskCard $taskCard)
    {
        //
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskListRequest;
use App\Http\Resources\TaskListResource;
use App\Models\TaskBoard;
use App\Models\TaskList;
use Illuminate\Http\Request;

class TaskListController extends Controller
{
    public function __construct(Request $request)
    {
        $taskBoardId = $request->task_board;
        $taskBoard = TaskBoard::find($taskBoardId);

        if (!$taskBoard) abort(404);

        $userId = $taskBoard->user_id;
        $this->middleware("authorize:${userId}");
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    public function store(TaskListRequest $request, TaskBoard $taskBoard)
    {
        $validated = $request->validated();
        $newList = new TaskList($validated);

        $newList->user()->associate($taskBoard->user);
        $newList->taskBoard()->associate($taskBoard);

        if ($newList->save()) return new TaskListResource($newList);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\TaskList  $taskList
     * @return \Illuminate\Http\Response
     */
    public function show(TaskList $taskList)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TaskList  $taskList
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TaskList $taskList)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TaskList  $taskList
     * @return \Illuminate\Http\Response
     */
    public function destroy(TaskList $taskList)
    {
        //
    }
}

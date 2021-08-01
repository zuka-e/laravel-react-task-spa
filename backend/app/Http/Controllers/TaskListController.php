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
        $taskBoardId = $request->route('task_board');
        $taskBoard = TaskBoard::find($taskBoardId);

        $userId = $taskBoard ? $taskBoard->user_id : '';

        $this->middleware("authorize:${userId}");

        $this->authorizeResource(TaskList::class, 'task_list');
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

    public function update(TaskListRequest $request, string $taskBoard, TaskList $taskList)
    {
        $validated = $request->validated();

        if ($taskList->fill($validated)->save())
            return new TaskListResource($taskList);
    }

    public function destroy(string $taskBoard, TaskList $taskList)
    {
        if ($taskList->delete()) return new TaskListResource($taskList);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskListRequest;
use App\Http\Resources\TaskListResource;
use App\Models\TaskBoard;
use App\Models\TaskList;

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

        if ($newList->save()) {
            return new TaskListResource($newList);
        }
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

    public function update(
        TaskListRequest $request,
        TaskBoard $taskBoard,
        TaskList $taskList,
    ) {
        $validated = $request->validated();

        if ($taskList->fill($validated)->save()) {
            return new TaskListResource($taskList);
        }
    }

    public function destroy(TaskBoard $taskBoard, TaskList $taskList)
    {
        if ($taskList->delete()) {
            return new TaskListResource($taskList);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\TaskBoard;
use Illuminate\Http\Request;

class TaskBoardController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\TaskBoard  $taskBoard
     * @return \Illuminate\Http\Response
     */
    public function show(TaskBoard $taskBoard)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TaskBoard  $taskBoard
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TaskBoard $taskBoard)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TaskBoard  $taskBoard
     * @return \Illuminate\Http\Response
     */
    public function destroy(TaskBoard $taskBoard)
    {
        //
    }
}

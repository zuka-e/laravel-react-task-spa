<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskCardCollection;
use App\Models\TaskCard;
use App\Models\User;
use Illuminate\Http\Request;

class TaskCardController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  \App\Models\User  $user  // Dependency Injection
     * => $user: パラメータの {user} を'id'として'User'から自動で取得
     * @return \Illuminate\Http\Response
     */
    public function index(User $user)
    {
        // カスタマイズされたJSONとして返却
        return new TaskCardCollection(
            TaskCard::where('user_id', $user->id)->orderBy('created_at', 'desc')->paginate(20)
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TaskCard  $taskCard  // DI
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $user, TaskCard $taskCard)
    {
        $taskCard->title = $request->title;
        $taskCard->user_id = $user;
        if ($taskCard->save()) return $taskCard;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\TaskCard  $taskCard
     * @return \Illuminate\Http\Response
     */
    public function show(User $user, TaskCard $taskCard)
    {
        // 自動取得した'taskCard'が '$user'に属するデータでなければ404エラー
        if ($taskCard->user_id != $user->id) {
            abort(404);
        }
        return $taskCard;
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

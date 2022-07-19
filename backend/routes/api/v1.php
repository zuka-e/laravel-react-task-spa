<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|------------------------------------------------------------------------------
| Authenticated routes being required login.
|------------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    /*
    |--------------------------------------------------------------------------
    | Authenticatd Users
    |--------------------------------------------------------------------------
    */

    Route::get('/users/auth', fn() => new UserResource(Auth::user()));

    Route::delete('/users/auth', function (Request $request) {
        $request->user()->delete();
        return response()->json([], 204);
    });

    /*
    |--------------------------------------------------------------------------
    | Tasks
    |--------------------------------------------------------------------------
    | https://laravel.com/docs/9.x/controllers#restful-scoping-resource-routes
    */

    Route::apiResource('users.task-boards', TaskBoardController::class)
        ->except([])
        ->scoped();

    Route::apiResource('task-boards.task-lists', TaskListController::class)
        ->only(['store', 'update', 'destroy', 'show'])
        ->scoped();

    Route::apiResource('task-lists.task-cards', TaskCardController::class)
        ->only(['store', 'update', 'destroy'])
        ->scoped();
});

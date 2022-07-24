<?php

namespace App\Http\Controllers\V1;

use Illuminate\Support\Facades\Route;

/*
|------------------------------------------------------------------------------
| Authenticated routes being required login.
|------------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
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

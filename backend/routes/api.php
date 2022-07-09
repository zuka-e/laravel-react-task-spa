<?php

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/home', fn() => Auth::user());

/*
|--------------------------------------------------------------
|  Version 1.0
|--------------------------------------------------------------
*/
Route::group(
    [
        'prefix' => 'v1',
        'namespace' => 'App\Http\Controllers',
        'middleware' => 'auth:sanctum',
    ],
    function () {
        /*
    |--------------------------------------------------------------
    | Auth
    |--------------------------------------------------------------
    */
        Route::get('/users/auth', fn() => new UserResource(Auth::user()));

        Route::delete('/users/auth', function (Request $request) {
            $request->user()->delete();
            return response()->json([], 204);
        });

        /*
    |--------------------------------------------------------------
    | Task
    |--------------------------------------------------------------
    */
        Route::apiResource('users.task-boards', TaskBoardController::class)
            ->except([])
            ->scoped();

        Route::apiResource('task-boards.task-lists', TaskListController::class)
            ->only(['store', 'update', 'destroy'])
            ->scoped();

        Route::apiResource('task-lists.task-cards', TaskCardController::class)
            ->only(['store', 'update', 'destroy'])
            ->scoped();
    },
);

/*
|--------------------------------------------------------------
| Not Found
|--------------------------------------------------------------
*/
Route::any('/{any?}', function ($any = null) {
    return response()->json(
        [
            'error' => [
                'title' => '404 Not Found',
                'message' => 'The requested URL was not found',
            ],
        ],
        404,
    );
})->where('any', '.*');

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

Route::get('/home', fn () => Auth::user());

/*
|--------------------------------------------------------------
|  Version 1.0
|--------------------------------------------------------------
*/
Route::group([
    'prefix' => 'v1',
    'namespace' => 'App\Http\Controllers',
    'middleware' => 'auth:sanctum'
], function () {

    /*
    |--------------------------------------------------------------
    | Auth
    |--------------------------------------------------------------
    */
    Route::get('/users/auth', fn () => new UserResource(Auth::user()));

    Route::delete('/users/auth', function (Request $request) {
        $request->usefr()->delete();
        return response()->json([], 204);
    });

    /*
    |--------------------------------------------------------------
    | Task
    |--------------------------------------------------------------
    */
    Route::group([
        'middleware' => 'verified'
    ], function () {
        Route::apiResource('users.task_boards', TaskBoardController::class)
            ->only('index', 'show');
    });
});

/*
|--------------------------------------------------------------
| Not Found
|--------------------------------------------------------------
*/
Route::any('/{any?}', function ($any = null) {
    return response()->json([
        'error' => [
            'title' => '404 Not Found',
            'message' => 'The requested URL was not found'
        ]
    ], 404);
})->where('any', '.*');

<?php

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

Route::group([
    'namespace' => 'App\Http\Controllers',
    'prefix' => 'v1',
], function () {
    Route::apiResource('users.task_cards', TaskCardController::class)
        ->only('index', 'show');
    Route::middleware('auth:sanctum')
        ->apiResource('users.task_cards', TaskCardController::class)
        ->only('store');
});

Route::any('/{any?}', function ($any = null) {
    return response()->json([
        'error' => [
            'title' => '404 Not Found',
            'message' => 'The requested URL was not found'
        ]
    ], 404);
})->where('any', '.*');

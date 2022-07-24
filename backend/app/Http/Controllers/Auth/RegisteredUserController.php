<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Http\Controllers\RegisteredUserController as Controller;

/**
 * It extends \Laravel\Fortify\Http\Controllers\RegisteredUserController
 */
class RegisteredUserController extends Controller
{
    /**
     * Delete the authenticated user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy()
    {
        Auth::user()->delete();

        return response()->json([], 204);
    }
}

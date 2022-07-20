<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    /**
     * Return the authenticated user or a welcome message
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return Auth::check()
            ? new UserResource(Auth::user())
            : response()->json([
                'message' => 'Welcome to ' . config('app.name'),
            ]);
    }
}

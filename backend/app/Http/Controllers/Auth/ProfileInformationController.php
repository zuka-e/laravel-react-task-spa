<?php

namespace App\Http\Controllers\Auth;

use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Http\Controllers\ProfileInformationController as Controller;

/**
 * It extends \Laravel\Fortify\Http\Controllers\ProfileInformationController
 */
class ProfileInformationController extends Controller
{
    /**
     * Display the authenticated user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function show()
    {
        return new UserResource(Auth::user());
    }
}

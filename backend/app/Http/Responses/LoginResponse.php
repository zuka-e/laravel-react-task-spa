<?php

namespace App\Http\Responses;

use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     * @see \Laravel\Fortify\Http\Responses\LoginResponse
     */
    public function toResponse($request)
    {
        return $request->wantsJson()
            ? response()->json([
                'user' => new UserResource(Auth::user()),
                'two_factor' => false,
            ])
            : redirect()->intended(config('fortify.home'));
    }
}

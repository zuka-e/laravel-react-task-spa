<?php

namespace App\Http\Responses;

use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\VerifyEmailResponse as VerifyEmailResponseContract;

class VerifyEmailResponse implements VerifyEmailResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     * @see \Laravel\Fortify\Http\Responses\VerifyEmailResponse
     */
    public function toResponse($request)
    {
        return new JsonResponse(['user' => new UserResource(Auth::user())]);
    }
}

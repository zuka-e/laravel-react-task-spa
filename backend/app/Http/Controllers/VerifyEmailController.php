<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Auth\Events\Verified;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Http\Requests\VerifyEmailRequest;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     *
     * @param  \Laravel\Fortify\Http\Requests\VerifyEmailRequest  $request
     * @return mixed
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     */
    public function __invoke(VerifyEmailRequest $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        // If already authenticated
        if ($user->hasVerifiedEmail()) {
            abort(403);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // 初回認証時
        return $request->wantsJson()
            ? response()->json([
                'user' => new UserResource(Auth::user()),
                'verified' => true,
            ])
            : redirect()->intended(config('fortify.home') . '?verified=1');
    }
}

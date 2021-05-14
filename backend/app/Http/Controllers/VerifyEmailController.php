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
     */
    public function __invoke(VerifyEmailRequest $request)
    {
        // `email_verified_at`が存在する場合
        if ($request->user()->hasVerifiedEmail()) {
            return $request->wantsJson() // 認証リンク遷移後にログインした場合`true`
                ? response()->json([
                    'user' => new UserResource(Auth::user()),
                    'verified' => true
                ])
                : redirect()->intended(config('fortify.home') . '?verified=1');
        }

        // `email_verified_at`を更新
        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        // 初回認証時
        return $request->wantsJson()
            ? response()->json([
                'user' => new UserResource(Auth::user()),
                'verified' => true
            ])
            : redirect()->intended(config('fortify.home') . '?verified=1');
    }
}

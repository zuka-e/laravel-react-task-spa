<?php

namespace App\Http\Controllers;

use App\Http\Responses\VerifyEmailResponse;
use Illuminate\Auth\Events\Verified;
use Illuminate\Routing\Controller;
use Laravel\Fortify\Http\Requests\VerifyEmailRequest;

/**
 * `\Laravel\Fortify\Http\Controllers\VerifyEmailController`
 * defined in `vendor/laravel/fortify/routes/routes.php`
 * is binded into this class in `FortifyServiceProvider`.
 *
 * @see \App\Providers\FortifyServiceProvider
 */
class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     *
     * @param  \Laravel\Fortify\Http\Requests\VerifyEmailRequest  $request
     * @return \App\Http\Responses\VerifyEmailResponse
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     * @see \Laravel\Fortify\Http\Controllers\VerifyEmailController
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

        return app(VerifyEmailResponse::class);
    }
}

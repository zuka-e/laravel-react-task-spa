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
     */
    public function toResponse($request)
    {
        // 認証メールリンクからのアクセスの場合
        $path = $request->session()->get('url.intended');
        if ($path) return redirect()->intended();

        // `vendor/laravel/fortify/src/Http/Responses/LoginResponse.php`転記
        return $request->wantsJson()
            ? response()->json([
                'user' => new UserResource(Auth::user()),
                'two_factor' => false
            ])
            : redirect()->intended(config('fortify.home'));
    }
}

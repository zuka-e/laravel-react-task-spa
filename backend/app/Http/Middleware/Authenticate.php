<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        // 認証メールリンクからのリダイレクトに使用 (クエリパラメータは飾り)
        if (!$request->expectsJson()) {
            $path = $request->session()->get('url.intended');
            $url = $path
                ? url(config('fortify.home') . '/login' . '?dest=' . $path)
                : url(config('fortify.home') . '/login');
            return $url;
        }
    }
}

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
     * @see \Illuminate\Auth\Middleware\Authenticate redirectTo
     */
    protected function redirectTo($request)
    {
        // There is no effect even if anything is implemented.
        // This is because `unauthenticated()` throws `AuthenticationException`,
        // the response is always returned as JSON by `shouldReturnJson()`.
        // Therefore, no redirect will occur.
        /**
         * @see \Illuminate\Auth\Middleware\Authenticate unautheticated
         * @see \App\Exceptions\Handler shouldReturnJson
         */
    }
}

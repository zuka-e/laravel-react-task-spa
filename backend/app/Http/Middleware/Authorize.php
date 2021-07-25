<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Authorize
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param string $userId - path parameter `{user}`
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $userId)
    {
        if ($userId !== Auth::id()) abort(403);

        return $next($request);
    }
}

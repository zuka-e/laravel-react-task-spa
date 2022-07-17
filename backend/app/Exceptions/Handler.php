<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Support\Arr;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

/** @see https://laravel.com/docs/9.x/errors */
class Handler extends ExceptionHandler
{
    /**
     * The default error messages corresponding to each error code.
     *
     * @var array<int, string>
     */
    public const HTTP_ERRORS = [
        400 => 'Bad Request',
        401 => 'Unauthorized',
        403 => 'Forbidden',
        404 => 'Not Found',
        419 => 'Page Expired',
        429 => 'Too Many Requests',
        500 => 'Internal Server Error',
        503 => 'Service Unavailable',
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Convert the given exception to an array.
     *
     * @param  \Throwable  $e
     * @return array
     */
    protected function convertExceptionToArray(Throwable $e)
    {
        // If no error message is specified, the default value will be set.
        // For example, `abort(403)` is handled like `abort(403, 'Forbidden')`.
        $message =
            $e instanceof HttpExceptionInterface
                ? ($e->getMessage() ?:
                self::HTTP_ERRORS[$e->getStatusCode()] ?? '')
                : 'Server Error';

        return config('app.debug')
            ? [
                'message' => $message,
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => collect($e->getTrace())
                    ->map(fn($trace) => Arr::except($trace, ['args']))
                    ->all(),
            ]
            : [
                'message' => $message,
            ];
    }

    /**
     * Determine if the exception handler response should be JSON.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $e
     * @return bool
     */
    protected function shouldReturnJson($request, Throwable $e)
    {
        // Only JSON should be returned, as this Laravel app is used as API server.
        return true;
    }
}

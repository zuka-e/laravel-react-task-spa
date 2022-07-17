<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use App\Http\Responses\RegisterResponse;
use App\Http\Responses\LoginResponse;
use App\Http\Controllers\VerifyEmailController as VerifyEmailControllerOverride;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Laravel\Fortify\Fortify;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Http\Controllers\VerifyEmailController;

/** @see \Laravel\Fortify\FortifyServiceProvider */
class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     * @see https://laravel.com/docs/9.x/container#binding-a-singleton
     */
    public function boot()
    {
        Fortify::ignoreRoutes();
        $this->configureRoutes();

        $this->app->singleton(
            RegisterResponseContract::class,
            RegisterResponse::class,
        );
        $this->app->singleton(
            LoginResponseContract::class,
            LoginResponse::class,
        );
        $this->app->singleton(
            VerifyEmailController::class,
            VerifyEmailControllerOverride::class,
        );

        Fortify::createUsersUsing(CreateNewUser::class);
        Fortify::updateUserProfileInformationUsing(
            UpdateUserProfileInformation::class,
        );
        Fortify::updateUserPasswordsUsing(UpdateUserPassword::class);
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);

        /*
        |----------------------------------------------------------------------
        | usage: https://laravel.com/docs/9.x/routing#attaching-rate-limiters-to-routes
        | see: `vendor/laravel/fortify/routes/routes.php`
        |----------------------------------------------------------------------
        */

        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->email . $request->ip());
        });

        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by(
                $request->session()->get('login.id'),
            );
        });
    }

    /**
     * Configure the routes offered by the application.
     *
     * @return void
     * @see \Laravel\Fortify\FortifyServiceProvider configureRoutes
     * @see \App\Providers\RouteServiceProvider
     */
    protected function configureRoutes()
    {
        Route::namespace('Laravel\Fortify\Http\Controllers')
            ->domain(config('fortify.domain', null))
            ->prefix(config('fortify.prefix'))
            ->group(base_path('routes/auth.php'));
    }
}

<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Lang;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        // 参考： `vendor/laravel/framework/src/Illuminate/Auth/Notifications/VerifyEmail.php`
        /** @see https://laravel.com/docs/8.x/verification#verification-email-customization */
        VerifyEmail::toMailUsing(function ($notifiable, $url) {
            return (new MailMessage())
                ->subject(Lang::get('Verify Your Email Address'))
                ->greeting(Lang::get('Thanks for registration'))
                ->line(
                    Lang::get(
                        'Please click the button below to verify your email address.',
                    ),
                )
                ->action(Lang::get('Verify Email Address'), $url)
                ->line(
                    Lang::get(
                        'If you did not create an account, no further action is required.',
                    ),
                )
                ->salutation(Lang::get('Regards.'));
        });

        // 参考： `vendor/laravel/framework/src/Illuminate/Auth/Notifications/ResetPassword.php`
        /** @see https://laravel.com/docs/8.x/passwords#password-customization */
        ResetPassword::toMailUsing(function ($notifiable, string $token) {
            $email = $notifiable->getEmailForPasswordReset();
            $queryParams = '?token=' . $token . '&email=' . $email;
            $url = env('SPA_URL') . '/reset-password' . $queryParams;

            return (new MailMessage())
                ->subject(Lang::get('Reset Password Notification'))
                ->greeting(
                    Lang::get(
                        'You are receiving this email because we received a password reset request for your account.',
                    ),
                )
                ->line(
                    Lang::get(
                        'Please click the button below for a password reset.',
                    ),
                )
                ->action(Lang::get('Reset Password'), $url)
                ->line(
                    Lang::get(
                        'This password reset link will expire in :count minutes.',
                        [
                            'count' => config(
                                'auth.passwords.' .
                                    config('auth.defaults.passwords') .
                                    '.expire',
                            ),
                        ],
                    ),
                )
                ->line(
                    Lang::get(
                        'If you did not request a password reset, no further action is required.',
                    ),
                )
                ->salutation(Lang::get('Regards.'));
        });
    }
}

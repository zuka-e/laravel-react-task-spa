<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as VerifyEmailNotification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Lang;

/**
 * This extends `\Illuminate\Auth\Notifications\VerifyEmail`.
 * As the document says, there is another way to customize the email verification,
 * which is implemented in `\App\Providers\AuthServiceProvider::boot()`.
 * But it's a little difficult to understand why that works.
 * That is why the class is required.
 *
 * @see https://laravel.com/docs/9.x/verification#verification-email-customization
 */
class VerifyEmail extends VerifyEmailNotification
{
    /**
     * Get the verify email notification mail message for the given URL.
     *
     * @param  string  $url
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    protected function buildMailMessage($url)
    {
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
    }
}

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
     * Build the mail representation of the notification.
     *
     * @param  \Illuminate\Foundation\Auth\User  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        // Because the response will always be returned as JSON
        // by `App\Exceptions\Handler::shouldReturnJson`,
        // the redirect to the login page is no logner works when not logged in.
        // Therefore, that behavior should be handled in the frontend.
        // So replace the link on the email with frontend URL (e.g. localhost:3000),
        // while the signed URL is created from backend URL (e.g. localhost).
        //
        // Instead of the above way, the relative signed URL can also be used.
        // For more infomation, see `verificationUrl()` commented out.

        /** @var array<string, string> Parsed verification URL */
        $url = parse_url($this->verificationUrl($notifiable));

        /** @var string Verification URL with frontend domain */
        $spaVericationUrl =
            config('fortify.home') . "{$url['path']}?{$url['query']}";

        return $this->buildMailMessage($spaVericationUrl);
    }

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

    /**
     * Get the relative verification URL for the given notifiable.
     *
     * To validate, use relative `ValidateSignature` middleware (`signed:relative`).
     *
     * @param  \Illuminate\Foundation\Auth\User  $notifiable
     * @return string
     * @see \App\Http\Kernel $routeMiddleware['signed'] ↓
     * @see \Illuminate\Routing\Middleware\ValidateSignature ↓
     * @see \Illuminate\Routing\UrlGenerator hasValidRelativeSignature
     * @see \Illuminate\Routing\UrlGenerator temporarySignedRoute
     */
    // protected function relativeVerificationUrl(User $notifiable)
    // {
    //     return URL::temporarySignedRoute(
    //         'verification.verify',
    //         Carbon::now()->addMinutes(
    //             Config::get('auth.verification.expire', 60),
    //         ),
    //         [
    //             'id' => $notifiable->getKey(),
    //             'hash' => sha1($notifiable->getEmailForVerification()),
    //         ],
    //         absolute: false,
    //     );
    // }
}

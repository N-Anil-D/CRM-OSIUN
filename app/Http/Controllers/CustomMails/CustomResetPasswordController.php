<?php

namespace App\Http\Controllers\CustomMails;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;
class CustomResetPasswordController extends ResetPassword
{
    public function toMail($notifiable)
    {
        return (new MailMessage)->from('no-reply@osius.nl', 'OSIUS CRM NOTIFICATION')
            ->subject('Osius CRM Reset Password Notification')
            ->line('You are receiving this email because we received a password reset request for your account.')
            ->action('Reset Password', url(config('app.url').route('password.reset', $this->token, false)))
            ->line('If you did not request a password reset, no further action is required.');
    }
}

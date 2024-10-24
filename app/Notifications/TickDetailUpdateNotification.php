<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class TickDetailUpdateNotification extends Notification
{
    use Queueable;

    protected $message;
    /**
     * Create a new notification instance.
     */
    public function __construct($message)
    {
        $this->message = $message;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Ticket Notification')
            ->line('Updated a ticket.')
            ->action('Show Ticket:', url('/tickets'))
            ->line('Ticket Message: ' . $this->notificationData);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'ticketUpdate' => $this->message,
        ];
    }

    public function toAbly($notifiable)
    {
        Log::info('channel name: '. $notifiable->id);
        return [
            'channel' => 'notifications:' . $notifiable->id,
            'message' => $this->notificationData
        ];
    }
}

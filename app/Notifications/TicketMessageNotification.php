<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Notifications\Messages\BroadcastMessage;

class TicketMessageNotification extends Notification
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
        return (new MailMessage) ->from('no-reply@osius.nl', 'OSIUS CRM NOTIFICATION')
        ->subject('Osius CRM Nieuw Meldingen Notification')
        ->line('Sended a new message by '. $this->message->userName . '.')
        ->action('Show Meldingen', url('/ticketdetail/'. $this->message->ticket_id))
        ->line('Message: ' . $this->message->Message);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => $this->message,
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

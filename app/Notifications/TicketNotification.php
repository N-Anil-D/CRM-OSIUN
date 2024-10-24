<?php

namespace App\Notifications;

use App\Models\Customers;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Notifications\Messages\BroadcastMessage;
use App\Models\Buildings;
use App\Models\File;
use Illuminate\Support\Facades\DB;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

class TicketNotification extends Notification
{
    use Queueable;

    protected $message;
    protected $userid;
    /**
     * Create a new notification instance.
     */
    public function __construct($message, $userid)
    {
        $this->message = $message;
        $this->userid = $userid;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast',];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'tickets' => $this->message,
        ];
    }

    public function toAbly($notifiable)
    {
        return [
            'channel' => 'notifications:' . $notifiable->id,
            'message' => $this->message
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => 'Yeni bir ticket oluşturuldu: ' . $this->message,
            'title' => 'Osius CRM',
        ]);
    }
    /**
     * Send Push Notification using WebPush and user targets
     */

}

<?php

namespace App\Channels;

use App\Models\User;
use Ably\AblyRest;
use Illuminate\Notifications\Notification;

class TicketNotificationChannel
{
    protected $ably;

    /**
     * Create a new channel instance.
     */
    public function __construct()
    {
        //
        $this->ably = new AblyRest(env('ABLY_API_KEY'));
    }

    /**
     * Authenticate the user's access to the channel.
     */
    public function send($notifiable, Notification $notification)
    {
        if (! $ablyNotification = $notification->toAbly($notifiable)) {
            return;
        }

        $this->ably->channels->get($ablyNotification['channel'])->publish('notification', $ablyNotification['message']);
    }
}

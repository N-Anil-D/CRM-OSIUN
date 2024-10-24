<?php

namespace App\Notifications;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Notifications\Messages\BroadcastMessage as LaravelBroadcastMessage;

class BroadcastMessage extends LaravelBroadcastMessage
{
    public function broadcastOn()
    {
// Bildirimin yayınlanacağı kanalı burada belirleyin
        return new Channel('notifications');
    }

    public function broadcastAs()
    {
// Bildirimin yayınlanma adını burada belirleyin
        return 'ticket_notification';
    }
}

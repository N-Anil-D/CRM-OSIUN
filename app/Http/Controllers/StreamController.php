<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\TicketNotification;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Notification;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StreamController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke()
    {
        /** @var User $user */
        $user = auth()->user();

        $response = new StreamedResponse(function () use ($user) {
//            while (true) {
//                $user->notifications()->unread()->each(function (DatabaseNotification $notification) {
//                    $notification->markAsRead();
//
//                    echo "data: " . json_encode($notification->toArray()) . "\n\n";
//                });
//
//                ob_flush();
//                flush();
//
//                sleep(1);
//            }
        });

        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('X-Accel-Buffering', 'no');
        $response->headers->set('Cache-Control', 'no-cache');
        $response->headers->set('Connection', 'keep-alive');

        return $response;
    }
}

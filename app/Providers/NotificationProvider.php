<?php

namespace App\Providers;

use Illuminate\Notifications\Notification;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\notifications;

class NotificationProvider extends ServiceProvider
{
    public function boot(): void
    {
        Inertia::share([
            // Bildirimler
            'tickets' => function () {
                return Auth::check() ? notifications::where('notifiable_id', Auth::user()->id)->where('type', 'App\Notifications\TicketNotification')->whereNull('read_at')->orderBy('created_at', 'desc')->get() : [];
            },
            'messages' => function () {
                return Auth::check() ? notifications::where('notifiable_id', Auth::user()->id)->where('type', 'App\Notifications\TicketMessageNotification')->whereNull('read_at')->orderBy('created_at', 'desc')->get() : [];
            },
        ]);
    }
}

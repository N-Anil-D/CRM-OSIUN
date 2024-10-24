<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Models\notifications;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use function Laravel\Prompts\error;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    public function getNotifications()
    {
        $user = Auth::user();
        $notis = notifications::where('notifiable_id', $user->id)->whereNull('read_at')->orderBy('id')->get();
        return response()->json($notis);
    }
    public function markAsRead($tickID)
    {
        try {
            $allNotifis = notifications::where('notifiable_id', Auth::user()->id)->whereNull('read_at')->orderBy('id')->get();
            foreach ($allNotifis as $notif) {
                $data = json_decode($notif->data, true);
                if(isset($data['tickets']) && $data['tickets']['id'] == $tickID) {
                    $notif->read_at = Carbon::now();
                    $notif->save();
                }elseif (isset($data['message']) && $data['message']['ticket_id'] == $tickID) {
                    $notif->read_at = Carbon::now();
                    $notif->save();
                }
            }
            return response()->json(['message' => 'Notification marked as read', 'ticket_id' => $tickID], 200);
        } catch (Exception $exception) {
            Log::error($exception);
            return response()->json(['message' => 'Invalid notification data', 'error' => $exception], 321);
        }

    }
}

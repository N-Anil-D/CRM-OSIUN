<?php

namespace App\Jobs;

use Ably\Auth;
use App\Models\Buildings;
use App\Models\Customers;
use App\Notifications\TicketMailers;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Ably\AblyRest;
use App\Notifications\TicketNotification;
use Illuminate\Notifications\Messages\MailMessage;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

class SendTicketNotifications implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $userIds;
    protected $notificationData;
    protected $sender;

    /**
     * Create a new job instance.
     */
    public function __construct(array $userIds, $notificationData, $sender)
    {
        //
        $this->userIds = $userIds;
        $this->notificationData = $notificationData;
        $this->sender = $sender;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Log::info('Ticket Store Jobundayım', ['sender' => $this->sender]);
            //UserIdleri kontrol edelim...
            if (!empty($this->userIds) && is_array($this->userIds)) {
                foreach ($this->userIds as $id) {
                    $user = User::where('id', $id)->first();
                    if ($user !== null && $user->email !== 'tom@b-amsterdam.com') {
                        $user->notify(new TicketMailers($this->notificationData, $id));
                    } else {
                        Log::info('SendNotificationsJob NOT completed. User can not find');
                    }
                }
            } else {
                Log::info('SendEmail NOT completed. User can not find');
            }

            //İlişkili kullanıcıları bulalım...
            $relatedCustomers = explode(';', $this->notificationData['customer']);
            $relatedLocations = explode(';', $this->notificationData['building']);
            if ($relatedCustomers[0] == 'ALL') {
                $relatedCustomers = Customers::all()->pluck('CustomerID')->toArray();
            }
            if ($relatedLocations[0] == '-1') {
                $relatedLocations = Buildings::all()->pluck('id')->toArray();
            }
            $relatedUsers = User::leftjoin('user_auth_customer',
                'users.id', '=', 'user_auth_customer.userid')
                ->leftJoin('user_auth_buildings',
                    'users.id', '=', 'user_auth_buildings.userid')
                ->where('users.bann', '!=', 1)
                ->where(function ($query) use ($relatedCustomers, $relatedLocations) {
                    $query->whereIn('customerid', $relatedCustomers)
                        ->orWhereIn('buildid', $relatedLocations);
                })
                ->orWhere(function ($query) {
                    $query->where('users.connectedCustomer', 'ALL')
                        ->where('users.connectedBuild', 'ALL');
                })
                ->groupBy('users.id')
                ->get(['users.id', 'users.name', 'users.profile_image_path']);

            if ($relatedUsers->count() > 0) {
                foreach ($relatedUsers as $user) {
                    if ($user->id == $this->sender['id']) continue;
                    $apiKey = env('ABLY_KEY');
                    $channelName = 'notification:' . $user->id;
                    $eventName = 'ticket';

                    $ably = new AblyRest($apiKey);
                    $channel = $ably->channel($channelName);
                    $channel->publish($eventName, ['ticket' => $this->notificationData]);
                    $user->notify(new TicketNotification($this->notificationData, $user->id));
                }
            }

            $this->sendPushNotification($relatedUsers);
        } catch (Exception $exception) {
            Log::error($exception);
        }
    }

    public function sendPushNotification($alicilar)
    {
        $aliciIds = $alicilar->pluck('id');
        Log::info('sendPushNotification called', ['aliciIds' => $aliciIds]);
        $subscriptions = DB::table('push_subscriptions')
            ->whereIn('push_subscriptions.user_id', $aliciIds)
            ->select('push_subscriptions.*')
            ->get();
        Log::info('sendPushNotification subscriptions', ['subscriptions' => $subscriptions]);
        // WebPush ayarları
        $webPush = new WebPush([
            'VAPID' => [
                'subject' => 'mailto:no-reply@osius.nl',
                'publicKey' => env('VAPID_PUBLIC_KEY'),
                'privateKey' => env('VAPID_PRIVATE_KEY'),
            ],
        ]);
        Log::info('sendPushNotification Vapids', ['vapids' => $webPush]);
        // Bildirim gönderme
        foreach ($subscriptions as $subscription) {

            if ($subscription->user_id == $this->sender['id']) continue;
            $sub = Subscription::create([
                'endpoint' => $subscription->endpoint,
                'keys' => [
                    'p256dh' => $subscription->public_key,
                    'auth' => $subscription->auth_token,
                ],
            ]);

            $webPush->queueNotification($sub, json_encode([
                'title' => 'Osius CRM',
                'body' => 'Yo have a new Ticket. Please check your panel', // Bildirimin içeriği
            ]));
            Log::info('sendPushNotification meraktan', ['data' => $webPush]);
        }
        try {
            $webPush->flush();
        } catch (Exception $e) {
            Log::error('Push Notification Error', ['error' => $e->getMessage()]);
        }
    }
}

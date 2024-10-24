<?php

namespace App\Jobs;

use Ably\AblyRest;
use App\Models\User;
use App\Notifications\TicketMessageNotification;
use App\Notifications\TicketReactNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class TicketReactNotificationSender implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $userIds;
    protected $notificationData;

    /**
     * Create a new job instance.
     */
    public function __construct(array $userIds, $notificationData)
    {
        //
        $this->userIds = $userIds;
        $this->notificationData = $notificationData;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {

        try {
            if (empty($this->userIds) || !is_array($this->userIds)) {
                Log::error('SendMessageNotificationsJob NOT completed. Array was empty');
                return;
            }
            $sendlog = "";
            foreach ($this->userIds as $id) {
                $user = User::where('id', $id)->first();
                if ($user !== null) {
                    $apiKey = env('ABLY_KEY');
                    $channelName = 'notification:' . $user->id;
                    $eventName = 'reaction';

                    $ably = new AblyRest($apiKey);
                    $channel = $ably->channel($channelName);
                    $channel->publish($eventName, ['reaction' => $this->notificationData]);

                    $user->notify(new TicketReactNotification($this->notificationData));
                    $sendlog .= $user->name . ", ";
                } else {
                    Log::error('SendMessageNotificationsJob NOT completed. User was empty');
                }
            }
            Log::info('SendMessageNotificationsJob completed' . $sendlog);
        } catch (Exception $exception) {
            Log::error($exception);
        }
    }
}

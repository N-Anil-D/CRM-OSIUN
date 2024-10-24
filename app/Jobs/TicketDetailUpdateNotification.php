<?php

namespace App\Jobs;

use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use Ably\AblyRest;
use App\Notifications\TickDetailUpdateNotification;

class TicketDetailUpdateNotification implements ShouldQueue
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
            Log::info('SendNotificationsJob started', ['userIds' => $this->userIds, 'notificationData' => $this->notificationData]);
            if (empty($this->userIds) || !is_array($this->userIds)) {
                Log::info('SendNotificationsJob NOT completed. Array was empty');
                return;
            }
            $sendlog = "";
            foreach ($this->userIds as $id) {
                try {
                    $user = User::where('id', $id)->first();
                    if ($user !== null) {
                        $apiKey = env('ABLY_KEY');
                        $channelName = 'notification:'. $user->id;
                        $eventName = 'ticketUpdates';

                        $ably = new AblyRest($apiKey);
                        $channel = $ably->channel($channelName);
                        $channel->publish($eventName, ['ticketUpdates' => $this->notificationData]);

                        $user->notify(new TickDetailUpdateNotification($this->notificationData));
                        $sendlog .= $user->name . ", ";
                    }else { Log::info('SendNotificationsJob NOT completed. User was empty');}
                }catch (Exception $ex) {
                    Log::error($ex);
                }
            }
            Log::info('SendNotificationsJob completed'. $sendlog);
        } catch (Exception $exception) {
            Log::error($exception);
        }
    }
}

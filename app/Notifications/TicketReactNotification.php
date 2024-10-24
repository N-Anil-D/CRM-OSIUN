<?php

namespace App\Notifications;

use App\Models\Buildings;
use App\Models\Customers;
use App\Models\File;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use App\Models\ticket_reacts;

class TicketReactNotification extends Notification
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
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        try {
            $allReacts = ticket_reacts::where('ticket_id', $this->message->react->ticket_id)->where('id', '!=', $this->message->react->id)->limit(3)->orderByDesc('created_at')->get();

            $rows = $allReacts->map(function ($react) {
                return [
                    $react->evaluator_persons,
                    $react->react_text,
                    $react->before_status,
                    $react->after_status,
                    $react->created_at,
                ];
            })->toArray();

            $mailMessage = (new MailMessage)
                ->from('no-reply@osius.nl', 'OSIUS CRM')
                ->subject('Osius CRM - Melding Status Gewijzigd')
                ->view('emails.reacts', [
                    'react' => $this->message->react,
                    'rows' => $rows,
                    'url' => url('/ticketdetail/' . $this->message->ticket->id)
                ]);

            if (isset($this->message->files)) {
                foreach ($this->message->files as $file) {
                    $filePath = public_path('/uploads/' . $file->id . '/' . $file->filename);
                    Log::info($filePath);
                    if (file_exists($filePath) && is_readable($filePath)) {
                        $mailMessage->attach($filePath, [
                            'as' => $file->name ?? basename($filePath),
                            'mime' => $file->mime_type ?? mime_content_type($filePath),
                        ]);
                    } else {
                        Log::error("File does not exist or is not readable: " . $filePath);
                    }
                }
            }

            return $mailMessage;
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return (new MailMessage)
                ->from('no-reply@osius.nl', 'OSIUS CRM')
                ->subject('Osius CRM - Fout bij verzenden van melding')
                ->line('Er is een fout opgetreden bij het verzenden van de melding.');
        }
    }


    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'react' => $this->message,
        ];
    }

    public function toAbly($notifiable)
    {
        return [
            'channel' => 'notifications:' . $notifiable->id,
            'message' => $this->notificationData
        ];
    }
}

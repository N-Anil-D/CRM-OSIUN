<?php

namespace App\Notifications;

use App\Models\Buildings;
use App\Models\Customers;
use App\Models\File;
use App\Models\CustomerAsignedLocations;
use App\Models\user_auth_customer;
use App\Models\user_auth_buildings;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class TicketMailers extends Notification
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
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        Log::info('toMail Started');
        $meldingAddedBuilds = explode(';', $this->message->building);
        $meldingAddedKlants = explode(';', $this->message->customer);

        $locatieQuery = Buildings::query();
        $klantQuery = Customers::query();

        if ($meldingAddedKlants[0] != 'ALL') {
            $asignedCustomers = user_auth_customer::where('userid', $this->userid)->groupBy('customerid')->pluck('customerid');
            if (!$asignedCustomers->isEmpty())
                $klantQuery->whereIn('CustomerID', $asignedCustomers);

            $klantQuery->whereIn('CustomerID', $meldingAddedKlants);
        } else {
            $asignedCustomers = user_auth_customer::where('userid', $this->userid)->groupBy('customerid')->pluck('customerid');
            Log::info('Bu infoyu görmeliyim.', ['userid' => $this->userid, 'data' => $asignedCustomers]);
            if (!$asignedCustomers->isEmpty())
                $klantQuery->whereIn('CustomerID', $asignedCustomers);
        }
        $klantQuery->where('passive', 'false');
        Log::info('klantQuery', ['query' => $klantQuery->toRawSql()]);
        $customers = $klantQuery->get();
        $customerUnvanlari = $customers->pluck('Unvan')->toArray();
        Log::info('Mail selected Customers', ['customers' => $customerUnvanlari]);
        $klantNames = implode(', ', $customerUnvanlari);
        $klanIDs = $customers->pluck('CustomerID');

        if ($meldingAddedBuilds[0] == '-1') {
            $relatedLocatieIds = CustomerAsignedLocations::whereIn('customerid', $klanIDs)->groupBy('locationid')->pluck('locationid');
            $authedLocaitons = user_auth_buildings::where('userid', $this->userid)->whereIn('buildid', $relatedLocatieIds)->groupBy('buildid')->get('buildid');
            if (!empty($authedLocaitons) && !empty($relatedLocatieIds))
                $locatieQuery->whereIn('id', $authedLocaitons);
        } else {
            $locatieQuery->whereIn('id', $meldingAddedBuilds);
        }
        $locatie = $locatieQuery->pluck('BuildingName')->toArray();
        Log::info('locaiteQuery', ['query' => $locatieQuery->toRawSql()]);
        $locatieNames = implode(', ', $locatie);

        $mailMessage = (new MailMessage)
            ->from('no-reply@osius.nl', 'OSIUS CRM NOTIFICATION')
            ->subject('Osius CRM Nieuw Meldingen')
            ->line($this->message->opener_name . ' heeft een nieuwe melding aangemaakt.')
            ->line('Klant: ' . $klantNames)
            ->line('Locatie: ' . $locatieNames)
            ->line('Melding Datum: ' . $this->message->created_at)
            ->line('Melding ID: ' . $this->message->id)
            ->line('Meldingtype: ' . $this->message->ticket_type)
            ->line('Melding: ' . $this->message->title)
            ->line('Omschrijving: ' . $this->message->ticketsubject)
            ->action('Show Meldingen', url('/ticketdetail/' . $this->message->id));

        $files = File::where('ticket_id', $this->message->id)->get();

        foreach ($files as $file) {
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
        return $mailMessage;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}

<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Jobs\MessageNotifications;
use App\Jobs\SendTicketNotifications;
use App\Jobs\TicketDetailUpdateNotification;
use App\Jobs\TicketReactNotificationSender;
use App\Models\File;
use App\Models\notifications;
use App\Models\TicketsMesages;
use App\Models\user_auth_customer;
use App\Notifications\TicketNotification;
use App\Notifications\TicketReactNotification;
use DateTime;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Auth\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Tickets;
use App\Models\Buildings;
use App\Models\rooms;
use App\Models\Customers;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use stdClass;
use Throwable;
use App\Models\ticket_reacts;

class TicketController extends Controller
{
    public function statusupdate($newstatus, $ticketId)
    {
        $ticked = Tickets::findorfail($ticketId);
        $ticked->status = $newstatus;
        $ticked->save();
        return response()->json([$ticked]);
    }

    public function view()
    {
        $user = Auth::user();
        $userName = $user->name;

        $buildingsQuery = Buildings::query();
        if ($user->connectedBuild !== 'ALL') {
            // Kullanıcı yetkili olduğu bina verilerine erişmek istiyor
            $buildingsQuery->join('user_auth_buildings', 'buildings.id', '=', 'user_auth_buildings.buildid')
                ->where('user_auth_buildings.userid', $user->id);
        }
        $buildingler = $buildingsQuery->select('buildings.*')->get();
        $customerQuery = Customers::query();
        if ($user->connectedCustomer !== 'ALL') {
            $customerQuery->join('user_auth_customer', 'customers.CustomerID', '=', 'user_auth_customer.customerid')
                ->where('user_auth_customer.userid', $user->id);
        }
        $customers = $customerQuery->with('assignedLocations')->get();
        Log::info('customers', [$customers]);
        $relatedCustomers = $customerQuery->pluck('customers.CustomerID');
        $relatedBuilds = $buildingler->pluck('id');
        $otherusers = \App\Models\User::leftjoin('user_auth_customer',
            'users.id', '=', 'user_auth_customer.userid')
            ->leftJoin('user_auth_buildings',
                'users.id', '=', 'user_auth_buildings.userid')
            ->where('users.id', '!=', $user->id)
            ->where('users.bann', '!=', 1)
            ->where(function ($query) use ($relatedCustomers, $relatedBuilds) {
                $query->whereIn('customerid', $relatedCustomers)
                    ->orwhereIn('buildid', $relatedBuilds);
            })
            ->get(['users.id', 'users.name', 'roleName', 'users.profile_image_path', 'user_auth_buildings.buildid', 'user_auth_customer.customerid']);

        $locationIDs = [];
        $clientIDs = [];
        if ($user->connectedBuild !== 'ALL') {
            $locationIDs = $buildingler->pluck('id')->toArray();
            $locationIDs[] = '-1';
        }
        if ($user->connectedCustomer !== 'ALL') {
            $clientIDs = $customers->pluck('CustomerID')->toArray();
            $clientIDs[] = 'ALL';
        }
        $ticketsData = Tickets::where('delete', 0)
            ->where(function ($query) use ($clientIDs) {
                if (!empty($clientIDs)) {
                    $query->whereIn('customer', $clientIDs);
                }
            })
            ->where(function ($query) use ($locationIDs) {
                if (!empty($locationIDs)) {
                    $query->whereIn('building', $locationIDs);
                }
            })
            ->orderBy('id', 'desc')
            ->get();
        $roomlar = collect();
        foreach ($buildingler as $building) {
            $roomlar = $roomlar->merge(rooms::where('building_id', $building->id)->orderby('id', 'desc')->get());
        }

        $notifications = notifications::where('notifiable_id', $user->id);
        return Inertia::render('Tickets', ['ticketsData' => $ticketsData, 'customers' => $customers,
            'buildingler' => $buildingler, 'roomlar' => $roomlar, 'otherusers' => $otherusers, 'notifications' => $notifications]);
    }

    public function index()
    {
        $data = Tickets::where("delete", 0)->get();
        return response()->json($data);
    }

    function detailIndexDataPreps($ticketid)
    {
        try {
            $user = Auth::user();
            $ticket = Tickets::where('id', $ticketid)->first();

            $customerQuery = Customers::query();
            if ($ticket->customer !== 'ALL')
                $customerQuery->where('CustomerID', $ticket->customer);
            $client = $customerQuery->where('passive', 0)->get();

            $buildingsQuery = Buildings::query();
            if ($ticket->building !== '-1')
                $buildingsQuery->where('id', $ticket->building);
            $currentLocation = $buildingsQuery->where('passive', 0)->get();

            $files = File::where('ticket_id', $ticketid)->get();
            $ticketmessages = TicketsMesages::leftJoin('files', 'tickets_mesages.id', '=', 'files.message_id')
                ->select(
                    'tickets_mesages.*',
                    DB::raw('JSON_ARRAYAGG(JSON_OBJECT("id", "files.id", "filename", files.filename, "media_id", files.media_id, "mime_type", files.mime_type)) as files')
                )
                ->where("tickets_mesages.ticket_id", $ticketid)
                ->groupBy('tickets_mesages.id')
                ->orderBy('tickets_mesages.created_at')
                ->get();
            $ticketreacts = ticket_reacts::leftJoin('files', 'ticket_reacts.id', '=', 'files.react_id')
                ->select(
                    'ticket_reacts.*',
                    DB::raw('JSON_ARRAYAGG(
            JSON_OBJECT(
                "id", files.id,
                "filename", files.filename,
                "media_id", files.media_id,
                "mime_type", files.mime_type
            )
        ) as files')
                )
                ->where("ticket_reacts.ticket_id", $ticketid)
                ->groupBy('ticket_reacts.id')
                ->orderByDesc('ticket_reacts.created_at')
                ->get();

            Log::info($ticketreacts);
            $relatedCustomers = $customerQuery->pluck('CustomerID');
            $relatedLocations = $buildingsQuery->pluck('id');
            $otherusers = \App\Models\User::leftjoin('user_auth_customer',
                'users.id', '=', 'user_auth_customer.userid')
                ->leftJoin('user_auth_buildings',
                    'users.id', '=', 'user_auth_buildings.userid')
                ->where('users.id', '!=', $user->id)
                ->where('users.bann', '!=', 1)
                ->where(function ($query) use ($relatedCustomers, $relatedLocations) {
                    $query->whereIn('customerid', $relatedCustomers)
                        ->orWhereIn('buildid', $relatedLocations);
                })
                ->get(['users.id', 'users.name', 'users.profile_image_path', 'user_auth_buildings.buildid', 'user_auth_customer.customerid']);

            return response()->json(['ticket' => $ticket, 'clients' => $client, 'locations' => $currentLocation,
                'files' => $files, 'ticketmessages' => $ticketmessages, 'otherUsers' => $otherusers, 'ticketreacts' => $ticketreacts]);
        } catch (ModelNotFoundException $e) {
            Log::error(['error' => 'Medewerker not found.', 'rawError' => $e->getMessage()]);
            return response()->json(['error' => 'Medewerker not found.'], 404);
        } catch (QueryException $e) {
            Log::error(['error' => 'Database error: ' . $e->getMessage()]);
            return response()->json(['error' => 'Database error: ' . $e->getMessage()], 500);
        } catch (Exception $e) {
            Log::error(['error' => 'An unexpected error occurred: ' . $e->getMessage()]);
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }

    }

    public function detailindex($ticketid)
    {
        $user = Auth::user();
        $ticket = Tickets::where('id', $ticketid)->first();

        $customerQuery = Customers::query();
        if ($ticket->customer !== 'ALL')
            $customerQuery->where('CustomerID', $ticket->customer);
        $client = $customerQuery->where('passive', 0)->get();

        $buildingsQuery = Buildings::query();
        if ($ticket->building !== '-1')
            $buildingsQuery->where('id', $ticket->building);
        $currentLocation = $buildingsQuery->where('passive', 0)->get();

        $files = File::where('ticket_id', $ticketid)->get();
        $ticketmessages = TicketsMesages::leftJoin('files', 'tickets_mesages.id', '=', 'files.message_id')
            ->select(
                'tickets_mesages.*',
                DB::raw('JSON_ARRAYAGG(JSON_OBJECT("id", "files.id", "filename", files.filename, "media_id", files.media_id, "mime_type", files.mime_type)) as files')
            )
            ->where("tickets_mesages.ticket_id", $ticketid)
            ->groupBy('tickets_mesages.id')
            ->orderBy('tickets_mesages.created_at')
            ->get();
        $ticketreacts = ticket_reacts::leftJoin('files', 'ticket_reacts.id', '=', 'files.react_id')
            ->select(
                'ticket_reacts.*',
                DB::raw('JSON_ARRAYAGG(
            JSON_OBJECT(
                "id", files.id,
                "filename", files.filename,
                "media_id", files.media_id,
                "mime_type", files.mime_type
            )
        ) as files')
            )
            ->where("ticket_reacts.ticket_id", $ticketid)
            ->groupBy('ticket_reacts.id')
            ->orderByDesc('ticket_reacts.created_at')
            ->get();

        Log::info($ticketreacts);
        $relatedCustomers = $customerQuery->pluck('CustomerID');
        $relatedLocations = $buildingsQuery->pluck('id');
        $otherusers = \App\Models\User::leftjoin('user_auth_customer',
            'users.id', '=', 'user_auth_customer.userid')
            ->leftJoin('user_auth_buildings',
                'users.id', '=', 'user_auth_buildings.userid')
            ->where('users.id', '!=', $user->id)
            ->where('users.bann', '!=', 1)
            ->where(function ($query) use ($relatedCustomers, $relatedLocations) {
                $query->whereIn('customerid', $relatedCustomers)
                    ->orWhereIn('buildid', $relatedLocations);
            })
            ->get(['users.id', 'users.name', 'users.profile_image_path', 'user_auth_buildings.buildid', 'user_auth_customer.customerid']);


        return Inertia::render('TicketDetails', ['ticket' => $ticket, 'client' => $client, 'locations' => $currentLocation,
            'files' => $files, 'ticketmessages' => $ticketmessages, 'otherUsers' => $otherusers, 'ticketreacts' => $ticketreacts]);
    }

    public function clientindex($customer, $building)
    {
        $data = Tickets::where("delete", 0)->where("customer", $customer)->where("building", $building)->get();
        return response()->json($data);
    }

    public function supervisorindex($data)
    {
        $data = Tickets::where("delete", 0)->where("customer", $data)->get();
        return response()->json($data);
    }

    public function gotrash($ticketId)
    {
        $ticket = Tickets::find($ticketId); // Find the ticket by ID

        if ($ticket) {
            $ticket->setDeleted(); // Update delete status
            //buraya bir event yazılabilir
            return response()->json([
                'success' => true,
                'message' => 'Ticket marked as deleted successfully.'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Ticket not found.'
            ], 404);
        }
    }

    public function TicketNotificationSend(Request $request, $ticket)
    {
        try {
            $sender = Auth::user();
            $userIds = array();
            if ($request->has('userIds')) {
                $userIdsString = $request->input('userIds');
                $userIds = explode(',', $userIdsString);
            }
            $notificationData = $ticket;
            Log::info('Bildirim gönderimi başlıyor', ['userIds' => $userIds, 'notificationData' => $notificationData]);
            // Job'ı kuyruğa gönderin
            SendTicketNotifications::dispatch($userIds, $notificationData, $sender);
            return response()->json(['success' => 'Notifications are being sent']);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['fail' => 'Notifications could not sent']);
        }

    }

    public function TicketDetailUpdateSend(Request $request, $ticketID)
    {
        try {
            $sender = Auth::user();
            $userIdsString = $request->input('userIds');
            $userIds = explode(',', $userIdsString); // String'i diziye dönüştürün
            Log::info('MessageNotiSend UserIDs', ['userIds' => $userIds, 'updateTicket' => $ticketID]);
            $notificationData = $ticketID; // Diğer bildirim verilerini alın

            if (empty($userIds) || !is_array($userIds)) {
                return response()->json(['error' => 'User IDs are required and must be an array'], 400);
            }
            Log::info('Bildirim gönderimi başlıyor', ['userIds' => $userIds, 'notificationData' => $notificationData]);
            // Job'ı kuyruğa gönderin
            TicketDetailUpdateNotification::dispatch($userIds, $notificationData);
            return response()->json(['success' => 'Notifications are being sent']);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['fail' => 'Notifications could not sent']);
        }

    }

    public function TicketStatusUpdateSend(Request $request, $ticketID)
    {
        try {
            $sender = Auth::user();
            $userIdsString = $request->input('userIds');
            $userIds = explode(',', $userIdsString); // String'i diziye dönüştürün
            Log::info('MessageNotiSend UserIDs', ['userIds' => $userIds, 'updateTicket' => $ticketID]);
            $notificationData = $ticketID; // Diğer bildirim verilerini alın

            if (empty($userIds) || !is_array($userIds)) {
                return response()->json(['error' => 'User IDs are required and must be an array'], 400);
            }
            Log::info('Bildirim gönderimi başlıyor', ['userIds' => $userIds, 'notificationData' => $notificationData]);
            // Job'ı kuyruğa gönderin
            TicketReactNotification::dispatch($userIds, $notificationData);
            return response()->json(['success' => 'Notifications are being sent']);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['fail' => 'Notifications could not sent']);
        }

    }

    public function MessageNotificationSend(Request $request, $ticket)
    {
        try {
            $sender = Auth::user();
            $userIdsString = $request->input('userIds');
            $userIds = explode(',', $userIdsString); // String'i diziye dönüştürün
            Log::info('MessageNotiSend UserIDs', ['userIds' => $userIds, 'ticket' => $ticket]);
            $notificationData = $ticket; // Diğer bildirim verilerini alın


            if (empty($userIds) || !is_array($userIds)) {
                return response()->json(['error' => 'User IDs are required and must be an array'], 400);
            }
            Log::info('Bildirim gönderimi başlıyor', ['userIds' => $userIds, 'notificationData' => $notificationData]);
            // Job'ı kuyruğa gönderin
            MessageNotifications::dispatch($userIds, $notificationData);
            return response()->json(['success' => 'Notifications are being sent']);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['fail' => 'Notifications could not sent']);
        }

    }

    public function store(Request $request)
    {
        $ticket = Tickets::create([
            'opener_name' => $request->input('opener_name'),
            'building' => $request->input('building'),
            'customer' => $request->input('customer'),
            'refnum' => $request->input('refnum'),
            'status' => $request->input('status'),
            'title' => $request->input('title'),
            'delete' => 0,
            'ticketsubject' => $request->input('ticketsubject'),
            'ticket_type' => $request->input('ticket_type'),
            'ticket_to' => $request->input('ticket_to'),
        ]);
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $media = $ticket->addMedia($file)->toMediaCollection('files');
                Log::info($media);
                $fileModel = File::create([
                    'filename' => $media->file_name,
                    'media_id' => $media->id,
                    'mime_type' => $media->mime_type,
                    'is_message' => 0,
                    'ticket_id' => $ticket->id,
                ]);
            }
        }
        $this->TicketNotificationSend($request, $ticket);
        return response()->json([$ticket]);
    }

    public function ticketFileUpload(Request $request)
    {
        Log::info($request);
        $ticket = Tickets::where('id', $request->input('ticket_id'))->first();
        $fileModel = [];
        foreach ($request->file('files') as $file) {
            $media = $ticket->addMedia($file)->toMediaCollection('files');
            Log::info($media);
            $fileModel[] = File::create([
                'filename' => $media->file_name,
                'media_id' => $media->id,
                'mime_type' => $media->mime_type,
                'is_message' => 0,
                'ticket_id' => $ticket->id,
            ]);
        }
        Log::info($fileModel);
        $this->TicketDetailUpdateSend($request, $ticket->id);
        return response()->json(['file' => $fileModel]);
    }

    public function download($fileId)
    {
        $media = Media::findOrFail($fileId); // Dosyayı id ile bulun

        // Dosyanın yolu ve dosya adı
        $filePath = $media->fully_path;
        $fileName = $media->file_name;

        // Dosyayı indirin
        return response()->download($filePath, $fileName);
    }

    public function messagestore(Request $request)
    {
        $message = TicketsMesages::create([
            'ticket_id' => $request->input('ticket_id'),
            'userName' => $request->input('userName'),
            'Message' => $request->input('Message') ?? 'nomess',
        ]);
        $fileModel = [];
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $media = $message->addMedia($file)->toMediaCollection('files');
                $fileModel[] = File::create([
                    'filename' => $media->file_name,
                    'media_id' => $media->id,
                    'mime_type' => $media->mime_type,
                    'is_message' => 1,
                    'ticket_id' => $request->input('ticket_id'),
                    'message_id' => $message->id,
                ]);
            }
        }
        return response()->json(['message' => $message, 'file' => $fileModel]);
    }

    public function update(Request $request)
    {
        $ticket = Tickets::findOrFail($request->input('id'));
        $ticket->update([
            'opener_name' => $request->input('opener_name'),
            'building' => $request->input('building'),
            'customer' => $request->input('customer'),
            'room' => $request->input('room'),
            'status' => $request->input('status'),
            'title' => $request->input('title'),
            'delete' => 0,
            'ticketsubject' => $request->input('ticketsubject'),
            'ticket_type' => $request->input('ticket_type'),
            'ticket_to' => $request->input('ticket_to'),
        ]);
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $media = $ticket->addMedia($file)->toMediaCollection('files');
                Log::info($media);
                $fileModel = File::create([
                    'filename' => $media->file_name,
                    'media_id' => $media->id,
                    'mime_type' => $media->mime_type,
                    'is_message' => 0,
                    'ticket_id' => $ticket->id,
                ]);
            }
        }
        $this->TicketDetailUpdateSend($request, $ticket->id);
        return response()->json([$ticket]);
    }

    public function assigntickettype($ticketid, $type)
    {
        $ticket = Tickets::where('id', $ticketid)->first();
        $ticket->assigned_type = $type;
        $ticket->save();
        return response()->json([$ticket]);
    }

    function StatusChangeNotification(Request $request, $react, array $fileModel, $ticket)
    {
        try {
            $sender = Auth::user();
            $userIdsString = $request->input('userIds');
            $userIds = explode(',', $userIdsString);
            $notificationData = new stdClass();
            $notificationData->react = $react;
            if (isset($fileModel)) $notificationData->files = $fileModel;
            $notificationData->ticket = $ticket;

            if (empty($userIds) || !is_array($userIds)) {
                return response()->json(['error' => 'User IDs are required and must be an array'], 400);
            }
            Log::info('StatusChangeNotification funtion');
            TicketReactNotificationSender::dispatch($userIds, $notificationData);
            return response()->json(['success' => 'Notifications are being sent']);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['fail' => 'Notifications could not sent']);
        }
    }

    public function reactTicketStore(Request $request)
    {
        $date = new DateTime();
        $ticket = Tickets::findOrFail($request->input('id'));
        $react = ticket_reacts::create([
            'ticket_id' => $request->input('id'),
            'react_text' => $request->input('closing_comment'),
            'before_status' => $ticket->status,
            'after_status' => $request->input('after_status'),
            'evaluator_persons' => Auth::user()->name,
        ]);
        $fileModel = [];
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $media = $react->addMedia($file)->toMediaCollection('files');
                $fileModel[] = File::create([
                    'filename' => $media->file_name,
                    'media_id' => $media->id,
                    'mime_type' => $media->mime_type,
                    'isReact' => 1,
                    'ticket_id' => $request->input('id'),
                    'react_id' => $react->id,
                ]);
            }
        }
        if ($request->input('after_status') === 'Closed') {
            $ticket->update([
                'status' => 'Closed',
                'delete' => 0,
                'evaluator_persons' => Auth::user()->name,
                'closing_date' => $request->input('closing_date'),
            ]);
        } else {
            $ticket->update([
                'status' => $ticket->status = $request->input('after_status'),
                'delete' => 0,
                'evaluator_persons' => Auth::user()->name,
            ]);
        }
        if ($react->before_status != $react->after_status) {
            $this->StatusChangeNotification($request, $react, $fileModel, $ticket);
        }
        $this->TicketDetailUpdateSend($request, $ticket->id);
        return response()->json([$ticket]);
    }

    public function reactTicketUpdate(Request $request)
    {
        $date = new DateTime();
        $ticket = Tickets::findOrFail($request->input('id'));
        $react = ticket_reacts::findOrFail($request->input('react_id'));
        $react->update([
            'ticket_id' => $request->input('id'),
            'react_text' => $request->input('closing_comment'),
            'before_status' => $request->input('before_status'),
            'after_status' => $request->input('after_status'),
            'evaluator_persons' => Auth::user()->name,
        ]);
        $fileModel = [];
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $media = $react->addMedia($file)->toMediaCollection('files');
                $fileModel[] = File::create([
                    'filename' => $media->file_name,
                    'media_id' => $media->id,
                    'mime_type' => $media->mime_type,
                    'isReact' => 1,
                    'ticket_id' => $request->input('ticket_id'),
                    'react_id' => $react->id,
                ]);
            }
        }
        if ($request->input('after_status') === 'Closed') {
            $ticket->update([
                'status' => 'Closed',
                'delete' => 0,
                'evaluator_persons' => Auth::user()->name,
                'closing_date' => $date->format('Y-m-d H:i:s'),
            ]);
        } else {
            $ticket->update([
                'status' => $ticket->status = $request->input('after_status'),
                'delete' => 0,
                'evaluator_persons' => Auth::user()->name,
            ]);
        }

        $this->TicketDetailUpdateSend($request, $ticket->id);
        return response()->json([$ticket]);
    }
}

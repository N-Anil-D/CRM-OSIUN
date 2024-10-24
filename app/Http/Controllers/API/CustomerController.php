<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Jobs\ClientNotificationSendJob;
use App\Models\client_contact_person;
use App\Models\clientgroups;
use App\Models\notifications;
use App\Models\Roles;
use App\Models\rooms;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Customers;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Tickets;
use App\Models\ClientNotes;
use App\Models\ClientNotesComments;
use App\Models\Buildings;
use App\Models\CustomerAsignedLocations;
use Throwable;

class CustomerController extends Controller
{
    public function customerindex()
    {
        $user = Auth::user();
        $userName = $user->name;
        $allUser = User::where('id', '!=', $user->id)->get(['id', 'name', 'profile_image_path']);
        $customerQuery = Customers::query();
        if ($user->connectedCustomer !== 'ALL') {
            $customerQuery->join('user_auth_customer', 'customers.CustomerID', '=', 'user_auth_customer.customerid')
                ->where('user_auth_customer.userid', $user->id);
        }
        $customers = $customerQuery->select('customers.*')->get();
        return Inertia::render('Clients', ['allUsers' => $allUser, 'customers' => $customers]);
    }
    function ClientDetailUpdate(Request $request, $clientID)
    {
        try {

            $userIdsString = $request->input('userIds');
            $userIds = explode(',', $userIdsString); // String'i diziye dönüştürün
            Log::info('MessageNotiSend UserIDs', ['userIds' => $userIds, 'updateClient' => $clientID]);
            $notificationData = $clientID; // Diğer bildirim verilerini alın

            if (empty($userIds) || !is_array($userIds)) {
                return response()->json(['error' => 'User IDs are required and must be an array'], 400);
            }
            Log::info('Bildirim gönderimi başlıyor', ['userIds' => $userIds, 'notificationData' => $notificationData]);
            // Job'ı kuyruğa gönderin
            ClientNotificationSendJob::dispatch($userIds, $notificationData);
            return response()->json(['success' => 'Notifications are being sent']);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['fail' => 'Notifications could not sent']);
        }
    }
    public function bestaandeLocatieStore(Request $request)
    {
        $locations = $request->input('locations');
        $client = $request->input('client');
        $asignedLocations = [];
        if (is_array($locations)) {
            foreach ($locations as $location) {
                Log::info( $location['id']);
                $asignedLocations[] = CustomerAsignedLocations::create([
                    'customerid' => $client['CustomerID'],
                    'locationid' => $location['id'],
                ]);
            }
        }
        $this->ClientDetailUpdate($request, $client['CustomerID']);
        return response()->json($asignedLocations, 200);
    }
    public function bestaandeLocatieDelete(Request $request)
    {
        Log::info($request->input());
        $locationID = $request->input('locationID');
        $clietnID = $request->input('clietnID');
        $asignedLocation = CustomerAsignedLocations::where('locationid', $locationID)->where('customerid', $clietnID)->first();
        if(!$asignedLocation) {
            return response()->json(['error' => 'Location not found'], 400);
        }
        $asignedLocation->forceDelete();
        return response()->json('basari', 200);
    }
    public function showRealitedCustomer($customerid)
    {
        $user = Auth::user();
        $userName = $user->name;
        $otherusers = User::where('id', '!=', $user->id)->get(['id', 'name']);
        $data = Customers::where('CustomerID', $customerid)->first();
        $representative = User::where('name', $data->username)->first();
        $client_notes = ClientNotes::where("delete", 0)->where("customerid", $customerid)->get();
        $note_comments = ClientNotesComments::where('delete', false)->where("client_id", $customerid)->get();
        $buildingsQuery = Buildings::query();
        if ($user->connectedBuild !== 'ALL') {
            // Kullanıcı yetkili olduğu bina verilerine erişmek istiyor
            $buildingsQuery->join('user_auth_buildings', 'buildings.id', '=', 'user_auth_buildings.buildid')
                ->where('user_auth_buildings.userid', $user->id);
        }
        $buildingsQuery->join('CustomerAsignedLocations', 'buildings.id', '=', 'CustomerAsignedLocations.locationid')
            ->where('CustomerAsignedLocations.customerid', $customerid);
        $locations = $buildingsQuery->select('buildings.*')->get();
        $locationIDs = $locations->pluck('id')->toArray();
        $otherLocations = [];
        if ($user->roleName == 'admin') {
            if (!empty($locationIDs)) {
                $otherLocations = Buildings::whereNotIn('id', $locationIDs)->get();
            } else {
                $otherLocations = Buildings::all();
            }
        }
        $locationIDs[] = '-1';
        $tickets = Tickets::where('delete', 0)
            ->where(function ($query) use ($customerid) {
                $query->where('customer', $customerid)
                    ->orwhere('customer', 'ALL');
            })
            ->where(function ($query) use ($locationIDs) {
                $query->whereIn('building', $locationIDs);
            })
            ->orderBy('id', 'desc')
            ->get();
        $rooms = Rooms::whereIn('building', $locationIDs);
        $notifications = notifications::where('notifiable_id', $user->id);
        $clientsUsers = User::where(function ($query) use ($customerid) {
            $query->where('roleName', 'Client')
                ->orWhere('roleName', 'user');
        })->where('connectedCustomer', $customerid)->get();
        $contactPersons = client_contact_person::where('connectedCustomer', $customerid)->get();
        if ($data->CustomerID == $customerid)
            return inertia::render('ClientDetail',
                ['data' => $data, 'representative' => $representative,
                    'tickets' => $tickets, 'notes' => $client_notes, 'note_comments' => $note_comments,
                    'locations' => $locations, 'rooms' => $rooms, 'otherusers' => $otherusers, 'notifications' => $notifications,
                    'clientsUsers' => $clientsUsers, 'contactPersons' => $contactPersons, 'otherLocations' => $otherLocations]);
        else return inertia::render('dashboard');
    }

    public function store(Request $request)
    {
        try {

            Log::info($request);
            if ($request->input('isNewUser') == 'true') {

                Log::info('it is new user');
                $client = Customers::create([
                    'CustomerID' => $request->input('CustomerID'),
                    'Unvan' => $request->input('Unvan'),
                    'VergiDairesi' => $request->input('VergiDairesi'),
                    'VergiNumarasi' => $request->input('VergiNumarasi'),
                    'Yetkili' => $request->input('authusername'),
                    'email' => $request->input('email'),
                    'phone_number' => $request->input('phone_number'),
                    'address' => $request->input('address'),
                    'city' => $request->input('city'),
                    'postal_code' => $request->input('postal_code'),
                    'country' => $request->input('country'),
                    'passive' => 0,
                    'customer_group' => $request->input('customer_group'),
                    'tag' => $request->input('tag'),
                    'billsendtype' => $request->input('billsendtype'),
                ]);
                $user = User::create([
                    'name' => $request->input('authusername'),
                    'email' => $request->input('authusermail'),
                    'password' => $request->input('authpassword'),
                ]);
                return response()->json($client, $user);
            } else {
                Log::info('it is NOT new user');
                $client = Customers::create([
                    'CustomerID' => $request->input('CustomerID'),
                    'Unvan' => $request->input('Unvan'),
                    'VergiDairesi' => $request->input('VergiDairesi'),
                    'VergiNumarasi' => $request->input('VergiNumarasi'),
                    'email' => $request->input('email'),
                    'phone_number' => $request->input('phone_number'),
                    'address' => $request->input('address'),
                    'city' => $request->input('city'),
                    'postal_code' => $request->input('postal_code'),
                    'country' => $request->input('country'),
                    'passive' => 0,
                    'customer_group' => $request->input('customer_group'),
                    'tag' => $request->input('tag'),
                    'billsendtype' => $request->input('billsendtype'),
                ]);

                return response()->json($client);
            }
        } catch (Throwable $th) {
            Log::error($th);
            return response()->json($th);
            throw $th;
        }
    }

    public function update(Request $request)
    {
        try {

            Log::info('client update request');
            Log::info($request);
            $client = Customers::where('id', $request->input('id'))->first();
            if ($request->input('isNewUser') == 'true') {

                Log::info('it is new user');
                $client->update([
                    'CustomerID' => $request->input('CustomerID'),
                    'Unvan' => $request->input('Unvan'),
                    'VergiDairesi' => $request->input('VergiDairesi'),
                    'VergiNumarasi' => $request->input('VergiNumarasi'),
                    'Yetkili' => $request->input('authusername'),
                    'email' => $request->input('email'),
                    'phone_number' => $request->input('phone_number'),
                    'address' => $request->input('address'),
                    'city' => $request->input('city'),
                    'postal_code' => $request->input('postal_code'),
                    'country' => $request->input('country'),
                    'passive' => 0,
                    'customer_group' => $request->input('customer_group'),
                    'tag' => $request->input('tag'),
                    'billsendtype' => $request->input('billsendtype'),
                ]);
                return response()->json($client);
            } else {

                $user = User::where('id', $request->input('authuserid'))->first();
                $client->update([
                    'CustomerID' => $request->input('CustomerID'),
                    'Unvan' => $request->input('Unvan'),
                    'VergiDairesi' => $request->input('VergiDairesi'),
                    'VergiNumarasi' => $request->input('VergiNumarasi'),
                    'email' => $request->input('email'),
                    'phone_number' => $request->input('phone_number'),
                    'address' => $request->input('address'),
                    'city' => $request->input('city'),
                    'postal_code' => $request->input('postal_code'),
                    'country' => $request->input('country'),
                    'passive' => 0,
                    'customer_group' => $request->input('customer_group'),
                    'tag' => $request->input('tag'),
                    'billsendtype' => $request->input('billsendtype'),
                ]);

                return response()->json($client);
            }
        } catch (Throwable $th) {
            Log::error($th);
            return response()->json($th);
            throw $th;
        }
    }

    public function gotrash($id)
    {
        $client = Customers::where('id', $id)->first(); // Find the ticket by ID

        if ($client) {
            $client->setDeleted(); // Update delete status
            //Buraya bir event yazılabilir
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


    public function breadclientindex()
    {
        $users = User::all();
        $groups = clientgroups::all();

        return response()->json($users, $groups);
    }

}

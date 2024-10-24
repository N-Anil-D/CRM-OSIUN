<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CustomerAsignedLocations;
use App\Models\Customers;
use App\Models\members;
use App\Models\Roles;
use App\Models\rooms;
use App\Models\CustomerAsignedRooms;
use App\Models\Tickets;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Buildings;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use function PHPUnit\Framework\isEmpty;
use Illuminate\Support\Facades\DB;

class BuildingsController extends Controller
{
    public function buildingindex()
    {
        $user = Auth::user();
        $buildingsQuery = Buildings::query();
        if ($user->connectedBuild !== 'ALL') {
            // Kullanıcı yetkili olduğu bina verilerine erişmek istiyor
            $buildingsQuery->join('user_auth_buildings', 'buildings.id', '=', 'user_auth_buildings.buildid')
                ->where('user_auth_buildings.userid', $user->id);
        }
        $locations = $buildingsQuery->select('buildings.*')->get();
        return Inertia::render("Locations", ['locations' => $locations]);
    }

    function getCustomerWithRoomsOnLocatie($locationId)
    {
        $customers = DB::table('crmosius.CustomerAsignedLocations as cal')
            ->join('crmosius.customers', DB::raw("cal.customerid COLLATE utf8mb4_unicode_ci"), '=', DB::raw("customers.CustomerID COLLATE utf8mb4_unicode_ci"))
            ->where('cal.locationid', $locationId)
            ->select('customers.*')
            ->get();
        $sumLocatieRooms = rooms::where('building_id', $locationId)->where('useage_type','Member')->sum('floor_square');
        $result = $customers->map(function ($customer) use ($sumLocatieRooms) {
            $rooms = DB::table('crmosius.customer_asigned_rooms as car')
                ->join('crmosius.rooms as r', 'r.id', '=', 'car.roomID')
                ->where('car.CustomerID', $customer->CustomerID)
                ->where('r.isdeleted', 0)
                ->select('r.id', 'r.building_id', 'r.floor_number', 'r.room_number', 'r.room_type', 'r.useage_type', 'r.floor_type', 'r.wall_type', 'r.floor_square', 'r.Binnenzijde', 'r.Buitenzijde', 'r.Seperstie_glas', 'r.created_at', 'r.updated_at')
                ->get();
            $totalarea = $rooms->sum('floor_square');
            return [
                'id' => $customer->id,
                'CustomerID' => $customer->CustomerID,
                'Unvan' => $customer->Unvan,
                'room' => $rooms,
                'totalArea' => $totalarea,
                'totalRoom' => $rooms->count(),
                'ratio' => ($totalarea/$sumLocatieRooms)*100,
            ];
        });
        Log::info(['customers' => $customers, 'result' => $result]);

        return $result;
    }
    public function buildingdetailindex($locationid)
    {
        $user = Auth::user();
        $building = Buildings::where('passive', 0)->where('id', $locationid)->FirstOrFail();
        $buildingsQuery = Buildings::query();
        if ($user->connectedBuild !== 'ALL') {
            // Kullanıcı yetkili olduğu bina verilerine erişmek istiyor
            $buildingsQuery->join('user_auth_buildings', 'buildings.id', '=', 'user_auth_buildings.buildid')
                ->where('user_auth_buildings.userid', $user->id);
        }
        $alllocaitons = $buildingsQuery->select('buildings.*')->get();
        $rooms = Rooms::where('building_id', $building->id)->get();
        $userName = Auth::user()->name;
        $customerQuery = Customers::query();
        if ($user->connectedCustomer !== 'ALL') {
            $customerQuery->join('user_auth_customer', 'customers.CustomerID', '=', 'user_auth_customer.customerid')
                ->where('user_auth_customer.userid', $user->id);
        }
        $clients = $customerQuery->select('customers.*')->get();
        // Filtreleme için sadece CustomerID'leri alıyoruz

        $clientIDs = $clients->pluck('CustomerID')->toArray();
        $clientIDs[] = 'ALL';
        $asignedKlants = $this->getCustomerWithRoomsOnLocatie($locationid);
        $tickets = Tickets::where(function ($query) use ($userName) {
            $query->where('ticket_to', $userName)
                ->orWhere('opener_name', $userName)
                ->orWhereNull('ticket_to');
        })->where(function ($query) use ($clientIDs) {
            if (!empty($clientIDs)) {
                $query->whereIn('customer', $clientIDs);
            }
        })
            ->where('delete', 0)
            ->where('building', $locationid)
            ->orderBy('id', 'desc')
            ->get();
        $members = members::where('location_id', $locationid)->get();
        $otherusers = User::where('id', '!=', $user->id)->get(['id', 'name', 'profile_image_path']);
        return inertia("LocationDetail", ['location' => $building, 'rooms' => $rooms, 'tickets' => $tickets,
            'allLocaitons' => $alllocaitons, 'members' => $members, 'otherusers' => $otherusers, 'clients' => $clients,
            'asignedKlants' => $asignedKlants]);
    }
    public function klantBuildingindex($customerid, $locationid)
    {
        $user = Auth::user();
        $building = Buildings::where('passive', 0)->where('id', $locationid)->FirstOrFail();
        $buildingsQuery = Buildings::query();
        if ($user->connectedBuild !== 'ALL') {
            // Kullanıcı yetkili olduğu bina verilerine erişmek istiyor
            $buildingsQuery->join('user_auth_buildings', 'buildings.id', '=', 'user_auth_buildings.buildid')
                ->where('user_auth_buildings.userid', $user->id);
        }
        $buildingsQuery->join('CustomerAsignedLocations', 'buildings.id', '=', 'CustomerAsignedLocations.locationid')
            ->where('CustomerAsignedLocations.customerid', $customerid);
        $alllocaitons = $buildingsQuery->select('buildings.*')->get();
        $rooms = Rooms::where('building_id', $building->id)->get();
        $userName = Auth::user()->name;
        $customerQuery = Customers::query();
        if ($user->connectedCustomer !== 'ALL') {
            $customerQuery->join('user_auth_customer', 'customers.CustomerID', '=', 'user_auth_customer.customerid')
                ->where('user_auth_customer.userid', $user->id);
        }
        $clients = $customerQuery->select('customers.*')->get();

        // Filtreleme için sadece CustomerID'leri alıyoruz
        $clientIDs = $clients->pluck('CustomerID')->toArray();

        $clientIDs[] = 'ALL';
        $tickets = Tickets::where(function ($query) use ($userName) {
            $query->where('ticket_to', $userName)
                ->orWhere('opener_name', $userName)
                ->orWhereNull('ticket_to');
        })->where(function ($query) use ($clientIDs) {
            if (!empty($clientIDs)) {
                $query->whereIn('customer', $clientIDs);
            }
        })
            ->where('delete', 0)
            ->where('building', $locationid)
            ->orderBy('id', 'desc')
            ->get();
        $members = members::where('location_id', $locationid)->get();
        $otherusers = User::where('id', '!=', $user->id)->get(['id', 'name', 'profile_image_path']);
        return inertia("KlantLocatieDetail", ['from' => 'klant', 'location' => $building, 'rooms' => $rooms,
            'tickets' => $tickets, 'allLocaitons' => $alllocaitons, 'members' => $members, 'otherusers' => $otherusers,
            'clients' => $clients, 'klant' => $customerid]);
    }

    public function relatedBuild($buildingname)
    {
        $data = Buildings::where("BuildingName", $buildingname)->get();
        return response()->json($data);
    }

    public function relatedBuildasCustomer($customerid)
    {
        $data = Buildings::where("CustomerID", $customerid)->get();
        return response()->json($data);
    }

    public function locationstore(Request $request)
    {
        Log::info($request);

        $data = Buildings::create([
            'LocationID' => $request->input('LocationID'),
            'BuildingName' => $request->input('BuildingName'),
            'locationadress' => $request->input('locationadress'),
            'postalcode' => $request->input('postalcode'),
            'email' => $request->input('email'),
            'dnumber' => $request->input('dnumber'),
            'bolge' => $request->input('bolge'),
            'passive' => $request->input('passive'),
            'Note' => $request->input('Note'),
        ]);
        return response()->json($data);
    }
    public function update(Request $request)
    {
        $user = Buildings::findOrFail($request->input('id'));
        $user->update([
            'LocationID' => $request->input('LocationID'),
            'BuildingName' => $request->input('BuildingName'),
            'locationadress' => $request->input('locationadress'),
            'postalcode' => $request->input('postalcode'),
            'email' => $request->input('email'),
            'dnumber' => $request->input('dnumber'),
            'bolge' => $request->input('bolge'),
            'passive' => $request->input('passive'),
            'Note' => $request->input('Note'),
        ]);
        return $user;
    }
}

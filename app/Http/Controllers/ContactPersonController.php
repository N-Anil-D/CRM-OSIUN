<?php

namespace App\Http\Controllers;

use App\Models\Buildings;
use App\Models\CustomerAsignedLocations;
use App\Models\Customers;
use App\Models\User;
use App\Models\user_auth_buildings;
use App\Models\user_auth_customer;
use App\Models\user_page_auth;
use App\Notifications\PasswordUpdated;
use Illuminate\Http\Request;
use App\Models\client_contact_person;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

use Illuminate\Support\Facades\Log;

class ContactPersonController extends Controller
{
    public function indexDetail($personID)
    {
        Log::info($personID);
        $person = client_contact_person::where('id', $personID)->first();
        $account = Auth::user();
        $user = Auth::user();
        $permissions = '';
        $klantsLocations = CustomerAsignedLocations::where('customerid', $person->connectedCustomer)->pluck('locationid')->toArray();
        if ($account->roleName != 'User' && $account->roleName != 'Client' && $person->is_user != 0) {
            $isAccount = User::where('id', $person->is_user)->first();
            if ($isAccount) {
                $account = $isAccount;
                $permissions = user_page_auth::where('userid', $isAccount->id)->whereNull('parent_id')->with('children')->get();
            }
        }
        $buildingsQuery = Buildings::query();

        if ($user->connectedBuild !== 'ALL') {
            $buildingsQuery->join('user_auth_buildings', 'buildings.id', '=', 'user_auth_buildings.buildid')
                ->where('user_auth_buildings.userid', $user->id);
        }
        $buildingsQuery->whereIn('buildings.id', $klantsLocations)
            ->addSelect(['is_assigned' => function ($query) use ($account) {
                $query->selectRaw('IF(COUNT(*), true, false)')
                    ->from('user_auth_buildings')
                    ->whereColumn('user_auth_buildings.buildid', 'buildings.id')
                    ->where('user_auth_buildings.userid', $account->id);
            }]);
        $buildings = $buildingsQuery->get();
        $customers = Customers::where('CustomerID', $person->connectedCustomer)->get();
        Log::info($buildings);
        return Inertia::render('ContactPersonDetail', ['person' => $person, 'account' => $account,
            'buildings' => $buildings, 'clients' => $customers, 'permissions' => $permissions]);
    }

    public function store(Request $request)
    {
        $contact_person = new client_contact_person([
            'first_name' => $request->input('first_name'),
            'tussen' => $request->input('tussen'),
            'last_name' => $request->input('last_name'),
            'email' => $request->input('email'),
            'phone_number' => $request->input('phone_number'),
            'title' => $request->input('title'),
            'function' => $request->input('function'),
            'mobilenum' => $request->input('mobilenum'),
            'connectedCustomer' => $request->input('connectedCustomer'),
            'hoofcontactperson' => $request->input('hoofcontactperson'),
            'passive' => $request->input('passive'),
            'is_user' => $request->input('is_user'),
        ]);
        $contact_person->save();
        return response()->json([$contact_person]);
    }

    public function update(Request $request)
    {
        $contact_person = client_contact_person::findOrFail($request->input('id'));
        $contact_person->update([
            'first_name' => $request->input('first_name'),
            'tussen' => $request->input('tussen'),
            'last_name' => $request->input('last_name'),
            'email' => $request->input('email'),
            'phone_number' => $request->input('phone_number'),
            'title' => $request->input('title'),
            'function' => $request->input('function'),
            'mobilenum' => $request->input('mobilenum'),
            'connectedCustomer' => $request->input('connectedCustomer'),
            'hoofcontactperson' => $request->input('hoofcontactperson'),
            'passive' => $request->input('passive'),
            'is_user' => $request->input('is_user'),
        ]);
        return response()->json([$contact_person]);
    }

    public function delete_that_user(Request $request)
    {
        $user = Auth::user();
        if ($user->roleName != 'Client' && $user->roleName != 'user') {
            $findedUser = User::where('id', $request->input('userid'))->first();
            if ($findedUser) {
                $findedUser->delete();
                user_page_auth::where('userid', $request->input('userid'))->delete();
                user_auth_customer::where('userid', $request->input('userid'))->delete();
                user_auth_buildings::where('userid', $request->input('userid'))->delete();
                $findedPerson = client_contact_person::where('id', $request->input('person_id'))->first();
                $findedPerson->update([
                    'is_user' => '0'
                ]);
            }
        } else return response()->json(['error' => 'Location not found'], 400);
        return response()->json('basari', 200);

    }

    public function make_it_user(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users'),
            ]
        ]);
        $password = Str::random(8);
        $usercreateresponse = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($password),
            'roleName' => $request->input('roleName'),
            'connectedBuild' => $request->input('connectedBuild'),
            'connectedCustomer' => $request->input('connectedCustomer'),
            'bann' => $request->input('passive')
        ]);
        $userid = $usercreateresponse->id;
        $contact_person = client_contact_person::findOrFail($request->input('contactPersonID'));
        $contact_person->update(['is_user' => $userid]);
        if ($request->has('permissions')) {
            $permissions = $request->input('permissions');

            if (is_string($permissions)) {
                $permissions = json_decode($permissions, true);
            }

            if (is_array($permissions)) {
                foreach ($permissions as $per) {
                    $relatedAuth = user_page_auth::create([
                        'userid' => $userid,
                        'page_name' => $per['page_name'],
                        'path' => $per['path'],
                        'read' => $per['read'],
                        'write' => $per['write'],
                        'delete' => $per['delete'],
                    ]);
                    if (isset($per['children'])) {

                        if (is_string($per['children'])) {
                            $per['children'] = json_decode($per['children'], true);
                        }
                        if (is_array($per['children'])) {
                            foreach ($per['children'] as $child) {
                                user_page_auth::create([
                                    'userid' => $userid,
                                    'page_name' => $child['page_name'],
                                    'parent_id' => $relatedAuth->id,
                                    'path' => $child['path'],
                                    'read' => $child['read'],
                                    'write' => $child['write'],
                                    'delete' => $child['delete'],
                                ]);
                            }
                        }
                    }
                }
            }
        }
        if ($request->has('customers') && $request->input('connectedCustomer') != 'ALL') {
            Log::info('Client yetkileri güncelleniyor.');
            $clients = $request->input('customers');
            if (is_string($clients)) {
                $clients = json_decode($clients, true);
            }
            foreach ($clients as $client) {
                user_auth_customer::create([
                    'userid' => $userid,
                    'customerid' => $client['value'],
                ]);
                Log::info('Yeni client yetkisi eklendi.', ['clientid' => $client['value']]);
            }
        }
        if ($request->has('buildings') && $request->input('connectedBuild') != 'ALL') {
            Log::info('Location yetkileri güncelleniyor.');
            $buildings = $request->input('buildings');
            if (is_string($buildings)) {
                $buildings = json_decode($buildings, true);
            }
            foreach ($buildings as $building) {
                user_auth_buildings::create([
                    'userid' => $userid,
                    'buildid' => $building['value'],
                ]);
                Log::info('Yeni location yetkisi eklendi.', ['buildid' => $building['value']]);
            }
        }
        $usercreateresponse->notify(new PasswordUpdated($password));    //burada mail atılacak
        return response()->json($usercreateresponse);
    }

    public function getpassivethatcontact(Request $request)
    {
        $person = client_contact_person::findOrFail($request->input('person_id'));
        $person->update(['passive' => true]);
        $personsuser = User::findOrFail($person->is_user);
        $personsuser->update(['bann' => true]);
        return response()->json('basari', 200);
    }

    public function getactivethatcontact(Request $request)
    {
        $person = client_contact_person::findOrFail($request->input('person_id'));
        $person->update(['passive' => false]);
        return response()->json('basari', 200);
    }

    public function getactivethatuser(Request $request)
    {
        $user = User::findOrFail($request->input('user_id'));
        $user->update(['bann' => false]);
        return response()->json('basari', 200);
    }

    public function getpassivethatuser(Request $request)
    {
        $personsuser = User::findOrFail($request->input('user_id'));
        $personsuser->update(['bann' => true]);
        return response()->json('basari', 200);
    }
    public function addbestaandelocatietocontact(Request $request) {
        $locations = $request->input('locations');
        $personsuser = User::findOrFail($request->input('user_id'));
        $eresed = user_auth_buildings::where('userid', $personsuser->id)->delete();
        $asignedLocations = [];
        if (is_array($locations)) {
            foreach ($locations as $location) {
                Log::info( $location['id']);
                $asignedLocations[] = user_auth_buildings::create([
                    'buildid' => $location['id'],
                    'userid' => $personsuser['id'],
                ]);
            }
        }
        $klantsLocations = CustomerAsignedLocations::where('customerid', $personsuser->connectedCustomer)->pluck('locationid')->toArray();
        $buildingsQuery = Buildings::query();
        if ($personsuser->connectedBuild !== 'ALL') {
            $buildingsQuery->join('user_auth_buildings', 'buildings.id', '=', 'user_auth_buildings.buildid')
                ->where('user_auth_buildings.userid', $personsuser->id);
        }
        $buildingsQuery->whereIn('buildings.id', $klantsLocations)
            ->addSelect(['is_assigned' => function ($query) use ($personsuser) {
                $query->selectRaw('IF(COUNT(*), true, false)')
                    ->from('user_auth_buildings')
                    ->whereColumn('user_auth_buildings.buildid', 'buildings.id')
                    ->where('user_auth_buildings.userid', $personsuser->id);
            }]);
        $buildings = $buildingsQuery->select('buildings.*')->get();
        return response()->json([$buildings], 200);
    }
}

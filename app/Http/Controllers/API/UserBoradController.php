<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Buildings;
use App\Models\Customers;
use App\Models\user_auth_buildings;
use App\Models\user_auth_customer;
use App\Models\user_page_auth;
use App\Notifications\PasswordUpdated;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Models\Roles;
use App\Models\User;
use Illuminate\Support\Facades\Route;

class UserBoradController extends Controller
{
    //
    public function getRoutes()
    {
        $routes = Route::getRoutes();

        return response()->json($routes);
    }


    private function getUserWithPermissions(int $userId)
    {
        $user = User::where('id', $userId)->firstOrFail();

        // Kullanıcının rollerini ve yetkilerini al
        $permissions = user_page_auth::where('userid', $user->id)->whereNull('parent_id')->with('children')->get();

        $buildingsQuery = Buildings::query();
        if ($user->connectedBuild !== 'ALL') {
            // Kullanıcı yetkili olduğu bina verilerine erişmek istiyor
            $buildingsQuery->join('user_auth_buildings', 'buildings.id', '=', 'user_auth_buildings.buildid')
                ->where('user_auth_buildings.userid', $user->id);
        }
        $buildings = $buildingsQuery->select('buildings.*')->get();
        $customerQuery = Customers::query();
        if ($user->connectedCustomer !== 'ALL') {
            $customerQuery->join('user_auth_customer', 'customers.CustomerID', '=', 'user_auth_customer.customerid')
                ->where('user_auth_customer.userid', $user->id);
        }
        $customers = $customerQuery->select('customers.*')->get();
        // Kullanıcıyı yönlendir
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'email_verified_at' => $user->email_verified_at,
            'roleName' => $user->roleName,
            'connectedBuild' => $user->connectedBuild,
            'connectedCustomer' => $user->connectedCustomer,
            'bann' => $user->bann,
            'profile_image_path' => $user->profile_image_path,
            'permissions' => $permissions,
            'customers' => $customers,
            'buildings' => $buildings,
        ];
    }

    public function managmentpageindex()
    {
        $allusers = User::where('roleName', '!=', 'Client')->get();
        $usersPrev = [];
        foreach ($allusers as $user) {
            $usersPrev[] = $this->getUserWithPermissions($user->id);
        }
        $clients = Customers::all();
        $buildings = Buildings::all();
        return Inertia::render('UsersManager', ['kullanicilar' => $usersPrev, 'clients' => $clients, 'buildings' => $buildings]);
    }

    public function storenewuser(Request $request)
    {
        Log::info($request);
        try {
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
                        if(isset($per['children'])) {

                            if (is_string($per['children'])) {
                                $per['children'] = json_decode($per['children'], true);
                            }
                            if(is_array($per['children'])) {
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
        } catch (Exception $ex) {
            Log::error($ex);
            return response()->json($ex);
        }
    }

    public function store(Request $request)
    {
        User::create($request->all());
        return Inertia::render('Error/InternalServerError');
    }

    public function update(Request $request, $user_id)
    {
        $user = User::findOrFail($user_id);
        $user->update($request->all());

        return Inertia::render('Error/InternalServerError');
    }
}

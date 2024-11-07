<?php

namespace App\Http\Controllers;

use App\Models\{medewerkers};
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;

class MedewerkersController extends Controller
{
    public function index()
    {
        $medewerkers = Medewerkers::all();
        return Inertia::render('Medewerkers', ['medewerkers' => $medewerkers]);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'first_name' => 'required|min:3|string',
            'last_name' => 'required|min:3|string',
            'email' => 'required|email|unique:medewerkers,email',
            'phone_number' => 'required|numeric',
        ]);
 
        if ($validator->fails()) {
            $validator->errors();
        }
 
        $validated = $validator->validated();

        try {
            $newMedewerker = new medewerkers;
            $newMedewerker->title = $validated['title'];
            $newMedewerker->first_name = $validated['first_name'];
            $newMedewerker->last_name = $validated['last_name'];
            $newMedewerker->email = $validated['email'];
            $newMedewerker->phone_number = $validated['phone_number'];
            $newMedewerker->save();
        } catch (\Throwable $th) {
            //throw $th;
        }

        return redirect()->route('medewerkers');

    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|numeric',
            'title' => 'required|string',
            'first_name' => 'required|min:3|string',
            'last_name' => 'required|min:3|string',
            'email' => 'required|email',
            'phone_number' => 'required|numeric',
        ]);
 
        if ($validator->fails()) {
            $validator->errors();
        }
        $validated = $validator->validated();

        $employee = medewerkers::find($validated['id']);

        try {
            $employee->title = $validated['title'];
            $employee->first_name = $validated['first_name'];
            $employee->last_name = $validated['last_name'];
            $employee->email = $validated['email'];
            $employee->phone_number = $validated['phone_number'];
            $employee->save();
        } catch (\Throwable $th) {
            //throw $th;
        }

        return redirect()->route('medewerkers');
    }

    public function detailindex($id)
    {
        try {
            $medewerker = medewerkers::findorFail($id);
            return Inertia::render('MedewerkerDetail', ['medewerker' => $medewerker]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Medewerker not found.'], 404);
        } catch
        (QueryException $e) {
            return response()->json(['error' => 'Database error: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }

    public function delete($id)
    {
        $validator = Validator::make(['employeeID' =>$id], [
            'employeeID' => 'required|numeric',
        ]);
        if ($validator->fails()){
            $validator->errors();
        }

        $medewerker = medewerkers::find($id);
        if ($medewerker) {
            $medewerker->delete();
            return redirect()->route('medewerkers');
        }else {
            return redirect()->route('medewerkers')->with('error');
        }
    }

    // private function getUserWithPermissions(int $userId)
    // {
    //     $user = User::where('id', $userId)->firstOrFail();

    //     // Kullanıcının rollerini ve yetkilerini al
    //     $permissions = user_page_auth::where('userid', $user->id)->whereNull('parent_id')->with('children')->get();

    //     $buildingsQuery = Buildings::query();
    //     if ($user->connectedBuild !== 'ALL') {
    //         // Kullanıcı yetkili olduğu bina verilerine erişmek istiyor
    //         $buildingsQuery->join('user_auth_buildings', 'buildings.id', '=', 'user_auth_buildings.buildid')
    //             ->where('user_auth_buildings.userid', $user->id);
    //     }
    //     $buildings = $buildingsQuery->select('buildings.*')->get();
    //     $customerQuery = Customers::query();
    //     if ($user->connectedCustomer !== 'ALL') {
    //         $customerQuery->join('user_auth_customer', 'customers.CustomerID', '=', 'user_auth_customer.customerid')
    //             ->where('user_auth_customer.userid', $user->id);
    //     }
    //     $customers = $customerQuery->select('customers.*')->get();
    //     // Kullanıcıyı yönlendir
    //     return [
    //         'id' => $user->id,
    //         'name' => $user->name,
    //         'email' => $user->email,
    //         'email_verified_at' => $user->email_verified_at,
    //         'roleName' => $user->roleName,
    //         'connectedBuild' => $user->connectedBuild,
    //         'connectedCustomer' => $user->connectedCustomer,
    //         'bann' => $user->bann,
    //         'profile_image_path' => $user->profile_image_path,
    //         'permissions' => $permissions,
    //         'customers' => $customers,
    //         'buildings' => $buildings,
    //     ];
    // }

}

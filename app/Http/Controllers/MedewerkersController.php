<?php

namespace App\Http\Controllers;

use App\Models\{Buildings,Customers,medewerkers,User,user_page_auth};
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Mockery\Exception;
use Carbon\Carbon;
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
            'name' => 'required|min:3|string',
            'last_name' => 'required|min:3|string',
            'email' => 'required|email|unique:medewerkers,email',
            'phone_number' => 'required|numeric',
        ]);
 
        if ($validator->fails()) {
            $validator->errors();
        }
 
        // Retrieve the validated input...
        $validated = $validator->validated();

        try {
            $newMedewerker = new medewerkers;
            $newMedewerker->title = $validated['title'];
            $newMedewerker->first_name = $validated['name'];
            $newMedewerker->last_name = $validated['last_name'];
            $newMedewerker->email = $validated['email'];
            $newMedewerker->phone_number = $validated['phone_number'];
            $newMedewerker->save();

            return redirect()->route('medewerkers');

            // $newMedewerker = medewerkers::create([
                // 'title' => $validated['title'],
                // 'first_name' => $validated['name'],
                // 'last_name' => $validated['last_name'],
                // 'email' => $validated['email'],
                // 'phone_number' => $validated['phone_number'],
                // 'tussen' => $validated['tussen'],
                // 'gender' => $validated['gender'],
                // 'pasive' => $validated['pasive'],
                // 'address' => $validated['address'],
                // 'house_number' => $validated['house_number'],
                // 'postal_code' => $validated['postal_code'],
                // 'residence' => $validated['residence'],
                // 'date_of_birth' => Carbon::parse($validated['date_of_birth'])->format('Y-m-d'), // Doğru tarih formatı
                // 'employment_type' => $validated['employment_type'],
                // 'contract_type' => $validated['contract_type'],
                // 'proeftijd' => Carbon::parse($validated['proeftijd'])->format('Y-m-d H:i:s'),
                // 'iban_number' => $validated['iban_number'],
                // 'start_date' => Carbon::parse($validated['start_date'])->format('Y-m-d H:i:s'),
                // 'travel_allowance' => $validated['travel_allowance'],
                // 'hourly_rate' => $validated['hourly_rate'],
                // 'rights' => $validated['rights'],
                // 'contract_hours' => $validated['contract_hours'],
                // 'bsn_number' => $validated['bsn_number'],
                // 'end_date' => Carbon::parse($validated['end_date'])->format('Y-m-d H:i:s'),
                // 'travel_expenses' => $validated['travel_expenses'],
                // 'bonus_amount' => $validated['bonus_amount']
            // ]);
            // $medewerkers = Medewerkers::all();
            // return Inertia::render('Medewerkers', ['medewerkers' => $medewerkers]);
        } catch (Exception $exception) {
            // return response()->json($exception->getMessage(), 500);
            // return redirect()->back();
        }
    }

    public function update(Request $request)
    {
        try {
            // Eğer id verilmemişse personnel_number ile sorgulama yap
            $medewerker = medewerkers::where('id', $request->input('id'))
                ->orWhere('personnel_number', $request->input('personnel_number'))
                ->firstOrFail(); // Eğer kayıt bulunamazsa hata fırlat

            // Medewerker güncelleniyor
            $medewerker->update([
                'title' => $request->input('title'),
                'first_name' => $request->input('first_name'),
                'tussen' => $request->input('tussen'),
                'last_name' => $request->input('last_name'),
                'email' => $request->input('email'),
                'phone_number' => $request->input('phone_number'),
                'gender' => $request->input('gender'),
                'pasive' => $request->input('pasive', false),
                'address' => $request->input('address'),
                'house_number' => $request->input('house_number'),
                'postal_code' => $request->input('postal_code'),
                'residence' => $request->input('residence'),
                'date_of_birth' => Carbon::parse($request->input('date_of_birth'))->format('Y-m-d'),
                'employment_type' => $request->input('employment_type', 'ZZP'),
                'contract_type' => $request->input('contract_type'),
                'proeftijd' => Carbon::parse($request->input('proeftijd'))->format('Y-m-d H:i:s'),
                'iban_number' => $request->input('iban_number'),
                'start_date' => Carbon::parse($request->input('start_date'))->format('Y-m-d H:i:s'),
                'travel_allowance' => $request->input('travel_allowance'),
                'hourly_rate' => $request->input('hourly_rate', 0.00),
                'rights' => $request->input('rights', 'Standard'),
                'contract_hours' => $request->input('contract_hours'),
                'bsn_number' => $request->input('bsn_number'),
                'end_date' => Carbon::parse($request->input('end_date'))->format('Y-m-d H:i:s'),
                'travel_expenses' => $request->input('travel_expenses', 0.00),
                'bonus_amount' => $request->input('bonus_amount', 0.00),
            ]);

            return response()->json($medewerker, 200);

        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Medewerker not found.'], 404);
        } catch (QueryException $e) {
            return response()->json(['error' => 'Database error: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
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
            
        }

        $medewerker = medewerkers::find($id);
        if ($medewerker) {
            $medewerker->delete();
            return redirect()->route('medewerkers');
        }else {
            return redirect()->route('medewerkers')->with('error');
        }

        // $medewerkers = Medewerkers::get();
        // return Inertia::render('Medewerkers', ['medewerkers' => $medewerkers]);

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

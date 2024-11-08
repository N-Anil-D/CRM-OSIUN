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
        if ($request->tab_one) {
            $validator = Validator::make($request->all(), [
                'id' => 'required|numeric',
                'Rijbewijsnummer' => 'string', // rijbewijsnummer ?
                'Afgegeven_op' => 'string', // rij_afgegeven_op ?
                'Gedlig_tot' => 'string', // rij_gedlig_tot ?
                'Adres' => 'string', // address
                'Postcode' => 'string', // postal_code
                'Woonplaats' => 'string', // residence
                'Huisnummer' => 'string', // house_number
                // 'proeftijd' => 'datetime', // proeftijd
            ]);
                
            if ($validator->fails()) {
                $validator->errors();
            }
            $validated = $validator->validated();

            $employee = medewerkers::find($validated['id']);
            $employee->address = $validated['Adres'];
            $employee->postal_code = $validated['Postcode'];
            $employee->residence = $validated['Woonplaats'];
            $employee->house_number = $validated['Huisnummer'];
            // $employee->proeftijd = $validated['proeftijd'];
            $employee->save();
            try {
            } catch (\Throwable $th) {
                //throw $th;
            }
            return redirect()->route('medewerker', ['id' => $validated['id']]);

        }elseif ($request->tab_two) {
            $validator = Validator::make($request->all(), [
                'id' => 'required|numeric',
                'iban_number' => 'string',
                'bsn_number' => 'string',
                'hourly_rate' => 'string',
                'travel_allowance' => 'string', 
                'travel_expenses' => 'string', 
                // 'bonus_amount' => 'string', 
            ]);
                
            if ($validator->fails()) {
                $validator->errors();
            }
            $validated = $validator->validated();

            $employee = medewerkers::find($validated['id']);
            $employee->iban_number = $validated['iban_number'];
            $employee->bsn_number = $validated['bsn_number'];
            $employee->hourly_rate = $validated['hourly_rate'];
            $employee->travel_allowance = $validated['travel_allowance'];
            $employee->travel_expenses = $validated['travel_expenses'];
            // $employee->bonus_amount = $validated['bonus_amount'];
            $employee->save();
            try {
            } catch (\Throwable $th) {
                //throw $th;
            }
            return redirect()->route('medewerker', ['id' => $validated['id']]);

        }elseif ($request->tab_three) {
            $validator = Validator::make($request->all(), [
                'id' => 'required|numeric',
                'contracttype' => 'string',
                'contracturen' => 'string',
                // 'contract_starten' => 'string',
                // 'einde_contract' => 'string',
                // 'Registratiedatum' => 'string',
            ]);
                
            if ($validator->fails()) {
                $validator->errors();
            }
            $validated = $validator->validated();

            $employee = medewerkers::find($validated['id']);
            $employee->contract_type = $validated['contracttype'];
            $employee->contract_hours = $validated['contracturen'];
            // $employee->start_date = $validated['hourly_rate'];
            // $employee->end_date = $validated['travel_allowance'];
            // $employee->created_at = $validated['travel_expenses'];
            $employee->save();
            try {
            } catch (\Throwable $th) {
                //throw $th;
            }
            return redirect()->route('medewerker', ['id' => $validated['id']]);

        }elseif ($request->tab_four) {
            $validator = Validator::make($request->all(), [
                'id' => 'required|numeric',
                'rights' => 'string|max:50',
            ]);
                
            if ($validator->fails()) {
                $validator->errors();
            }
            $validated = $validator->validated();

            $employee = medewerkers::find($validated['id']);
            $employee->rights = $validated['rights'];
            $employee->save();
            try {
            } catch (\Throwable $th) {
                //throw $th;
            }
            return redirect()->route('medewerker', ['id' => $validated['id']]);

        }else{
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

}

<?php

namespace App\Http\Controllers;

use Exception;
use http\Env\Response;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use App\Models\CustomerAsignedRooms;
use InvalidArgumentException;
use Illuminate\Support\Facades\Log;

class RoomAsigneControlles extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('CustomerID')) {
            $asignedRooms = CustomerAsignedRooms::where('CustomerID', $request->CustomerID);
            return response()->json(['asignedrooms' => $asignedRooms], 200);
        } elseif ($request->has('LocationID')) {
            $asignedRooms = CustomerAsignedRooms::where('CustomerID', $request->LocationID);
            return response()->json(['asignedrooms' => $asignedRooms], 200);
        }
    }

    public function getlocationsasignedrooms(Request $request)
    {
        try {
            $asignedRooms =
                CustomerAsignedRooms::where('LocationID', $request->locatieID)->get();//Burada Customer ile işimiz yok çünkü lokasyon odalarını customerlara atıyoruz.
            return response()->json(['asignedrooms' => $asignedRooms], 200);
        } catch (QueryException $e) {
            // Veritabanı ile ilgili bir hata olduğunda
            Log::error('Database error: ' . $e->getMessage());
            return response()->json(['error' => 'Veritabanı hatası oluştu.'], 500);

        } catch (AuthenticationException $e) {
            // Kimlik doğrulama hatası olduğunda
            Log::error('Authentication error: ' . $e->getMessage());
            return response()->json(['error' => 'Kimlik doğrulama hatası.'], 401);

        } catch (InvalidArgumentException $e) {
            // Geçersiz argüman hatası olduğunda
            Log::error('Invalid argument: ' . $e->getMessage());
            return response()->json(['error' => 'Geçersiz veri sağlandı.'], 400);

        } catch (Exception $e) {
            // Genel hata yakalama
            Log::error('General error: ' . $e->getMessage());
            return response()->json(['error' => 'Beklenmeyen bir hata oluştu.'], 500);
        }
    }

    public function updateClientRooms(Request $request)
    {
        try {
            if (!$request->has('customerID') &&
                !$request->has('locatieID') &&
                !$request->has('rooms') &&
                !is_array($request->rooms)) {
                return response()->json(['error' => 'Data hatalı gelmiştir.'], 300);
            }
            $odalar = $request->rooms;
            $asigneds = CustomerAsignedRooms::where('CustomerID', $request->customerID)->where('LocationID', $request->locatieID)->delete();
            if (is_array($odalar))
                foreach ($request->rooms as $room) {
                    CustomerAsignedRooms::create([
                        'CustomerID' => $request->customerID,
                        'LocationID' => $request->locatieID,
                        'roomID' => $room['id'],
                        'percentage' => $room['percentage'],
                    ]);
                }
            else return response()->json(['error' => 'Odalar Datalari hatali geldi.'], 300);
            return response()->json('başarılı', 200);
        } catch (QueryException $e) {
            // Veritabanı ile ilgili bir hata olduğunda
            Log::error('Database error: ' . $e->getMessage());
            return response()->json(['error' => 'Veritabanı hatası oluştu.'], 500);

        } catch (AuthenticationException $e) {
            // Kimlik doğrulama hatası olduğunda
            Log::error('Authentication error: ' . $e->getMessage());
            return response()->json(['error' => 'Kimlik doğrulama hatası.'], 401);

        } catch (InvalidArgumentException $e) {
            // Geçersiz argüman hatası olduğunda
            Log::error('Invalid argument: ' . $e->getMessage());
            return response()->json(['error' => 'Geçersiz veri sağlandı.'], 400);

        } catch (Exception $e) {
            // Genel hata yakalama
            Log::error('General error: ' . $e->getMessage());
            return response()->json(['error' => 'Beklenmeyen bir hata oluştu.'], 500);
        }

    }
    public function asignClientRooms(Request $request)
    {
        try {
            if (!$request->has('customerID') &&
                !$request->has('locatieID') &&
                !$request->has('rooms') &&
                !is_array($request->rooms)) {
                return response()->json(['error' => 'Data hatalı gelmiştir.'], 300);
            }
            $odalar = $request->rooms;
            //$asigneds = CustomerAsignedRooms::where('CustomerID', $request->customerID)->where('LocationID', $request->locatieID)->delete();
            if (is_array($odalar))
                foreach ($request->rooms as $room) {
                    CustomerAsignedRooms::create([
                        'CustomerID' => $request->customerID,
                        'LocationID' => $request->locatieID,
                        'roomID' => $room['id'],
                        'percentage' => $room['percentage'],
                    ]);
                }
            else return response()->json(['error' => 'Odalar Datalari hatali geldi.'], 300);
            return response()->json('başarılı', 200);
        } catch (QueryException $e) {
            // Veritabanı ile ilgili bir hata olduğunda
            Log::error('Database error: ' . $e->getMessage());
            return response()->json(['error' => 'Veritabanı hatası oluştu.'], 500);

        } catch (AuthenticationException $e) {
            // Kimlik doğrulama hatası olduğunda
            Log::error('Authentication error: ' . $e->getMessage());
            return response()->json(['error' => 'Kimlik doğrulama hatası.'], 401);

        } catch (InvalidArgumentException $e) {
            // Geçersiz argüman hatası olduğunda
            Log::error('Invalid argument: ' . $e->getMessage());
            return response()->json(['error' => 'Geçersiz veri sağlandı.'], 400);

        } catch (Exception $e) {
            // Genel hata yakalama
            Log::error('General error: ' . $e->getMessage());
            return response()->json(['error' => 'Beklenmeyen bir hata oluştu.'], 500);
        }

    }
}

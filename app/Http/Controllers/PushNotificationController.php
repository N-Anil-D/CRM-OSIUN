<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\push_subscriptions;
use InvalidArgumentException;

class PushNotificationController extends Controller
{
    public function subscribe(Request $request)
    {
        try {
            // Abonelik verisini al
            $subscription = $request->input();
            $user = Auth::user();
            $olds = push_subscriptions::where('user_id', Auth::id());
            $olds->delete();
            // Abonelik verisini veritabanına kaydet
            $creator = push_subscriptions::create([
                'user_id' => $user->id,
                'endpoint' => $subscription['endpoint'],
                'public_key' => $subscription['keys']['p256dh'],
                'auth_token' => $subscription['keys']['auth']
            ]);

            // Başarılı abonelik yanıtı döndür
            return response()->json(['success' => true], 200);

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

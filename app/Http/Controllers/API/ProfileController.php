<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\user_auth_customer;
use App\Models\user_auth_buildings;
use App\Models\user_page_auth;
use Exception;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    public function updateOther(Request $request): JsonResponse
    {
        try {
            Log::info('updateOther fonksiyonu başlatıldı.', ['userid' => $request->input('id')]);

            $userid = $request->input('id');
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => [
                    'required',
                    'email',
                    Rule::unique('users')->ignore($userid), // Güncellenen kullanıcı ID'sini kullanarak unique kontrolü yap
                ]
            ]);
            $user = User::findOrFail($userid);
            Log::info('Kullanıcı veritabanında bulundu.', ['user' => $user]);

            // Kullanıcı verilerini güncelle
            $user->update([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'email_verified_at' => $request->input('email_verified_at'),
                'bann' => $request->input('bann'),
                'roleName' => $request->input('roleName'),
                'connectedBuild' => $request->input('connectedBuild'),
                'connectedCustomer' => $request->input('connectedCustomer'),
            ]);
            Log::info('Kullanıcı bilgileri güncellendi.', ['user' => $user]);

            // İzinleri güncelle
            if ($request->has('permissions')) {
                user_page_auth::where('userid', $userid)->delete();
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
                                    $relatedChild = user_page_auth::create([
                                        'userid' => $userid,
                                        'page_name' => $child['page_name'],
                                        'parent_id' => $relatedAuth->id,
                                        'path' => $child['path'],
                                        'read' => $child['read'],
                                        'write' => $child['write'],
                                        'delete' => $child['delete'],
                                    ]);
                                    if(isset($child['children'])) {

                                        if (is_string($child['children'])) {
                                            $child['children'] = json_decode($child['children'], true);
                                        }
                                        if(is_array($child['children'])) {
                                            foreach ($child['children'] as $baby) {
                                                user_page_auth::create([
                                                    'userid' => $userid,
                                                    'page_name' => $baby['page_name'],
                                                    'parent_id' => $relatedChild->id,
                                                    'path' => $baby['path'],
                                                    'read' => $baby['read'],
                                                    'write' => $baby['write'],
                                                    'delete' => $baby['delete'],
                                                ]);

                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }else {Log::info('izin verisi bulunamadı');}

            // Client ilişkileri
            if ($request->input('connectedCustomer') == 'ALL') {
                Log::info('Tüm client yetkileri siliniyor.');
                user_auth_customer::where('userid', $userid)->delete();
            } elseif ($request->has('willclients')) {
                Log::info('Client yetkileri güncelleniyor.');
                user_auth_customer::where('userid', $userid)->delete();
                $clients = $request->input('willclients');
                foreach ($clients as $client) {
                    user_auth_customer::create([
                        'userid' => $userid,
                        'customerid' => $client['value'],
                    ]);
                    Log::info('Yeni client yetkisi eklendi.', ['clientid' => $client['value']]);
                }
            }

            // Location ilişkileri
            if ($request->input('connectedBuild') == 'ALL') {
                Log::info('Tüm location yetkileri siliniyor.');
                user_auth_buildings::where('userid', $userid)->delete();
            } elseif ($request->has('willbuilds')) {
                Log::info('Location yetkileri güncelleniyor.');
                user_auth_buildings::where('userid', $userid)->delete();
                $buildings = $request->input('willbuilds');
                foreach ($buildings as $building) {
                    user_auth_buildings::create([
                        'userid' => $userid,
                        'buildid' => $building['value'],
                    ]);
                    Log::info('Yeni location yetkisi eklendi.', ['buildid' => $building['value']]);
                }
            }

            // Eğer e-mail değişmişse email_verified_at'ı sıfırla ve sadece bu durumda kaydet
            if ($user->isDirty('email')) {
                Log::info('Email değişikliği algılandı, email_verified_at sıfırlanıyor.');
                $user->email_verified_at = null;
                $user->save();
                Log::info('Kullanıcı email ve verified_at güncellendi.');
            }

            Log::info('updateOther fonksiyonu başarıyla tamamlandı.');

            return response()->json([
                'status' => 'success',
                'message' => 'Profile Data Has Been Updated.',
            ], 200);

        } catch (Exception $e) {
            // Hata olduğunda log kaydı ve hata mesajı döndürme
            Log::error('updateOther fonksiyonunda hata oluştu.', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return  response()->json([
                'status' => 'error',
                'message' => 'An error occurred while updating profile data.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}

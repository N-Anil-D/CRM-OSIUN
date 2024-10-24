<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Auth\AuthManager;
use App\Models\User;
use Inertia\Inertia;

class AuthController extends Controller
{
    ///*
    public function authenticate(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            // Kullanıcının rollerini ve yetkilerini al
            $roles = $user->roles()->with('permissions')->get();
            $permissions = $roles->pluck('permissions')->flatten()->pluck('name');

            // Kullanıcıyı yönlendir
            if ($user->can('access-ticket')) {
                return redirect()->route('tickets');
            } else {
                return redirect()->route('dashboard', [
                    'user' => $user,
                    'permissions' => $permissions,
                ]);
            }
        }

        return back()->withErrors(['email' => 'Hatalı kimlik bilgileri']);
    }
}

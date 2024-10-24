<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Str;
use App\Notifications\PasswordUpdated;
use Illuminate\Support\Facades\Notification;


class PasswordController extends Controller
{
    /**
     * Update the user's password.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back();
    }

    public function updateOther(Request $request): RedirectResponse
    {
        $userData = $request->input('user');
        $user = User::findOrFail($userData['id']);

        $password = Str::random(8);

        $user->password = Hash::make($password);
        $user->setRememberToken(Str::random(60));

        $user->save();

        $user->notify(new PasswordUpdated($password));

        return back();
    }
}

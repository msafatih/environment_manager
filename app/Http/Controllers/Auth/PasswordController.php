<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePasswordRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;

use Illuminate\Support\Facades\Hash;

class PasswordController extends Controller
{
    /**
     * Update the user's password.
     */
    public function update(User $user, UpdatePasswordRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();

        if (!Hash::check($validatedData['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Kata sandi saat ini tidak cocok.'],
            ]);
        }
        $user->update([
            'password' => Hash::make($validatedData['password']),
        ]);
        return back()->with('status', 'Password updated successfully.');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function index()
    {
        $users = User::latest()->get();
        return Inertia::render('users/index', [
            'users' => $users
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'role' => 'required|in:super_admin,admin_operasional,staff',
            'password' => ['required', Password::defaults()],
        ]);

        User::create($validated);

        return redirect()->back()->with('success', 'User created successfully.');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|in:super_admin,admin_operasional,staff',
        ]);

        if ($request->filled('password')) {
            $request->validate(['password' => [Password::defaults()]]);
            $validated['password'] = bcrypt($request->password);
        }

        $user->update($validated);

        return redirect()->back()->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->back()->with('success', 'User deleted successfully.');
    }
}

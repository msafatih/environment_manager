<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $this->authorize(ability: 'view-users');
        $users = User::orderBy('full_name')
            ->get();

        /** @var \App\Models\User $user */
        $user = Auth::user();
        return Inertia::render('Dashboard/Users/Index', [
            'users' => $users,
            'canEditUsers' => $user->can('edit-users'),
            'canDeleteUsers' => $user->can('delete-users'),
            'canCreateUsers' => $user->can('create-users'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        $this->authorize(ability: 'create-users');

        $roles = \Spatie\Permission\Models\Role::all();

        return Inertia::render('Dashboard/Users/Create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        //
        $validated = $request->validated();
        try {
            $user = User::create([
                'full_name' => $validated['full_name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);
            $user->assignRole($validated['role']);

            return redirect()->route('users.index')->with('success', 'User created successfully!');
        } catch (\Exception $e) {
            Log::error('Failed to create user: ' . $e->getMessage(), [
                'user' => $validated['full_name'],
                'email' => $validated['email'],
                'role' => $validated['role'],
            ]);
            return redirect()->back()->with('error', 'Failed to create user: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified user including their groups, roles and permissions.
     *
     * @param User $user
     * @return \Inertia\Response
     */
    public function show(User $user)
    {
        // Authorize the action
        $this->authorize(ability: 'view-users');

        $user->load([
            'roles.permissions',
            'permissions',
            'groupMembers',
            'groupMembers.group'
        ]);

        $directPermissions = $user->getDirectPermissions()->values();
        $allPermissions = $user->getAllPermissions()->values();
        $rolePermissions = $allPermissions->filter(function ($permission) use ($directPermissions) {
            return !$directPermissions->contains('id', $permission->id);
        })->values();

        $permissionsByCategory = $allPermissions->groupBy(function ($permission) {
            $parts = explode('-', $permission->name);
            if (count($parts) >= 2) {
                return $parts[1]; // The resource/category part (e.g., "users" from "create-users")
            }
            return 'other';
        });


        return Inertia::render('Dashboard/Users/Show', [
            'user' => $user,
            'roles' => $user->roles,
            'direct_permissions' => $directPermissions,
            'role_permissions' => $rolePermissions,
            'permissions_by_category' => $permissionsByCategory->map(function ($permissions) {
                return $permissions->map->only(['id', 'name', 'guard_name']);
            }),

        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
        $this->authorize(ability: 'edit-users');
        return Inertia::render('Dashboard/Users/Edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        //
        try {
            $validated = $request->validated();
            $user->update($validated);
            return redirect()->route('users.index')->with('success', 'User updated successfully!');
        } catch (\Exception $e) {
            Log::error('Failed to update user: ' . $e->getMessage(), [
                'user' => $user->full_name,
                'email' => $user->email,
                'role' => $user->getRoleNames()->first(),
            ]);
            return redirect()->back()->with('error', 'Failed to update user: ' . $e->getMessage());
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $this->authorize(ability: 'delete-users');
        try {
            $user->delete();
            return redirect()->route('users.index')->with('success', 'User deleted successfully!');
        } catch (\Exception $e) {
            Log::error('Failed to delete user: ' . $e->getMessage(), [
                'user' => $user->full_name,
                'email' => $user->email,
                'role' => $user->getRoleNames()->first(),
            ]);
            return redirect()->back()->with('error', 'Failed to delete user: ' . $e->getMessage());
        }
    }
}

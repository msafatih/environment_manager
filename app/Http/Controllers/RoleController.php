<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $this->authorize(ability: 'view-roles');

        $roles = Role::orderBy('name')
            ->with(['permissions', 'users'])
            ->get();

        /** @var \App\Models\User $user */
        $user = Auth::user();
        return Inertia::render('Dashboard/Roles/Index', [
            'roles' => $roles,
            'canViewRoles' => $user->can('view-roles'),
            'canEditRoles' => $user->can('edit-roles'),
            'canDeleteRoles' => $user->can('delete-roles'),
            'canCreateRoles' => $user->can('create-roles'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $this->authorize(ability: 'create-roles');

        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
        ]);

        try {
            Role::create($request->only('name'));
            return redirect()->route('roles.index')->with('success', 'Role created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to create role.']);
        }
    }

    /**
     * Display the specified resource.
     */

    public function show(Role $role)
    {
        //
        $this->authorize(ability: 'view-roles');

        $permissions = Permission::orderBy('name')->get();
        $users = User::orderBy('full_name')->get();

        $role->load(['permissions', 'users']);


        /** @var \App\Models\User $user */
        $user = Auth::user();
        return Inertia::render('Dashboard/Roles/Show', [
            'role' => $role,
            'users' => $users,
            'permissions' => $permissions,
            'canGivePermission' => $user->can('give-permissions'),
            'canAssignRole' => $user->can('assign-roles'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        //

        $this->authorize(ability: 'edit-roles');

        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
        ]);

        try {
            $role->update($request->only('name'));
            return redirect()->route('roles.index')->with('success', 'Role updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to update role.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        //
        $this->authorize(ability: 'delete-roles');

        try {
            $role->delete();
            return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to delete role.']);
        }
    }

    public function updatePermissions(Request $request, Role $role)
    {
        $this->authorize(ability: 'give-permissions');

        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'integer|exists:permissions,id',
        ]);

        try {
            $permissions = Permission::whereIn('id', $request->input('permissions'))->get();
            $role->syncPermissions($permissions);
            return redirect()->route('roles.show', $role)->with('success', 'Permissions given successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to give permission.']);
        }
    }

    public function updateRoles(Request $request, Role $role)
    {
        $this->authorize(ability: 'assign-roles');

        $request->validate([
            'users' => 'required|array',
            'users.*' => 'integer|exists:users,id',
        ]);

        try {
            $users = User::whereIn('id', $request->input('users'))->get();
            $role->users()->sync($users);
            return redirect()->route('roles.show', $role)->with('success', 'Users assigned successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to assign users.']);
        }
    }
}

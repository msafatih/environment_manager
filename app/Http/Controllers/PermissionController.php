<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PermissionController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $this->authorize(ability: 'view-permissions');

        $permissions = \Spatie\Permission\Models\Permission::orderBy('name')->get();
        /** @var \App\Models\User $user */
        $user = Auth::user();


        return Inertia::render('Dashboard/Permissions/Index', [
            'permissions' => $permissions,
            'canEditPermissions' => $user->can('edit-permissions'),
            'canCreatePermissions' => $user->can('create-permissions'),
            'canDeletePermissions' => $user->can('delete-permissions'),
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $this->authorize(ability: 'create-permissions');
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
            'guard_name' => 'required|string|max:255',
        ]);

        try {
            \Spatie\Permission\Models\Permission::create($request->only('name', 'guard_name'));
            return redirect()->route('permissions.index')->with('success', 'Permission created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to create permission.']);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $this->authorize(ability: 'edit-permissions');
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $id,
            'guard_name' => 'required|string|max:255',
        ]);

        try {
            $permission = \Spatie\Permission\Models\Permission::findOrFail($id);
            $permission->update($request->only('name', 'guard_name'));
            return redirect()->route('permissions.index')->with('success', 'Permission updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to update permission.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $this->authorize(ability: 'delete-permissions');

        try {
            $permission = \Spatie\Permission\Models\Permission::findOrFail($id);
            $permission->delete();
            return redirect()->route('permissions.index')->with('success', 'Permission deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to delete permission.']);
        }
    }
}

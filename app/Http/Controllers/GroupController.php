<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Models\GroupMember;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\DB;

class GroupController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize(ability: 'view-groups');

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $groups = Group::with(['groupMembers'])
            ->orderBy('name')
            ->get();

        return Inertia::render('Dashboard/Groups/Index', [
            'groups' => $groups,
            'canCreateGroup' => $user->can('create-groups'),
            'canEditGroup' => $user->can('edit-groups'),
            'canDeleteGroup' => $user->can('delete-groups'),
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        $this->authorize(ability: 'create-groups');

        return Inertia::render('Dashboard/Groups/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGroupRequest $request)
    {
        //
        $validatedData = $request->validated();
        try {
            $group = Group::create([
                'name' => $validatedData['name'],
                'description' => $validatedData['description'],
                'slug' => Str::slug($validatedData['name']),
            ])->load([
                'groupMembers',
                'applications'
            ]);

            /** @var \App\Models\User $user */
            $user = Auth::user();

            // Create group-specific permissions
            $viewPermission = Permission::create(['name' => 'view-group-' . $group->slug]);
            $editPermission = Permission::create(['name' => 'edit-group-' . $group->slug]);
            $deletePermission = Permission::create(['name' => 'delete-group-' . $group->slug]);

            $createMembersPermission = Permission::create(['name' => 'create-groupMembers-' . $group->slug]);
            $editMembersPermission = Permission::create(['name' => 'edit-groupMembers-' . $group->slug]);
            $deleteMembersPermission = Permission::create(['name' => 'delete-groupMembers-' . $group->slug]);

            $viewAppsPermission = Permission::create(['name' => 'view-applications-' . $group->slug]);
            $createAppsPermission = Permission::create(['name' => 'create-applications-' . $group->slug]);
            $editAppsPermission = Permission::create(['name' => 'edit-applications-' . $group->slug]);
            $deleteAppsPermission = Permission::create(['name' => 'delete-applications-' . $group->slug]);

            // Assign all permissions to the user
            $user->givePermissionTo([
                $viewPermission,
                $editPermission,
                $deletePermission,
                $createMembersPermission,
                $editMembersPermission,
                $deleteMembersPermission,
                $viewAppsPermission,
                $createAppsPermission,
                $editAppsPermission,
                $deleteAppsPermission
            ]);

            GroupMember::create([
                'user_id' => $user->id,
                'group_id' => $group->id,
                'role' => 'admin',
            ]);

            return redirect()->route('groups.index')->with('success', 'Group created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to create group: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Group $group)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        // Use a custom gate check instead
        if (!$user->can('view-groups') && !$user->can('view-group-' . $group->slug)) {
            $this->authorize('view-groups'); // This will throw the appropriate 403 exception
        }

        $group->load(
            'groupMembers',
            'groupMembers.user',
            'applications'
        );

        // Also add group-specific permissions
        return Inertia::render('Dashboard/Groups/Show', [
            'group' => $group,
            'canViewApplications' => $user->can('view-applications') || $user->can('view-applications-' . $group->slug),
            'canViewGroupMembers' => $user->can('view-groupMembers') || $user->can('view-groupMembers-' . $group->slug),
            'canCreateGroupMembers' => $user->can('create-groupMembers') || $user->can('create-groupMembers-' . $group->slug),
            'canEditGroupMembers' => $user->can('edit-groupMembers') || $user->can('edit-groupMembers-' . $group->slug),
            'canDeleteGroupMembers' => $user->can('delete-groupMembers') || $user->can('delete-groupMembers-' . $group->slug),
        ]);
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Group $group)
    {
        //
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->can('edit-groups') && !$user->can('edit-group-' . $group->slug)) {
            $this->authorize('view-groups'); // This will throw the appropriate 403 exception
        }
        return Inertia::render('Dashboard/Groups/Edit', [
            'group' => $group,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGroupRequest $request, Group $group)
    {
        //
        $validatedData = $request->validated();
        try {
            $group->update($validatedData);
            return redirect()->route('groups.index')->with('success', 'Group updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update group: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified group and clean up associated permissions.
     *
     * @param Group $group
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Group $group)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check if user has either global or group-specific delete permission
        if (!$user->can('delete-groups') && !$user->can('delete-group-' . $group->slug)) {
            $this->authorize('delete-group-' . $group->slug); // Throw the specific permission exception
        }

        try {
            // Start a database transaction to ensure all operations succeed or fail together
            DB::beginTransaction();

            // Load group members to revoke their permissions
            $group->load('groupMembers.user');

            // Get all group-specific permissions
            $groupPermissions = [
                'view-group-' . $group->slug,
                'edit-group-' . $group->slug,
                'delete-group-' . $group->slug,
                'create-groupMembers-' . $group->slug,
                'edit-groupMembers-' . $group->slug,
                'delete-groupMembers-' . $group->slug,
                'view-applications-' . $group->slug,
                'create-applications-' . $group->slug,
                'edit-applications-' . $group->slug,
                'delete-applications-' . $group->slug,
            ];

            // Revoke permissions from all group members
            foreach ($group->groupMembers as $member) {
                if ($member->user) {
                    $member->user->revokePermissionTo($groupPermissions);
                }
            }

            // Delete the group-specific permissions
            Permission::whereIn('name', $groupPermissions)->delete();

            // Delete the group (this will cascade delete group members due to foreign key constraints)
            $group->delete();

            DB::commit();

            return redirect()
                ->route('groups.index')
                ->with('success', 'Group deleted successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            report($e); // Log the error

            return redirect()
                ->back()
                ->with('error', 'Failed to delete group: ' . $e->getMessage());
        }
    }

    /**
     * Show form to add members to a group
     *
     * @param Group $group
     * @return \Inertia\Response | \Illuminate\Http\RedirectResponse
     */
    public function createGroupMembers(Group $group)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check if user has either global or group-specific permission
        if (!$user->can('create-groupMembers') && !$user->can('create-groupMembers-' . $group->slug)) {
            // Better to throw the specific permission that's required
            $this->authorize('create-groupMembers-' . $group->slug);
        }


        try {
            // Efficiently load only what's needed - just the user_id from group members
            $group->load('groupMembers.user');


            // Get existing member IDs more efficiently
            $existingMemberIds = $group->groupMembers->pluck('user_id')->toArray();

            // Get available users with pagination and minimal fields
            $availableUsers = User::select(['id', 'email', 'full_name', 'created_at'])
                ->whereNotIn('id', $existingMemberIds)
                ->orderBy('full_name')
                ->get();

            return Inertia::render('Dashboard/Groups/GroupMembers/Create', [
                'group' => $group,
                'users' => $availableUsers,
                'canCreateGroupMembers' => true, // We know the user has permission since they got here
            ]);
        } catch (\Exception $e) {
            report($e); // Log the error
            return redirect()->route('groups.show', $group)->with('error', 'Error loading user data: ' . $e->getMessage());
        }
    }

    public function storeGroupMembers(Request $request, Group $group)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        // Check if user has either global or group-specific permission
        if (!$user->can('create-groupMembers') && !$user->can('create-groupMembers-' . $group->slug)) {
            // Better to throw the specific permission that's required
            $this->authorize('create-groupMembers-' . $group->slug);
        }

        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|string|max:255|in:admin,member',
        ]);

        try {
            $groupMember = $group->groupMembers()->create($validatedData);
            $user = $groupMember->user;
            // Assign group-specific permissions to the user
            if ($groupMember->role === 'admin') {
                $user->givePermissionTo([
                    'view-group-' . $group->slug,
                    'edit-group-' . $group->slug,
                    'delete-group-' . $group->slug,
                    'create-groupMembers-' . $group->slug,
                    'edit-groupMembers-' . $group->slug,
                    'delete-groupMembers-' . $group->slug,
                    'view-applications-' . $group->slug,
                    'create-applications-' . $group->slug,
                    'edit-applications-' . $group->slug,
                    'delete-applications-' . $group->slug,
                ]);
            } else {
                $user->givePermissionTo([
                    'view-group-' . $group->slug,
                    'view-applications-' . $group->slug,
                ]);
            }
            return redirect()->route('groups.show', $group)->with('success', 'Group member added successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to add group member: ' . $e->getMessage());
        }
    }

    /**
     * Update a group member's role
     * 
     * @param Request $request
     * @param Group $group
     * @param GroupMember $groupMember
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateGroupMembers(Request $request, Group $group, GroupMember $groupMember)
    {
        /** @var \App\Models\User $authUser */
        $authUser = Auth::user();
        if (!$authUser->can('edit-groupMembers') && !$authUser->can('edit-groupMembers-' . $group->slug)) {
            $this->authorize('edit-groupMembers-' . $group->slug);
        }

        $validatedData = $request->validate([
            'role' => 'required|string|max:255|in:admin,member',
        ]);

        try {
            $user = $groupMember->user;


            // Handle role change
            if ($validatedData['role'] === 'admin' && $groupMember->role !== 'admin') {
                // Moving from member to admin - add admin permissions
                $user->givePermissionTo([
                    'view-group-' . $group->slug,
                    'edit-group-' . $group->slug,
                    'delete-group-' . $group->slug,
                    'create-groupMembers-' . $group->slug,
                    'edit-groupMembers-' . $group->slug,
                    'delete-groupMembers-' . $group->slug,
                    'view-applications-' . $group->slug,
                    'create-applications-' . $group->slug,
                    'edit-applications-' . $group->slug,
                    'delete-applications-' . $group->slug,
                ]);
            } elseif ($validatedData['role'] !== 'admin' && $groupMember->role === 'admin') {
                // Moving from admin to member - revoke admin permissions
                $user->revokePermissionTo([
                    'edit-group-' . $group->slug,
                    'delete-group-' . $group->slug,
                    'create-groupMembers-' . $group->slug,
                    'edit-groupMembers-' . $group->slug,
                    'delete-groupMembers-' . $group->slug,
                    'create-applications-' . $group->slug,
                    'edit-applications-' . $group->slug,
                    'delete-applications-' . $group->slug,
                ]);

                // Keep basic member permissions
                $user->givePermissionTo([
                    'view-group-' . $group->slug,
                    'view-applications-' . $group->slug,
                ]);
            }

            // Update the group member's role
            $groupMember->role = $validatedData['role'];

            $groupMember->save();

            return redirect()
                ->route('groups.show', $group)
                ->with('success', 'Group member updated successfully!');
        } catch (\Exception $e) {
            report($e); // Log the error
            return redirect()
                ->back()
                ->with('error', 'Failed to update group member: ' . $e->getMessage());
        }
    }

    public function destroyGroupMembers(Group $group, GroupMember $groupMember)
    {
        $this->authorize(ability: 'delete-groupMembers');

        try {
            if ($groupMember->role === 'admin') {
                // Remove group-specific permissions from the user
                $user = $groupMember->user;
                $user->revokePermissionTo([
                    'view-group-' . $group->slug,
                    'edit-group-' . $group->slug,
                    'delete-group-' . $group->slug,
                    'view-groupMembers-' . $group->slug,
                    'create-groupMembers-' . $group->slug,
                    'edit-groupMembers-' . $group->slug,
                    'delete-groupMembers-' . $group->slug,
                    'view-applications-' . $group->slug,
                    'create-applications-' . $group->slug,
                    'edit-applications-' . $group->slug,
                    'delete-applications-' . $group->slug,
                ]);
            } else {
                // Remove only the view-group and view-applications permissions
                $user = $groupMember->user;
                $user->revokePermissionTo([
                    'view-group-' . $group->slug,
                    'view-applications-' . $group->slug,
                ]);
            }
            $groupMember->delete();

            return redirect()->route('groups.show', $group)->with('success', 'Group member removed successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to remove group member: ' . $e->getMessage());
        }
    }
}

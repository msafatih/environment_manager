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

class GroupController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize(ability: 'view-groups');

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $groups = Group::with(['groupMembers', 'applications'])
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
            $group = Group::create($validatedData);
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
        //
        $this->authorize(ability: 'view-groups');

        $group->load(
            'groupMembers',
            'groupMembers.user',
            'applications'
        );
        /** @var \App\Models\User $user */
        $user = Auth::user();


        return Inertia::render('Dashboard/Groups/Show', [
            'group' => $group,
            'canAddApplications' => $user->can('create-applications'),
            'canViewApplications' => $user->can('view-applications'),
            'canCreateApplications' => $user->can('create-applications'),
            'canEditApplications' => $user->can('edit-applications'),
            'canDeleteApplications' => $user->can('delete-applications'),
            'canAddGroupMembers' => $user->can('create-groupMembers'),
            'canViewGroupMembers' => $user->can('view-groupMembers'),
            'canCreateGroupMembers' => $user->can('create-groupMembers'),
            'canEditGroupMembers' => $user->can('edit-groupMembers'),
            'canDeleteGroupMembers' => $user->can('delete-groupMembers'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Group $group)
    {
        //
        $this->authorize(ability: 'edit-groups');

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
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group)
    {
        //
    }

    public function createGroupMembers(Group $group)
    {
        $this->authorize(ability: 'create-groupMembers');

        // Load group members with their user information
        $group->load('groupMembers.user');

        // Get all existing group member user IDs
        $existingMemberIds = $group->groupMembers->pluck('user_id')->toArray();

        // Get all users except those who are already members
        $availableUsers = User::whereNotIn('id', $existingMemberIds)->get();

        return Inertia::render('Dashboard/Groups/GroupMembers/Create', [
            'group' => $group,
            'users' => $availableUsers,
        ]);
    }

    public function storeGroupMembers(Request $request, Group $group)
    {
        $this->authorize(ability: 'create-groupMembers');

        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|string|max:255',
        ]);

        try {
            $group->groupMembers()->create($validatedData);
            return redirect()->route('groups.show', $group)->with('success', 'Group member added successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to add group member: ' . $e->getMessage());
        }
    }

    public function updateGroupMembers(Request $request, Group $group, GroupMember $groupMember)
    {
        $this->authorize(ability: 'edit-groupMembers');

        $validatedData = $request->validate([
            'role' => 'required|string|max:255',
        ]);

        try {
            $groupMember->update($validatedData);
            return redirect()->route('groups.show', $group)->with('success', 'Group member updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update group member: ' . $e->getMessage());
        }
    }

    public function destroyGroupMembers(Group $group, GroupMember $groupMember)
    {
        $this->authorize(ability: 'delete-groupMembers');

        try {
            $groupMember->delete();
            return redirect()->route('groups.show', $group)->with('success', 'Group member removed successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to remove group member: ' . $e->getMessage());
        }
    }
}

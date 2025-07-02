<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\EnvValueChange;
use App\Http\Requests\StoreEnvValueChangeRequest;
use App\Http\Requests\UpdateEnvValueChangeRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class EnvValueChangeController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize(ability: 'view-any-env-value-changes');

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $isSuperAdmin = $user->roles->contains(function ($role) {
            return strtolower($role->name) === 'super-admin';
        });

        $query = EnvValueChange::orderBy('created_at', 'desc')
            ->with([
                'user',
                'envValue',
                'envValue.envVariable',
                'envValue.envVariable.application',
                'envValue.accessKey',
                'envValue.accessKey.envType',
            ]);

        if ($isSuperAdmin) {
            $envValueChanges = $query->get();
        } else {
            $userGroupIds = $user->groupMembers->pluck('group_id')->toArray();
            $allChanges = $query->get();
            $envValueChanges = $allChanges->filter(function ($change) use ($user, $userGroupIds) {
                if (
                    !$change->envValue ||
                    !$change->envValue->envVariable ||
                    !$change->envValue->envVariable->application ||
                    !$change->envValue->accessKey ||
                    !$change->envValue->accessKey->envType
                ) {
                    return false;
                }

                $application = $change->envValue->envVariable->application;
                $envTypeName = strtolower($change->envValue->accessKey->envType->name);
                $appSlug = $application->slug;

                if (!in_array($application->group_id, $userGroupIds)) {
                    return false;
                }

                $permissionName = 'view-' . $envTypeName . '-' . $appSlug;
                $generalPermName = 'view-' . $envTypeName;

                return $user->can($permissionName) || $user->can($generalPermName);
            });
        }

        // Make application IDs visible for route generation
        $envValueChanges = $envValueChanges->map(function ($change) {
            if (
                $change->envValue &&
                $change->envValue->envVariable &&
                $change->envValue->envVariable->application
            ) {
                $change->envValue->envVariable->application->makeVisible('id');
            }
            return $change;
        });

        // Convert Collection to array for consistent frontend handling
        $envValueChangesArray = $envValueChanges->values()->toArray();

        return Inertia::render('Dashboard/EnvValueChanges/Index', [
            'envValueChanges' => $envValueChangesArray,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEnvValueChangeRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(EnvValueChange $envVariableChange)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EnvValueChange $envVariableChange)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEnvValueChangeRequest $request, EnvValueChange $envVariableChange)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EnvValueChange $envVariableChange)
    {
        //
    }
}

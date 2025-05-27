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
        $this->authorize(ability: 'view-env-value-changes');

        // The issue is in the relation paths - we need to make sure the application data is available
        $envValueChanges = EnvValueChange::orderBy('created_at', 'desc')
            ->with([
                'user',
                'envValue',
                'envValue.envVariable',
                'envValue.envVariable.application',
                'envValue.accessKey',
                'envValue.accessKey.envType',
            ])
            ->get()
            ->map(function ($change) {
                // Ensure application ID is properly set for route generation
                if ($change->envValue && $change->envValue->accessKey && $change->envValue->accessKey->application) {
                    // This ensures the application has an ID to avoid the Ziggy error
                    $change->envValue->accessKey->application->makeVisible('id');
                }
                return $change;
            });

        /** @var \App\Models\User $user */
        $user = Auth::user();

        return Inertia::render('Dashboard/EnvValueChanges/Index', [
            'envValueChanges' => $envValueChanges,
            'canShowEnvValueChanges' => $user->can('view-env-value-changes'),
            'canViewApplications' => $user->can('view-applications'),  // Add permission check
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

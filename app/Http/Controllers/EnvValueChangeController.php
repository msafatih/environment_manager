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
        //
        $this->authorize(ability: 'view-env-variable-changes');

        $envVariableChanges = EnvValueChange::orderBy('created_at', 'desc')
            ->with(['user', 'application'])
            ->get();

        /** @var \App\Models\User $user */
        $user = Auth::user();
        return Inertia::render('Dashboard/EnvVariableChanges/Index', [
            'envVariableChanges' => $envVariableChanges,
            'canShowEnvVariableChanges' => $user->can('view-env-variable-changes'),
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

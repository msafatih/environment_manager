<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreApplicationRequest;
use App\Http\Requests\UpdateApplicationRequest;
use App\Http\Requests\StoreAccessKeyRequest;
use App\Http\Requests\UpdateAccessKeyRequest;
use App\Http\Requests\StoreEnvVariableRequest;
use App\Http\Requests\UpdateEnvVariableRequest;
use App\Models\AccessKey;
use App\Models\EnvType;
use App\Models\EnvValue;
use App\Models\EnvVariable;
use App\Models\Group;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;

class ApplicationController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $applications = Application::with(['group', 'envVariables', 'accessKeys'])->get();
        $groupCount = Group::count();

        return Inertia::render('Dashboard/Applications/Index', [
            'applications' => $applications,
            'groupCount' => $groupCount,
            'canCreateApplication' => $user->can('create-applications'),
            'canEditApplication' => $user->can('edit-applications'),
            'canDeleteApplication' => $user->can('delete-applications'),
            'canViewApplication' => $user->can('view-applications'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        $groups = Group::all();

        return Inertia::render('Dashboard/Applications/Create', [
            'groups' => $groups,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreApplicationRequest $request)
    {
        //
        $this->authorize('create-applications');

        $validatedData = $request->validated();
        try {
            $validatedData['slug'] = str($validatedData['name'])->slug()->toString();
            Application::create($validatedData);
            return redirect()->route('applications.index')->with('success', 'Application created successfully!');
        } catch (\Exception $e) {
            Log::error('Failed to create application: ' . $e->getMessage(), [
                'request' => $request->all(),
                'user_id' => Auth::id(),
            ]);
            return redirect()->back()->with('error', 'Failed to create application: ' . $e->getMessage());
        }
    }

    public function getEnvValuesByType(Application $application, $envTypeId)
    {
        $this->authorize('view-applications');

        // Find the access key for this application+envType combination
        $accessKey = AccessKey::where('application_id', $application->id)
            ->where('env_type_id', $envTypeId)
            ->first();

        if (!$accessKey) {
            return response()->json([]);
        }

        // Get all env values for this access key with their associated variables
        $envValues = $accessKey->envValues()
            ->with('envVariable')
            ->get();

        return response()->json($envValues);
    }
    /**
     * Display the specified resource.
     */
    public function show(Application $application)
    {
        $this->authorize('view-applications');

        // Eager load all necessary relationships with proper nesting
        $application->load([
            'group',
            'envVariables' => function ($query) {
                $query->orderBy('sequence', 'asc')->orderBy('name', 'asc');
            },
            'envVariables.envValues',
            'accessKeys',
            'accessKeys.envType',
            'accessKeys.envValues',
            'accessKeys.envValues.envVariable'
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Get unique environment types from access keys
        $envTypes = $application->accessKeys->pluck('envType')->unique('id')->values();

        // Calculate statistics for the details tab
        $envValuesCount = $application->envVariables->reduce(function ($count, $variable) {
            return $count + ($variable->envValues ? $variable->envValues->count() : 0);
        }, 0);

        return Inertia::render('Dashboard/Applications/Show', [
            'application' => $application,
            'envTypes' => $envTypes,
            'statistics' => [
                'envVariablesCount' => $application->envVariables->count(),
                'accessKeysCount' => $application->accessKeys->count(),
                'envValuesCount' => $envValuesCount
            ],
            'canEditEnvVariables' => $user->can('edit-env-variables'),
            'canDeleteEnvVariables' => $user->can('delete-env-variables'),
            'canCreateEnvVariables' => $user->can('create-env-variables'),
            'canEditAccessKeys' => $user->can('edit-access-keys'),
            'canDeleteAccessKeys' => $user->can('delete-access-keys'),
            'canCreateAccessKeys' => $user->can('create-access-keys'),
            'canEditEnvValues' => $user->can('edit-env-values'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Application $application)
    {
        //
        $this->authorize('edit-applications');
        $groups = Group::all();
        $application->load(['group']);

        return Inertia::render('Dashboard/Applications/Edit', [
            'application' => $application,
            'groups' => $groups,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateApplicationRequest $request, Application $application)
    {
        //
        $validatedData = $request->validated();
        try {
            $validatedData['slug'] = str($validatedData['name'])->slug()->toString();
            $application->update($validatedData);
            return redirect()->route('applications.index')->with('success', 'Application updated successfully!');
        } catch (\Exception $e) {
            Log::error('Failed to update application: ' . $e->getMessage(), [
                'request' => $request->all(),
                'user_id' => Auth::id(),
            ]);
            return redirect()->back()->with('error', 'Failed to update application: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Application $application)
    {
        //
        $this->authorize('delete-applications');
        try {
            $application->delete();
            return redirect()->route('applications.index')->with('success', 'Application deleted successfully!');
        } catch (\Exception $e) {
            Log::error('Failed to delete application: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
            ]);
            return redirect()->back()->with('error', 'Failed to delete application: ' . $e->getMessage());
        }
    }

    public function createAccessKeys(Application $application)
    {
        $this->authorize('create-access-keys');

        $application->load(['accessKeys.envType']);

        $usedEnvTypeIds = $application->accessKeys->pluck('env_type_id')->toArray();

        $availableEnvTypes = EnvType::whereNotIn('id', $usedEnvTypeIds)->get();

        return Inertia::render('Dashboard/Applications/AccessKeys/Create', [
            'application' => $application,
            'envTypes' => $availableEnvTypes,
            'hasUsedAllEnvTypes' => $availableEnvTypes->isEmpty(),
            'usedEnvTypes' => EnvType::whereIn('id', $usedEnvTypeIds)->get(),
        ]);
    }
    public function storeAccessKeys(StoreAccessKeyRequest $request, Application $application)
    {
        //
        $this->authorize('create-access-keys');
        $validatedData = $request->validated();
        try {
            // Start a database transaction
            DB::beginTransaction();

            // Create the access key
            $validatedData['application_id'] = $application->id;
            $accessKey = AccessKey::create($validatedData);

            // Get all environment variables for this application
            $envVariables = $application->envVariables;

            // Create empty env values for each environment variable
            foreach ($envVariables as $envVariable) {
                EnvValue::create([
                    'env_variable_id' => $envVariable->id,
                    'access_key_id' => $accessKey->id,
                    'value' => '', // Empty value by default
                ]);
            }

            DB::commit();

            return redirect()->route('applications.show', $application)->with('success', 'Access key created successfully!');
        } catch (\Exception $e) {
            // Rollback the transaction if any error occurs
            DB::rollBack();

            Log::error('Failed to create access key: ' . $e->getMessage(), [
                'request' => $request->all(),
                'user_id' => Auth::id(),
            ]);
            return redirect()->back()->with('error', 'Failed to create access key: ' . $e->getMessage());
        }
    }

    public function editAccessKeys(Application $application, AccessKey $accessKey)
    {
        //
        $this->authorize('edit-access-keys');
        $application->load(['accessKeys.envType']);
        $accessKey->load(['envType']);
        $usedEnvTypeIds = $application->accessKeys->pluck('env_type_id')->toArray();
        $availableEnvTypes = EnvType::whereNotIn('id', $usedEnvTypeIds)->get();
        return Inertia::render('Dashboard/Applications/AccessKeys/Edit', [
            'application' => $application,
            'accessKey' => $accessKey,
            'envTypes' => $availableEnvTypes,
            'hasUsedAllEnvTypes' => $availableEnvTypes->isEmpty(),
            'usedEnvTypes' => EnvType::whereIn('id', $usedEnvTypeIds)->get(),
        ]);
    }

    public function updateAccessKeys(UpdateAccessKeyRequest $request, Application $application, AccessKey $accessKey)
    {
        //
        $validatedData = $request->validated();
        try {
            $accessKey->update($validatedData);
            return redirect()->route('applications.show', $application)->with('success', 'Access key updated successfully!');
        } catch (\Exception $e) {
            Log::error('Failed to update access key: ' . $e->getMessage(), [
                'request' => $request->all(),
                'user_id' => Auth::id(),
            ]);
            return redirect()->back()->with('error', 'Failed to update access key: ' . $e->getMessage());
        }
    }

    public function destroyAccessKeys(Application $application, AccessKey $accessKey)
    {
        //
        $this->authorize('delete-access-keys');
        try {
            $accessKey->delete();
            return redirect()->route('applications.show', $application)->with('success', 'Access key deleted successfully!');
        } catch (\Exception $e) {
            Log::error('Failed to delete access key: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
            ]);
            return redirect()->back()->with('error', 'Failed to delete access key: ' . $e->getMessage());
        }
    }

    public function createEnvVariables(Application $application)
    {
        $this->authorize('create-env-variables');


        return Inertia::render('Dashboard/Applications/EnvVariables/Create', [
            'application' => $application,
        ]);
    }

    public function storeEnvVariables(StoreEnvVariableRequest $request, Application $application)
    {
        //
        $this->authorize('create-env-variables');
        $validatedData = $request->validated();
        try {
            // Start a database transaction
            DB::beginTransaction();

            // Create the environment variable
            $envVariable = EnvVariable::create([
                'name' => $validatedData['name'],
                'application_id' => $validatedData['application_id'],
                'sequence' => $validatedData['sequence'] ?? null,
            ]);

            // Get all access keys for this application
            $accessKeys = $application->accessKeys;

            // Create empty env values for this variable in all access keys
            foreach ($accessKeys as $accessKey) {
                EnvValue::create([
                    'env_variable_id' => $envVariable->id,
                    'access_key_id' => $accessKey->id,
                    'value' => '', // Empty value by default
                ]);
            }

            // Commit the transaction
            DB::commit();

            return redirect()->route('applications.show', $application)->with('success', 'Env variable created successfully!');
        } catch (\Exception $e) {
            // Rollback the transaction if any error occurs
            DB::rollBack();

            Log::error('Failed to create env variable: ' . $e->getMessage(), [
                'request' => $request->all(),
                'user_id' => Auth::id(),
            ]);
            return redirect()->back()->with('error', 'Failed to create env variable: ' . $e->getMessage());
        }
    }

    public function editEnvVariables(Application $application, EnvVariable $envVariable)
    {
        //
        $this->authorize('edit-env-variables');
        return Inertia::render('Dashboard/Applications/EnvVariables/Edit', [
            'application' => $application,
            'envVariable' => $envVariable,
        ]);
    }

    public function updateEnvVariables(UpdateEnvVariableRequest $request, Application $application, EnvVariable $envVariable)
    {
        //
        $validatedData = $request->validated();
        try {
            $envVariable->update($validatedData);
            return redirect()->route('applications.show', $application)->with('success', 'Env variable updated successfully!');
        } catch (\Exception $e) {
            Log::error('Failed to update env variable: ' . $e->getMessage(), [
                'request' => $request->all(),
                'user_id' => Auth::id(),
            ]);
            return redirect()->back()->with('error', 'Failed to update env variable: ' . $e->getMessage());
        }
    }
    public function destroyEnvVariables(Application $application, EnvVariable $envVariable)
    {
        //
        $this->authorize('delete-env-variables');
        try {
            $envVariable->delete();
            return redirect()->route('applications.show', $application)->with('success', 'Env variable deleted successfully!');
        } catch (\Exception $e) {
            Log::error('Failed to delete env variable: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
            ]);
            return redirect()->back()->with('error', 'Failed to delete env variable: ' . $e->getMessage());
        }
    }

    public function updateEnvValue(Request $request, Application $application, EnvValue $envValue)
    {
        $this->authorize('edit-env-values');

        // Validate the request
        $validated = $request->validate([
            'value' => 'nullable|string',
        ]);

        // Update the environment value
        $envValue->update([
            'value' => $validated['value'],
        ]);

        return Redirect::back()->with('success', 'Env value updated successfully!');
    }
}

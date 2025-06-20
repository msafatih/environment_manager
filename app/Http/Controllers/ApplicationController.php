<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreApplicationRequest;
use App\Http\Requests\UpdateApplicationRequest;
use App\Exports\EnvVariablesExport;
use Maatwebsite\Excel\Facades\Excel;
use App\Http\Requests\StoreEnvVariableRequest;
use App\Http\Requests\UpdateEnvVariableRequest;
use App\Models\AccessKey;
use App\Models\EnvType;
use App\Models\EnvValue;
use App\Models\EnvValueChange;
use App\Models\EnvVariable;
use App\Models\Group;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ApplicationController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Load applications with related data
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
        $this->authorize('create-applications');

        $validatedData = $request->validated();

        try {
            DB::beginTransaction();

            $validatedData['slug'] = str($validatedData['name'])->slug()->toString();

            $application = Application::create($validatedData);

            $envTypes = EnvType::all();

            foreach ($envTypes as $envType) {
                AccessKey::create([
                    'application_id' => $application->id,
                    'env_type_id' => $envType->id,
                    'key' => str()->random(32),
                ]);
            }

            DB::commit();

            return redirect()
                ->route('applications.index')
                ->with('success', 'Application created successfully with access keys for all environment types!');
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Failed to create application: ' . $e->getMessage(), [
                'request' => $request->all(),
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()
                ->back()
                ->with('error', 'Failed to create application: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Application $application)
    {
        $this->authorize('view-applications');

        $application->load([
            'group',
            'envVariables' => function ($query) {
                $query->orderBy('sequence', 'asc')->orderBy('name', 'asc');
            },
            'envVariables.envValues.accessKey',
            'envVariables.envValues.accessKey.envType',
            'accessKeys.envType',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Get unique environment types from access keys
        $envTypes = $application->accessKeys->pluck('envType')->unique('id')->values();

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
            if ($application->health > 0) {
                return redirect()->back()->with(
                    'error',
                    'Cannot delete application because it contains filled environment variables. ' .
                        'Current health: ' . $application->health . '/' . $application->health .
                        '. Please empty all environment variable values before deleting.'
                );
            }

            $application->delete();
            return redirect()->route('applications.index')->with('success', 'Application deleted successfully!');
        } catch (\Exception $e) {
            Log::error('Failed to delete application: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
            ]);
            return redirect()->back()->with('error', 'Failed to delete application: ' . $e->getMessage());
        }
    }

    public function history(Application $application, EnvVariable $envVariable)
    {
        $this->authorize('view-env-value-changes');
        $envVariable->load(['envValues', 'envValues.accessKey', 'envValues.accessKey.envType']);
        $envValueChanges = EnvValueChange::whereHas('envValue', function ($query) use ($envVariable) {
            $query->where('env_variable_id', $envVariable->id);
        })->with(['user', 'envValue.accessKey.envType'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Dashboard/Applications/History', [
            'application' => $application,
            'envVariable' => $envVariable,
            'envValueChanges' => $envValueChanges,
        ]);
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
        $this->authorize('create-env-variables');
        $validatedData = $request->validated();

        try {
            DB::beginTransaction();

            // Get the next sequence number for this application
            $lastSequence = EnvVariable::where('application_id', $validatedData['application_id'])
                ->max('sequence') ?? 0;

            $nextSequence = $lastSequence + 1;

            $envVariable = EnvVariable::create([
                'name' => $validatedData['name'],
                'application_id' => $validatedData['application_id'],
                'sequence' => $nextSequence, // Auto-assign the next sequence number
            ]);

            $accessKeys = $application->accessKeys;

            $envTypeMap = [
                'production_value' => 'Production',
                'staging_value' => 'Staging',
                'development_value' => 'Development',
            ];

            foreach ($accessKeys as $accessKey) {
                $envTypeName = $accessKey->envType->name ?? null;
                $valueKey = array_search($envTypeName, $envTypeMap);
                $value = '';
                if ($valueKey && isset($validatedData[$valueKey])) {
                    $value = $validatedData[$valueKey];
                }

                $envValue = EnvValue::create([
                    'env_variable_id' => $envVariable->id,
                    'access_key_id' => $accessKey->id,
                    'value' => $value,
                ]);

                // Record the change
                $envValueChange = EnvValueChange::create([
                    'env_value_id' => $envValue->id,
                    'user_id' => Auth::id(),
                    'old_value' => null,
                    'new_value' => $value ?: null,
                    'type' => 'create',
                ]);

                Log::info('Env value created successfully', [
                    'application_id' => $application->id,
                    'env_variable_id' => $envVariable->id,
                    'access_key_id' => $accessKey->id,
                    'env_value_id' => $envValue->id,
                    'env_value_change_id' => $envValueChange->id,
                    'user_id' => Auth::id(),
                ]);
            }

            $application->updateHealth();

            Log::info('Env variable created successfully', [
                'application_id' => $application->id,
                'env_variable_id' => $envVariable->id,
                'user_id' => Auth::id(),
            ]);

            DB::commit();

            return redirect()->route('applications.show', $application)
                ->with('success', 'Env variable created successfully!');
        } catch (\Exception $e) {
            // Rollback the transaction if any error occurs
            DB::rollBack();

            Log::error('Failed to create env variable: ' . $e->getMessage(), [
                'request' => $request->all(),
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString(),
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
        $this->authorize('edit-env-variables');
        $validatedData = $request->validated();

        try {
            DB::beginTransaction();

            $envVariable->update([
                'name' => $validatedData['name'],
                'sequence' => $validatedData['sequence'] ?? null,
            ]);

            DB::commit();

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Env variable updated successfully!'
                ]);
            }

            return redirect()->route('applications.show', $application)
                ->with('success', 'Env variable updated successfully!');
        } catch (\Exception $e) {
            // Rollback the transaction if any error occurs
            DB::rollBack();

            Log::error('Failed to update env variable: ' . $e->getMessage(), [
                'request' => $request->all(),
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString(),
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to update env variable: ' . $e->getMessage()
                ], 500);
            }

            return redirect()->back()->with('error', 'Failed to update env variable: ' . $e->getMessage());
        }
    }


    public function destroyEnvVariables(Application $application, EnvVariable $envVariable)
    {
        $this->authorize('delete-env-variables');

        try {
            DB::beginTransaction();
            $deletedSequence = $envVariable->sequence;
            $envVariable->delete();
            EnvVariable::where('application_id', $application->id)
                ->where('sequence', '>', $deletedSequence)
                ->orderBy('sequence')
                ->get()
                ->each(function ($env, $index) use ($deletedSequence) {
                    $env->sequence = $deletedSequence + $index;
                    $env->save();
                });

            DB::commit();

            return redirect()->back()
                ->with('success', 'Environment variable deleted successfully! Sequences have been updated.');
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Failed to delete environment variable: ' . $e->getMessage(), [
                'env_variable_id' => $envVariable->id,
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()
                ->with('error', 'Failed to delete environment variable: ' . $e->getMessage());
        }
    }

    public function updateEnvValue(Request $request, Application $application, EnvValue $envValue)
    {
        $this->authorize('edit-env-values');

        // Validate the request
        $validated = $request->validate([
            'value' => 'nullable|string',
        ]);
        EnvValueChange::create([
            'env_value_id' => $envValue->id,
            'user_id' => Auth::id(),
            'old_value' => $envValue->value,
            'new_value' => $validated['value'],
            'type' => 'update',
        ]);

        // Update the environment value
        $envValue->update([
            'value' => $validated['value'],
        ]);
        // Update the health of the application
        $application->updateHealth();

        return Redirect::back()->with('success', 'Env value updated successfully!');
    }


    /**
     * Export environment variables as Excel file
     *
     * @param Application $application
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse|\Symfony\Component\HttpFoundation\StreamedResponse|\Illuminate\Http\RedirectResponse
     */
    public function export(Application $application)
    {
        $filename = $application->name . '_env_variables_' . now()->format('Y-m-d') . Str::random(5) . '.xlsx';
        try {
            return Excel::download(new EnvVariablesExport($application), $filename);
        } catch (\Exception $e) {
            Log::error('Failed to export environment variables: ' . $e->getMessage(), [
                'application_id' => $application->id,
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString(),
            ]);
            return redirect()->back()->with('error', 'Failed to export environment variables: ' . $e->getMessage());
        }
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AccessKey;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;

class EnvFileController extends Controller
{
    /**
     * Download .env file for authenticated users
     */
    public function download(Application $application, string $envType)
    {
        $envType = ucfirst(strtolower($envType));

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $permissionName = 'view-' . strtolower($envType);

        if (!$user->can($permissionName)) {
            return response()->json(['error' => 'You do not have permission to access this environment.'], 403);
        }
        $envContents = $this->generateEnvFile($application, $envType);
        $response = Response::make($envContents, 200);
        $response->header('Content-Type', 'text/plain');
        $response->header('Content-Disposition', 'attachment; filename=".env.' . strtolower($envType) . '"');

        return $response;
    }

    /**
     * Download .env file using access token
     */
    public function downloadWithToken(Request $request, Application $application, string $envType, string $token)
    {
        $envType = ucfirst(strtolower($envType));

        $accessKey = AccessKey::whereHas('envType', function ($query) use ($envType) {
            $query->where('name', $envType);
        })->where('application_id', $application->id)
            ->where('key', $token)
            ->first();

        if (!$accessKey) {
            return response()->json(['error' => 'Invalid access token.'], 403);
        }

        // Get the environment variables for this environment type
        $envContents = $this->generateEnvFile($application, $envType);

        // Create a response with the .env file
        $response = Response::make($envContents, 200);
        $response->header('Content-Type', 'text/plain');
        $response->header('Content-Disposition', 'attachment; filename=".env.' . strtolower($envType) . '"');

        return $response;
    }

    /**
     * Generate the contents of the .env file
     */
    private function generateEnvFile(Application $application, string $envType): string
    {
        $application->load([
            'envVariables' => function ($query) {
                $query->orderBy('sequence', 'asc')->orderBy('name', 'asc');
            },
            'envVariables.envValues.accessKey',
            'envVariables.envValues.accessKey.envType',
        ]);

        $envContents = "# Environment file for {$application->name} ({$envType})\n";
        $envContents .= "# Generated at " . now()->toDateTimeString() . "\n\n";

        foreach ($application->envVariables as $variable) {
            $envValue = $variable->envValues->first(function ($value) use ($envType) {
                return $value->accessKey->envType->name === $envType;
            });

            $value = $envValue ? $envValue->value : '';
            $envContents .= "{$variable->name}=\"{$value}\"\n";
        }

        return $envContents;
    }

    
}

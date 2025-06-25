<?php

namespace App\Http\Requests;

use App\Models\Application;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreEnvVariableRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $application = $this->route('application');

        return $user->can('create-env-variables') ||
            ($application && $user->can('create-env-variables-' . $application->slug));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:255|regex:/^[A-Z][A-Z0-9_]*$/',
            'application_id' => 'required|exists:applications,id',
            'production_value' => 'nullable|string',
            'staging_value' => 'nullable|string',
            'development_value' => 'nullable|string',

        ];
        return $rules;
    }

    /**
     * Get custom validation messages
     */
    public function messages(): array
    {
        return [
            'name.regex' => 'Variable name must start with an uppercase letter and contain only uppercase letters, numbers, and underscores.',
        ];
    }
}

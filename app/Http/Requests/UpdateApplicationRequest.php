<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $application = $this->route('application');
        
        return $user->can('edit-applications') || 
               ($application && $user->can('edit-application-' . $application->slug));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $application = $this->route('application');
        
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('applications', 'name')->ignore($application->id)
            ],
            'description' => 'nullable|string|max:255',
            'group_id' => 'required|exists:groups,id',
        ];
    }
}
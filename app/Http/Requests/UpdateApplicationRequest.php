<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        return $user->can('create-applications');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
            'name' => 'required|string|max:255|unique:applications,name',
            'description' => 'nullable|string|max:255',
            'group_id' => 'required|exists:groups,id',

        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\Group;

class StoreApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $hasGlobalPermission = $user->can('create-applications');
        $groupId = $this->input('group_id');
        $hasGroupPermission = false;

        if ($groupId) {
            $group = Group::find($groupId);
            if ($group) {
                $hasGroupPermission = $user->can('create-applications-' . $group->slug);
                $isGroupAdmin = $user->groupMembers()
                    ->where('group_id', $groupId)
                    ->where('role', 'admin')
                    ->exists();
                $isSuperAdmin = $user->roles->contains(function ($role) {
                    return strtolower($role->name) === 'super-admin';
                });
                return $hasGlobalPermission || $hasGroupPermission || $isGroupAdmin || $isSuperAdmin;
            }
        }
        return $hasGlobalPermission;
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

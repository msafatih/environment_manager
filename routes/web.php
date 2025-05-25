<?php

use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EnvValueChangeController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::prefix('dashboard')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Dashboard/Index');
    })->name('dashboard');

    Route::resource('groups', GroupController::class);
    Route::resource('applications', ApplicationController::class);

    Route::prefix('groups/{group}')->group(function () {
        Route::get('/groupMembers/create', [GroupController::class, 'createGroupMembers'])->name('groups.groupMembers.create');
        Route::post('groupMembers', [GroupController::class, 'storeGroupMembers'])->name('groups.groupMembers.store');
        Route::get('groupMembers/{groupMember}/edit', [GroupController::class, 'editGroupMembers'])->name('groups.groupMembers.edit');
        Route::put('groupMembers/{groupMember}', [GroupController::class, 'updateGroupMembers'])->name('groups.groupMembers.update');
        Route::delete('groupMembers/{groupMember}', [GroupController::class, 'destroyGroupMembers'])->name('groups.groupMembers.destroy');
        Route::get('/applications', [GroupController::class, 'applications'])->name('groups.applications.index');
        Route::get('/applications/create', [GroupController::class, 'createApplications'])->name('groups.applications.create');
        Route::post('applications', [GroupController::class, 'storeApplications'])->name('groups.applications.store');
        Route::get('applications/{application}/edit', [GroupController::class, 'editApplications'])->name('groups.applications.edit');
        Route::put('applications/{application}', [GroupController::class, 'updateApplications'])->name('groups.applications.update');
        Route::delete('applications/{application}', [GroupController::class, 'destroyApplications'])->name('groups.applications.destroy');
    });

    Route::prefix('/applications/{application}')->group(function () {
        Route::get('/envVariables/create', [ApplicationController::class, 'createEnvVariables'])->name('applications.envVariables.create');
        Route::post('envVariables', [ApplicationController::class, 'storeEnvVariables'])->name('applications.envVariables.store');
        Route::get('envVariables/{envVariable}/edit', [ApplicationController::class, 'editEnvVariables'])->name('applications.envVariables.edit');
        Route::put('envVariables/{envVariable}', [ApplicationController::class, 'updateEnvVariables'])->name('applications.envVariables.update');
        Route::delete('envVariables/{envVariable}', [ApplicationController::class, 'destroyEnvVariables'])->name('applications.envVariables.destroy');

        Route::put('envValues/{envValue}', [ApplicationController::class, 'updateEnvValue'])
            ->name('applications.envValues.update');
    });


    Route::resource('envValueChanges', EnvValueChangeController::class)->except(['create', 'edit']);

    Route::resource('users', UserController::class);
    Route::put('/roles/{role}/roles', [RoleController::class, 'updateRoles'])->name('roles.users.update');
    Route::put('/roles/{role}/permissions', [RoleController::class, 'updatePermissions'])->name('roles.permissions.update');
    Route::resource('roles', RoleController::class)->except(['create', 'edit']);
    Route::resource('permissions', PermissionController::class)->except(['create', 'edit']);
})->middleware(['auth', 'verified']);


Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});

require __DIR__ . '/auth.php';

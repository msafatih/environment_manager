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

    Route::prefix('groups/{group}')->controller(GroupController::class)->group(function () {
        Route::prefix('/groupMembers')->group(function () {
            Route::get('/',  'groupMembers')->name('groups.groupMembers.index');
            Route::get('/create',  'createGroupMembers')->name('groups.groupMembers.create');
            Route::post('/',  'storeGroupMembers')->name('groups.groupMembers.store');
            Route::get('/{groupMember}/edit',  'editGroupMembers')->name('groups.groupMembers.edit');
            Route::put('/{groupMember}',  'updateGroupMembers')->name('groups.groupMembers.update');
            Route::delete('/{groupMember}',  'destroyGroupMembers')->name('groups.groupMembers.destroy');
        });
        Route::prefix('/applications')->controller(ApplicationController::class)->group(function () {
            Route::get('/',  'groupApplications')->name('groups.applications.index');
            Route::get('/create',  'createGroupApplications')->name('groups.applications.create');
            Route::post('/',  'storeGroupApplications')->name('groups.applications.store');
            Route::get('/{application}/edit',  'editGroupApplications')->name('groups.applications.edit');
            Route::put('/{application}',  'updateGroupApplications')->name('groups.applications.update');
            Route::delete('/{application}',  'destroyGroupApplications')->name('groups.applications.destroy');
        });
    });

    Route::prefix('/applications/{application}/')->controller(ApplicationController::class)->group(function () {
        Route::get('/envVariables/create',  'createEnvVariables')->name('applications.envVariables.create');
        Route::post('envVariables',  'storeEnvVariables')->name('applications.envVariables.store');
        Route::get('envVariables/{envVariable}/edit',  'editEnvVariables')->name('applications.envVariables.edit');
        Route::put('envVariables/{envVariable}',  'updateEnvVariables')->name('applications.envVariables.update');
        Route::delete('envVariables/{envVariable}',  'destroyEnvVariables')->name('applications.envVariables.destroy');
        Route::put('envValues/{envValue}',  'updateEnvValue')
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

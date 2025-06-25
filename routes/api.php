<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/applications/{application}/download/{envType}', [App\Http\Controllers\Api\EnvFileController::class, 'download'])
    ->middleware('auth:sanctum')
    ->name('api.applications.download');

// You can also add a token-based route for CI/CD systems
Route::get('/applications/{application}/download/{envType}/{token}', [App\Http\Controllers\Api\EnvFileController::class, 'downloadWithToken'])
    ->name('api.applications.download.token');

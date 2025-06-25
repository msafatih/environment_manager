<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EnvFileController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/applications/{application}/download/{envType}', [EnvFileController::class, 'download'])
        ->name('api.applications.download');

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
Route::get('/applications/{application}/download/{envType}/{token}', [EnvFileController::class, 'downloadWithToken'])
    ->name('api.applications.download.token');

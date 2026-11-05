<?php

use App\Http\Controllers\CompanySettingController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SecurityController;
use Illuminate\Auth\Middleware\RequirePassword;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::middleware('role:direktur_utama')->group(function () {
        Route::get('settings', [CompanySettingController::class, 'edit'])->name('settings.index');
        Route::post('settings', [CompanySettingController::class, 'update'])->name('settings.update');
        Route::post('settings/signature-assets', [CompanySettingController::class, 'storeSignatureAsset'])->name('settings.signature-assets.store');
        Route::get('settings/signature-assets/{asset}', [CompanySettingController::class, 'showSignatureAsset'])->whereIn('asset', ['signature', 'stamp'])->name('settings.signature-assets.show');
        Route::delete('settings/signature-assets/{asset}', [CompanySettingController::class, 'destroySignatureAsset'])->whereIn('asset', ['signature', 'stamp'])->name('settings.signature-assets.destroy');
    });

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/security', [SecurityController::class, 'edit'])
        ->middleware(RequirePassword::class)
        ->name('security.edit');

    Route::put('settings/password', [SecurityController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');
});

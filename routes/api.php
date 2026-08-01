<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\ProjectMilestoneController;
use App\Http\Controllers\Api\V1\ProjectDocumentController;
use App\Http\Controllers\Api\V1\ProjectMeetingController;
use App\Http\Controllers\Api\V1\ProjectActivityController;
use App\Http\Controllers\Api\V1\DailyReportController;
use App\Http\Controllers\Api\V1\ProjectRevisionController;
use App\Http\Controllers\Api\V1\ClientFeedbackController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth')->prefix('v1')->group(function () {
    // Milestones
    Route::post('/projects/{project}/milestones', [ProjectMilestoneController::class, 'store']);
    Route::put('/milestones/{milestone}/progress', [ProjectMilestoneController::class, 'updateProgress']);

    // Documents
    Route::get('/projects/{project}/documents', [ProjectDocumentController::class, 'index']);
    Route::post('/projects/{project}/document-folders', [ProjectDocumentController::class, 'storeFolder']);
    Route::post('/projects/{project}/documents', [ProjectDocumentController::class, 'storeDocument']);
    Route::get('/documents/{document}/download', [ProjectDocumentController::class, 'download']);
    Route::delete('/documents/{document}', [ProjectDocumentController::class, 'destroy']);

    // Meetings
    Route::get('/projects/{project}/meetings', [ProjectMeetingController::class, 'index']);
    Route::post('/projects/{project}/meetings', [ProjectMeetingController::class, 'store']);
    Route::put('/meetings/{meeting}/minutes', [ProjectMeetingController::class, 'updateMinutes']);
    Route::post('/meetings/{meeting}/action-items', [ProjectMeetingController::class, 'storeActionItem']);

    // Activities
    Route::get('/projects/{project}/activities', [ProjectActivityController::class, 'index']);

    // Activities
    Route::get('/projects/{project}/activities', [ProjectActivityController::class, 'index']);
});

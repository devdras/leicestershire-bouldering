<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', [App\Http\Controllers\AreaController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard route removed as requested

    Route::get('/ticks', [App\Http\Controllers\TickController::class, 'index'])->name('ticks.index');
    Route::post('/ticks', [App\Http\Controllers\TickController::class, 'store'])->name('ticks.store');
    Route::delete('/ticks/{tick}', [App\Http\Controllers\TickController::class, 'destroy'])->name('ticks.destroy');
});



Route::get('/areas', [App\Http\Controllers\AreaController::class, 'index'])->name('areas.index');
Route::get('/sectors', [App\Http\Controllers\AreaController::class, 'allSectors'])->name('sectors.index');
Route::get('/crags', [App\Http\Controllers\CragController::class, 'index'])->name('crags.index');
Route::get('/areas/{area:name}', [App\Http\Controllers\AreaController::class, 'show'])->name('areas.show');
Route::get('/areas/{area:name}/{sector:name}', [App\Http\Controllers\SectorController::class, 'show'])->name('sectors.show');
Route::get('/areas/{areaName}/{sectorName}/{cragName}', [App\Http\Controllers\CragController::class, 'show'])->name('crags.show');

Route::get('/about', fn() => Inertia::render('About'))->name('about');
Route::get('/data-export', fn() => Inertia::render('DataExport'))->name('data-export');

Route::get('/search', [App\Http\Controllers\SearchController::class, 'search'])->name('search');

require __DIR__.'/settings.php';

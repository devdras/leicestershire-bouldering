<?php

namespace App\Http\Controllers;

use App\Models\Tick;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TickController extends Controller
{
    public function index()
    {
        return Auth::user()->ticks()->with('climb')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'climb_id' => 'required|exists:climbs,id',
            'date' => 'nullable|date',
            'style' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $tick = Auth::user()->ticks()->create($validated);

        return response()->json($tick, 201);
    }

    public function destroy(Tick $tick)
    {
        if ($tick->user_id !== Auth::id()) {
            abort(403);
        }

        $tick->delete();

        return response()->noContent();
    }
}

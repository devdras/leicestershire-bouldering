<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tick extends Model
{
    protected $guarded = [];

    public function climb()
    {
        return $this->belongsTo(Climb::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

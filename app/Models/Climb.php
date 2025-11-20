<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Climb extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $guarded = [];

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function ticks()
    {
        return $this->hasMany(Tick::class);
    }
}

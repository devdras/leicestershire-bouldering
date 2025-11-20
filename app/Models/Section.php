<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $guarded = [];

    public function crag()
    {
        return $this->belongsTo(Crag::class);
    }

    public function climbs()
    {
        return $this->hasMany(Climb::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sector extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    public function getRouteKeyName()
    {
        return 'name';
    }
    protected $guarded = [];

    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    public function crags()
    {
        return $this->hasMany(Crag::class);
    }
}

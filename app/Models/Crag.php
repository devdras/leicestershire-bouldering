<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Crag extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $guarded = [];

    public function getRouteKeyName()
    {
        return 'name';
    }

    public function sector()
    {
        return $this->belongsTo(Sector::class);
    }

    public function sections()
    {
        return $this->hasMany(Section::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $guarded = [];

    public function getRouteKeyName()
    {
        return 'name';
    }

    public function sectors()
    {
        return $this->hasMany(Sector::class);
    }
}

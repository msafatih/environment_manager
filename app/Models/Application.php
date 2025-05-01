<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;
    //

    protected $table = 'applications';

    protected $fillable = [
        'name',
        'description',
        'slug',
        'group_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id', 'id');
    }

    public function envVariables()
    {
        return $this->hasMany(EnvVariable::class, 'application_id', 'id');
    }

    public function accessKeys()
    {
        return $this->hasMany(AccessKey::class, 'application_id', 'id');
    }
}

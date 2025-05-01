<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnvType extends Model
{
    //
    protected $table = 'env_types';

    protected $fillable = [
        'name',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function accessKeys()
    {
        return $this->hasMany(AccessKey::class, 'env_type_id', 'id');
    }
}

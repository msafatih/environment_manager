<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnvValue extends Model
{
    //
    protected $table = 'env_values';

    protected $fillable = [
        'env_variable_id',
        'access_key_id',
        'value',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function envVariable()
    {
        return $this->belongsTo(EnvVariable::class, 'env_variable_id', 'id');
    }

    public function accessKey()
    {
        return $this->belongsTo(AccessKey::class, 'access_key_id', 'id');
    }
}

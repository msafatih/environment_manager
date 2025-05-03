<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnvVariable extends Model
{
    //
    protected $table = 'env_variables';

    protected $fillable = [
        'name',
        'sequence',
        'application_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function application()
    {
        return $this->belongsTo(Application::class, 'application_id', 'id');
    }

    public function envValues()
    {
        return $this->hasMany(EnvValue::class, 'env_variable_id', 'id');
    }
}

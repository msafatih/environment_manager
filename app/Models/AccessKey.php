<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccessKey extends Model
{
    //

    protected $table = 'access_keys';

    protected $fillable = [
        'key',
        'application_id',
        'env_type_id'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function application()
    {
        return $this->belongsTo(Application::class, 'application_id', 'id');
    }

    public function envType()
    {
        return $this->belongsTo(EnvType::class, 'env_type_id', 'id');
    }

    public function envValues()
    {
        return $this->hasMany(EnvValue::class, 'access_key_id', 'id');
    }
}

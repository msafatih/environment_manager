<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnvVariableChange extends Model
{
    //

    protected $table = 'env_variable_changes';

    protected $fillable = [
        'user_id',
        'env_variable_id',
        'old_value',
        'new_value',
        'type',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function envVariable()
    {
        return $this->belongsTo(EnvVariable::class, 'env_variable_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}

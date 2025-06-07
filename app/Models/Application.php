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
        'health',
        'slug',
        'group_id',
    ];

    public function updateHealth()
    {
        $envVariables = $this->envVariables()->get();

        $accessKeys = $this->accessKeys()->get();

        if ($envVariables->count() === 0) {
            $this->health = 0.00;
            $this->save();
            return 0;
        }

        $totalPossible = $envVariables->count() * $accessKeys->count();

        $filledValues = EnvValue::whereHas('envVariable', function ($query) {
            $query->where('application_id', $this->id);
        })
            ->whereNotNull('value')
            ->where('value', '!=', '')
            ->count();

        $healthPercentage = $totalPossible > 0
            ? round(($filledValues / $totalPossible) * 100, 2)
            : 0;

        $this->health = $healthPercentage;
        $this->save();

        return $healthPercentage;
    }


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

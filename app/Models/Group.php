<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;
    //
    protected $table = 'groups';
    protected $fillable = [
        'name',
        'description',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function groupMembers()
    {
        return $this->hasMany(GroupMember::class, 'group_id', 'id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class, 'group_id', 'id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskBoard extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
    ];

    protected $hidden = [];

    protected $casts = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function taskLists()
    {
        return $this->hasMany(TaskList::class);
    }

    public function taskCards()
    {
        return $this->hasManyThrough(TaskCard::class, TaskList::class);
    }
}

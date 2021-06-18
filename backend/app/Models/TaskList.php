<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskList extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function taskBoard()
    {
        return $this->belongsTo(TaskBoard::class);
    }

    public function taskCards()
    {
        return $this->hasMany(TaskCard::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TaskList extends Model
{
    use HasFactory;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['title', 'description'];

    protected static function booted()
    {
        static::creating(function (self $taskList) {
            $taskList->id = (string) Str::uuid();
        });
    }

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

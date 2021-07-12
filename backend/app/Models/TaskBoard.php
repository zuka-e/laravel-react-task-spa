<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TaskBoard extends Model
{
    use HasFactory;

    protected static function booted()
    {
        static::creating(function ($task_board) {
            $task_board->id = (string)Str::uuid();
        });
    }

    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The data type of the auto-incrementing ID.
     *
     * @var string
     */
    protected $keyType = 'string';

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

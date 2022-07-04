<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TaskBoard extends Model
{
    use HasFactory;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'title',
        'description',
        'list_index_map',
        'card_index_map',
    ];

    /** @see https://laravel.com/docs/8.x/eloquent-mutators#array-and-json-casting */
    protected $casts = [
        'list_index_map' => 'array',
        'card_index_map' => 'array',
    ];

    protected static function booted()
    {
        static::creating(function (TaskBoard $task_board) {
            $task_board->id = (string) Str::uuid();
        });
    }

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

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
            $task_board->list_index_map = json_encode([], JSON_FORCE_OBJECT);
            $task_board->card_index_map = json_encode([], JSON_FORCE_OBJECT);
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
        'list_index_map',
        'card_index_map',
    ];

    protected $hidden = [];

    /** @see https://laravel.com/docs/8.x/eloquent-mutators#array-and-json-casting */
    protected $casts = [
        'list_index_map' => 'array',
        'card_index_map' => 'array',
    ];

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

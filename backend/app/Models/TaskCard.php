<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TaskCard extends Model
{
    use HasFactory;

    protected static function booted()
    {
        static::creating(function ($task_card) {
            $task_card->id = (string)Str::uuid();
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
        'content',
        'deadline',
        'done'
    ];

    protected $hidden = [];

    /** @see [https://laravel.com/docs/8.x/eloquent-mutators#date-casting-and-timezones */
    protected $casts = [
        'deadline' => 'datetime',
        'done' => 'boolean'
    ];

    // 使用例: TaskCard::find(1)->user;
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function taskList()
    {
        return $this->belongsTo(TaskList::class);
    }
}

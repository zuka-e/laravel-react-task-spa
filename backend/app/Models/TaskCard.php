<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TaskCard extends Model
{
    use HasFactory;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['title', 'content', 'deadline', 'done'];

    /** @see [https://laravel.com/docs/8.x/eloquent-mutators#date-casting-and-timezones */
    protected $casts = [
        'deadline' => 'datetime',
        'done' => 'boolean',
    ];

    protected static function booted()
    {
        static::creating(function (self $taskCard) {
            $taskCard->id = (string) Str::uuid();
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function taskList()
    {
        return $this->belongsTo(TaskList::class);
    }
}

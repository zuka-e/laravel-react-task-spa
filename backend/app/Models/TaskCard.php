<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskCard extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'deadline',
        'done'
    ];

    protected $hidden = [];

    protected $casts = [
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

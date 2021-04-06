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
        'done'
    ];

    // 使用例: TaskCard::find(1)->user;
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

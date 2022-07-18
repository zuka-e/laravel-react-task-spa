<?php

namespace App\Models;

use App\Notifications\VerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    /** @see https://laravel.com/docs/9.x/eloquent#primary-keys */
    public $incrementing = false;

    /** @see https://laravel.com/docs/9.x/eloquent#primary-keys */
    protected $keyType = 'string';

    /** @see https://laravel.com/docs/9.x/eloquent#mass-assignment */
    protected $fillable = ['name', 'email', 'password'];

    /** @see https://laravel.com/docs/9.x/eloquent-serialization#hiding-attributes-from-json */
    protected $hidden = ['password', 'remember_token'];

    /** @see https://laravel.com/docs/9.x/eloquent-mutators#attribute-casting */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /** @see https://laravel.com/docs/9.x/eloquent#events-using-closures */
    protected static function booted()
    {
        // A default value in the migration can also be used.
        // `->default(new Expression('(UUID())'));`
        // https://laravel.com/docs/9.x/migrations#default-expressions
        // But the created model doesn't have `id`.
        static::creating(function (self $user) {
            $user->id = (string) Str::uuid();
        });
    }

    public function taskBoards()
    {
        return $this->hasMany(TaskBoard::class);
    }

    public function taskLists()
    {
        return $this->hasMany(TaskList::class);
    }

    public function taskCards()
    {
        return $this->hasMany(TaskCard::class);
    }

    /** @see \Illuminate\Auth\MustVerifyEmail */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmail());
    }
}

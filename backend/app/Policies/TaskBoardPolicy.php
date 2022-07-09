<?php

namespace App\Policies;

use App\Models\TaskBoard;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

/**
 * @see https://laravel.com/docs/9.x/authorization#authorizing-resource-controllers
 */
class TaskBoardPolicy
{
    use HandlesAuthorization;

    /**
     * Whether `index()` action is allowed.
     *
     * @param  \App\Models\User  $user  `Auth::user()`
     * @return bool
     */
    public function viewAny(User $user)
    {
        // Allow viewing of only authenticated user data.
        // ※ `originalParameter()` doesn't bind model. (cf. `parameter()`)
        return $user->id ===
            request()
                ->route()
                ->originalParameter('user');
    }

    /**
     * Whether `show()` is allowed.
     *
     * @param  \App\Models\User  $user  `Auth::user()`
     * @return bool
     */
    public function view(User $user, TaskBoard $taskBoard)
    {
        return $user->id === $taskBoard->user_id;
    }

    /**
     * Whether `create()` or `store()` is allowed.
     *
     * @param  \App\Models\User  $user  `Auth::user()`
     * @return bool
     */
    public function create(User $user)
    {
        // Allow creating of only authenticated user data.
        return $user->id ===
            request()
                ->route()
                ->originalParameter('user');
    }

    /**
     * Whether `edit()` or `update()` is allowed.
     *
     * @param  \App\Models\User  $user  `Auth::user()`
     * @return bool
     */
    public function update(User $user, TaskBoard $taskBoard)
    {
        return $user->id === $taskBoard->user_id;
    }

    /**
     * Whether `destroy()` is allowed.
     *
     * @param  \App\Models\User  $user  `Auth::user()`
     * @return bool
     */
    public function delete(User $user, TaskBoard $taskBoard)
    {
        return $user->id === $taskBoard->user_id;
    }
}

<?php

namespace App\Policies;

use App\Models\TaskCard;
use App\Models\TaskList;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

/**
 * @see https://laravel.com/docs/9.x/authorization#authorizing-resource-controllers
 */
class TaskCardPolicy
{
    use HandlesAuthorization;

    /**
     * Whether `create()` or `store()` is allowed.
     *
     * @param  \App\Models\User  $user  `Auth::user()`
     * @return bool
     */
    public function create(User $user)
    {
        /**
         * Be sure the parameter type of `TaskCardController::store()`
         * is `TaskList`, or model binding won't work.
         *
         * @var string|object|null $taskList Model binded to the route
         * @see https://laravel.com/docs/9.x/routing#implicit-binding
         */
        $taskList = request()
            ->route()
            ->parameter('task_list');

        if (!($taskList instanceof TaskList)) {
            throw new \LogicException('The route binding was not resolved.');
        }

        return $user->id === $taskList->user_id;
    }

    /**
     * Whether `edit()` or `update()` is allowed.
     *
     * @param  \App\Models\User  $user  `Auth::user()`
     * @return bool
     */
    public function update(User $user, TaskCard $taskCard)
    {
        return $user->id === $taskCard->user_id;
    }

    /**
     * Whether `destroy()` is allowed.
     *
     * @param  \App\Models\User  $user  `Auth::user()`
     * @return bool
     */
    public function delete(User $user, TaskCard $taskCard)
    {
        return $user->id === $taskCard->user_id;
    }
}

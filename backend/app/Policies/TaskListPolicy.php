<?php

namespace App\Policies;

use App\Models\TaskBoard;
use App\Models\TaskList;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

/**
 * @see https://laravel.com/docs/9.x/authorization#authorizing-resource-controllers
 */
class TaskListPolicy
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
         * Be sure the parameter type of `TaskListController::store()`
         * is `TaskBoard`, or model binding won't work.
         *
         * @var string|object|null $taskBoard Model bound to the route
         * @see https://laravel.com/docs/9.x/routing#implicit-binding
         */
        $taskBoard = request()
            ->route()
            ->parameter('task_board');

        if (!($taskBoard instanceof TaskBoard)) {
            throw new \LogicException('The route binding was not resolved.');
        }

        return $user->id === $taskBoard->user_id;
    }

    /**
     * Whether `edit()` or `update()` is allowed.
     *
     * @param  \App\Models\User  $user  `Auth::user()`
     * @return bool
     */
    public function update(User $user, TaskList $taskList)
    {
        return $user->id === $taskList->user_id;
    }

    /**
     * Whether `destroy()` is allowed.
     *
     * @param  \App\Models\User  $user  `Auth::user()`
     * @return bool
     */
    public function delete(User $user, TaskList $taskList)
    {
        return $user->id === $taskList->user_id;
    }
}

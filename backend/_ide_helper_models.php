<?php

// @formatter:off
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * App\Models\TaskBoard
 *
 * @property string $id
 * @property string $user_id
 * @property string $title
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property array $list_index_map
 * @property array $card_index_map
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\TaskCard[] $taskCards
 * @property-read int|null $task_cards_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\TaskList[] $taskLists
 * @property-read int|null $task_lists_count
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\TaskBoardFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskBoard newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TaskBoard newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TaskBoard query()
 * @method static \Illuminate\Database\Eloquent\Builder|TaskBoard whereCardIndexMap($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskBoard whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskBoard whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskBoard whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskBoard whereListIndexMap($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskBoard whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskBoard whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskBoard whereUserId($value)
 */
	class TaskBoard extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\TaskCard
 *
 * @property string $id
 * @property string $user_id
 * @property string $title
 * @property string|null $content
 * @property \Illuminate\Support\Carbon|null $deadline
 * @property bool $done
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $task_list_id
 * @property-read \App\Models\TaskList $taskList
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\TaskCardFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskCard newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TaskCard newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TaskCard query()
 * @method static \Illuminate\Database\Eloquent\Builder|TaskCard whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskCard whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskCard whereDeadline($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskCard whereDone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskCard whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskCard whereTaskListId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskCard whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskCard whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskCard whereUserId($value)
 */
	class TaskCard extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\TaskList
 *
 * @property string $id
 * @property string $user_id
 * @property string $task_board_id
 * @property string $title
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\TaskBoard $taskBoard
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\TaskCard[] $taskCards
 * @property-read int|null $task_cards_count
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\TaskListFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskList newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TaskList newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TaskList query()
 * @method static \Illuminate\Database\Eloquent\Builder|TaskList whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskList whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskList whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskList whereTaskBoardId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskList whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskList whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaskList whereUserId($value)
 */
	class TaskList extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\User
 *
 * @property string $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection|\Illuminate\Notifications\DatabaseNotification[] $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\TaskBoard[] $taskBoards
 * @property-read int|null $task_boards_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\TaskCard[] $taskCards
 * @property-read int|null $task_cards_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\TaskList[] $taskLists
 * @property-read int|null $task_lists_count
 * @method static \Database\Factories\UserFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereTwoFactorRecoveryCodes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereTwoFactorSecret($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUpdatedAt($value)
 */
	class User extends \Eloquent implements \Illuminate\Contracts\Auth\MustVerifyEmail {}
}


<?php

namespace App\Http\Resources;

use App\Models\TaskList;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * It's used to transform the model and define what data should be returned.
 *
 * @see https://laravel.com/docs/9.x/eloquent-resources
 */
class TaskListResource extends JsonResource
{
    /** @var \App\Models\TaskList */
    public $resource; // Type declaration can't be used

    /** @param  \App\Models\TaskList  $resource */
    public function __construct(TaskList $resource)
    {
        $this->resource = $resource;
    }

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // Undefined properties can be accessed by `__get()`.
        // (Illuminate\Http\Resources\DelegatesToResource::__get)
        // But it's not type-safe. So access via a typed variable.
        // e.g. `$this->resource->id` instead of `this->id`
        $taskList = $this->resource;

        return [
            'id' => $taskList->id,
            'userId' => $taskList->user_id,
            'boardId' => $taskList->task_board_id,
            'cards' => $this->when(
                $taskList->taskCards,
                TaskCardResource::collection($taskList->taskCards),
            ),
            'title' => $taskList->title,
            'description' => $taskList->description,
            'createdAt' => $taskList->created_at,
            'updatedAt' => $taskList->updated_at,
        ];
    }
}

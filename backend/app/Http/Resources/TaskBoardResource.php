<?php

namespace App\Http\Resources;

use App\Models\TaskBoard;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * It's used to transform the model and define what data should be returned.
 *
 * @see https://laravel.com/docs/9.x/eloquent-resources
 */
class TaskBoardResource extends JsonResource
{
    /** @var \App\Models\TaskBoard */
    public $resource; // Type declaration can't be used

    /** @param  \App\Models\TaskBoard  $resource */
    public function __construct(TaskBoard $resource)
    {
        $this->resource = $resource;
    }

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        // Undefined properties can be accessed by `__get()`.
        // (Illuminate\Http\Resources\DelegatesToResource::__get)
        // But it's not type-safe. So access via a typed variable.
        // e.g. `$this->resource->id` instead of `this->id`
        $taskBoard = $this->resource;

        return [
            'id' => $taskBoard->id,
            'userId' => $taskBoard->user_id,
            'title' => $taskBoard->title,
            'description' => $taskBoard->description,
            'lists' => TaskListResource::collection(
                $this->whenLoaded('taskLists'),
            ),
            'createdAt' => $taskBoard->created_at,
            'updatedAt' => $taskBoard->updated_at,
            'listIndexMap' => $taskBoard->list_index_map,
            'cardIndexMap' => $taskBoard->card_index_map,
        ];
    }
}

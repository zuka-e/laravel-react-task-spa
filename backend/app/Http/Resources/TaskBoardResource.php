<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TaskBoardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'userId' => $this->user_id,
            'title' => $this->title,
            'description' => $this->description,
            'lists' => TaskListResource::collection(
                $this->whenLoaded('taskLists'),
            ),
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'listIndexMap' => $this->list_index_map,
            'cardIndexMap' => $this->card_index_map,
        ];
    }
}

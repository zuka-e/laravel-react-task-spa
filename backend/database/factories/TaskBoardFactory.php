<?php

namespace Database\Factories;

use App\Models\TaskBoard;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskBoardFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = TaskBoard::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph . $this->faker->paragraph,
        ];
    }
}

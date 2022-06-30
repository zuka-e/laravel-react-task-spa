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
        $createdAt = $this->faker->dateTimeBetween('-2 years');
        $updatedAt = $this->faker->dateTimeBetween($createdAt);

        return [
            'title' => $this->faker->sentence,
            'description' => implode("\n", $this->faker->paragraphs()),
            'created_at' => $createdAt,
            'updated_at' => $updatedAt,
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\TaskList;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskListFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = TaskList::class;

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

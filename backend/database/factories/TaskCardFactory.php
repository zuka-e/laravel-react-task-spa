<?php

namespace Database\Factories;

use App\Models\TaskCard;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskCardFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = TaskCard::class;

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
            'content' => implode("\n", $this->faker->paragraphs()),
            'created_at' => $createdAt,
            'updated_at' => $updatedAt,
        ];
    }
}

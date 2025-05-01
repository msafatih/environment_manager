<?php

namespace Database\Factories;

use App\Models\Group;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Application>
 */
class ApplicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->words(rand(1, 3), true);
        $createdAt = $this->faker->dateTimeBetween('-1 year', 'now');

        return [
            'name' => ucfirst($name),
            'description' => $this->faker->sentence(),
            'slug' => Str::slug($name),
            'group_id' => $this->faker->randomElement(Group::pluck('id')->toArray()),
            'created_at' => $createdAt,
            'updated_at' => $this->faker->dateTimeBetween($createdAt, 'now'),
        ];
    }
}

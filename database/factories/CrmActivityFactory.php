<?php

namespace Database\Factories;

use App\Models\CrmActivity;
use App\Models\Prospect;
use App\Support\Crm;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CrmActivity>
 */
class CrmActivityFactory extends Factory
{
    protected $model = CrmActivity::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'prospect_id' => Prospect::factory(),
            'type' => fake()->randomElement(Crm::activityTypes()),
            'subject' => fake()->sentence(4),
            'description' => fake()->optional()->paragraph(),
            'scheduled_at' => now()->addDays(fake()->numberBetween(1, 7)),
            'status' => 'Terjadwal',
        ];
    }

    public function completed(): static
    {
        return $this->state(fn () => [
            'status' => 'Selesai',
            'completed_at' => now(),
            'outcome' => fake()->sentence(),
        ]);
    }

    public function overdue(): static
    {
        return $this->state(fn () => [
            'status' => 'Terjadwal',
            'scheduled_at' => now()->subDays(2),
        ]);
    }
}

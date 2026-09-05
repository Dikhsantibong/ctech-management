<?php

namespace Database\Factories;

use App\Models\Prospect;
use App\Support\Crm;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Prospect>
 */
class ProspectFactory extends Factory
{
    protected $model = Prospect::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_name' => fake()->company(),
            'brand_name' => fake()->optional()->word(),
            'company_type' => fake()->randomElement(Crm::companyTypes()),
            'industry' => fake()->randomElement(Crm::industries()),
            'address' => fake()->address(),
            'city' => fake()->city(),
            'province' => fake()->state(),
            'country' => 'Indonesia',
            'website' => fake()->optional()->url(),
            'company_email' => fake()->companyEmail(),
            'company_phone' => fake()->phoneNumber(),
            'company_whatsapp' => fake()->phoneNumber(),
            'pic_name' => fake()->name(),
            'pic_position' => fake()->jobTitle(),
            'pic_email' => fake()->safeEmail(),
            'pic_phone' => fake()->phoneNumber(),
            'pic_whatsapp' => fake()->phoneNumber(),
            'source' => fake()->randomElement(Crm::sources()),
            'priority' => fake()->randomElement(Crm::priorities()),
            'stage' => 'Prospek Baru',
            'status' => 'Aktif',
            'products_interest' => fake()->optional()->sentence(),
            'notes' => fake()->optional()->sentence(),
        ];
    }

    public function stage(string $stage): static
    {
        return $this->state(fn () => ['stage' => $stage]);
    }

    public function won(): static
    {
        return $this->state(fn () => ['stage' => 'Berhasil', 'status' => 'Berhasil']);
    }

    public function overdueFollowUp(): static
    {
        return $this->state(fn () => [
            'status' => 'Aktif',
            'next_follow_up_at' => now()->subDays(2),
            'next_action' => 'Follow-up penawaran',
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\EnvType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EnvTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //

        EnvType::create([
            'name' => 'Development',
        ]);
        EnvType::create([
            'name' => 'Staging',
        ]);
        EnvType::create([
            'name' => 'Production',
        ]);
    }
}

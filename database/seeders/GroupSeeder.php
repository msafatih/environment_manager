<?php

namespace Database\Seeders;

use App\Models\Group;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing groups
        DB::table('groups')->truncate();

        // Create 10 groups
        Group::factory()
            ->count(10)
            ->create();
    }
}

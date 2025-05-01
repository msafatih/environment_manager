<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('env_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('env_variable_id')->constrained('env_variables')->onDelete('cascade');
            $table->foreignId('access_key_id')->constrained('access_keys')->onDelete('cascade');
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('env_values');
    }
};

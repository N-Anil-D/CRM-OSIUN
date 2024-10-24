<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('rooms'))
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->integer('building_id');
            $table->string('floor_number');
            $table->string('room_number');
            $table->string('room_type');
            $table->string('useage_type');
            $table->string('floor_type');
            $table->string('wall_type');
            $table->decimal('floor_square', 12, 4);
            $table->decimal('Binnenzijde', 12, 4);
            $table->decimal('Buitenzijde', 12, 4);
            $table->decimal('Seperstie_glas', 12, 4);
            $table->boolean('isdeleted', false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};

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
        //2024_10_18_134601_customer_asigned_rooms.php
        if (!Schema::hasTable('customer_asigned_rooms')) {
        }
        Schema::create('customer_asigned_rooms', function (Blueprint $table) {
            $table->id();
            $table->string('CustomerID');
            $table->string('LocationID');
            $table->string('roomID');
            $table->decimal('percentage', 8, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};

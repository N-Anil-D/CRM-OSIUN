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
        if (!Schema::hasTable('buildings'))
        Schema::create('buildings', function (Blueprint $table) {
            $table->id()->primary()->autoIncrement();
            $table->string('CustomerID');
            $table->string('BuildingName');
            $table->string('locationadress');
            $table->string('relaited_user');
            $table->string('email');
            $table->string('postalcode');
            $table->string('Note');
            $table->boolean('passive')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buildings');
    }
};

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
        if (!Schema::hasTable('client_contact_person'))
        Schema::create('client_contact_person', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('connectedCustomer');
            $table->string('first_name', 100);
            $table->string('tussen', 50)->nullable();
            $table->string('last_name', 100);
            $table->string('email', 150)->unique();
            $table->string('phone_number', 20)->nullable();
            $table->text('function')->nullable();
            $table->string('mobilenum', 100)->nullable();
            $table->boolean('hoofcontactperson', false)->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_contact_person');
    }
};

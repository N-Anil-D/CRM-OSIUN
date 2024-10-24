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
        if (!Schema::hasTable('members'))
        Schema::create('members', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->string('member_id');
            $table->string('member_name');
            $table->string('phone_number');
            $table->string('email');
            $table->string('adres');
            $table->boolean('status');
            $table->integer('bill_to_member');
            $table->integer('location_id');
            $table->integer('postal_code');
            $table->string('billsendtype');
            $table->string('CustomerID');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};

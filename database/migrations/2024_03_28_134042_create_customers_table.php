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
        if (!Schema::hasTable('customers'))
        Schema::create('customers', function (Blueprint $table) {
            $table->id()->primary()->autoIncrement();
            $table->string('CustomerID');
            $table->string('Unvan');
            $table->string('username');
            $table->string('customer_group')->default('General');
            $table->string('VergiDairesi')->nullable();
            $table->string('VergiNumarasi')->nullable();
            $table->string('Yetkili')->nullable();
            $table->string('email')->unique()->nullable();
            $table->string('phone_number')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country')->nullable();
            $table->string('tag')->nullable();
            $table->string('billsendtype')->nullable();
            $table->boolean('passive')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};

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
        if (!Schema::hasTable('client_asigned_users'))
            Schema::create('client_asigned_users', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('connectedCustomer');
                $table->bigInteger('user_id');
                $table->timestamps();
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_asigned_users');
    }
};

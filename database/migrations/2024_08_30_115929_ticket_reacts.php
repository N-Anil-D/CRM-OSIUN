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
        if (!Schema::hasTable('ticket_reacts'))
            Schema::create('ticket_reacts', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->bigInteger('ticket_id');
                $table->text('react_text');
                $table->string('before_status');
                $table->string('after_status');
                $table->timestamps();
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticket_reacts');
    }
};

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
        if (!Schema::hasTable('client_notes'))
        Schema::create('client_notes', function (Blueprint $table) {
            $table->id();
            $table->string('customerid');
            $table->string('openername');
            $table->string('notetitle');
            $table->string('note');
            $table->binary('delete');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_notes');
    }
};

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
        if (!Schema::hasTable('client_notes_comments'))
        Schema::create('client_notes_comments', function (Blueprint $table) {
            $table->id();
            $table->string('client_id');
            $table->integer('note_id');
            $table->string("writer");
            $table->string("comment");
            $table->boolean("delete");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_notes_comments');
    }
};

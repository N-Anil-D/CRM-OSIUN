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
        if (!Schema::hasTable('tickets'))
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('opener_name');
            $table->string('customer');
            $table->string('building');
            $table->string('room');
            $table->string('title');
            $table->fullText('ticketsubject');
            $table->string('status');
            $table->string('ticket_type');
            $table->string('ticket_to');
            $table->integer('delete')->default(0);
            $table->string('assigned_type')->nullable();
            $table->longText('closing_comment')->nullable();
            $table->string('assined_persons')->nullable();
            $table->string('evaluator_persons')->nullable();
            $table->timestamp('closing_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};

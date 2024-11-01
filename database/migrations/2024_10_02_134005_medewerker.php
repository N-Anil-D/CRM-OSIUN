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

        if (!Schema::hasTable('medewerkers'))
            Schema::create('medewerkers', function (Blueprint $table) {
                $table->id();
                $table->string('title', 50)->nullable();
                $table->string('first_name', 50)->nullable();
                $table->string('tussen', 50)->nullable();
                $table->string('last_name', 100);
                $table->string('email')->unique();
                $table->string('phone_number')->nullable();
                $table->string('gender')->nullable();
                $table->boolean('pasive')->default(false);
                $table->string('address')->nullable();
                $table->string('house_number')->nullable();
                $table->string('postal_code')->nullable();
                $table->string('residence')->nullable();
                $table->date('date_of_birth')->nullable();
                $table->string('employment_type', 50)->default('ZZP'); // Çalışma durumu: Serbest meslek vs.
                $table->string('contract_type', 50)->nullable();
                $table->timestamp('proeftijd')->nullable();
                $table->string('iban_number')->nullable();
                $table->timestamp('start_date')->nullable();
                $table->string('travel_allowance', 50)->nullable();
                $table->decimal('hourly_rate', 8, 2)->default(0.00);
                $table->string('rights', 50)->default('Standard');
                $table->string('contract_hours')->nullable();
                $table->string('bsn_number')->nullable();
                $table->timestamp('end_date')->nullable();
                $table->decimal('travel_expenses', 8, 2)->default(0.00);
                $table->decimal('bonus_amount', 8, 2)->default(0.00);
                $table->timestamps();
                $table->softDeletes();
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

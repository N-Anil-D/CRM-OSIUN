<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class medewerkers extends Model
{
    protected $tablename = "medewerkers";
    protected $fillable = [
        'title',
        'first_name',
        'tussen',
        'last_name',
        'email',
        'phone_number',
        'gender',
        'pasive',
        'address',
        'house_number',
        'postal_code',
        'residence',
        'date_of_birth',
        'employment_type',
        'contract_type',
        'proeftijd',
        'personnel_number',
        'iban_number',
        'start_date',
        'travel_allowance',
        'hourly_rate',
        'rights',
        'contract_hours',
        'bsn_number',
        'end_date',
        'travel_expenses',
        'bonus_amount',
    ];
    use HasFactory;
}

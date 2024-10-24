<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class members extends Model
{
    protected $fillable = [
        'member_id',
        'member_name',
        'phone_number',
        'email',
        'adres',
        'status',
        'bill_to_member',
        'location_id',
        'CustomerID',
        'postal_code',
        'billsendtype'
    ];
    use HasFactory;
}

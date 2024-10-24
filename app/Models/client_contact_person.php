<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class client_contact_person extends Model
{

    protected $table = 'client_contact_person';
    protected $fillable = [
        'connectedCustomer',
        'first_name',
        'tussen',
        'last_name',
        'email',
        'phone_number',
        'title',
        'function',
        'mobilenum',
        'hoofcontactperson',
        'passive',
        'is_user',
    ];
    use HasFactory;
}

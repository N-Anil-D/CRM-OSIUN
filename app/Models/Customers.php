<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\CustomerAsignedLocations;
use Illuminate\Support\Facades\Log;

class Customers extends Model
{
    use HasFactory;
    protected $fillable = [
        'CustomerID',
        'Unvan',
        'username',
        'VergiDairesi',
        'VergiNumarasi',
        'Yetkili',
        'email',
        'phone_number',
        'address',
        'city',
        'postal_code',
        'country',
        'passive',
        'customer_group',
        'tag',
        'billsendtype',
        ];

    public function assignedLocations()
    {
        return $this->hasMany(CustomerAsignedLocations::class, 'customerid', 'CustomerID');
    }
    public function setDeleted()
    {
        $this->passive = 1; // Set delete status to 1
        $this->save(); // Save the updated model
    }
}

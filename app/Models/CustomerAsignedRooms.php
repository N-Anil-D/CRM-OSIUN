<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerAsignedRooms extends Model
{
    use HasFactory;

    protected $table = 'customer_asigned_rooms';
    protected $fillable = ['CustomerID', 'LocationID', 'roomID', 'percentage'];
}

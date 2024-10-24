<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerAsignedLocations extends Model
{
    protected $table = 'CustomerAsignedLocations';
    protected $fillable = [
        'customerid',
        'locationid',
        'rooms'];
    use HasFactory;
}

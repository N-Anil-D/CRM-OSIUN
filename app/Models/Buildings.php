<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Buildings extends Model
{
    protected $fillable = [
        'id',
        'LocationID',
        'BuildingName',
        'locationadress',
        'email',
        'postalcode',
        'Note',
        'passive',
        'bolge',
        'dnumber',
    ];
    use HasFactory;
}

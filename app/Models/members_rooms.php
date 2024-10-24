<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class members_rooms extends Model
{

    protected $fillable =[
        'member_id',
        'room_id',
        'cıkıs_tarihi',
        'start_date'
    ];
    use HasFactory;
}

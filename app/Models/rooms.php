<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class rooms extends Model
{

    protected $fillable = [
        'building_id',
        'floor_number',
        'room_number',
        'floor_square',
        'room_type',
        'wall_type',
        'useage_type',
        'created_at',
        'updated_at',
        'floor_type',
        'Binnenzijde',
        'Buitenzijde',
        'Seperstie_glas',
    ];
    use HasFactory;
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class user_auth_buildings extends Model
{
    protected $table = 'user_auth_buildings';
    protected $fillable = ['userid', 'buildid'];
    use HasFactory;
}

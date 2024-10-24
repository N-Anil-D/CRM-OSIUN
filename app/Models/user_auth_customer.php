<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class user_auth_customer extends Model
{
    protected $table = 'user_auth_customer';
    protected $fillable = ['userid', 'customerid'];
    use HasFactory;
}

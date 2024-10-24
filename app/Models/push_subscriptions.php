<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class push_subscriptions extends Model
{
    use HasFactory;

    protected $table = 'push_subscriptions';
    protected $fillable = [
        'id',
        'user_id',
        'endpoint',
        'public_key',
        'auth_token',
    ];
}

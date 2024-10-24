<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $fillable = [
        'filename',
        'is_message',
        'ticket_id',
        'message_id',
        'mime_type',
        'media_id',
        'isReact',
        'react_id'
    ];
    use HasFactory;
}

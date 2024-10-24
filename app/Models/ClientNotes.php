<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientNotes extends Model
{
    protected $fillable = [
        'customerid',
        'openername',
        'notetitle',
        'note',
        'delete'
    ];
    public function setDeleted()
    {
        $this->delete = 1; // Set delete status to 1
        $this->save(); // Save the updated model
    }
    use HasFactory;
}

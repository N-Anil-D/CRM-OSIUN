<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientNotesComments extends Model
{
    protected $fillable = ['comment', 'client_id', 'note_id', 'writer', 'delete', 'created_at', 'updated_at'];

    public function setDeleted()
    {
        $this->delete = true; // Set delete status to 1
        $this->save(); // Save the updated model
    }
    use HasFactory;
}

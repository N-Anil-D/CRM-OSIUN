<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class user_page_auth extends Model
{
    public $table = 'user_page_auth';
    public $fillable = ["userid",
        "page_name",
        "parent_id",
        "path",
        "read",
        "write",
        "delete"];

    public function children()
    {
        return $this->hasMany(user_page_auth::class, 'parent_id')->with('children');
    }

    use HasFactory;
}

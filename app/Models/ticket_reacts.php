<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class ticket_reacts extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $table = 'ticket_reacts';

    protected $fillable = [
        'ticket_id',
        'react_text',
        'before_status',
        'after_status',
        'evaluator_persons'
    ];
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('files')
            ->useDisk('public_uploads');
    }
    use HasFactory;
}

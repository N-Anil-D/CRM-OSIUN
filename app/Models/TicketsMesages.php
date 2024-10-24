<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class TicketsMesages extends Model implements HasMedia
{
    use InteractsWithMedia;
    protected $fillable = [
        'id',
        'ticket_id',
        'userName',
        'Message',
    ];
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('files')
            ->useDisk('public_uploads');
    }
    use HasFactory;
}

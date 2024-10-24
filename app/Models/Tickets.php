<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Tickets extends Model implements HasMedia
{
    use InteractsWithMedia;
    protected $fillable = [
        'opener_name',
        'customer',
        'building',
        'refnum',
        'status',
        'title',
        'delete',
        'ticketsubject',
        'ticket_to',
        'ticket_type',
        'assigned_type',
        'closing_comment',
        'asigned_persons',
        'evaluator_persons',
        'closing_date'
    ];
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('files')
            ->useDisk('public_uploads');
    }
    public function setDeleted()
    {
        $this->delete = 1; // Set delete status to 1
        $this->save(); // Save the updated model
    }
}

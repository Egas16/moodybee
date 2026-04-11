<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\JournalCollection;

class Journal extends Model
{
    protected $table      = 'journals';
    protected $primaryKey = 'id_journal';

    protected $fillable = [
        'id_user',
        'id_mood',
        'id_collection',
        'title',
        'content',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function mood(): BelongsTo
    {
        return $this->belongsTo(Mood::class, 'id_mood', 'id_mood');
    }

    public function collection(): BelongsTo
    {
        return $this->belongsTo(JournalCollection::class, 'id_collection', 'id_collection');
    }
}

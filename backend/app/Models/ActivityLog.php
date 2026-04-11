<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'description',
        'photo_path',
        'date',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id_user');
    }

    public function activities()
    {
        return $this->belongsToMany(Activity::class, 'activity_log_activities', 'activity_log_id', 'activity_id', null, 'id_activity');
    }
}

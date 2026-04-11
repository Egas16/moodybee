<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLogActivity extends Model
{
    protected $table = 'activity_log_activities';
    public $timestamps = false;

    protected $fillable = [
        'activity_log_id',
        'activity_id',
    ];

    public function activityLog()
    {
        return $this->belongsTo(ActivityLog::class);
    }

    public function activity()
    {
        return $this->belongsTo(Activity::class, 'activity_id', 'id_activity');
    }
}

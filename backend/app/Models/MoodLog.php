<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MoodLog extends Model
{
    protected $table = 'mood_logs';
    protected $primaryKey = 'id_log';

    protected $fillable = ['id_user', 'id_mood', 'catatan', 'tanggal'];

    public function user() {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function mood() {
        return $this->belongsTo(Mood::class, 'id_mood', 'id_mood');
    }

    // Relasi Many-to-Many ke Activities
    public function activities() {
        return $this->belongsToMany(Activity::class, 'mood_activities', 'id_log', 'id_activity');
    }

    /**
     * Scope untuk mengambil mood log user per bulan.
     * Digunakan oleh MoodLogController dan MoodStatController.
     */
    public function scopeForMonth($query, int $userId, int $year, int $month)
    {
        return $query
            ->where('id_user', $userId)
            ->whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month);
    }

    
}

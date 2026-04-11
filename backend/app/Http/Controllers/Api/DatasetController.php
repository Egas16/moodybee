<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mood;
use App\Models\MoodLog;
use App\Models\User;

class DatasetController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'users' => User::select('id_user', 'username', 'email', 'created_at')->get(),

                'moods' => Mood::select('id_mood', 'nama_mood', 'icon', 'level_mood')->get(),

                'mood_logs' => MoodLog::select('id_log', 'id_user', 'id_mood', 'tanggal', 'catatan')->get(),
            ]
        ]);
    }
}

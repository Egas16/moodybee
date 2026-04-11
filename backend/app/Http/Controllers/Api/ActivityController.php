<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\ActivityLog;
use App\Models\ActivityLogActivity;
use App\Models\MoodActivity;
use App\Models\MoodLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ActivityController extends Controller
{
    // GET /activities — ambil semua master aktivitas (untuk icon picker)
    public function index()
    {
        $activities = Activity::all(['id_activity', 'nama_aktivitas', 'icon']);

        return response()->json([
            'status' => 'success',
            'data'   => $activities,
        ]);
    }

    // POST /activities/attach — simpan aktivitas yang dipilih user ke mood log
    public function attach(Request $request)
    {
        $request->validate([
            'id_log'       => 'required|exists:mood_logs,id_log',
            'activity_ids' => 'required|array|min:1',
            'activity_ids.*' => 'exists:activities,id_activity',
        ]);

        $moodLog = MoodLog::where('id_log', $request->id_log)
            ->where('id_user', $request->user()->id)
            ->firstOrFail();

        // Hapus yang lama dulu biar tidak duplikat kalau user edit
        MoodActivity::where('id_log', $moodLog->id_log)->delete();

        $inserts = array_map(fn($id) => [
            'id_log'      => $moodLog->id_log,
            'id_activity' => $id,
        ], $request->activity_ids);

        MoodActivity::insert($inserts);

        return response()->json([
            'status'  => 'success',
            'message' => 'Aktivitas berhasil disimpan.',
            'data'    => $inserts,
        ]);
    }

    // GET /activities/history — ambil riwayat aktivitas user (seminggu terakhir)
    public function history(Request $request)
    {
        $logs = MoodLog::where('id_user', $request->user()->id)
            ->whereBetween('created_at', [
                now()->subDays(6)->startOfDay(),
                now()->endOfDay(),
            ])
            ->with(['activities'])
            ->orderByDesc('created_at')
            ->get();

        $data = $logs->map(fn($log) => [
            'id_log'     => $log->id_log,
            'tanggal'    => $log->created_at->toDateString(),
            'activities' => $log->activities->map(fn($a) => [
                'id_activity'    => $a->id_activity,
                'nama_aktivitas' => $a->nama_aktivitas,
                'icon'           => $a->icon,
            ]),
        ]);

        return response()->json([
            'status' => 'success',
            'data'   => $data,
        ]);
    }

    // GET /api/activities/logs — list activity logs user (bulan ini)
    public function logs(Request $request)
    {
        $startDate = now()->startOfMonth();
        $endDate = now()->endOfMonth();

        $logs = ActivityLog::where('user_id', $request->user()->id)
            ->whereBetween('date', [$startDate, $endDate])
            ->with('activities')
            ->orderByDesc('date')
            ->get();

        $data = $logs->map(function ($log) {
            return [
                'id' => $log->id,
                'activities' => $log->activities->map(function ($activity) {
                    return [
                        'id' => $activity->id_activity,
                        'name' => $activity->nama_aktivitas,
                        'icon' => $activity->icon,
                    ];
                }),
                'description' => $log->description,
                'photo_url' => $log->photo_path ? Storage::url($log->photo_path) : null,
                'date' => $log->date->toDateString(),
                'created_at' => $log->created_at,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }

    // POST /api/activities/logs — create new activity log
    public function storeLog(Request $request)
    {
        try {
            $user = $request->user();
            
            \Log::debug('StoreLog Request', [
                'user' => $user,
                'user_id_user' => $user?->id_user,
                'auth_header' => $request->header('Authorization'),
            ]);
            
            if (!$user) {
                \Log::error('User not authenticated in storeLog');
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized - User not found from token',
                ], 401);
            }

            $request->validate([
                'activity_ids' => 'required|array|min:1',
                'activity_ids.*' => 'exists:activities,id_activity',
                'description' => 'nullable|string|max:1000',
                'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'date' => 'required|date|before_or_equal:today',
            ]);

            $photoPath = null;
            if ($request->hasFile('photo')) {
                $file = $request->file('photo');
                $originalName = $file->getClientOriginalName();
                
                // Jika nama file terlalu panjang, generate nama baru
                if (strlen($originalName) > 100) {
                    $extension = $file->getClientOriginalExtension();
                    $originalName = 'activity_' . time() . '_' . rand(1000, 9999) . '.' . $extension;
                }
                
                $photoPath = $file->storeAs('activities', $originalName, 'public');
            }

            $log = ActivityLog::create([
                'user_id' => $user->id_user,
                'description' => $request->description,
                'photo_path' => $photoPath,
                'date' => $request->date,
            ]);

            // Attach activities
            $activityInserts = array_map(function ($activityId) use ($log) {
                return [
                    'activity_log_id' => $log->id,
                    'activity_id' => $activityId,
                ];
            }, $request->activity_ids);

            ActivityLogActivity::insert($activityInserts);

            return response()->json([
                'status' => 'success',
                'message' => 'Activity log berhasil disimpan.',
                'data' => $log->load('activities'),
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error in storeLog: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }
}

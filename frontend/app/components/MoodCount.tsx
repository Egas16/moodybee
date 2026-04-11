"use client";

// MoodCount.tsx
// PERUBAHAN dari versi lama:
//   - Count tidak lagi hardcode, diambil dari GET /api/mood/stats bulan ini
//   - Tampilan / styling tidak berubah sama sekali

import { useState, useEffect } from "react";
import { IconHappy, IconGood, IconNeutral, IconBad, IconSad } from "./icons";
import { fetchMoodStats, type MoodCount } from "@/lib/api/mood";

// Warna per mood icon — harus cocok dengan kolom icon di tabel moods
const MOOD_COLORS: Record<string, string> = {
  happy:   "#FFB000",
  good:    "#74CD28",
  neutral: "#00BCD4",
  bad:     "#339AF0",
  sad:     "#3F51B5",
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  happy:   IconHappy,
  good:    IconGood,
  neutral: IconNeutral,
  bad:     IconBad,
  sad:     IconSad,
};

const DUMMY_STATS: MoodCount[] = [
  { id_mood: 1, nama_mood: "Happy",   icon: "happy",   level_mood: 5, count: 0 },
  { id_mood: 2, nama_mood: "Good",    icon: "good",    level_mood: 4, count: 0 },
  { id_mood: 3, nama_mood: "Neutral", icon: "neutral", level_mood: 3, count: 0 },
  { id_mood: 4, nama_mood: "Bad",     icon: "bad",     level_mood: 2, count: 0 },
  { id_mood: 5, nama_mood: "Sad",     icon: "sad",     level_mood: 1, count: 0 },
];

export default function MoodCount({ year, month }: { year: number; month: number }) {
  const [counts, setCounts]   = useState<MoodCount[]>(DUMMY_STATS);
  const [loading, setLoading] = useState(true);

  const refreshMoodStats = async () => {
    setLoading(true);
    try {
      const data = await fetchMoodStats(year, month);
      const sorted = [...data.counts].sort((a, b) => b.level_mood - a.level_mood);
      setCounts(sorted.length ? sorted : DUMMY_STATS);
    } catch (error) {
      console.error("fetchMoodStats failed", error);
      setCounts(DUMMY_STATS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMoodStats();
  }, [year, month]);

  useEffect(() => {
    const onMoodSaved = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      const { tanggal, icon, prevIcon } = event.detail ?? {};
      if (!tanggal || !icon) return;

      const [eventYear, eventMonth] = tanggal.split("-").map((v: string) => Number(v));
      if (eventYear !== year || eventMonth !== month) return;

      setCounts((prev) => {
        let changed = false;
        const next = prev.map((m) => {
          if (m.icon === icon) {
            changed = true;
            return { ...m, count: m.count + 1 };
          }
          if (prevIcon && m.icon === prevIcon && prevIcon !== icon) {
            changed = true;
            return { ...m, count: Math.max(0, m.count - 1) };
          }
          return m;
        });

        if (changed) return next;

        // Kalau mood tidak cocok dengan data lokal, tarik ulang dari API supaya pasti sinkron
        refreshMoodStats();
        return prev;
      });
    };

    window.addEventListener("mood-saved", onMoodSaved as EventListener);
    return () => window.removeEventListener("mood-saved", onMoodSaved as EventListener);
  }, [year, month]);

  // Saat loading atau data kosong, tampilkan data dummy dengan count 0 supaya layout tidak hilang
  const displayData = loading || counts.length === 0 ? DUMMY_STATS : counts;

  return (
    <div className="w-full rounded-[28px] border-[5px] border-[#FDB813] bg-white shadow-md overflow-hidden flex flex-col pt-6 pb-6 sm:pt-8 sm:pb-8">

      {/* Decorative arc — identik dengan versi asli */}
      <div className="relative mx-auto flex h-[80px] w-[160px] items-start justify-center overflow-hidden sm:h-[100px] sm:w-[200px]">
        <div className="absolute top-0 h-[160px] w-[160px] rounded-full border-[14px] border-[#FDB813] sm:h-[200px] sm:w-[200px] sm:border-[16px]" />
      </div>

      <div className="w-full px-5 mt-3 sm:px-8">
        <div className="text-center mb-2">
          <span className="text-[11px] font-bold text-gray-500 sm:text-[13px]">Total moods logged</span>
          <p className="text-[28px] font-extrabold text-[#FDB813] sm:text-[34px]">{displayData.reduce((sum, item) => sum + item.count, 0)}</p>
        </div>
        <h3 className="text-center text-[15px] font-extrabold text-[#FDB813] sm:text-[18px] mb-4 tracking-wide">
          Mood Count
        </h3>
        <div className="w-full h-[2px] bg-gray-200 mb-5 sm:mb-6" />

        <div className="flex items-start justify-between">
          {displayData.map((m) => {
            const IconComponent = ICON_MAP[m.icon];
            const color         = MOOD_COLORS[m.icon] ?? "#888";
            if (!IconComponent) return null;

            return (
              <div key={m.id_mood} className="flex flex-col items-center gap-1.5 sm:gap-2">
                <IconComponent
                  className="h-[36px] w-[36px] sm:h-[44px] sm:w-[44px] stroke-[2px]"
                  style={{ color }}
                />
                <span className="text-[9px] font-bold text-gray-500 sm:text-[11px]">
                  {m.nama_mood}
                </span>
                <span
                  className="flex h-[18px] w-[32px] items-center justify-center rounded-xl text-[11px] font-extrabold text-white sm:h-[22px] sm:w-[38px] sm:text-[12px]"
                  style={{ background: color }}
                >
                  {m.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
"use client";
// MoodCalendar.tsx
// PERUBAHAN dari versi lama:
//   1. Saat mount → fetch mood log bulan ini dari API, isi state `moods`
//   2. Saat user pilih mood di modal → POST ke API (pakai id_mood dari DB)
//   3. Tampilan / styling tidak berubah sama sekali

import { useState, useEffect } from "react";
import { IconHappy, IconGood, IconNeutral, IconBad, IconSad } from "./icons";
import {
  fetchMoodEntries,
  fetchAvailableMoods,
  saveMoodEntry,
  type MoodOption,
} from "@/lib/api/mood";

const MOODS = [
  { id: "happy",   icon: IconHappy,   color: "#7CCC29", label: "Happy"   },
  { id: "good",    icon: IconGood,    color: "#8BC34A", label: "Good"    },
  { id: "neutral", icon: IconNeutral, color: "#00BCD4", label: "Neutral" },
  { id: "bad",     icon: IconBad,     color: "#339AF0", label: "Bad"     },
  { id: "sad",     icon: IconSad,     color: "#3F51B5", label: "Sad"     },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

interface MoodCalendarProps {
  year?: number;
  month?: number; // 0-based: 0=Jan, 11=Des — sama seperti versi lama
}

export default function MoodCalendar({ year: propYear, month: propMonth }: MoodCalendarProps = {}) {
  const today = new Date();
  const year  = propYear  !== undefined ? propYear  : today.getFullYear();
  const month = propMonth !== undefined ? propMonth : today.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay    = getFirstDayOfMonth(year, month);
  const monthName   = new Date(year, month, 1).toLocaleString("en-US", { month: "long" });

  // Generate cells: array of day numbers, padded with nulls for empty slots
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day);
  }

  // key: "YYYY-MM-DD" → icon string ("happy", "good", dst)
  const [moods, setMoods]                   = useState<Record<string, string>>({});
  const [selectedDay, setSelectedDay]       = useState<number | null>(null);
  const [availableMoods, setAvailableMoods] = useState<MoodOption[]>([]);
  const [saving, setSaving]                 = useState(false);

  useEffect(() => {
    const apiMonth = month + 1; // API pakai 1-based

    // Fetch log bulan ini
    fetchMoodEntries(year, apiMonth)
      .then((entries) => {
        const mapped: Record<string, string> = {};
        entries.forEach((e) => {
          const dateKey = e.tanggal.slice(0, 10); // ambil "YYYY-MM-DD"
          mapped[dateKey] = e.mood.icon;
        });
        setMoods(mapped);
      })
      .catch(console.error);

    // Fetch daftar mood (butuh id_mood saat POST)
    fetchAvailableMoods().then(setAvailableMoods).catch(console.error);

    const handleMoodSaved = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      const detail = event.detail as { tanggal?: string; icon?: string };
      if (!detail.tanggal || !detail.icon) return;

      const [eventYear, eventMonth] = detail.tanggal.split("-").map((v) => Number(v));
      if (eventYear !== year || eventMonth !== apiMonth) return;

      const key = detail.tanggal as string;
      const icon = detail.icon as string;

      setMoods((prev) => ({ ...prev, [key]: icon }));
    };

    window.addEventListener("mood-saved", handleMoodSaved as EventListener);
    return () => window.removeEventListener("mood-saved", handleMoodSaved as EventListener);
  }, [year, month]);

  const handleMoodSelect = async (moodIconId: string) => {
    if (selectedDay === null) return;

    const moodOption = availableMoods.find((m) => m.icon === moodIconId);
    if (!moodOption) return;

    const tanggal = `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
    const previousIcon = moods[tanggal] ?? null;

    // Optimistic update — UI langsung berubah, tidak tunggu API
    setMoods((prev) => ({ ...prev, [tanggal]: moodIconId }));
    setSelectedDay(null);

    setSaving(true);
    try {
      await saveMoodEntry({ id_mood: moodOption.id_mood, tanggal });
      window.dispatchEvent(
        new CustomEvent("mood-saved", {
          detail: {
            tanggal,
            icon: moodIconId,
            prevIcon: previousIcon,
          },
        })
      );
    } catch (err) {
      console.error("Gagal menyimpan mood:", err);
      // Rollback kalau gagal
      setMoods((prev) => {
        const next = { ...prev };
        if (previousIcon) {
          next[tanggal] = previousIcon;
        } else {
          delete next[tanggal];
        }
        return next;
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-[28px] bg-[#FDB813] shadow-md">
      <div className="bg-[#E59400] py-3 text-center">
        <h2 className="text-[17px] font-extrabold text-[#222222]">{monthName}</h2>
      </div>

      <div className="px-4 pt-4 pb-6 sm:px-6 sm:pt-6">
        <div className="mb-2 grid grid-cols-7 text-center">
          {DAYS.map((d) => (
            <span key={d} className="text-[11px] font-extrabold text-[#222222] sm:text-xs">
              {d}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-3 sm:gap-y-4">
          {cells.map((day, idx) => {
            if (!day) return <div key={idx} />;

            const dateKey     = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const moodData    = MOODS.find((m) => m.id === moods[dateKey]);

            return (
              <button
                key={idx}
                onClick={() => setSelectedDay(day)}
                className="flex flex-col items-center gap-1.5 transition-transform hover:scale-110"
              >
                {moodData ? (
                  <moodData.icon
                    className="h-[30px] w-[30px] sm:h-9 sm:w-9"
                    style={{ color: "#fff" }}
                  />
                ) : (
                  <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full border-[1.5px] border-white/60 text-[18px] font-medium text-white/80 transition-all hover:border-white hover:text-white sm:h-9 sm:w-9">
                    +
                  </span>
                )}
                <span className="text-[10px] font-extrabold text-[#222222] sm:text-[11px]">
                  {day}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mood Selector Modal — identik dengan versi asli */}
      {selectedDay !== null && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10 transition-opacity p-4">
          <div className="w-[95%] max-w-sm rounded-[24px] bg-white p-5 sm:p-6 shadow-2xl">
            <p className="mb-4 text-center text-sm font-bold text-gray-800">
              How are you feeling on day {selectedDay}?
            </p>
            <div className="flex justify-between gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleMoodSelect(m.id)}
                  disabled={saving}
                  className="flex flex-col items-center gap-2 rounded-xl p-2 transition hover:bg-gray-100 disabled:opacity-50"
                >
                  <m.icon
                    className="h-10 w-10 sm:h-12 sm:w-12 stroke-[2px]"
                    style={{ color: m.color }}
                  />
                  <span className="text-[10px] font-bold capitalize text-gray-600">
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectedDay(null)}
              className="mt-6 w-full rounded-xl bg-gray-100 py-3 text-center text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

// MoodBanner.tsx
// PERUBAHAN dari versi lama:
//   - Tombol mood sekarang punya onClick yang POST ke API
//   - Mood yang sudah dipilih hari ini diberi highlight (scale + opacity)
//   - Tanggal sekarang dinamis dari Date, bukan hardcode
//   - Tampilan / layout tidak berubah sama sekali

import { useState, useEffect } from "react";
import { IconHappy, IconGood, IconNeutral, IconBad, IconSad } from "./icons";
import {
  fetchAvailableMoods,
  fetchMoodEntries,
  saveMoodEntry,
  type MoodOption,
} from "@/lib/api/mood";

// Mapping icon string → komponen SVG
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  happy:   IconHappy,
  good:    IconGood,
  neutral: IconNeutral,
  bad:     IconBad,
  sad:     IconSad,
};

// Label bahasa Inggris per icon (untuk tampilan di bawah emoji)
const LABEL_MAP: Record<string, string> = {
  happy:   "Happy",
  good:    "Good",
  neutral: "Neutral",
  bad:     "Bad",
  sad:     "Sad",
};

export default function MoodBanner() {
  const [availableMoods, setAvailableMoods] = useState<MoodOption[]>([]);
  const [selectedIcon, setSelectedIcon]     = useState<string | null>(null); // icon mood hari ini
  const [saving, setSaving]                 = useState(false);
  const [userName, setUserName]             = useState<string>("User");

  // Format tanggal dinamis, misal "30 Maret 2026"
  const today    = new Date();
  const dateStr  = today.toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });

  useEffect(() => {
    // Fetch user info
    const fetchUser = async () => {
      const token = localStorage.getItem("auth_token") || localStorage.getItem("AUTH_TOKEN");
      if (!token) return;

      try {
        const res = await fetch("http://127.0.0.1:8000/api/user", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        });
        const json = await res.json();
        if (json.username) {
          setUserName(json.username);
        }
      } catch (err) {
        console.error("Gagal ambil user info:", err);
      }
    };

    fetchUser();

    // Fetch daftar mood yang tersedia
    fetchAvailableMoods().then(setAvailableMoods).catch(console.error);

    // Cek apakah user sudah isi mood hari ini → untuk highlight tombol
    const now = new Date();
    fetchMoodEntries(now.getFullYear(), now.getMonth() + 1)
      .then((entries) => {
        const todayStr  = now.toISOString().slice(0, 10); // "YYYY-MM-DD"
        const todayEntry = entries.find((e) => e.tanggal.slice(0, 10) === todayStr);
        if (todayEntry) setSelectedIcon(todayEntry.mood.icon);
      })
      .catch(console.error);
  }, []);

  const handleSelectMood = async (mood: MoodOption) => {
    if (saving) return;
    if (selectedIcon === mood.icon) return;

    const previousIcon = selectedIcon;
    setSelectedIcon(mood.icon); // optimistic
    setSaving(true);
    try {
      await saveMoodEntry({ id_mood: mood.id_mood });

      const today = new Date().toISOString().slice(0, 10);
      window.dispatchEvent(
        new CustomEvent("mood-saved", {
          detail: {
            tanggal: today,
            icon: mood.icon,
            prevIcon: previousIcon,
          },
        })
      );
    } catch (err) {
      console.error("Gagal menyimpan mood:", err);
      setSelectedIcon(previousIcon); // rollback
    } finally {
      setSaving(false);
    }
  };

  // Urutkan dari level tertinggi → terendah (happy..sad), sesuai urutan di versi lama
  const sortedMoods = [...availableMoods].sort((a, b) => b.level_mood - a.level_mood);

  return (
    <div className="w-full bg-[#7CCC29] text-white rounded-b-[40px] shadow-md">
      <div className="mx-auto max-w-5xl px-6 pt-6 pb-8 sm:px-10 sm:pt-8 sm:pb-10">
        {/* Header text row — identik dengan versi asli */}
        <div className="flex flex-col items-center justify-between text-center gap-2 sm:flex-row sm:text-left">
          <p className="text-sm font-bold sm:text-lg">
            Welcome, {userName}!
          </p>
          <p className="text-xs font-bold sm:text-sm">
            Samarinda, {dateStr}
          </p>
        </div>
        
        <p className="text-center mb-8 text-sm font-black opacity-90 tracking-widest uppercase">
          Bagaimana perasaanmu hari ini?
        </p>

        {/* Mood icons row */}
        <div className="max-w-xl mx-auto mt-6 flex items-center justify-between gap-4 sm:mt-8">
          {sortedMoods.map((mood) => {
            const IconComponent = ICON_MAP[mood.icon];
            if (!IconComponent) return null;
            const isSelected = selectedIcon === mood.icon;

            return (
              <button
                key={mood.id_mood}
                onClick={() => handleSelectMood(mood)}
                disabled={saving}
                title={LABEL_MAP[mood.icon] ?? mood.nama_mood}
                className={`flex flex-col items-center gap-2 transition-transform active:scale-95 text-white
                  ${isSelected ? "scale-110 opacity-100" : "hover:scale-110 opacity-80 hover:opacity-100"}
                  ${saving ? "cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                <IconComponent className="h-12 w-12 sm:h-[60px] sm:w-[60px] stroke-[2.5px] drop-shadow-sm" />
                <span className="text-[10px] font-extrabold tracking-wide sm:text-xs">
                  {LABEL_MAP[mood.icon] ?? mood.nama_mood}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
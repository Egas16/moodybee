"use client";
import React, { useState, useEffect } from "react";
import { IconBook, IconCirclePlus, IconDocument } from "@/app/components/icons";
import Link from "next/link";
import {
  Bed,
  Utensils,
  Dumbbell,
  Music,
  Sun,
  Coffee,
  HeartPulse,
  BookOpen,
  Bike,
  Pencil,
  Gamepad,
  ShoppingBag,
  Users,
  Plane,
  TreePine,
  Home,
  Stethoscope,
  Smile,
  Star,
  Moon,
  Bookmark,
  Tv,
  UtensilsCrossed,
  Headphones,
  Dog,
  Bath,
  Baby,
  Glasses,
  Scissors,
  Flower,
  Wind,
  Umbrella
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Activity {
  id_activity: number;
  nama_aktivitas: string;
  icon: string;
}

const iconMap = {
  Bed, Utensils, Dumbbell, Music, Sun, Coffee, HeartPulse, BookOpen, Bike, Pencil, Gamepad, ShoppingBag, Users, Plane, TreePine, Home, Stethoscope, Smile, Star, Moon, Bookmark, Tv, UtensilsCrossed, Headphones, Dog, Bath, Baby, Glasses, Scissors, Flower, Wind, Umbrella
};

export default function CreateActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivityIds, setSelectedActivityIds] = useState<number[]>([]);
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("No auth token found");
        return;
      }

      const response = await fetch("http://localhost:8000/api/activities", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }

      const data = await response.json();
      setActivities(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (iconMap as any)[iconName];
    return IconComponent ? <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" /> : <div>?</div>;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedActivityIds.length === 0) {
      setError("Please select at least one activity");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("No auth token found. Please login first.");
      }

      const formData = new FormData();
      selectedActivityIds.forEach(id => formData.append("activity_ids[]", id.toString()));
      formData.append("description", description);
      formData.append("date", date);
      if (photo) {
        formData.append("photo", photo);
      }

      const response = await fetch("http://localhost:8000/api/activities/logs", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = "Failed to create activity";
        
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || "Failed to create activity";
        } else {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      router.push("/activities");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-white w-full pb-32 overflow-x-hidden font-sans">
      {/* Top Left Orange Badge */}
      <div className="absolute top-0 left-0 bg-[#ff7a00] rounded-br-[25px] sm:rounded-br-[35px] px-6 sm:px-10 py-5 z-20">
        <h1 className="text-white font-extrabold text-2xl tracking-wide">
          My Activities
        </h1>
      </div>

      {/* Top Right Back Button */}
      <div className="absolute top-6 right-6 sm:right-10 z-20">
        <Link
          href="/activities"
          className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border-[3px] border-[#5ccc14] text-[#5ccc14] bg-white hover:bg-[#f6fff0] transition transform hover:scale-105"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </Link>
      </div>

      {/* Main Content */}
      <div className="pt-28 pb-10 px-4 sm:px-8 md:px-14 max-w-7xl mx-auto h-auto md:h-[calc(100vh-120px)] min-h-[800px]">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full items-stretch">
          {/* LEFT ICON PICKER */}
          <div className="bg-white rounded-[40px] border-[5px] sm:border-[6px] border-[#ff7a00] p-6 lg:p-8 flex flex-col h-full items-center shadow-[0px_4px_10px_rgba(0,0,0,0.05)] overflow-hidden">
            <p className="text-[#ff7a00] font-bold text-sm mb-4 self-start">
              Tap to select your activities
            </p>
            <div className="grid grid-cols-4 gap-2 w-full overflow-y-auto flex-1 pr-1">
              {activities.map((activity) => {
                const isSelected = selectedActivityIds.includes(activity.id_activity);
                return (
                  <button
                    key={activity.id_activity}
                    type="button"
                    onClick={() => {
                      setSelectedActivityIds(prev =>
                        prev.includes(activity.id_activity)
                          ? prev.filter(id => id !== activity.id_activity)
                          : [...prev, activity.id_activity]
                      );
                    }}
                    title={activity.nama_aktivitas}
                    className={`flex flex-col justify-center items-center gap-1 rounded-xl p-2 transition-all duration-200 active:scale-95
                      ${isSelected
                        ? "bg-[#ff7a00] shadow-sm"
                        : "bg-gray-50 hover:bg-orange-50"
                      }`}
                  >
                    <div className={isSelected ? "text-white" : "text-[#a0b5c9]"}>
                      {getIconComponent(activity.icon)}
                    </div>
                    <span
                      className={`text-[8px] font-semibold truncate w-full text-center transition-colors duration-200 ${isSelected ? "text-white" : "text-gray-400"}`}
                    >
                      {activity.nama_aktivitas}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col h-full gap-6">
            {/* Selected activities preview */}
            {selectedActivityIds.length > 0 && (
              <div className="bg-orange-50 rounded-[24px] border-[3px] border-[#ff7a00] px-5 py-3 flex flex-wrap gap-2 items-center">
                <span className="text-[#ff7a00] font-bold text-xs mr-1">Selected:</span>
                {selectedActivityIds.map(id => {
                  const activity = activities.find(a => a.id_activity === id);
                  return activity ? (
                    <div
                      key={id}
                      className="flex items-center gap-1 bg-[#ff7a00] rounded-full px-2 py-1"
                    >
                      <div className="text-white">{getIconComponent(activity.icon)}</div>
                      <span className="text-white text-[10px] font-semibold">{activity.nama_aktivitas}</span>
                    </div>
                  ) : null;
                })}
              </div>
            )}

            {/* Date Input */}
            <div className="bg-white rounded-[30px] border-[4px] border-[#ff7a00] p-5 shadow-[0px_4px_10px_rgba(0,0,0,0.05)]">
              <label className="block text-[#ff7a00] font-black text-base sm:text-lg mb-3">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent border-0 outline-none text-gray-700 font-medium"
                required
              />
            </div>

            {/* Write Down Box */}
            <div className="bg-white rounded-[30px] border-[4px] border-[#ff7a00] p-5 flex flex-col flex-[0.5] shadow-[0px_4px_10px_rgba(0,0,0,0.05)] relative">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-[#ff7a00] font-black text-base sm:text-lg">
                  Write down about your activity
                </h2>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-[#5ccc14] shrink-0 transform -rotate-12"
                >
                  <path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z" />
                </svg>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full flex-1 resize-none bg-transparent border-0 outline-none text-gray-700 text-sm placeholder-gray-300 font-medium leading-relaxed border-b-[2px] border-gray-200 focus:border-[#ff7a00] transition-colors duration-200 pb-1"
                placeholder="Type your activity notes here..."
                rows={3}
              />
            </div>

            {/* Upload Box */}
            <div className="bg-white rounded-[30px] border-[4px] border-[#ff7a00] p-5 flex flex-col flex-[0.6] shadow-[0px_4px_10px_rgba(0,0,0,0.05)] relative">
              <h2 className="text-[#ff7a00] font-black text-base sm:text-lg mb-4">
                Wanna upload a picture?
              </h2>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex-1 flex items-center justify-center pt-4 cursor-pointer"
              >
                <button
                  type="button"
                  className="bg-[#ff7a00] hover:bg-[#e66c00] text-white font-bold text-base sm:text-lg py-2 px-10 rounded-[16px] transition transform hover:scale-105"
                >
                  {photo ? photo.name : "Upload"}
                </button>
              </label>
              {photo && (
                <img
                  src={URL.createObjectURL(photo)}
                  alt="Preview"
                  className="mt-4 w-full max-w-xs h-auto rounded-lg border mx-auto"
                />
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Save Button */}
            <button
              type="submit"
              disabled={loading || selectedActivityIds.length === 0}
              className="bg-[#ff7a00] hover:bg-[#e66c00] disabled:bg-gray-400 text-white font-black text-base sm:text-lg py-3 rounded-[16px] w-full transition shrink-0 transform hover:scale-[1.02] disabled:transform-none"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      {/* Bottom Nav Bar */}
      <div className="fixed bottom-0 left-0 right-0 w-full bg-white pb-4 pt-4 px-10 flex items-center justify-around z-50 border-t border-gray-100">
        <Link href="/diary" className="p-2 transition-transform hover:scale-110 active:scale-95 group">
          <IconBook className="h-[36px] w-[36px] sm:h-[44px] sm:w-[44px] text-[#7CCC29] stroke-[2px] group-hover:drop-shadow-sm" />
        </Link>
        <Link href="/dashboard" className="p-2 transition-transform hover:scale-110 active:scale-95 group">
          <IconCirclePlus className="h-[48px] w-[48px] sm:h-[58px] sm:w-[58px] text-[#7CCC29] stroke-[2.5px] group-hover:drop-shadow-sm" />
        </Link>
        <Link href="/activities" className="p-2 transition-transform hover:scale-110 active:scale-95 group">
          <IconDocument className="h-[36px] w-[36px] sm:h-[44px] sm:w-[44px] text-[#7CCC29] stroke-[2px] group-hover:drop-shadow-sm" />
        </Link>
      </div>
    </main>
  );
}

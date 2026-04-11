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

interface ActivityLog {
  id: number;
  activities: {
    id: number;
    name: string;
    icon: string;
  }[];
  description: string | null;
  photo_url: string | null;
  date: string;
  created_at: string;
}

const iconMap = {
  Bed, Utensils, Dumbbell, Music, Sun, Coffee, HeartPulse, BookOpen, Bike, Pencil, Gamepad, ShoppingBag, Users, Plane, TreePine, Home, Stethoscope, Smile, Star, Moon, Bookmark, Tv, UtensilsCrossed, Headphones, Dog, Bath, Baby, Glasses, Scissors, Flower, Wind, Umbrella
};

export default function ActivitiesPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      const response = await fetch("http://localhost:8000/api/activities/logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }

      const data = await response.json();
      setLogs(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (iconMap as any)[iconName];
    return IconComponent ? <IconComponent className="w-6 h-6" /> : <div>?</div>;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading activities...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-white w-full pb-32 overflow-x-hidden font-sans">
      {/* Top Left Orange Badge */}
      <div className="absolute top-0 left-0 bg-[#ff7a00] rounded-br-[25px] sm:rounded-br-[35px] px-6 sm:px-10 py-5 z-20">
        <h1 className="text-white font-extrabold text-2xl tracking-wide">
          My Activities
        </h1>
      </div>

      {/* Top Right Create Button */}
      <div className="absolute top-6 right-6 sm:right-10 z-20">
        <Link
          href="/activities/create"
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
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </Link>
      </div>

      {/* Content */}
      <div className="pt-28 pb-10 px-4 sm:px-8 md:px-14 max-w-7xl mx-auto">
        {logs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No activities logged this month.</p>
            <Link
              href="/activities/create"
              className="inline-block mt-4 bg-[#ff7a00] text-white px-6 py-2 rounded-lg hover:bg-[#e66c00]"
            >
              Create Your First Activity
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-white rounded-[30px] border-[4px] border-[#ff7a00] p-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#ff7a00] rounded-full flex items-center justify-center text-white">
                      {log.activities.length > 0 && getIconComponent(log.activities[0].icon)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-[#ff7a00]">
                        {log.activities.map(a => a.name).join(', ')}
                      </h3>
                      <span className="text-sm text-gray-500">{log.date}</span>
                    </div>
                    {log.description && (
                      <p className="text-gray-700 mb-3">{log.description}</p>
                    )}
                    {log.photo_url && (
                      <img
                        src={`http://localhost:8000${log.photo_url}`}
                        alt="Activity photo"
                        className="w-full max-w-md h-auto rounded-lg border"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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

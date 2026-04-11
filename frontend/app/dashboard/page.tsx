"use client";
import { useState, useEffect } from "react";
import MoodBanner from "@/app/components/MoodBanner";
import MoodCalendar from "@/app/components/MoodCalendar";
import MoodCount from "@/app/components/MoodCount";
import QuoteCard from "@/app/components/QuoteCard";
import LogoutButton from "@/app/components/LogoutButton";
import Link from "next/link";
import { IconBook, IconCirclePlus, IconDocument } from "@/app/components/icons";

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 });

  useEffect(() => {
    const now = new Date();
    setCurrentDate({ year: now.getFullYear(), month: now.getMonth() + 1 });
  }, []);
  return (
    <main className="min-h-screen bg-[#F8FAF5] pb-32">
      <MoodBanner />

      {/* Container Utama */}
      <div className="max-w-[1440px] mx-auto mt-10 px-8 flex flex-col lg:flex-row gap-8 justify-center items-start">

        {/* Kolom Kalender (Kiri) */}
        <div className="flex-1 w-full flex justify-center">
          <MoodCalendar />
        </div>

        {/* Kolom Kanan (Statistik, Quote, & Logout) */}
        <div className="w-full lg:w-[380px] flex flex-col gap-6">
          <MoodCount year={currentDate.year} month={currentDate.month} />
          <QuoteCard />

          {/* Navigasi Logout - Nempel di bawah, rata kanan */}
          <div className="flex justify-end mt-4">
            <div className="w-fit">
              <LogoutButton />
            </div>
          </div>
        </div>

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
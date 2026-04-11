import MoodBanner from "@/app/components/MoodBanner";
import MoodCalendar from "@/app/components/MoodCalendar";
import MoodCount from "@/app/components/MoodCount";
import QuoteCard from "@/app/components/QuoteCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard – Daylio",
  description: "Track your daily mood",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-white pb-10 overflow-x-hidden">
      {/* Banner is outside max-w wrapper so its background spans full width */}
      <MoodBanner />

      {/* Unified content area matching the Figma layout, constrained in center */}
      <div className="w-full mt-6 px-4 sm:mt-10 sm:px-8 flex flex-col gap-6 sm:flex-row sm:gap-6">
        {/* Calendar Column */}
        <div className="relative grid w-full grid-cols-1 lg:grid-cols-2 shadow-md bg-[#FDB813] rounded-[28px] overflow-hidden sm:w-[80%]">
          <MoodCalendar year={2026} month={2} /> {/* March */}
          {/* subtle divider line for desktop */}
          <div className="hidden lg:block w-px bg-[#E59400] absolute left-1/2 top-0 bottom-0" />
          <MoodCalendar year={2026} month={3} /> {/* April */}
        </div>

        {/* Right column */}
        <div className="flex w-full flex-col gap-6 sm:w-[20%]">
          <MoodCount />
          <QuoteCard />
        </div>
      </div>
    </main>
  );
}

"use client";

// app/diary/page.tsx
// PERUBAHAN dari versi lama:
//   - Koleksi tidak lagi hardcode ['A','B','C'], diambil dari GET /api/journal/collections
//   - Link ke /diary/[id] pakai id_collection dari DB (bukan idx+1)
//   - Tampilan / layout tidak berubah

import { useState, useEffect } from "react";
import { IconPencil, IconBook, IconCirclePlus, IconDocument } from "@/app/components/icons";
import Link from "next/link";
import { fetchCollections, type JournalCollection } from "@/lib/api/journal";

export default function DiaryPage() {
  const [collections, setCollections] = useState<JournalCollection[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    fetchCollections()
      .then(setCollections)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-white pb-32 relative overflow-x-hidden flex flex-col">
      {/* Header Widget "My Diaries" — identik */}
      <div className="flex justify-start w-full">
        <div className="bg-[#FDB813] text-white font-extrabold tracking-wide text-[22px] px-10 pt-6 pb-6 rounded-br-[36px] shadow-sm lg:px-16 lg:pt-8 lg:pb-8 lg:text-3xl lg:rounded-br-[48px]">
          My Diaries
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 mt-12 sm:mt-16 flex-1">
        {/* Input Box — identik */}
        <Link href="/journal" className="block w-full">
          <div className="w-full border-[8px] border-[#7CCC29] py-8 px-6 sm:px-10 rounded-[36px] sm:rounded-[50px] shadow-sm mb-16 relative flex items-center bg-white cursor-text transition-transform hover:scale-[1.01]">
            <div className="w-full flex items-end justify-between border-b-[2px] border-[#333333] pb-1.5 px-2">
              <span className="w-full text-[15px] sm:text-[17px] font-semibold text-[#555555] pt-2 select-none">
                What&apos;s on your mind?
              </span>
              <IconPencil className="h-[22px] w-[22px] text-[#7CCC29] flex-shrink-0 mb-1 ml-4 stroke-[2.5px]" />
            </div>
          </div>
        </Link>

        {/* Collection Cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 pb-16 pt-4">
          {loading ? (
            // Skeleton saat loading — jumlah dan ukuran sama dengan card asli
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full h-[190px] sm:h-[220px] bg-gray-100 rounded-[32px] sm:rounded-[44px] animate-pulse"
              />
            ))
          ) : collections.length === 0 ? (
            <p className="text-[15px] text-gray-400 col-span-3 text-center pt-8">
              Belum ada koleksi. Tulis journal pertamamu!
            </p>
          ) : (
            collections.map((col) => (
              <Link
                href={`/diary/${col.id_collection}`}
                key={col.id_collection}
                className="w-full h-[190px] sm:h-[220px] bg-white rounded-[32px] sm:rounded-[44px] flex flex-col items-center justify-center gap-2 transition-transform hover:-translate-y-2 cursor-pointer"
                style={{ boxShadow: "16px 18px 24px rgba(200, 200, 200, 0.9)" }}
              >
                <h3 className="font-extrabold text-black text-[17px] sm:text-[20px] tracking-wide text-center px-4">
                  {col.name}
                </h3>
                <span className="text-[12px] text-gray-400 font-medium">
                  {col.journals_count} {col.journals_count === 1 ? "entry" : "entries"}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Bottom Nav Bar — identik */}
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
"use client";

// app/journal/page.tsx
// PERUBAHAN dari versi lama:
//   - Koleksi di modal "Konfirmasi Papan" diambil dari API, bukan hardcode
//   - Tombol "+" di modal buat koleksi baru via POST /api/journal/collections
//   - Tombol Save (pilih koleksi) → POST /api/journal/journals → redirect ke koleksi
//   - Kolom pencarian di modal berfungsi filter koleksi
//   - Tampilan / layout tidak berubah sama sekali

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useToast } from "@/app/components/ToastProvider";
import {
  fetchCollections,
  createCollection,
  saveJournal,
  type JournalCollection,
} from "@/lib/api/journal";

// Dynamic import TiptapEditor to avoid SSR issues
const TiptapEditor = dynamic(() => import("@/app/components/TiptapEditor"), { ssr: false });

export default function JournalPage() {
  const router                              = useRouter();
  const [isPublishing, setIsPublishing]     = useState(false);
  const [title, setTitle]                   = useState("");
  const [content, setContent]               = useState("");

  // Modal state
  const [collections, setCollections]       = useState<JournalCollection[]>([]);
  const [searchQuery, setSearchQuery]       = useState("");
  const [newColName, setNewColName]         = useState("");
  const [showNewInput, setShowNewInput]     = useState(false);
  const [saving, setSaving]                 = useState(false);
  const toast = useToast();

  // Fetch koleksi saat modal dibuka
  useEffect(() => {
    if (isPublishing) {
      fetchCollections().then(setCollections).catch(console.error);
    }
  }, [isPublishing]);

  // Filter koleksi berdasarkan search
  const filteredCollections = collections.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // User pilih koleksi → simpan journal
  const handleSelectCollection = async (collectionId: number) => {
    if (saving) return;
    if (!title.trim() || !content.trim()) {
      alert("Judul dan isi journal tidak boleh kosong.");
      return;
    }
    setSaving(true);
    try {
      console.log("Saving to collection:", collectionId);
      await saveJournal({ title, content, id_collection: collectionId });
      router.push(`/diary/${collectionId}`);
    } catch (err) {
      console.error("Gagal menyimpan journal:", err);
      toast.notify("Gagal menyimpan journal. Coba lagi.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Buat koleksi baru dari modal
  const handleCreateCollection = async () => {
    if (!newColName.trim()) return;
    try {
      const newCol = await createCollection(newColName.trim());
      setCollections((prev) => [newCol, ...prev]);
      setNewColName("");
      setShowNewInput(false);
      toast.notify("Koleksi baru berhasil dibuat.", "success");
    } catch (err) {
      console.error("Gagal membuat koleksi:", err);
      toast.notify("Gagal membuat koleksi: " + (err as Error).message, "error");
    }
  };

  // ─── Modal "Konfirmasi Papan" ─────────────────────────────────────────────
  if (isPublishing) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header — identik */}
        <div className="flex justify-start w-full">
          <div className="bg-[#FDB813] text-white font-extrabold tracking-wide text-[22px] px-10 pt-6 pb-6 rounded-br-[36px] shadow-sm lg:px-16 lg:pt-8 lg:pb-8 lg:text-3xl lg:rounded-br-[48px]">
            My Diaries
          </div>
        </div>

        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
          <div
            className="w-full max-w-[420px] bg-white rounded-[32px] px-8 py-8"
            style={{ boxShadow: "16px 18px 36px rgba(180, 180, 180, 0.55)" }}
          >
            <h2 className="text-[18px] font-extrabold text-black text-center mb-5">
              Konfirmasi Papan
            </h2>

            {/* Search — sekarang berfungsi */}
            <div className="flex items-center gap-3 border border-black rounded-full px-4 py-2.5 mb-5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black flex-shrink-0">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Cari koleksi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full outline-none bg-transparent text-[15px] text-black"
              />
            </div>

            {/* Collection list — dari API */}
            <div className="flex flex-col gap-1 mb-6 max-h-[240px] overflow-y-auto">
              {filteredCollections.length === 0 ? (
                <p className="text-center text-[13px] text-gray-400 py-4">
                  {searchQuery ? "Koleksi tidak ditemukan." : "Belum ada koleksi."}
                </p>
              ) : (
                filteredCollections.map((col) => (
                  <button
                    key={col.id_collection}
                    onClick={() => handleSelectCollection(col.id_collection)}
                    disabled={saving}
                    className="text-left text-[15px] font-bold text-black py-3 px-2 hover:bg-gray-50 rounded-xl transition-colors w-full disabled:opacity-50"
                  >
                    {col.name}
                  </button>
                ))
              )}
            </div>

            {/* Tambah koleksi baru */}
            <div className="flex flex-col items-center gap-3">
              {showNewInput ? (
                <div className="flex gap-2 w-full">
                  <input
                    type="text"
                    value={newColName}
                    onChange={(e) => setNewColName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreateCollection()}
                    placeholder="Nama koleksi baru..."
                    autoFocus
                    className="flex-1 border border-black rounded-full px-4 py-2 text-[14px] outline-none"
                  />
                  <button
                    onClick={handleCreateCollection}
                    className="bg-[#7CCC29] text-white px-4 py-2 rounded-full text-[13px] font-semibold"
                  >
                    Buat
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewInput(true)}
                  className="w-10 h-10 rounded-full border-2 border-black text-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              )}

              <button
                onClick={() => setIsPublishing(false)}
                className="flex items-center gap-1.5 text-[#6B6B6B] hover:text-black transition-colors text-[14px] font-medium mt-1"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Editor ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white text-black selection:bg-[#7CCC29] selection:text-white">
      {/* Editor Header — identik */}
      <header className="w-full flex items-start justify-between sticky top-0 z-10 bg-white">
        <Link href="/dashboard">
          <div className="bg-[#FDB813] text-white font-extrabold tracking-wide text-[22px] px-10 pt-6 pb-6 rounded-br-[36px] shadow-sm lg:px-16 lg:pt-8 lg:pb-8 lg:text-3xl lg:rounded-br-[48px] hover:brightness-105 transition-all">
            My Diaries
          </div>
        </Link>
        <div className="flex items-center gap-3 px-6 sm:px-8 pt-5">
          <span className="text-[#A8A8A8] text-[13px] font-medium hidden sm:block">Draft</span>
          <Link
            href="/diary"
            className="flex items-center gap-1.5 text-[#6B6B6B] hover:text-black transition-colors text-[14px] font-medium"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </Link>
          <button
            onClick={() => setIsPublishing(true)}
            className="bg-[#7CCC29] text-white px-5 py-2 rounded-[30px] text-[14px] font-semibold shadow-sm hover:opacity-90 hover:shadow-md transition-all active:scale-95"
          >
            Save
          </button>
        </div>
      </header>

      {/* Editor Main — identik */}
      <main className="w-full max-w-[740px] mx-auto px-6 sm:px-12 pt-8 sm:pt-16 pb-32">
        <div className="relative group">
          <textarea
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            placeholder="Title"
            className="w-full text-4xl sm:text-[44px] leading-tight text-gray-900 font-serif placeholder-[#B3B3B1] outline-none bg-transparent mb-4 resize-none overflow-hidden"
            rows={1}
          />
        </div>
        <div className="relative group flex mt-2">
          <div className="absolute -left-12 sm:-left-16 top-0 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
            <button className="p-1.5 text-black border border-black rounded-full hover:bg-black hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
          <div className="w-full">
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder="Tell your story..."
              className="min-h-[200px]"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
"use client";

// app/diary/[id]/page.tsx
// PERUBAHAN dari versi lama:
//   - List journal tidak lagi hardcode lorem ipsum
//   - Fetch dari GET /api/journal/collections/{id}/journals
//   - Judul koleksi diambil dari API bukan dari array hardcode
//   - Tampilan / layout tidak berubah
//   - Tambah menu three dots untuk delete collection atau journals

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { IconArrowLeft, IconBook, IconCirclePlus, IconDocument, IconDotsVertical } from "@/app/components/icons";
import Link from "next/link";
import { useToast } from "@/app/components/ToastProvider";
import ConfirmDialog from "@/app/components/ConfirmDialog";
import { fetchJournals, deleteCollection, deleteJournal, type JournalEntry } from "@/lib/api/journal";

export default function DiaryCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const collectionId = parseInt(id);
  const router = useRouter();
  const toast = useToast();

  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedJournals, setSelectedJournals] = useState<Set<number>>(new Set());
  const [showDeleteCollectionDialog, setShowDeleteCollectionDialog] = useState(false);
  const [showDeleteJournalsDialog, setShowDeleteJournalsDialog] = useState(false);

  // Ambil nama koleksi dari journal pertama, fallback ke "Koleksi Diaries"
  const collectionTitle = journals[0]?.collection?.name ?? "Koleksi Diaries";

  useEffect(() => {
    fetchJournals(collectionId)
      .then(setJournals)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [collectionId]);

  // Function to strip HTML tags and get plain text preview
  const getPlainTextPreview = (htmlContent: string, maxLength: number = 100) => {
    // Remove HTML tags
    const text = htmlContent.replace(/<[^>]*>/g, '').trim();
    // Remove extra whitespace
    const cleanText = text.replace(/\s+/g, ' ').trim();
    // Truncate if too long
    if (cleanText.length > maxLength) {
      return cleanText.substring(0, maxLength) + '...';
    }
    return cleanText;
  };

  const handleDeleteCollection = async () => {
    setShowDeleteCollectionDialog(true);
  };

  const confirmDeleteCollection = async () => {
    try {
      await deleteCollection(collectionId);
      toast.notify("Koleksi berhasil dihapus.", "success");
      router.push("/diary");
    } catch (err) {
      console.error("Gagal hapus koleksi:", err);
      toast.notify("Gagal hapus koleksi.", "error");
    } finally {
      setShowDeleteCollectionDialog(false);
    }
  };

  const handleDeleteSelectedJournals = async () => {
    if (selectedJournals.size === 0) return;
    setShowDeleteJournalsDialog(true);
  };

  const confirmDeleteSelectedJournals = async () => {
    try {
      await Promise.all(Array.from(selectedJournals).map(id => deleteJournal(id)));
      setJournals(journals.filter(j => !selectedJournals.has(j.id_journal)));
      setSelectMode(false);
      setSelectedJournals(new Set());
      toast.notify("Journal berhasil dihapus.", "success");
    } catch (err) {
      console.error("Gagal hapus journals:", err);
      toast.notify("Gagal hapus journals.", "error");
    } finally {
      setShowDeleteJournalsDialog(false);
    }
  };

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedJournals);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedJournals(newSelected);
  };

  // Format tanggal: "16 March 2026"
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric",
    });

  return (
    <main className="min-h-screen bg-white pb-32 relative overflow-x-hidden flex flex-col">
      {/* Top Header — identik */}
      <div className="relative pt-6 pb-6 flex items-center justify-center w-full min-h-[90px]">
        <div className="absolute top-0 left-0 bg-[#FDB813] px-8 py-5 rounded-br-[32px] sm:rounded-br-[40px] z-10">
          <Link href="/diary">
            <IconArrowLeft className="h-8 w-8 text-white stroke-[3px]" />
          </Link>
        </div>
        <h1 className="font-extrabold text-[20px] sm:text-[24px] text-black">
          {collectionTitle}
        </h1>
      </div>

      <div className="w-full max-w-4xl mx-auto px-6 sm:px-10 flex justify-end mb-4">
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="rounded-full border border-black bg-white p-3 shadow-sm hover:bg-gray-50 transition-colors">
            <IconDotsVertical className="h-6 w-6 text-black" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-2xl shadow-lg z-20">
              <button
                onClick={() => {
                  setSelectMode(true);
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-3 hover:bg-gray-100"
              >
                Hapus Journal
              </button>
              <button
                onClick={() => {
                  handleDeleteCollection();
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-3 hover:bg-gray-100 text-red-600"
              >
                Hapus Koleksi
              </button>
            </div>
          )}
        </div>
      </div>

      {/* List of journals */}
      <div className="w-full max-w-4xl mx-auto px-6 sm:px-10 mt-8 flex flex-col gap-6 flex-1">
        {selectMode && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{selectedJournals.size} dipilih</span>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteSelectedJournals}
                disabled={selectedJournals.size === 0}
                className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Hapus
              </button>
              <button
                onClick={() => {
                  setSelectMode(false);
                  setSelectedJournals(new Set());
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Batal
              </button>
            </div>
          </div>
        )}
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="w-full h-[100px] bg-gray-100 rounded-[24px] animate-pulse" />
          ))
        ) : journals.length === 0 ? (
          <p className="text-center text-gray-400 text-[15px] pt-12">
            Belum ada journal di koleksi ini.
          </p>
        ) : (
          journals.map((journal) => (
            <div
              key={journal.id_journal}
              className="w-full border-[4px] border-black rounded-[24px] sm:rounded-[32px] px-6 py-6 sm:px-8 sm:py-8 flex flex-col sm:flex-row items-start justify-between bg-white text-black gap-4 hover:shadow-md transition-shadow"
              style={{ boxShadow: "8px 12px 18px rgba(220, 220, 220, 0.9)" }}
            >
              {selectMode && (
                <input
                  type="checkbox"
                  checked={selectedJournals.has(journal.id_journal)}
                  onChange={() => toggleSelect(journal.id_journal)}
                  className="mt-1 mr-4"
                />
              )}
              <Link
                href={selectMode ? "#" : `/journal/${journal.id_journal}`}
                className="flex flex-col gap-1 sm:max-w-[65%] flex-1"
              >
                <p className="font-extrabold text-[15px] sm:text-[17px]">{journal.title}</p>
                <p className="font-medium text-[13px] sm:text-[14px] text-gray-500 line-clamp-2">
                  {getPlainTextPreview(journal.content)}
                </p>
              </Link>
              <span className="font-extrabold text-[14px] sm:text-[15px] whitespace-nowrap text-right pt-0.5">
                {formatDate(journal.created_at)}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={showDeleteCollectionDialog}
        title="Hapus Koleksi"
        message="Yakin ingin menghapus koleksi ini beserta semua journal di dalamnya? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Koleksi"
        cancelText="Batal"
        onConfirm={confirmDeleteCollection}
        onCancel={() => setShowDeleteCollectionDialog(false)}
      />

      <ConfirmDialog
        isOpen={showDeleteJournalsDialog}
        title="Hapus Journal"
        message={`Yakin ingin menghapus ${selectedJournals.size} journal yang dipilih? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Journal"
        cancelText="Batal"
        onConfirm={confirmDeleteSelectedJournals}
        onCancel={() => setShowDeleteJournalsDialog(false)}
      />

      {/* Bottom Nav Bar — identik */}
      <div className="fixed bottom-0 left-0 right-0 w-full bg-white pb-4 pt-4 px-10 flex items-center justify-around z-50 border-t border-gray-100">
        <Link href="/diary" className="p-2 transition-transform hover:scale-110 active:scale-95 group">
          <IconBook className="h-[36px] w-[36px] sm:h-[44px] sm:w-[44px] text-[#7CCC29] stroke-[2px] group-hover:drop-shadow-sm" />
        </Link>
        <Link href="/dashboard" className="p-2 transition-transform hover:scale-110 active:scale-95 group">
          <IconCirclePlus className="h-[48px] w-[48px] sm:h-[58px] sm:w-[58px] text-[#7CCC29] stroke-[2.5px] group-hover:drop-shadow-sm" />
        </Link>
        <Link href="#" className="p-2 transition-transform hover:scale-110 active:scale-95 group">
          <IconDocument className="h-[36px] w-[36px] sm:h-[44px] sm:w-[44px] text-[#7CCC29] stroke-[2px] group-hover:drop-shadow-sm" />
        </Link>
      </div>
    </main>
  );
}
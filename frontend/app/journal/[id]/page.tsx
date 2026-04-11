"use client";

// app/journal/[id]/page.tsx
// Halaman detail journal: view, edit, delete

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { IconArrowLeft, IconBook, IconCirclePlus, IconDocument, IconTrash, IconEdit } from "@/app/components/icons";
import { useToast } from "@/app/components/ToastProvider";
import ConfirmDialog from "@/app/components/ConfirmDialog";
import { fetchJournal, updateJournal, deleteJournal, type JournalEntry } from "@/lib/api/journal";

// Dynamic import TiptapEditor to avoid SSR issues
const TiptapEditor = dynamic(() => import("@/app/components/TiptapEditor"), { ssr: false });

export default function JournalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const journalId = parseInt(id);
  const router = useRouter();
  const toast = useToast();

  const [journal, setJournal] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchJournal(journalId)
      .then((data) => {
        setJournal(data);
        setTitle(data.title);
        setContent(data.content);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [journalId]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Judul dan isi journal tidak boleh kosong.");
      return;
    }
    setSaving(true);
    try {
      const updated = await updateJournal(journalId, { title, content });
      setJournal(updated);
      setEditing(false);
    } catch (err) {
      console.error("Gagal update journal:", err);
      toast.notify("Gagal update journal.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteJournal(journalId);
      toast.notify("Journal berhasil dihapus.", "success");
      router.push(`/diary/${journal?.collection?.id_collection || ""}`);
    } catch (err) {
      console.error("Gagal hapus journal:", err);
      toast.notify("Gagal hapus journal.", "error");
    } finally {
      setShowDeleteDialog(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;

  if (!journal) return <div className="min-h-screen bg-white flex items-center justify-center">Journal tidak ditemukan.</div>;

  return (
    <main className="min-h-screen bg-white pb-32 relative overflow-x-hidden flex flex-col">
      {/* Header */}
      <div className="relative pt-6 pb-6 flex items-center justify-center w-full min-h-[90px]">
        <div className="absolute top-0 left-0 bg-[#FDB813] px-8 py-5 rounded-br-[32px] sm:rounded-br-[40px] z-10">
          <Link href={`/diary/${journal.collection?.id_collection}`}>
            <IconArrowLeft className="h-8 w-8 text-white stroke-[3px]" />
          </Link>
        </div>
        <h1 className="font-extrabold text-[20px] sm:text-[24px] text-black">
          {journal.collection?.name || "Journal"}
        </h1>
        <div className="absolute top-0 right-0 px-8 py-5 flex gap-2">
          <button onClick={() => setEditing(!editing)} className="p-2">
            <IconEdit className="h-6 w-6 text-black" />
          </button>
          <button onClick={handleDelete} className="p-2">
            <IconTrash className="h-6 w-6 text-red-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-4xl mx-auto px-6 sm:px-10 mt-8 flex-1">
        {editing ? (
          <div className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-bold border-b border-gray-300 pb-2 outline-none"
              placeholder="Title"
            />
            <div className="w-full">
              <TiptapEditor
                content={content}
                onChange={setContent}
                placeholder="Content"
                className="min-h-[300px]"
              />
            </div>
            <div className="flex gap-4">
              <button onClick={handleSave} disabled={saving} className="bg-green-500 text-white px-4 py-2 rounded">
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{journal.title}</h2>
            <p className="text-gray-600 text-sm">{new Date(journal.created_at).toLocaleDateString()}</p>
            <div
              className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none"
              dangerouslySetInnerHTML={{ __html: journal.content }}
            />
          </div>
        )}
      </div>

      {/* Bottom Nav */}
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

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Hapus Journal"
        message="Yakin ingin menghapus journal ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Journal"
        cancelText="Batal"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />

    </main>
  );
}
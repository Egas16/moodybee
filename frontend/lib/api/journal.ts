// lib/api/journal.ts

const BASE_URL = "http://127.0.0.1:8000/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type JournalCollection = {
  id_collection: number;
  name: string;
  journals_count: number;
};

export type JournalEntry = {
  id_journal: number;
  title: string;
  content: string;
  created_at: string;
  mood?: {
    id_mood: number;
    nama_mood: string;
    icon: string;
  } | null;
  collection?: {
    id_collection: number;
    name: string;
  } | null;
};

// ─── Collections ──────────────────────────────────────────────────────────────

/** GET /api/journal/collections — list koleksi user */
export async function fetchCollections(): Promise<JournalCollection[]> {
  const res = await fetch(`${BASE_URL}/journal/collections`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Gagal mengambil koleksi");
  return (await res.json()).data;
}

/** POST /api/journal/collections — buat koleksi baru */
export async function createCollection(name: string): Promise<JournalCollection> {
  const res = await fetch(`${BASE_URL}/journal/collections`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Gagal membuat koleksi");
  return (await res.json()).data;
}

/** DELETE /api/journal/collections/{id} */
export async function deleteCollection(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/journal/collections/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Gagal menghapus koleksi");
}

// ─── Journals ─────────────────────────────────────────────────────────────────

/** GET /api/journal/collections/{id}/journals — list journal dalam 1 koleksi */
export async function fetchJournals(collectionId: number): Promise<JournalEntry[]> {
  const res = await fetch(`${BASE_URL}/journal/collections/${collectionId}/journals`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Gagal mengambil journal");
  return (await res.json()).data;
}

/** GET /api/journal/journals/{id} — detail 1 journal */
export async function fetchJournal(id: number): Promise<JournalEntry> {
  const res = await fetch(`${BASE_URL}/journal/journals/${id}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Gagal mengambil journal");
  return (await res.json()).data;
}

/** POST /api/journal/journals — simpan journal baru */
export async function saveJournal(payload: {
  title: string;
  content: string;
  id_collection: number;
  id_mood?: number | null;
}): Promise<JournalEntry> {
  const res = await fetch(`${BASE_URL}/journal/journals`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Gagal menyimpan journal");
  return (await res.json()).data;
}

/** PUT /api/journal/journals/{id} — update journal */
export async function updateJournal(
  id: number,
  payload: Partial<{ title: string; content: string; id_collection: number; id_mood: number | null }>
): Promise<JournalEntry> {
  const res = await fetch(`${BASE_URL}/journal/journals/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Gagal memperbarui journal");
  return (await res.json()).data;
}

/** DELETE /api/journal/journals/{id} */
export async function deleteJournal(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/journal/journals/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Gagal menghapus journal");
}
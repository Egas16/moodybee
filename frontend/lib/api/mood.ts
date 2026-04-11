export type MoodCount = {
  id_mood: number;
  nama_mood: string;
  icon: "happy" | "good" | "neutral" | "bad" | "sad" | string;
  level_mood: number;
  count: number;
};

export type MoodOption = {
  id_mood: number;
  nama_mood: string;
  icon: "happy" | "good" | "neutral" | "bad" | "sad" | string;
  level_mood: number;
};

export type MoodEntry = {
  id_log: number;
  tanggal: string;
  catatan: string | null;
  mood: MoodOption;
};

export type DailyQuote = {
  id: number;
  text: string;
  author: string;
  date: string;
};

const API_BASE_URL =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_API_BASE_URL &&
    process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/+$/, "")) ||
  "http://127.0.0.1:8000/api";

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(input, {
    mode: "cors",
    cache: "no-cache",
    headers,
    ...init,
  });

  if (!res.ok) {
    const bodyText = await res.text();
    const errorMessage = `API request failed: ${res.status} ${res.statusText} for ${input} - ${bodyText}`;
    throw new Error(errorMessage);
  }

  const json = (await res.json()) as { data: unknown };
  return json.data as T;
}

function apiUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export async function fetchMoodStats(year: number, month: number) {
  return request<{ year: number; month: number; total_days: number; counts: MoodCount[] }>(
    apiUrl(`/mood/stats?year=${encodeURIComponent(year)}&month=${encodeURIComponent(month)}`)
  );
}

export async function fetchMoodEntries(year: number, month: number) {
  return request<MoodEntry[]>(
    apiUrl(`/mood/entries?year=${encodeURIComponent(year)}&month=${encodeURIComponent(month)}`)
  );
}

export async function fetchAvailableMoods() {
  return request<MoodOption[]>(apiUrl("/mood/available"));
}

export async function saveMoodEntry(payload: { id_mood: number; tanggal?: string; catatan?: string | null }) {
  return request<{
    message: string;
    data: MoodEntry;
  }>(apiUrl("/mood/entries"), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchTodayQuote() {
  return request<DailyQuote>(apiUrl("/quotes/today"));
}

"use client"; // WAJIB ada di baris pertama

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/ToastProvider";

export default function LoginPage() {
  const [username, setUsername] = useState(""); // Laravel biasanya pake email, kalau mau username tinggal ganti
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          username: username || "test", // Default test user
          password: password || "password", // Default test password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Simpan token di browser supaya user tetap login
        localStorage.setItem("auth_token", data.access_token);
        toast.notify("Login Berhasil!", "success");
        router.push("/dashboard"); // Pindah ke halaman dashboard
      } else {
        toast.notify(data.message || "Login Gagal!", "error");
      }
    } catch (error) {
      toast.notify("Gagal konek ke server Laravel. Pastikan 'php artisan serve' jalan!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#7CCC29] p-8 sm:p-10 rounded-[40px] shadow-lg flex flex-col items-center">
        <h1 className="text-white text-3xl sm:text-4xl font-extrabold mb-8 tracking-wide">
          Sign In
        </h1>

        <form className="w-full flex flex-col gap-5 sm:gap-6" onSubmit={handleLogin}>

          <input
            type="text" // Ganti text ke email jika di Laravel pake email
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-white text-black placeholder-gray-400 rounded-full px-6 py-3 sm:py-4 text-[15px] sm:text-[16px] font-semibold outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white text-black placeholder-gray-400 rounded-full px-6 py-3 sm:py-4 text-[15px] sm:text-[16px] font-semibold outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-3/4 mx-auto bg-white rounded-full py-2.5 sm:py-3 border-[4px] border-[#FDB813] border-b-[6px] active:border-b-[4px] active:translate-y-[2px] transition-all disabled:opacity-50"
          >
            <span className="text-[#FDB813] text-[20px] sm:text-[22px] font-extrabold tracking-wide">
              {loading ? "Loading..." : "Sign In"}
            </span>
          </button>
          <p className="mt-4 text-center text-white font-medium">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="text-[#ffffff] font-bold hover:underline underline-offset-4 transition-all"
            >
              Register here
            </button>
          </p>
        </form>
      </div>
    </main>
  );
}
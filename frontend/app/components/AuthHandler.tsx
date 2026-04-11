"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function AuthHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");
    const verified = searchParams.get("verified");

    if (token) {
      // 1. Simpan token ke localStorage supaya user dianggap login oleh sistem
      localStorage.setItem("auth_token", token);
      localStorage.setItem("AUTH_TOKEN", token);
      
      // 2. (Opsional) Jika kamu simpan data user di state/context, bisa diupdate di sini

      // 3. Hapus parameter dari URL agar rapi (localhost:3000/dashboard)
      router.replace("/dashboard");

      if (verified === "true") {
        console.log("Email verified & Auto-login success!");
      }
    }
  }, [searchParams, router]);

  return null; 
}
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, AlertCircle, X } from "lucide-react";

export default function LogoutButton() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // 1. Hapus token dari localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("AUTH_TOKEN");
    
    // 2. Tutup modal
    setShowModal(false);

    // 3. Arahkan ke halaman login
    router.push("/login");
    
    // 4. Refresh agar state bersih total
    router.refresh();
  };

  return (
    <>
      {/* TOMBOL LOGOUT UTAMA (Yang muncul di Sidebar) */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-3 px-6 py-3 w-full text-[#B0B0B0] hover:text-red-500 hover:bg-red-50 font-bold transition-all rounded-2xl group"
      >
        <LogOut size={22} className="group-hover:rotate-180 transition-transform duration-300" />
        <span>Logout</span>
      </button>

      {/* MODAL KONFIRMASI (Pop-up) */}
      {showModal && (
        <div className="fixed inset-0 z- flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[30px] p-8 max-w-sm w-full mx-4 shadow-2xl transform animate-in zoom-in-95 duration-200">
            
            {/* Header Modal */}
            <div className="flex justify-center mb-4 text-red-500">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertCircle size={40} />
              </div>
            </div>

            {/* Konten Teks */}
            <h2 className="text-2xl font-black text-[#4A4A4A] text-center mb-2">
              Wait a sec!
            </h2>
            <p className="text-[#888888] text-center font-medium mb-8">
              Are you sure you want to log out from MoodyBee?
            </p>

            {/* Tombol Aksi */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogout}
                className="w-full py-4 bg-red-500 text-white font-black rounded-2xl hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-95"
              >
                YES, LOGOUT
              </button>
              
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-4 bg-[#F5F5F5] text-[#A0A0A0] font-black rounded-2xl hover:bg-[#E0E0E0] transition-all"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
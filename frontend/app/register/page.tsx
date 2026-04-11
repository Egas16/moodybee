"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { id } from 'date-fns/locale/id';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    gender: "", 
    dob: null as Date | null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // --- CARA PALING AMAN: AMBIL TAHUN-BULAN-TANGGAL MANUAL ---
    let formattedDate = null;
    if (formData.dob) {
      const d = formData.dob;
      const year = d.getFullYear();
      // getMonth() dimulai dari 0, jadi harus +1. padStart memastikan jadi 2 digit (01, 02, dst)
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      
      formattedDate = `${year}-${month}-${day}`; // Hasilnya pasti: "2026-03-30"
    }

    const dataToSend = {
      ...formData,
      dob: formattedDate
    };

    try {
      const response = await axios.post("http://localhost:8000/api/register", dataToSend);
      setMessage("Registrasi berhasil!");
    } catch (error: any) {
      // Menampilkan pesan error detail dari Laravel
      const serverError = error.response?.data?.errors;
      if (serverError) {
        // Jika ada error spesifik seperti 'dob', ambil pesan pertamanya
        const firstError = Object.values(serverError).flat()[0];
        setMessage(String(firstError) || "Gagal mendaftar.");
      } else {
        setMessage(error.response?.data?.message || "Gagal mendaftar.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <style jsx global>{`
        .custom-datepicker-wrapper, .react-datepicker-wrapper {
          width: 100% !important;
        }
        .react-datepicker {
          border: none !important;
          border-radius: 25px !important;
          box-shadow: 0 15px 40px rgba(0,0,0,0.15) !important;
          overflow: hidden !important;
        }
        .react-datepicker__header {
          background-color: #7CCC29 !important;
          border-bottom: none !important;
          padding-top: 15px !important;
        }
        .react-datepicker__current-month, .react-datepicker__day-name {
          color: white !important;
          font-weight: bold !important;
        }
        .react-datepicker__day--selected {
          background-color: #FDB813 !important;
          color: white !important;
          border-radius: 50% !important;
        }
        
        .custom-radio {
          appearance: none;
          width: 1.3em;
          height: 1.3em;
          border: 2px solid white;
          border-radius: 50%;
          display: grid;
          place-content: center;
          cursor: pointer;
        }
        .custom-radio:checked::before {
          content: "";
          width: 0.7em;
          height: 0.7em;
          border-radius: 50%;
          background-color: #FDB813;
        }
      `}</style>

      <div className="w-full max-w-sm bg-[#7CCC29] p-8 sm:p-10 rounded-[40px] shadow-lg flex flex-col items-center">
        <h1 className="text-white text-3xl font-extrabold mb-8 tracking-wide uppercase">Register</h1>

        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-white text-black rounded-full px-7 py-3.5 font-semibold outline-none focus:ring-4 focus:ring-white/40"
            required
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <input
            type="text"
            placeholder="Username"
            className="w-full bg-white text-black rounded-full px-7 py-3.5 font-semibold outline-none focus:ring-4 focus:ring-white/40"
            required
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-white text-black rounded-full px-7 py-3.5 font-semibold outline-none focus:ring-4 focus:ring-white/40"
            required
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <div className="w-full custom-datepicker-wrapper">
            <DatePicker
              selected={formData.dob}
              onChange={(date: Date | null) => setFormData({ ...formData, dob: date })}
              placeholderText="Tanggal Lahir"
              dateFormat="dd MMMM yyyy"
              locale={id}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              required
              className="w-full bg-white text-black rounded-full px-7 py-3.5 font-semibold outline-none cursor-pointer"
            />
          </div>  

          <div className="w-full flex flex-col gap-3">
            <label className="text-white font-bold ml-5 text-sm uppercase">Gender</label>
            <div className="flex gap-10 px-5">
              <label className="flex items-center gap-3 cursor-pointer text-white font-bold">
                <input
                  type="radio"
                  name="gender"
                  value="Laki-laki"
                  className="custom-radio"
                  required
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                />
                Laki-laki
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-white font-bold">
                <input
                  type="radio"
                  name="gender"
                  value="Perempuan"
                  className="custom-radio"
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                />
                Perempuan
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-white rounded-full py-3.5 border-[4px] border-[#FDB813] border-b-[6px] active:translate-y-[2px] transition-all disabled:opacity-50"
          >
            <span className="text-[#FDB813] font-black uppercase text-xl">
              {loading ? "Sending..." : "Register"}
            </span>
          </button>
        </form>

        {message && (
          <p className="mt-5 text-white font-bold text-center text-sm italic bg-black/10 p-2 rounded-lg w-full shadow-inner">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
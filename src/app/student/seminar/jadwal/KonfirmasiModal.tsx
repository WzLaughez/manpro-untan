"use client";

import { useRouter } from "next/navigation";
import { konfirmasiKehadiran } from "@/lib/actions/seminar";

export default function KonfirmasiModal({
  tanggal,
  pukul,
  lokasi,
}: {
  tanggal: string;
  pukul: string;
  lokasi: string;
}) {
  const router = useRouter();
  const close = () => router.push("/student/seminar/jadwal");

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-surface rounded-2xl shadow-xl p-6"
      >
        <h3 className="text-[16px] font-semibold text-center mb-4">
          Konfirmasi Kehadiran Anda
        </h3>

        <div className="rounded-lg bg-card border border-line px-4 py-4 text-[12px] mb-4">
          <p className="text-ink-soft mb-3">
            Silahkan Konfirmasi kehadiran anda untuk seminar :
          </p>
          <p>
            <span className="font-semibold">Tanggal:</span> {tanggal}
          </p>
          <p>
            <span className="font-semibold">Pukul:</span> {pukul}
          </p>
          <p>
            <span className="font-semibold">Lokasi:</span> {lokasi}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={close}
            className="flex-1 h-10 rounded-md border border-line bg-card text-[13px] font-medium hover:bg-surface"
          >
            Batal
          </button>
          <form action={konfirmasiKehadiran} className="flex-1">
            <button
              type="submit"
              className="w-full h-10 rounded-md text-white text-[13px] font-semibold"
              style={{
                background: "linear-gradient(135deg, #56E8A0 0%, #1AAF6B 100%)",
              }}
            >
              Ya, Saya Akan Hadir
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

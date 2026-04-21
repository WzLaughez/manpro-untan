"use client";

import { useRouter } from "next/navigation";

export default function SuccessModal() {
  const router = useRouter();
  const close = () => router.push("/teacher/seminar");

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-card rounded-2xl shadow-xl p-8 text-center relative"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 size-7 grid place-items-center rounded-full hover:bg-surface text-ink-soft"
        >
          ✕
        </button>

        <div
          className="mx-auto size-20 rounded-full grid place-items-center text-white text-4xl mb-5"
          style={{
            background: "linear-gradient(135deg, #56E8A0 0%, #1AAF6B 100%)",
          }}
        >
          ✓
        </div>

        <h3 className="text-[15px] font-semibold text-success">
          Konfirmasi Kehadiran Berhasil!
        </h3>
        <p className="text-[12px] text-ink-soft mt-2">
          Pastikan untuk tiba 30 menit sebelum pelaksanaan!
        </p>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { usulkanJadwalBaru } from "@/lib/actions/teacherSeminar";

export default function RejectModal({ id }: { id: string }) {
  const router = useRouter();
  const close = () => router.push("/teacher/seminar");

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-card rounded-2xl shadow-xl p-6 relative"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 size-7 grid place-items-center rounded-full hover:bg-surface text-ink-soft"
        >
          ✕
        </button>

        <h3 className="text-[15px] font-semibold pb-3 mb-4 border-b border-line">
          Pengajuan Jadwal Seminar Terbaru
        </h3>

        <form action={usulkanJadwalBaru} className="space-y-4">
          <input type="hidden" name="id" value={id} />

          <div>
            <textarea
              name="alasan"
              required
              placeholder="Jelaskan alasan penolakan jadwal seminar yang ditentukan..."
              className="w-full min-h-[110px] p-3 rounded-md border border-line bg-card text-[13px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-[12px] text-ink-soft mb-1.5">
              Usulkan Hari & Tanggal
            </label>
            <input
              type="date"
              name="tanggal_baru"
              required
              className="w-full h-10 px-3 rounded-md border border-line bg-surface text-[13px] text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-md text-white text-[13px] font-semibold"
            style={{
              background: "linear-gradient(135deg, #5BC0F0 0%, #1E88E5 100%)",
            }}
          >
            Kirim usulan Jadwal
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui";

type Seminar = {
  id: string;
  tanggal_pengajuan: string | null;
  tanggal_seminar: string | null;
  waktu_mulai: string | null;
  waktu_selesai: string | null;
  lokasi: string | null;
  ruang_seminar: string | null;
  pembimbing_lapangan: string | null;
  status: string;
  student: { name: string; nim: string | null } | null;
  kp: { judul: string; dosen_pa: string | null } | null;
};

type Doc = {
  doc_key: string;
  label: string;
  file_name: string | null;
  file_url: string | null;
};

function fmtDate(iso: string | null | undefined) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function fmtTime(t: string | null | undefined) {
  if (!t) return null;
  return t.slice(0, 5);
}

export default function DetailModal({
  seminar,
  documents,
}: {
  seminar: Seminar;
  documents: Doc[];
}) {
  const router = useRouter();
  const close = () => router.push("/teacher/seminar");

  const waktuText =
    seminar.tanggal_seminar && seminar.waktu_mulai
      ? `${fmtDate(seminar.tanggal_seminar)}, Pukul ${fmtTime(seminar.waktu_mulai)} WIB`
      : seminar.tanggal_pengajuan
        ? `${fmtDate(seminar.tanggal_pengajuan)} (jam menyusul)`
        : "Menunggu penjadwalan";
  const ruangText =
    seminar.ruang_seminar ?? seminar.lokasi ?? "Belum ditentukan";

  const canDecide = seminar.status === "diajukan";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4 py-6 overflow-y-auto"
      onClick={close}
    >
      <div
        className="w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
      <Card className="relative">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 size-8 grid place-items-center rounded-full hover:bg-surface text-ink-soft"
        >
          ✕
        </button>

        <h2 className="text-[16px] font-semibold pb-3 mb-4 border-b border-line">
          Detail Jadwal Seminar
        </h2>

        {/* Student info */}
        <p className="text-[13px] font-semibold">
          {seminar.student?.name ?? "-"} — {seminar.student?.nim ?? "-"}
        </p>
        <p className="text-[12px] text-ink-soft mb-5">
          {seminar.kp?.judul ?? "-"}
        </p>

        {/* Two blue cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          <div
            className="rounded-xl p-4 text-white relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #5BC0F0 0%, #1E88E5 100%)",
            }}
          >
            <span className="absolute top-3 right-3 size-9 rounded-full bg-white/20 grid place-items-center text-xl">
              📅
            </span>
            <p className="text-[11px] opacity-90 mb-1">Waktu & Tanggal</p>
            <p className="text-[13px] font-semibold leading-snug pr-10">
              {waktuText}
            </p>
          </div>
          <div
            className="rounded-xl p-4 text-white relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #5BC0F0 0%, #1E88E5 100%)",
            }}
          >
            <span className="absolute top-3 right-3 size-9 rounded-full bg-white/20 grid place-items-center text-xl">
              📍
            </span>
            <p className="text-[11px] opacity-90 mb-1">Ruangan</p>
            <p className="text-[13px] font-semibold leading-snug pr-10">
              {ruangText}
            </p>
          </div>
        </div>

        {/* Pembimbing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pb-4 mb-4 border-b border-line text-[13px]">
          <div>
            <p className="text-[11px] text-ink-soft">Dosen Pembimbing KP</p>
            <p className="font-semibold">{seminar.kp?.dosen_pa ?? "-"}</p>
          </div>
          <div>
            <p className="text-[11px] text-ink-soft">Pembimbing Lapangan</p>
            <p className="font-semibold">
              {seminar.pembimbing_lapangan ?? "-"}
            </p>
          </div>
        </div>

        {/* Dokumen lampiran */}
        <div className="mb-5">
          <p className="text-[11px] text-ink-soft mb-2">Dokumen Lampiran</p>
          <ul className="space-y-1">
            {documents
              .filter((d) => d.file_url)
              .map((d) => (
                <li key={d.doc_key}>
                  <a
                    href={d.file_url!}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[13px] text-primary hover:underline font-medium"
                  >
                    📎 {d.file_name ?? d.label}
                  </a>
                </li>
              ))}
            {documents.filter((d) => d.file_url).length === 0 && (
              <li className="text-[12px] text-ink-soft">
                Mahasiswa belum mengunggah berkas.
              </li>
            )}
          </ul>
        </div>

        {/* Actions */}
        {canDecide ? (
          <div className="flex justify-end gap-3">
            <Link
              href={`/teacher/seminar?reject=${seminar.id}`}
              className="inline-flex items-center justify-center h-10 px-4 rounded-md text-white text-[13px] font-semibold"
              style={{
                background: "linear-gradient(135deg, #FFB366 0%, #F57C1A 100%)",
              }}
            >
              Tolak & Usulkan Jadwal Baru
            </Link>
            <Link
              href={`/teacher/seminar?confirm=${seminar.id}`}
              className="inline-flex items-center justify-center h-10 px-4 rounded-md text-white text-[13px] font-semibold"
              style={{
                background: "linear-gradient(135deg, #5BC0F0 0%, #1E88E5 100%)",
              }}
            >
              Konfirmasi Kehadiran
            </Link>
          </div>
        ) : (
          <div className="rounded-md bg-surface border border-line px-3 py-2.5 text-[12px] text-ink-soft">
            Status saat ini:{" "}
            <span className="font-semibold capitalize text-ink">
              {seminar.status}
            </span>
          </div>
        )}
      </Card>
      </div>
    </div>
  );
}

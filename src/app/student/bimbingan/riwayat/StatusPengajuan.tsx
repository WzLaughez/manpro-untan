"use client";

import { useState } from "react";
import { Card } from "@/components/ui";

type FeedbackItem = {
  id: string;
  jenis: string;
  tanggal: string;
  status: string;
  catatan_dosen: string;
};

function fmtDate(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function StatusPengajuan({
  total,
  disetujui,
  revisi,
  items,
}: {
  total: number;
  disetujui: number;
  revisi: number;
  items: FeedbackItem[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="mt-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-[14px] font-semibold"
      >
        <span>Status Pengajuan</span>
        <span
          className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="mt-4 space-y-5">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              className="rounded-2xl p-4 text-white text-center"
              style={{
                background:
                  "linear-gradient(135deg, #5BC0F0 0%, #1E88E5 100%)",
              }}
            >
              <div className="text-[11px] opacity-90 mb-1">Total Pengajuan</div>
              <div className="text-[28px] font-bold leading-none">{total}</div>
            </div>
            <div
              className="rounded-2xl p-4 text-white text-center"
              style={{
                background:
                  "linear-gradient(135deg, #56E8A0 0%, #1AAF6B 100%)",
              }}
            >
              <div className="text-[11px] opacity-90 mb-1">Disetujui</div>
              <div className="text-[28px] font-bold leading-none">
                {disetujui}
              </div>
            </div>
            <div
              className="rounded-2xl p-4 text-white text-center"
              style={{
                background:
                  "linear-gradient(135deg, #F87171 0%, #DC2626 100%)",
              }}
            >
              <div className="text-[11px] opacity-90 mb-1">Revisi</div>
              <div className="text-[28px] font-bold leading-none">{revisi}</div>
            </div>
          </div>

          {/* Detail validasi */}
          {items.length > 0 && (
            <div>
              <h4 className="text-[13px] font-semibold mb-3">
                Detail Validasi
              </h4>
              <div className="space-y-3">
                {items.map((b) => (
                  <div
                    key={b.id}
                    className={`rounded-lg border-l-4 px-4 py-3 ${
                      b.status === "disetujui"
                        ? "border-success bg-success/5"
                        : "border-alert bg-alert/5"
                    }`}
                  >
                    <div className="flex justify-between text-[13px] mb-2">
                      <span className="font-semibold">{b.jenis}</span>
                      <span className="text-ink-soft">
                        {fmtDate(b.tanggal)}
                      </span>
                    </div>
                    <div className="text-[12px]">
                      <span className="text-ink-soft">Catatan Dosen:</span>
                      <p className="text-ink mt-1 leading-relaxed">
                        {b.catatan_dosen}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

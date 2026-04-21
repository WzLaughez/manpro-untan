"use client";

import { useState } from "react";

export default function StudentNilaiActions({
  canBA,
  studentName,
  studentNim,
  studentSemester,
  nilaiAkhir,
  dosenName,
  komentar,
}: {
  canBA: boolean;
  studentName: string;
  studentNim: string | null;
  studentSemester: number | null;
  nilaiAkhir: number | null;
  dosenName: string | null;
  komentar: string | null;
}) {
  const [showBA, setShowBA] = useState(false);

  return (
    <>
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="block w-full h-11 rounded-md text-white text-[14px] font-semibold"
          style={{
            background: "linear-gradient(135deg, #5BC0F0 0%, #1E88E5 100%)",
          }}
        >
          📥 Unduh Rekap Nilai
        </button>
        <button
          type="button"
          disabled={!canBA}
          onClick={() => setShowBA(true)}
          className="block w-full h-11 rounded-md bg-secondary/30 text-ink text-[14px] font-semibold disabled:opacity-60 disabled:cursor-not-allowed hover:bg-secondary/50"
        >
          📄 Unduh Berita Acara
        </button>
      </div>

      {showBA && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 py-6 overflow-y-auto print:bg-white print:p-0"
          onClick={() => setShowBA(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-card rounded-2xl shadow-xl relative print:shadow-none print:rounded-none"
          >
            <button
              type="button"
              onClick={() => setShowBA(false)}
              aria-label="Close"
              className="absolute top-3 right-3 size-7 grid place-items-center rounded-full hover:bg-surface text-ink-soft print:hidden"
            >
              ✕
            </button>

            <div className="p-8 print:p-0">
              <div className="text-center mb-6">
                <h2 className="text-[16px] font-bold">BERITA ACARA</h2>
                <h2 className="text-[16px] font-bold">
                  PENGESAHAN PENILAIAN KERJA PRAKTEK
                </h2>
              </div>

              <table className="text-[13px] mb-4">
                <tbody>
                  <Row label="Nama" value={studentName} />
                  <Row label="NIM" value={studentNim ?? "-"} />
                  <Row
                    label="Periode Semester"
                    value={`${studentSemester ?? "-"} (Ganjil)`}
                  />
                </tbody>
              </table>

              <p className="text-[13px] leading-relaxed mb-4">
                Bahwa berdasarkan hasil seminar Kerja Praktek, maka hasil
                Tugas/Proyek, Seminar dan Laporan mahasiswa yang bersangkutan
                telah <span className="font-bold">diterima</span> dengan nilai{" "}
                <span className="font-bold">
                  {nilaiAkhir?.toFixed(2) ?? "-"}
                </span>
                .
              </p>

              {komentar && (
                <p className="text-[12px] mb-4 italic">
                  Komentar dosen: {komentar}
                </p>
              )}

              <p className="text-[13px] mb-8">
                Demikian Berita Acara ini dibuat untuk dapat dipergunakan
                sebagaimana mestinya.
              </p>

              <p className="text-[13px] text-center mb-10">Tertanda,</p>

              <div className="grid grid-cols-1 gap-4 text-[12px]">
                <div>
                  <p>Dosen Pembimbing Kerja Praktik,</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">{dosenName ?? "-"}</p>
                </div>
              </div>
            </div>

            <div className="px-8 py-4 border-t border-line flex justify-between gap-3 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="h-10 px-5 rounded-md text-white text-[13px] font-semibold"
                style={{
                  background:
                    "linear-gradient(135deg, #5BC0F0 0%, #1E88E5 100%)",
                }}
              >
                ⬇ Unduh BA
              </button>
              <button
                type="button"
                onClick={() => setShowBA(false)}
                className="h-10 px-5 rounded-md border border-line bg-card text-[13px] font-medium hover:bg-surface"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td className="pr-3 align-top whitespace-nowrap">{label}</td>
      <td className="pr-3 align-top">:</td>
      <td className="align-top">{value}</td>
    </tr>
  );
}

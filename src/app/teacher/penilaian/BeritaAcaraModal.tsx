"use client";

import { useRouter } from "next/navigation";

function fmtDate(iso: string | null | undefined) {
  if (!iso) return "-";
  const d = new Date(iso);
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function BeritaAcaraModal({
  student,
  kp,
  tanggalSeminar,
  ruang,
  pembimbingLapangan,
  nilaiAkhir,
  dosenName,
  onBackHref,
}: {
  student: { name: string; nim: string | null; semester: number | null };
  kp: { judul: string };
  tanggalSeminar: string | null;
  ruang: string | null;
  pembimbingLapangan: string | null;
  nilaiAkhir: number | null;
  dosenName: string;
  onBackHref: string;
}) {
  const router = useRouter();
  const close = () => router.push(onBackHref);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 py-6 overflow-y-auto"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-card rounded-2xl shadow-xl relative"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 size-7 grid place-items-center rounded-full hover:bg-surface text-ink-soft"
        >
          ✕
        </button>

        {/* Printable content */}
        <div className="p-8 print:p-0" id="berita-acara-print">
          <div className="text-center mb-6">
            <h2 className="text-[16px] font-bold">BERITA ACARA</h2>
            <h2 className="text-[16px] font-bold">
              PENGESAHAN PENILAIAN KERJA PRAKTEK
            </h2>
          </div>

          <p className="text-[13px] leading-relaxed mb-4">
            Pada hari ini, <span className="font-semibold">{fmtDate(tanggalSeminar)}</span>, bertempat di{" "}
            <span className="font-semibold">
              {ruang ?? "Ruang Sidang Utama Informatika Universitas Tanjungpura"}
            </span>
            , telah dilaksanakan Seminar Kerja Praktek Mahasiswa dengan rincian
            sebagai berikut :
          </p>

          <table className="text-[13px] mb-4">
            <tbody>
              <Row label="Nama" value={student.name} />
              <Row label="NIM" value={student.nim ?? "-"} />
              <Row
                label="Periode Semester"
                value={`${student.semester ?? "-"} (Ganjil)`}
              />
              <Row
                label="Tempat Kerja Praktek"
                value={"—"}
              />
              <Row
                label="Pembimbing Lapangan"
                value={pembimbingLapangan ?? "-"}
              />
              <Row label="Judul Kerja Praktek" value={kp.judul} />
            </tbody>
          </table>

          <p className="text-[13px] leading-relaxed mb-4">
            Bahwa berdasarkan hasil seminar Kerja Praktek, maka hasil
            Tugas/Proyek, Seminar dan Laporan mahasiswa yang bersangkutan telah{" "}
            <span className="font-bold">diterima</span> dengan nilai{" "}
            <span className="font-bold">{nilaiAkhir?.toFixed(2) ?? "-"}</span>.
          </p>

          <p className="text-[13px] mb-8">
            Demikian Berita Acara ini dibuat untuk dapat dipergunakan sebagaimana
            mestinya.
          </p>

          <p className="text-[13px] text-center mb-10">Tertanda,</p>

          <div className="grid grid-cols-2 gap-4 text-[12px]">
            <div>
              <p>Dosen Pembimbing Kerja Praktik,</p>
              <div className="h-16"></div>
              <p className="font-bold underline">{dosenName}</p>
            </div>
            <div>
              <p>Pembimbing Lapangan Kerja Praktik,</p>
              <div className="h-16"></div>
              <p className="font-bold underline">
                {pembimbingLapangan ?? "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Actions (hidden when printing) */}
        <div className="px-8 py-4 border-t border-line flex justify-between gap-3 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="h-10 px-5 rounded-md text-white text-[13px] font-semibold"
            style={{
              background: "linear-gradient(135deg, #5BC0F0 0%, #1E88E5 100%)",
            }}
          >
            ⬇ Unduh BA
          </button>
          <button
            type="button"
            onClick={close}
            className="h-10 px-5 rounded-md border border-line bg-card text-[13px] font-medium hover:bg-surface"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
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

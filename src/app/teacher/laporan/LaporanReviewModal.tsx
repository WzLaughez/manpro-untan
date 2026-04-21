"use client";

import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { approveLaporan, revisiLaporan } from "@/lib/actions/teacherLaporan";

type Item = {
  id: string;
  file_name: string | null;
  file_url: string | null;
  lampiran_name: string | null;
  lampiran_url: string | null;
  catatan_mahasiswa: string | null;
  catatan_dosen: string | null;
  status: string;
  updated_at: string | null;
  created_at: string;
  student: { name: string; nim: string | null } | null;
  kp: { judul: string } | null;
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

export default function LaporanReviewModal({ item }: { item: Item }) {
  const router = useRouter();
  const close = () => router.push("/teacher/laporan");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 overflow-y-auto">
      <div className="w-full max-w-6xl bg-card rounded-2xl shadow-xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-line px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-[15px] font-semibold">
            Tinjau Laporan Akhir: {item.student?.name ?? "-"}
          </h2>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={close}
              className="text-[13px] text-primary hover:underline font-medium"
            >
              ← Kembali ke Daftar Pengajuan
            </button>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="size-8 grid place-items-center rounded-full hover:bg-surface text-ink-soft"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* LEFT: PDF preview */}
          <Card className="lg:col-span-2 !p-0 overflow-hidden">
            <div className="px-5 py-3 flex items-center justify-between border-b border-line">
              <h3 className="text-[14px] font-semibold">Pratinjau Dokumen</h3>
              {item.file_url && (
                <a
                  href={item.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[12px] text-primary hover:underline font-medium"
                >
                  Unduh Proposal
                </a>
              )}
            </div>
            <div className="bg-surface" style={{ height: "70vh" }}>
              {item.file_url ? (
                <iframe
                  src={item.file_url}
                  title="Laporan Akhir"
                  className="w-full h-full bg-white"
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-center px-6">
                  <div>
                    <div className="text-5xl mb-3">📄</div>
                    <p className="text-[14px] font-semibold text-ink mb-1">
                      Belum ada file laporan
                    </p>
                    <p className="text-[12px] text-ink-soft max-w-sm mx-auto">
                      Mahasiswa belum mengunggah laporan akhir.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* RIGHT: Info + Tanggapan */}
          <div className="space-y-5">
            <Card>
              <h3 className="text-[14px] font-semibold pb-3 mb-3 border-b border-line">
                Informasi File
              </h3>
              <dl className="space-y-2 text-[12px]">
                <div>
                  <dt className="text-ink-soft">Nama File</dt>
                  <dd className="font-semibold break-all">
                    {item.file_name ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-soft">Tanggal Upload</dt>
                  <dd className="font-semibold">
                    {fmtDate(item.updated_at ?? item.created_at)}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-soft">Judul KP</dt>
                  <dd className="font-semibold">{item.kp?.judul ?? "-"}</dd>
                </div>
                <div>
                  <dt className="text-ink-soft">NIM</dt>
                  <dd className="font-semibold">
                    {item.student?.nim ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-soft">Status</dt>
                  <dd className="font-semibold capitalize">{item.status}</dd>
                </div>
                {item.lampiran_url && (
                  <div>
                    <dt className="text-ink-soft">Lampiran</dt>
                    <dd>
                      <a
                        href={item.lampiran_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline font-semibold break-all"
                      >
                        {item.lampiran_name ?? "Unduh"}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </Card>

            {item.catatan_mahasiswa && (
              <Card>
                <h3 className="text-[14px] font-semibold pb-3 mb-3 border-b border-line">
                  Catatan dari Mahasiswa
                </h3>
                <p className="text-[12px] leading-relaxed whitespace-pre-wrap break-words">
                  {item.catatan_mahasiswa}
                </p>
              </Card>
            )}

            {item.catatan_dosen && (
              <Card>
                <h3 className="text-[14px] font-semibold pb-3 mb-3 border-b border-line">
                  Tanggapan Sebelumnya
                </h3>
                <p className="text-[12px] leading-relaxed whitespace-pre-wrap break-words">
                  {item.catatan_dosen}
                </p>
              </Card>
            )}

            <Card>
              <h3 className="text-[14px] font-semibold pb-3 mb-3 border-b border-line">
                Beri Tanggapan
              </h3>
              <form className="space-y-3">
                <input type="hidden" name="id" value={item.id} />
                <textarea
                  name="body"
                  placeholder="Tuliskan komentar atau catatan revisi..."
                  className="w-full min-h-[100px] p-3 rounded-md border border-line bg-card text-[13px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    formAction={approveLaporan}
                    variant="primary"
                    size="second"
                  >
                    ▶ Kirim Tanggapan
                  </Button>
                  <button
                    type="submit"
                    formAction={revisiLaporan}
                    className="h-9 min-w-[100px] px-4 rounded-md text-[13px] font-medium text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #FFB366 0%, #F57C1A 100%)",
                    }}
                  >
                    ⟳ Revisi
                  </button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

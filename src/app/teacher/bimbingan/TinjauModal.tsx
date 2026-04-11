"use client";

import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { sendTanggapan, revisiBimbingan } from "@/lib/actions/teacherBimbingan";

type Detail = {
  id: string;
  jenis: string;
  tanggal: string;
  ringkasan: string | null;
  file_name: string | null;
  file_url: string | null;
  catatan_dosen: string | null;
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

export default function TinjauModal({ item }: { item: Detail }) {
  const router = useRouter();
  const close = () => router.push("/teacher/bimbingan");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 overflow-y-auto">
      <div className="w-full max-w-6xl bg-card rounded-2xl shadow-xl max-h-[95vh] overflow-y-auto">
        {/* Modal header */}
        <div className="sticky top-0 bg-card border-b border-line px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-[15px] font-semibold">
            Tinjau Lampiran: {item.student?.name ?? "-"}
          </h2>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={close}
              className="text-[13px] text-primary hover:underline font-medium"
            >
              ← Kembali ke Daftar Bimbingan
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
          {/* LEFT: Preview */}
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
                  Unduh Lampiran
                </a>
              )}
            </div>
            <div className="bg-surface" style={{ height: "60vh" }}>
              {item.file_url ? (
                <iframe
                  src={item.file_url}
                  title="Lampiran Bimbingan"
                  className="w-full h-full bg-white"
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-center px-6">
                  <div>
                    <div className="text-5xl mb-3">📄</div>
                    <p className="text-[14px] font-semibold text-ink mb-1">
                      Belum ada lampiran
                    </p>
                    <p className="text-[12px] text-ink-soft max-w-sm mx-auto">
                      Mahasiswa belum mengunggah file untuk bimbingan ini.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {item.ringkasan && (
              <div className="px-5 py-4 border-t border-line">
                <p className="text-[12px] text-ink-soft mb-1">
                  Catatan dari Mahasiswa:
                </p>
                <p className="text-[13px] text-ink leading-relaxed bg-surface rounded-md p-3 border border-line">
                  {item.ringkasan}
                </p>
              </div>
            )}
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
                    {item.file_name ?? "Tidak ada file"}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-soft">Jenis Bimbingan</dt>
                  <dd className="font-semibold">{item.jenis}</dd>
                </div>
                <div>
                  <dt className="text-ink-soft">Tanggal Bimbingan</dt>
                  <dd className="font-semibold">{fmtDate(item.tanggal)}</dd>
                </div>
                <div>
                  <dt className="text-ink-soft">Tanggal Upload</dt>
                  <dd className="font-semibold">{fmtDate(item.created_at)}</dd>
                </div>
                <div>
                  <dt className="text-ink-soft">Judul KP</dt>
                  <dd className="font-semibold">{item.kp?.judul ?? "-"}</dd>
                </div>
                <div>
                  <dt className="text-ink-soft">NIM</dt>
                  <dd className="font-semibold">{item.student?.nim ?? "-"}</dd>
                </div>
              </dl>
            </Card>

            {item.catatan_dosen && (
              <Card>
                <h3 className="text-[14px] font-semibold pb-3 mb-3 border-b border-line">
                  Tanggapan Sebelumnya
                </h3>
                <p className="text-[12px] text-ink leading-relaxed">
                  {item.catatan_dosen}
                </p>
              </Card>
            )}

            <Card>
              <h3 className="text-[14px] font-semibold pb-3 mb-3 border-b border-line">
                Beri Tanggapan (Opsional)
              </h3>
              <form action={sendTanggapan} className="space-y-3">
                <input type="hidden" name="id" value={item.id} />
                <textarea
                  name="body"
                  placeholder="Tuliskan komentar atau catatan revisi..."
                  className="w-full min-h-[100px] p-3 rounded-md border border-line bg-card text-[13px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex gap-2">
                  <Button type="submit" variant="primary" size="second">
                    ▶ Kirim Tanggapan
                  </Button>
                  <button
                    type="submit"
                    formAction={revisiBimbingan}
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

"use client";

import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { approveLogbook, revisiLogbook } from "@/lib/actions/teacherLogbook";

type Item = {
  id: string;
  tanggal: string;
  aktivitas: string;
  kendala: string | null;
  hasil: string | null;
  status: string;
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

export default function LogbookReviewModal({ item }: { item: Item }) {
  const router = useRouter();
  const close = () => router.push("/teacher/logbook");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 overflow-y-auto">
      <div className="w-full max-w-5xl bg-card rounded-2xl shadow-xl max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-line px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-[15px] font-semibold">
            Tinjau Logbook: {item.student?.name ?? "-"}
          </h2>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={close}
              className="text-[13px] text-primary hover:underline font-medium"
            >
              ← Kembali
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

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* LEFT: Content + attachment */}
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
                <div className="min-w-0">
                  <p className="text-[11px] text-ink-soft mb-1">Aktivitas</p>
                  <p className="leading-relaxed whitespace-pre-wrap break-words">
                    {item.aktivitas}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-ink-soft mb-1">Kendala</p>
                  <p className="leading-relaxed whitespace-pre-wrap break-words">
                    {item.kendala || "-"}
                  </p>
                </div>
                <div className="md:col-span-2 min-w-0">
                  <p className="text-[11px] text-ink-soft mb-1">
                    Hasil Pekerjaan
                  </p>
                  <p className="leading-relaxed whitespace-pre-wrap break-words">
                    {item.hasil || "-"}
                  </p>
                </div>
              </div>
            </Card>

            {item.file_url && (
              <Card className="!p-0 overflow-hidden">
                <div className="px-5 py-3 flex items-center justify-between border-b border-line">
                  <h3 className="text-[14px] font-semibold">
                    Lampiran
                  </h3>
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[12px] text-primary hover:underline font-medium"
                  >
                    Unduh Lampiran
                  </a>
                </div>
                <div className="bg-surface" style={{ height: "50vh" }}>
                  <iframe
                    src={item.file_url}
                    title="Lampiran Logbook"
                    className="w-full h-full bg-white"
                  />
                </div>
              </Card>
            )}
          </div>

          {/* RIGHT: Info + Actions */}
          <div className="space-y-5">
            <Card>
              <h3 className="text-[14px] font-semibold pb-3 mb-3 border-b border-line">
                Informasi
              </h3>
              <dl className="space-y-2 text-[12px]">
                <div>
                  <dt className="text-ink-soft">Mahasiswa</dt>
                  <dd className="font-semibold">
                    {item.student?.name ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-soft">NIM</dt>
                  <dd className="font-semibold">
                    {item.student?.nim ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-soft">Tanggal Logbook</dt>
                  <dd className="font-semibold">{fmtDate(item.tanggal)}</dd>
                </div>
                <div>
                  <dt className="text-ink-soft">Diajukan pada</dt>
                  <dd className="font-semibold">{fmtDate(item.created_at)}</dd>
                </div>
                <div>
                  <dt className="text-ink-soft">Status</dt>
                  <dd className="font-semibold capitalize">{item.status}</dd>
                </div>
                {item.file_name && (
                  <div>
                    <dt className="text-ink-soft">Nama File</dt>
                    <dd className="font-semibold break-all">{item.file_name}</dd>
                  </div>
                )}
              </dl>
            </Card>

            {item.catatan_dosen && (
              <Card>
                <h3 className="text-[14px] font-semibold pb-3 mb-3 border-b border-line">
                  Tanggapan Sebelumnya
                </h3>
                <p className="text-[12px] text-ink leading-relaxed whitespace-pre-wrap break-words">
                  {item.catatan_dosen}
                </p>
              </Card>
            )}

            <Card>
              <h3 className="text-[14px] font-semibold pb-3 mb-3 border-b border-line">
                Beri Tanggapan (Opsional)
              </h3>
              <form className="space-y-3">
                <input type="hidden" name="id" value={item.id} />
                <textarea
                  name="body"
                  placeholder="Tuliskan komentar atau catatan revisi..."
                  className="w-full min-h-[90px] p-3 rounded-md border border-line bg-card text-[13px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    formAction={approveLogbook}
                    variant="success"
                    size="second"
                  >
                    ✓ Setujui
                  </Button>
                  <button
                    type="submit"
                    formAction={revisiLogbook}
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

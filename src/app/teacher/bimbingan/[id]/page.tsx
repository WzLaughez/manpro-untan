import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Card, PageTitle } from "@/components/ui";
import { sendTanggapan, revisiBimbingan } from "@/lib/actions/teacherBimbingan";
import { getBimbinganDetail } from "@/lib/data/teacherBimbingan";

function fmtDate(iso: string | null | undefined) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function fmtSize(bytes?: number) {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function TinjauBimbinganPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getBimbinganDetail(id);
  if (!data) notFound();

  const student = data.student as {
    name: string;
    nim: string | null;
  } | null;
  const kp = data.kp as { judul: string } | null;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <PageTitle title={`Tinjau Lampiran: ${student?.name ?? "-"}`} />
        <Link
          href="/teacher/bimbingan"
          className="text-[13px] text-primary hover:underline"
        >
          ← Kembali ke Daftar Bimbingan
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT: Document preview */}
        <Card className="lg:col-span-2 !p-0 overflow-hidden">
          <div className="px-5 py-3 flex items-center justify-between border-b border-line">
            <h3 className="text-[14px] font-semibold">Pratinjau Dokumen</h3>
            {data.file_url && (
              <a
                href={data.file_url}
                target="_blank"
                rel="noreferrer"
                className="text-[12px] text-primary hover:underline font-medium"
              >
                Unduh Lampiran
              </a>
            )}
          </div>
          <div className="bg-surface" style={{ height: "70vh" }}>
            {data.file_url ? (
              <iframe
                src={data.file_url}
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

          {/* Student's ringkasan */}
          {data.ringkasan && (
            <div className="px-5 py-4 border-t border-line">
              <p className="text-[12px] text-ink-soft mb-1">
                Catatan dari Mahasiswa:
              </p>
              <p className="text-[13px] text-ink leading-relaxed bg-surface rounded-md p-3 border border-line">
                {data.ringkasan}
              </p>
            </div>
          )}
        </Card>

        {/* RIGHT: Info + Actions */}
        <div className="space-y-5">
          <Card>
            <h3 className="text-[14px] font-semibold pb-3 mb-3 border-b border-line">
              Informasi File
            </h3>
            <dl className="space-y-2 text-[12px]">
              <div>
                <dt className="text-ink-soft">Nama File</dt>
                <dd className="font-semibold">{data.file_name ?? "Tidak ada file"}</dd>
              </div>
              <div>
                <dt className="text-ink-soft">Jenis Bimbingan</dt>
                <dd className="font-semibold">{data.jenis}</dd>
              </div>
              <div>
                <dt className="text-ink-soft">Tanggal Bimbingan</dt>
                <dd className="font-semibold">{fmtDate(data.tanggal)}</dd>
              </div>
              <div>
                <dt className="text-ink-soft">Tanggal Upload</dt>
                <dd className="font-semibold">{fmtDate(data.created_at)}</dd>
              </div>
              <div>
                <dt className="text-ink-soft">Judul KP</dt>
                <dd className="font-semibold">{kp?.judul ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-ink-soft">NIM</dt>
                <dd className="font-semibold">{student?.nim ?? "-"}</dd>
              </div>
            </dl>
          </Card>

          {/* Existing feedback */}
          {data.catatan_dosen && (
            <Card>
              <h3 className="text-[14px] font-semibold pb-3 mb-3 border-b border-line">
                Tanggapan Sebelumnya
              </h3>
              <p className="text-[12px] text-ink leading-relaxed">
                {data.catatan_dosen}
              </p>
            </Card>
          )}

          <Card>
            <h3 className="text-[14px] font-semibold pb-3 mb-3 border-b border-line">
              Beri Tanggapan (Opsional)
            </h3>
            <form action={sendTanggapan} className="space-y-3">
              <input type="hidden" name="id" value={data.id} />
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
    </>
  );
}

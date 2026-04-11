import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Card, PageTitle } from "@/components/ui";
import {
  addKPComment,
  approveKP,
  requestRevisionKP,
} from "@/lib/actions/teacherKp";
import { getKPDetail } from "@/lib/data/teacher";

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  diajukan: "Menunggu Verifikasi",
  verifikasi: "Sedang Diverifikasi",
  revisi: "Menunggu Revisi",
  disetujui: "Disetujui",
  ditolak: "Ditolak",
  berjalan: "Berjalan",
  selesai: "Selesai",
};

function fmtDate(iso: string | null | undefined) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function VerifikasiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getKPDetail(id);
  if (!data) notFound();

  const { kp, documents, comments } = data;
  const proposal = documents.find((d) => d.doc_key === "proposal");
  const canDecide = kp.status === "diajukan" || kp.status === "verifikasi";

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <PageTitle title="Verifikasi Proposal Pengajuan KP" />
        <Link
          href="/teacher/verifikasi"
          className="text-[13px] text-primary hover:underline"
        >
          ← Kembali ke Daftar Pengajuan
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT: Document preview */}
        <Card className="lg:col-span-2 !p-0 overflow-hidden">
          <div className="px-5 py-3 flex items-center justify-between border-b border-line">
            <h3 className="text-[14px] font-semibold">Pratinjau Dokumen</h3>
            {proposal?.file_url && (
              <a
                href={proposal.file_url}
                target="_blank"
                rel="noreferrer"
                className="text-[12px] text-primary hover:underline font-medium"
              >
                Unduh Proposal
              </a>
            )}
          </div>
          <div className="bg-surface" style={{ height: "70vh" }}>
            {proposal?.file_url ? (
              <iframe
                src={proposal.file_url}
                title="Proposal KP"
                className="w-full h-full bg-white"
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-center px-6">
                <div>
                  <div className="text-5xl mb-3">📄</div>
                  <p className="text-[14px] font-semibold text-ink mb-1">
                    Belum ada file proposal
                  </p>
                  <p className="text-[12px] text-ink-soft max-w-sm mx-auto">
                    Mahasiswa belum mengunggah file Proposal Kerja Praktik.
                    Anda bisa meminta revisi atau menunggu unggahan.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* RIGHT: Info + Actions */}
        <div className="space-y-5">
          <Card>
            <h3 className="text-[14px] font-semibold pb-3 mb-3 border-b border-line">
              Informasi Mahasiswa
            </h3>
            <dl className="space-y-2 text-[12px]">
              <Row label="Nama Mahasiswa" value={kp.student?.name ?? "-"} />
              <Row label="NIM" value={kp.student?.nim ?? "-"} />
              <Row
                label="Tanggal Pengajuan"
                value={fmtDate(kp.tanggal_pengajuan)}
              />
              <Row label="Semester" value={String(kp.student?.semester ?? "-")} />
              <Row label="IPK" value={String(kp.student?.ipk ?? "-")} />
              <div>
                <dt className="text-ink-soft">Judul KP</dt>
                <dd className="font-semibold leading-snug mt-0.5">{kp.judul}</dd>
              </div>
              <div>
                <dt className="text-ink-soft">Status</dt>
                <dd className="font-semibold mt-0.5">
                  {STATUS_LABEL[kp.status] ?? kp.status}
                </dd>
              </div>
            </dl>
          </Card>

          <Card>
            {canDecide ? (
              <>
                <form action={approveKP} className="mb-2">
                  <input type="hidden" name="kp_id" value={kp.id} />
                  <button
                    type="submit"
                    className="w-full h-11 rounded-md text-white font-semibold text-[14px]"
                    style={{
                      background:
                        "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
                    }}
                  >
                    ✓ Setujui
                  </button>
                </form>
                <form action={requestRevisionKP}>
                  <input type="hidden" name="kp_id" value={kp.id} />
                  <button
                    type="submit"
                    className="w-full h-11 rounded-md text-white font-semibold text-[14px]"
                    style={{
                      background:
                        "linear-gradient(135deg, #FFB366 0%, #F57C1A 100%)",
                    }}
                  >
                    ⟳ Revisi
                  </button>
                </form>
              </>
            ) : (
              <div className="rounded-md bg-surface border border-line px-3 py-3 text-[12px] text-ink-soft text-center">
                Status saat ini:{" "}
                <span className="font-semibold text-ink">
                  {STATUS_LABEL[kp.status] ?? kp.status}
                </span>
                . Tidak perlu tindakan lanjutan.
              </div>
            )}
          </Card>

          <Card>
            <form action={addKPComment} className="space-y-3">
              <input type="hidden" name="kp_id" value={kp.id} />
              <label className="text-[12px] font-medium">
                Tambahkan Komentar (Opsional)
              </label>
              <textarea
                name="body"
                placeholder="Tulis komentar untuk mahasiswa…"
                className="w-full min-h-[80px] p-3 rounded-md border border-line bg-card text-[13px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <Button type="submit" variant="primary" size="second">
                ✈️ Kirim Komentar
              </Button>
            </form>

            {comments.length > 0 && (
              <ul className="mt-4 pt-4 border-t border-line space-y-3">
                {comments.map((c) => (
                  <li key={c.id} className="text-[12px]">
                    <div className="flex justify-between text-ink-soft mb-0.5">
                      <span className="font-medium text-ink">
                        {(c as { author?: { name?: string } }).author?.name ?? "—"}
                      </span>
                      <span>
                        {new Date(c.created_at).toLocaleString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-ink leading-snug">{c.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="font-semibold text-right">{value}</dd>
    </div>
  );
}

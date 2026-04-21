import FlashToast from "@/components/FlashToast";
import { Card, PageTitle } from "@/components/ui";
import { getCurrentUser } from "@/lib/currentUser";
import { getLaporanByStudent } from "@/lib/data/laporan";

function fmtDate(iso: string | null | undefined) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const STATUS_META: Record<
  string,
  { label: string; border: string; bg: string }
> = {
  diajukan: {
    label: "Menunggu Verifikasi",
    border: "border-primary",
    bg: "bg-primary/5",
  },
  diterima: {
    label: "Laporan Diterima",
    border: "border-success",
    bg: "bg-success/5",
  },
  revisi: {
    label: "Perlu Revisi",
    border: "border-alert",
    bg: "bg-alert/5",
  },
  draft: {
    label: "Draft",
    border: "border-line",
    bg: "bg-surface",
  },
};

export default async function RiwayatLaporanPage() {
  const user = await getCurrentUser();
  const laporan = await getLaporanByStudent(user.id);

  return (
    <>
      <FlashToast message="Laporan Berhasil Dikirim!" param="submitted" />
      <PageTitle
        title="Riwayat Validasi Laporan"
        subtitle="Lihat status dan riwayat validasi laporan akhir kerja praktikmu secara detail."
      />

      {!laporan ? (
        <Card>
          <p className="text-[14px] text-ink-soft">
            Belum ada laporan yang diunggah. Silakan unggah laporan di menu{" "}
            <a
              className="text-primary font-medium"
              href="/student/laporan/upload"
            >
              Upload Laporan
            </a>
            .
          </p>
        </Card>
      ) : (
        <div className="space-y-5">
          <Card>
            <h3 className="text-[14px] font-semibold pb-3 mb-4 border-b border-line">
              Status Upload Terakhir
            </h3>

            <div
              className={`rounded-lg border-l-4 px-5 py-4 ${STATUS_META[laporan.status]?.border} ${STATUS_META[laporan.status]?.bg}`}
            >
              <p className="text-[15px] font-semibold mb-2">
                {STATUS_META[laporan.status]?.label ?? laporan.status}
              </p>

              {laporan.status === "diterima" && (
                <>
                  <p className="text-[12px]">
                    <span className="text-ink-soft">Diverifikasi Oleh: </span>
                    <span className="font-semibold">
                      {(laporan as { verifikator?: { name?: string } })
                        .verifikator?.name ?? "-"}
                    </span>
                  </p>
                  <p className="text-[12px]">
                    <span className="text-ink-soft">Tanggal Verifikasi: </span>
                    <span className="font-semibold">
                      {fmtDate(laporan.tanggal_verifikasi)}
                    </span>
                  </p>
                  <p className="text-[12px] text-ink-soft mt-2 leading-relaxed">
                    Laporan kamu telah divalidasi oleh dosen pembimbing dan
                    diterima secara resmi.
                  </p>
                </>
              )}

              {laporan.status === "diajukan" && (
                <p className="text-[12px] text-ink-soft leading-relaxed">
                  Laporan kamu sedang menunggu verifikasi dosen pembimbing.
                </p>
              )}

              {laporan.status === "revisi" && (
                <>
                  <p className="text-[12px] text-ink-soft leading-relaxed mb-2">
                    Dosen pembimbing meminta revisi pada laporan kamu.
                  </p>
                  {laporan.catatan_dosen && (
                    <div className="mt-3 rounded-md bg-card border border-line p-3">
                      <p className="text-[11px] text-ink-soft mb-1">
                        Catatan Dosen:
                      </p>
                      <p className="text-[12px] leading-relaxed whitespace-pre-wrap break-words">
                        {laporan.catatan_dosen}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-[14px] font-semibold pb-3 mb-4 border-b border-line">
              Detail Laporan
            </h3>
            <dl className="space-y-2 text-[13px]">
              <div className="flex gap-2">
                <dt className="text-ink-soft">Nama File:</dt>
                <dd className="font-semibold break-all">
                  {laporan.file_name ?? "-"}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-ink-soft">Tanggal Upload:</dt>
                <dd className="font-semibold">
                  {fmtDate(laporan.updated_at ?? laporan.created_at)}
                </dd>
              </div>
              {laporan.lampiran_name && (
                <div className="flex gap-2">
                  <dt className="text-ink-soft">Lampiran:</dt>
                  <dd className="font-semibold break-all">
                    {laporan.lampiran_name}
                  </dd>
                </div>
              )}
              {laporan.catatan_mahasiswa && (
                <div>
                  <dt className="text-ink-soft">Catatan kamu:</dt>
                  <dd className="mt-1 leading-relaxed whitespace-pre-wrap break-words">
                    {laporan.catatan_mahasiswa}
                  </dd>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                {laporan.file_url && (
                  <a
                    href={laporan.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    📄 Lihat Laporan
                  </a>
                )}
                {laporan.lampiran_url && (
                  <a
                    href={laporan.lampiran_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    🗂 Unduh Lampiran
                  </a>
                )}
              </div>
            </dl>
          </Card>
        </div>
      )}
    </>
  );
}

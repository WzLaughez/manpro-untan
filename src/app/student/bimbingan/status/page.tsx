import { Card, PageTitle } from "@/components/ui";
import { getCurrentUser } from "@/lib/currentUser";
import { getBimbinganStats } from "@/lib/data/bimbingan";

function fmtDate(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function StatusVerifikasiBimbinganPage() {
  const user = await getCurrentUser();
  const { total, disetujui, revisi, items } = await getBimbinganStats(user.id);

  const withFeedback = items.filter((b) => b.catatan_dosen);

  return (
    <>
      <PageTitle
        title="Status Verifikasi Bimbingan"
        subtitle="Ringkasan progres dan detail validasi bimbingan anda"
      />

      {/* 3 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
        <div
          className="rounded-2xl p-5 text-white text-center"
          style={{
            background:
              "linear-gradient(135deg, #5BC0F0 0%, #1E88E5 100%)",
          }}
        >
          <div className="text-[12px] opacity-90 mb-1">Total Pengajuan</div>
          <div className="text-[36px] font-bold leading-none">{total}</div>
        </div>
        <div
          className="rounded-2xl p-5 text-white text-center"
          style={{
            background:
              "linear-gradient(135deg, #56E8A0 0%, #1AAF6B 100%)",
          }}
        >
          <div className="text-[12px] opacity-90 mb-1">Disetujui</div>
          <div className="text-[36px] font-bold leading-none">{disetujui}</div>
        </div>
        <div
          className="rounded-2xl p-5 text-white text-center"
          style={{
            background:
              "linear-gradient(135deg, #F87171 0%, #DC2626 100%)",
          }}
        >
          <div className="text-[12px] opacity-90 mb-1">Revisi</div>
          <div className="text-[36px] font-bold leading-none">{revisi}</div>
        </div>
      </div>

      {/* Detail Validasi */}
      <Card>
        <h3 className="text-[14px] font-semibold pb-3 mb-4 border-b border-line">
          Detail Validasi
        </h3>

        {withFeedback.length === 0 ? (
          <p className="text-[13px] text-ink-soft">
            Belum ada catatan dosen pada bimbingan Anda.
          </p>
        ) : (
          <div className="space-y-4">
            {withFeedback.map((b) => (
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
                  <span className="text-ink-soft">{fmtDate(b.tanggal)}</span>
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
        )}
      </Card>
    </>
  );
}

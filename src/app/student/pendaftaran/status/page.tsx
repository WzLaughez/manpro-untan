import FlashToast from "@/components/FlashToast";
import { Card, PageTitle, Stepper, Timeline } from "@/components/ui";
import { getCurrentUser } from "@/lib/currentUser";
import { getKPWithRelations } from "@/lib/data/kp";

const STEPS = ["Dikirim", "Verifikasi Dosen", "Disetujui"];

function statusToStep(status: string) {
  if (status === "disetujui" || status === "berjalan" || status === "selesai")
    return 3;
  if (status === "diajukan" || status === "verifikasi") return 2;
  return 1;
}

function fmt(iso: string | null | undefined) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }) + " WIB";
}

export default async function StatusVerifikasiPage() {
  const user = await getCurrentUser();
  const data = await getKPWithRelations(user.id);

  if (!data || data.kp.status === "draft") {
    return (
      <>
        <PageTitle title="Status Pengajuan Proposal" />
        <Card>
          <p className="text-[14px] text-ink-soft">
            Belum ada proposal yang disubmit. Selesaikan Form Pendaftaran &
            Upload Dokumen, lalu klik Submit.
          </p>
        </Card>
      </>
    );
  }

  const { kp, activity } = data;
  const currentStep = statusToStep(kp.status);

  return (
    <>
      <FlashToast message="Pendaftaran Berhasil Dikirim!" param="submitted" />
      <PageTitle
        title="Status Pengajuan Proposal"
        subtitle="Status dan Riwayat Proposal Dapat Dilihat pada Halaman ini"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <h2 className="text-[16px] font-semibold pb-4 mb-8 border-b border-line">
            Progres Verifikasi Proposal
          </h2>
          <Stepper steps={STEPS} current={currentStep} />

          <div className="mt-8 space-y-2 text-[13px]">
            <div>
              <span className="text-ink-soft">Dosen Pembimbing Akademik: </span>
              <span className="font-semibold">{kp.dosen_pa ?? "-"}</span>
            </div>
            <div>
              <span className="text-ink-soft">Tanggal Pengajuan: </span>
              <span className="font-semibold">{fmt(kp.tanggal_pengajuan)}</span>
            </div>
            <div>
              <span className="text-ink-soft">Status Saat Ini: </span>
              <span className="font-semibold">
                {kp.catatan_dosen ?? `Status: ${kp.status}`}
              </span>
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <h3 className="text-[14px] font-semibold pb-3 mb-3 border-b border-line">
              Langkah Selanjutnya
            </h3>
            <p className="text-[12px] text-ink-soft leading-relaxed">
              Setelah Proposal kamu disetujui, kamu dapat melanjutkan ke tahap
              bimbingan
            </p>
          </Card>
          <Card>
            <h3 className="text-[14px] font-semibold pb-3 mb-4 border-b border-line">
              Riwayat Aktivitas
            </h3>
            <Timeline
              items={activity.map((a) => ({
                title: a.title,
                time: fmt(a.created_at),
              }))}
            />
          </Card>
        </div>
      </div>
    </>
  );
}

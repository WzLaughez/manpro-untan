import FlashToast from "@/components/FlashToast";
import {
  Button,
  Card,
  Field,
  Input,
  PageTitle,
  Textarea,
} from "@/components/ui";
import { submitLaporan } from "@/lib/actions/laporan";
import { getCurrentUser } from "@/lib/currentUser";
import { getKPByStudent } from "@/lib/data/kp";
import { getLaporanByStudent } from "@/lib/data/laporan";
import LampiranPicker from "../LampiranPicker";
import LaporanFilePicker from "../LaporanFilePicker";

export default async function UploadLaporanPage() {
  const user = await getCurrentUser();
  const kp = await getKPByStudent(user.id);

  const approved =
    !!kp && ["disetujui", "berjalan", "selesai"].includes(kp.status);

  if (!kp || !approved) {
    return (
      <>
        <PageTitle
          title="Upload Laporan Akhir KP"
          subtitle="Unggah dokumen laporan akhir anda setelah proses riset selesai."
        />
        <Card>
          <p className="text-[14px] text-ink-soft">
            {!kp
              ? "Belum ada pendaftaran KP. Silakan isi Form Pendaftaran terlebih dahulu."
              : "Proposal belum disetujui. Upload laporan dapat dilakukan setelah proposal diverifikasi oleh dosen."}
          </p>
        </Card>
      </>
    );
  }

  const existing = await getLaporanByStudent(user.id);

  return (
    <>
      <FlashToast message="Submit Laporan Berhasil!" />

      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <PageTitle
          title="Upload Laporan Akhir KP"
          subtitle="Unggah dokumen laporan akhir anda setelah proses riset selesai."
        />
        <a
          href="#"
          aria-disabled="true"
          className="text-[13px] text-primary hover:underline font-medium"
          title="Link template akan ditambahkan"
        >
          Unduh template laporan
        </a>
      </div>

      <Card>
        <h3 className="text-[14px] font-semibold pb-3 mb-4 border-b border-line">
          Formulir Upload Laporan
        </h3>

        <form action={submitLaporan} className="space-y-5">
          <Field label="Judul Kerja Praktik">
            <Input
              name="judul"
              value={kp.judul}
              readOnly
              className="bg-surface cursor-not-allowed"
            />
          </Field>

          <Field label="Dosen Pembimbing Kerja Praktik">
            <Input
              name="dosen"
              value={kp.dosen_pa ?? "-"}
              readOnly
              className="bg-surface cursor-not-allowed"
            />
          </Field>

          <LaporanFilePicker currentName={existing?.file_name} />

          <Field label="Lampiran (Opsional, Zip)">
            <LampiranPicker currentName={existing?.lampiran_name} />
          </Field>

          <Field label="Catatan Tambahan untuk Dosen (Opsional)">
            <Textarea
              name="catatan"
              defaultValue={existing?.catatan_mahasiswa ?? ""}
              placeholder="Tuliskan catatan tambahan untuk dosen..."
            />
          </Field>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary">
              ✅ Submit Laporan
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}

import FlashToast from "@/components/FlashToast";
import {
  Button,
  Card,
  Field,
  Input,
  PageTitle,
  Textarea,
} from "@/components/ui";
import { saveDraftLogbook, submitLogbook } from "@/lib/actions/logbook";
import { getCurrentUser } from "@/lib/currentUser";
import { getKPByStudent } from "@/lib/data/kp";
import LogbookFilePicker from "../LogbookFilePicker";

export default async function PengisianLogbookPage() {
  const user = await getCurrentUser();
  const kp = await getKPByStudent(user.id);

  const approved =
    !!kp && ["disetujui", "berjalan", "selesai"].includes(kp.status);

  if (!kp || !approved) {
    return (
      <>
        <PageTitle
          title="Logbook Mahasiswa"
          subtitle="Catat dan unggah aktivitas harian kerja praktikmu secara teratur."
        />
        <Card>
          <p className="text-[14px] text-ink-soft">
            {!kp
              ? "Belum ada pendaftaran KP. Silakan isi Form Pendaftaran terlebih dahulu."
              : "Proposal belum disetujui. Pengisian logbook dapat dilakukan setelah proposal diverifikasi oleh dosen."}
          </p>
        </Card>
      </>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <FlashToast message="Simpan Berkas Berhasil!" />
      <PageTitle
        title="Logbook Mahasiswa"
        subtitle="Catat dan unggah aktivitas harian kerja praktikmu secara teratur."
      />

      <Card>
        <h3 className="text-[14px] font-semibold pb-3 mb-4 border-b border-line">
          Formulir Pengisian Logbook Harian
        </h3>
        <form className="space-y-4">
          <div className="max-w-sm">
            <Field label="Tanggal">
              <Input name="tanggal" type="date" required defaultValue={today} />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Aktivitas">
              <Textarea
                name="aktivitas"
                required
                placeholder="Melakukan pemasangan jaringan p..."
              />
            </Field>
            <Field label="Kendala (Opsional)">
              <Textarea
                name="kendala"
                placeholder="Jelaskan kendala yang kamu alami..."
              />
            </Field>
          </div>

          <Field label="Hasil Pekerjaan">
            <Textarea
              name="hasil"
              placeholder="Sebutkan atau jelaskan hasil pekerjaan..."
            />
          </Field>

          <LogbookFilePicker />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="submit"
              formAction={saveDraftLogbook}
              variant="secondary"
              size="second"
            >
              💾 Simpan
            </Button>
            <Button
              type="submit"
              formAction={submitLogbook}
              variant="primary"
              size="second"
            >
              📤 Submit
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}

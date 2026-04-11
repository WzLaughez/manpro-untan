import FlashToast from "@/components/FlashToast";
import { Button, Card, Field, Input, PageTitle, Textarea } from "@/components/ui";
import { submitBimbingan } from "@/lib/actions/bimbingan";
import { getCurrentUser } from "@/lib/currentUser";
import { getKPByStudent } from "@/lib/data/kp";
import BimbinganFilePicker from "../BimbinganFilePicker";

export default async function AjukanBimbinganPage() {
  const user = await getCurrentUser();
  const kp = await getKPByStudent(user.id);

  const approved =
    !!kp && ["disetujui", "berjalan", "selesai"].includes(kp.status);

  if (!kp || !approved) {
    return (
      <>
        <PageTitle
          title="Pengajuan Bimbingan"
          subtitle="Ajukan Bimbingan Kerja Praktik"
        />
        <Card>
          <p className="text-[14px] text-ink-soft">
            {!kp
              ? "Belum ada pendaftaran KP. Silakan isi Form Pendaftaran terlebih dahulu."
              : "Proposal belum disetujui. Bimbingan dapat dilakukan setelah proposal diverifikasi oleh dosen."}
          </p>
        </Card>
      </>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <FlashToast message="Submit Bimbingan Berhasil!" />
      <PageTitle
        title="Pengajuan Bimbingan"
        subtitle="Ajukan Bimbingan Kerja Praktik"
      />

      {/* KP context */}
      <Card className="mb-5 bg-surface/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-[12px]">
          <div>
            <span className="text-ink-soft">Mahasiswa: </span>
            <span className="font-semibold">{user.name}</span>
          </div>
          <div>
            <span className="text-ink-soft">NIM: </span>
            <span className="font-semibold">{user.nim}</span>
          </div>
          <div>
            <span className="text-ink-soft">Judul KP: </span>
            <span className="font-semibold">{kp.judul}</span>
          </div>
          <div>
            <span className="text-ink-soft">Dosen Pembimbing: </span>
            <span className="font-semibold">{kp.dosen_pa ?? "-"}</span>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-[14px] font-semibold pb-3 mb-4 border-b border-line">
          Form Bimbingan
        </h3>
        <form action={submitBimbingan} className="space-y-4">
          <Field label="Tanggal">
            <Input name="tanggal" type="date" required defaultValue={today} />
          </Field>
          <Field label="Jenis Bimbingan">
            <Input
              name="jenis"
              placeholder="Perkembangan Bab 1 - Pendahuluan..."
              required
            />
          </Field>
          <Field label="Ringkasan">
            <Textarea
              name="ringkasan"
              placeholder="Jelaskan secara singkat perkembangan yang telah dicapai atau permasalahan yang ingin didiskusikan dengan dosen..."
            />
          </Field>

          <BimbinganFilePicker />

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary">
              ✅ Submit Bimbingan
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}

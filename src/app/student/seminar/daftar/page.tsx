import FlashToast from "@/components/FlashToast";
import {
  Button,
  Card,
  Field,
  Input,
  PageTitle,
} from "@/components/ui";
import { daftarSeminar } from "@/lib/actions/seminar";
import { getCurrentUser } from "@/lib/currentUser";
import { getKPByStudent } from "@/lib/data/kp";
import { getSeminarWithDocs } from "@/lib/data/seminar";
import SeminarDocPicker from "../SeminarDocPicker";

export default async function DaftarSeminarPage() {
  const user = await getCurrentUser();
  const kp = await getKPByStudent(user.id);

  const approved =
    !!kp && ["disetujui", "berjalan", "selesai"].includes(kp.status);

  if (!kp || !approved) {
    return (
      <>
        <PageTitle
          title="Pengajuan Seminar"
          subtitle="Ajukan jadwal seminar kerja praktikmu dan unggah berkas pendukung di sini."
        />
        <Card>
          <p className="text-[14px] text-ink-soft">
            {!kp
              ? "Belum ada pendaftaran KP."
              : "Proposal belum disetujui. Pengajuan seminar dapat dilakukan setelah proposal diverifikasi oleh dosen."}
          </p>
        </Card>
      </>
    );
  }

  const data = await getSeminarWithDocs(user.id);
  const seminar = data?.seminar;
  const documents = data?.documents ?? [];

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <FlashToast message="Pengajuan Seminar Berhasil Diajukan!" />
      <PageTitle
        title="Pengajuan Seminar"
        subtitle="Ajukan jadwal seminar kerja praktikmu dan unggah berkas pendukung di sini."
      />

      <Card>
        <form action={daftarSeminar} className="space-y-6">
          {/* Data Mahasiswa (readonly) */}
          <div>
            <h3 className="text-[14px] font-semibold mb-3">Data Mahasiswa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-[13px] pb-5 border-b border-line">
              <div>
                <p className="text-[11px] text-ink-soft">Nama</p>
                <p className="font-semibold">{user.name}</p>
              </div>
              <div>
                <p className="text-[11px] text-ink-soft">NIM</p>
                <p className="font-semibold">{user.nim ?? "-"}</p>
              </div>
              <div>
                <p className="text-[11px] text-ink-soft">Program Studi</p>
                <p className="font-semibold">Informatika</p>
              </div>
              <div>
                <p className="text-[11px] text-ink-soft">Dosen Pembimbing</p>
                <p className="font-semibold">{kp.dosen_pa ?? "-"}</p>
              </div>
            </div>
          </div>

          {/* Informasi Seminar */}
          <div>
            <h3 className="text-[14px] font-semibold mb-3">
              Informasi Seminar
            </h3>

            <div className="space-y-4">
              <Field label="Judul Kerja Praktik">
                <Input
                  value={kp.judul}
                  readOnly
                  className="bg-surface cursor-not-allowed"
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Tanggal Pengajuan">
                  <Input
                    name="tanggal_pengajuan"
                    type="date"
                    defaultValue={seminar?.tanggal_pengajuan ?? today}
                    required
                  />
                </Field>
                <Field label="Lokasi Seminar (Opsional)">
                  <Input
                    name="lokasi"
                    placeholder="Ruang Sidang Utama Informatika"
                    defaultValue={seminar?.lokasi ?? ""}
                  />
                </Field>
              </div>

              <Field label="Pembimbing Lapangan">
                <Input
                  name="pembimbing_lapangan"
                  placeholder="Nama pembimbing dari instansi"
                  defaultValue={seminar?.pembimbing_lapangan ?? ""}
                />
              </Field>
            </div>
          </div>

          {/* Unggah Berkas */}
          <div className="pt-2 border-t border-line">
            <h3 className="text-[14px] font-semibold mt-5 mb-2">
              Unggah Berkas
            </h3>
            <p className="text-[11px] text-ink-soft mb-3">
              Unggah keempat berkas di bawah ini, lalu klik{" "}
              <span className="font-semibold">Daftar Seminar</span> untuk
              mengajukan.
            </p>
            <ul className="divide-y divide-line">
              {documents.map((doc) => (
                <SeminarDocPicker key={doc.doc_key} doc={doc} />
              ))}
            </ul>
          </div>

          {/* Single CTA */}
          <div className="flex justify-end pt-4 border-t border-line">
            <Button type="submit" variant="primary">
              ✅ Daftar Seminar
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}

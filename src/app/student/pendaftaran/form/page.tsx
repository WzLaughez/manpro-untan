import FilePicker from "@/components/FilePicker";
import {
  Button,
  Card,
  Field,
  Input,
  PageTitle,
  Select,
  Textarea,
} from "@/components/ui";
import { saveKPForm } from "@/lib/actions/kp";
import { getCurrentUser } from "@/lib/currentUser";
import { getKPByStudent } from "@/lib/data/kp";

const KELOMPOK = [
  "Rekayasa Perangkat Lunak",
  "Sistem Cerdas",
  "Jaringan & Keamanan",
  "Multimedia & Visi Komputer",
  "Sistem Informasi",
];

export default async function FormPendaftaranPage() {
  const user = await getCurrentUser();
  const kp = await getKPByStudent(user.id);

  const ttdName = kp?.ttd_url ? kp.ttd_url.split("/").pop() : null;

  return (
    <>
      <PageTitle
        title="Formulir Pendaftaran"
        subtitle="Isi Formulir dengan Data yang Valid"
      />

      <Card>
        <form
          action={saveKPForm}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4"
        >
          <Field label="Nama">
            <Input name="nama" defaultValue={user.name} readOnly />
          </Field>
          <Field label="Judul Kerja Praktik">
            <Input
              name="judul"
              required
              placeholder="Judul Kerja Praktik"
              defaultValue={kp?.judul ?? ""}
            />
          </Field>

          <Field label="NIM">
            <Input name="nim" defaultValue={user.nim ?? ""} readOnly />
          </Field>
          <Field label="Dosen Pembimbing Akademik">
            <Input
              name="dosen_pa"
              placeholder="Nama Dosen PA"
              defaultValue={kp?.dosen_pa ?? ""}
            />
          </Field>

          <Field label="Semester">
            <Input
              name="semester"
              defaultValue={user.semester ?? ""}
              readOnly
            />
          </Field>
          <Field label="Jumlah SKS">
            <Input
              name="jumlah_sks"
              type="number"
              placeholder="Jumlah SKS"
              defaultValue={kp?.jumlah_sks ?? ""}
            />
          </Field>

          <Field label="IPK Terakhir">
            <Input name="ipk" defaultValue={user.ipk ?? ""} readOnly />
          </Field>
          <Field label="Kelompok Keahlian">
            <Select name="kelompok_keahlian" defaultValue={kp?.kelompok_keahlian ?? ""}>
              <option value="" disabled>
                Kelompok Keahlian
              </option>
              {KELOMPOK.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </Select>
          </Field>

          <div className="md:col-span-2">
            <Field label="Ringkasan">
              <Textarea
                name="ringkasan"
                placeholder="Deskripsikan singkat rencana Kerja Praktik yang akan kamu lakukan di instansi."
                defaultValue={kp?.ringkasan ?? ""}
              />
            </Field>
          </div>

          <Field label="Nama Instansi">
            <Input
              name="nama_instansi"
              placeholder="Contoh: PT PUTRA MANDIRI JAYA"
              defaultValue={kp?.nama_instansi ?? ""}
            />
          </Field>
          <Field label="Nomor HP Narahubung">
            <Input
              name="no_hp_narahubung"
              placeholder="08xx-xxxx-xxxx"
              defaultValue={kp?.no_hp_narahubung ?? ""}
            />
          </Field>

          <Field label="Nama Narahubung">
            <Input
              name="nama_narahubung"
              placeholder="Nama"
              defaultValue={kp?.nama_narahubung ?? ""}
            />
          </Field>
          <Field label="Alamat Instansi">
            <Input
              name="alamat_instansi"
              placeholder="Alamat"
              defaultValue={kp?.alamat_instansi ?? ""}
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Unggah Tanda Tangan Anda">
              <FilePicker name="ttd" accept="image/*" currentName={ttdName} />
            </Field>
          </div>

          <div className="md:col-span-2 flex justify-end pt-2">
            <Button type="submit" variant="primary">
              Lanjut →
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}

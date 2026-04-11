import {
  Button,
  Card,
  Field,
  Input,
  PageTitle,
  StatusBadge,
  Textarea,
} from "@/components/ui";
import { currentStudent, logbooks } from "@/lib/mock";

export default function LogbookPage() {
  const mine = logbooks.filter((l) => l.studentId === currentStudent.id);

  return (
    <>
      <PageTitle title="Logbook" subtitle="Catat aktivitas KP harianmu" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card>
          <h2 className="text-[16px] font-semibold mb-4">Isi Logbook</h2>
          <div className="space-y-3">
            <Field label="Tanggal">
              <Input type="date" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Jam Mulai">
                <Input type="time" />
              </Field>
              <Field label="Jam Selesai">
                <Input type="time" />
              </Field>
            </div>
            <Field label="Kegiatan">
              <Textarea placeholder="Deskripsi singkat aktivitas..." />
            </Field>
            <Button type="button">Ajukan</Button>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-[16px] font-semibold mb-4">Riwayat Logbook</h2>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[13px]">
              <thead className="text-left text-ink-soft border-b border-line">
                <tr>
                  <th className="py-2 px-2 font-medium">Tanggal</th>
                  <th className="py-2 px-2 font-medium">Kegiatan</th>
                  <th className="py-2 px-2 font-medium">Jam</th>
                  <th className="py-2 px-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {mine.map((l) => (
                  <tr key={l.id} className="border-b border-line/60">
                    <td className="py-2.5 px-2">{l.tanggal}</td>
                    <td className="py-2.5 px-2">{l.kegiatan}</td>
                    <td className="py-2.5 px-2">
                      {l.jamMulai} – {l.jamSelesai}
                    </td>
                    <td className="py-2.5 px-2">
                      <StatusBadge status={l.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}

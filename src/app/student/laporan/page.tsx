import {
  Button,
  Card,
  Field,
  Input,
  PageTitle,
  StatusBadge,
} from "@/components/ui";
import { currentStudent, laporanAkhir } from "@/lib/mock";

export default function LaporanPage() {
  const mine = laporanAkhir.filter((l) => l.studentId === currentStudent.id);
  return (
    <>
      <PageTitle title="Laporan Akhir" subtitle="Unggah dan verifikasi laporan akhir KP" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <h2 className="text-[16px] font-semibold mb-4">Unggah Laporan</h2>
          <div className="space-y-3">
            <Field label="Judul Laporan">
              <Input placeholder="Judul laporan akhir" />
            </Field>
            <Field label="File Laporan (PDF)">
              <Input type="file" accept="application/pdf" />
            </Field>
            <Button type="button">Ajukan Verifikasi</Button>
          </div>
        </Card>
        <Card>
          <h2 className="text-[16px] font-semibold mb-4">Status</h2>
          {mine.map((l) => (
            <div key={l.id} className="border border-line rounded-lg p-3">
              <div className="font-medium text-[14px]">{l.judul}</div>
              <div className="mt-2">
                <StatusBadge status={l.status} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}

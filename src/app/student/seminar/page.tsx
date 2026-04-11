import { Button, Card, PageTitle, StatusBadge } from "@/components/ui";
import { currentStudent, seminars } from "@/lib/mock";

export default function SeminarPage() {
  const mine = seminars.filter((s) => s.studentId === currentStudent.id);
  return (
    <>
      <PageTitle title="Seminar" subtitle="Daftar seminar dan lihat jadwalnya" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card>
          <h2 className="text-[16px] font-semibold mb-4">Daftar Seminar</h2>
          <p className="text-[13px] text-ink-soft mb-4">
            Pastikan laporan akhir sudah disetujui sebelum mendaftar seminar.
          </p>
          <Button type="button">Daftar Sekarang</Button>
        </Card>
        <Card className="lg:col-span-2">
          <h2 className="text-[16px] font-semibold mb-4">Jadwal Seminar</h2>
          <ul className="divide-y divide-line">
            {mine.map((s) => (
              <li key={s.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{s.jadwal}</div>
                  <div className="text-[12px] text-ink-soft">{s.ruangan}</div>
                </div>
                <StatusBadge status={s.status} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

import { Button, Card, PageTitle, StatusBadge } from "@/components/ui";
import { allStudents, laporanAkhir } from "@/lib/mock";

export default function TeacherLaporanPage() {
  return (
    <>
      <PageTitle title="Cek Laporan Akhir" subtitle="Verifikasi laporan akhir KP" />
      <Card>
        <ul className="divide-y divide-line">
          {laporanAkhir.map((l) => {
            const stu = allStudents.find((s) => s.id === l.studentId);
            return (
              <li key={l.id} className="py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{l.judul}</div>
                  <div className="text-[12px] text-ink-soft">{stu?.name}</div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={l.status} />
                  <Button size="second" variant="secondary">
                    Lihat
                  </Button>
                  <Button size="second" variant="success">
                    Setujui
                  </Button>
                  <Button size="second" variant="notification">
                    Revisi
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </>
  );
}

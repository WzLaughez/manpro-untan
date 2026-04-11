import { Button, Card, PageTitle, StatusBadge } from "@/components/ui";
import { allStudents, seminars } from "@/lib/mock";

export default function TeacherSeminarPage() {
  return (
    <>
      <PageTitle title="Seminar Akhir" subtitle="Jadwal & konfirmasi kehadiran" />
      <Card>
        <ul className="divide-y divide-line">
          {seminars.map((s) => {
            const stu = allStudents.find((u) => u.id === s.studentId);
            return (
              <li key={s.id} className="py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{stu?.name}</div>
                  <div className="text-[12px] text-ink-soft">
                    {s.jadwal} · {s.ruangan}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={s.status} />
                  <Button size="second">Konfirmasi Hadir</Button>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </>
  );
}

import { Button, Card, PageTitle, StatusBadge } from "@/components/ui";
import { allStudents, logbooks } from "@/lib/mock";

export default function TeacherLogbookPage() {
  return (
    <>
      <PageTitle title="Logbook" subtitle="Verifikasi logbook harian mahasiswa" />
      <Card>
        <table className="w-full text-[13px]">
          <thead className="text-left text-ink-soft border-b border-line">
            <tr>
              <th className="py-2 px-2 font-medium">Mahasiswa</th>
              <th className="py-2 px-2 font-medium">Tanggal</th>
              <th className="py-2 px-2 font-medium">Kegiatan</th>
              <th className="py-2 px-2 font-medium">Status</th>
              <th className="py-2 px-2 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {logbooks.map((l) => {
              const stu = allStudents.find((s) => s.id === l.studentId);
              return (
                <tr key={l.id} className="border-b border-line/60">
                  <td className="py-3 px-2">{stu?.name}</td>
                  <td className="py-3 px-2">{l.tanggal}</td>
                  <td className="py-3 px-2">{l.kegiatan}</td>
                  <td className="py-3 px-2">
                    <StatusBadge status={l.status} />
                  </td>
                  <td className="py-3 px-2">
                    <Button size="second" variant="success">
                      Setujui
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </>
  );
}

import { Card, PageTitle } from "@/components/ui";
import { currentStudent, scores } from "@/lib/mock";

export default function StatusPage() {
  const score = scores.find((s) => s.studentId === currentStudent.id);
  return (
    <>
      <PageTitle title="Status & Nilai" subtitle="Hasil akhir KP-mu" />
      <Card>
        {score ? (
          <div className="text-center py-6">
            <div className="text-[12px] text-ink-soft uppercase tracking-wider">
              Nilai Akhir
            </div>
            <div className="text-5xl font-bold text-primary mt-2">
              {score.nilaiHuruf}
            </div>
            <div className="text-[14px] text-ink-soft mt-1">
              {score.nilaiAngka}
            </div>
            {score.catatan && (
              <p className="mt-4 text-[13px]">{score.catatan}</p>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="text-3xl mb-2">⏳</div>
            <p className="text-[14px] text-ink-soft">
              Menunggu penilaian dari dosen pembimbing.
            </p>
          </div>
        )}
      </Card>
    </>
  );
}

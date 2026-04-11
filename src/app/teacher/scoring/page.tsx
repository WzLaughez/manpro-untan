import { Button, Card, Field, Input, PageTitle } from "@/components/ui";
import { allStudents } from "@/lib/mock";

export default function ScoringPage() {
  const students = allStudents.filter((s) => s.role === "student");
  return (
    <>
      <PageTitle title="Penilaian" subtitle="Berikan nilai akhir KP mahasiswa" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {students.map((s) => (
          <Card key={s.id}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-[12px] text-ink-soft">{s.nim}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nilai Angka">
                <Input type="number" min={0} max={100} placeholder="0–100" />
              </Field>
              <Field label="Nilai Huruf">
                <Input placeholder="A / B / C / D / E" />
              </Field>
            </div>
            <div className="mt-4">
              <Button>Simpan Nilai</Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

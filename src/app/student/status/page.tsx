import { Card, PageTitle } from "@/components/ui";
import { getCurrentUser } from "@/lib/currentUser";
import { getPenilaianByStudent } from "@/lib/data/penilaian";
import {
  CRITERIA,
  letterGrade,
  lulus,
} from "@/lib/penilaianConstants";
import StudentNilaiActions from "./StudentNilaiActions";

export default async function StatusNilaiPage() {
  const user = await getCurrentUser();
  const penilaian = await getPenilaianByStudent(user.id);

  if (!penilaian || penilaian.nilai_akhir == null) {
    return (
      <>
        <PageTitle
          title="Nilai Mahasiswa"
          subtitle="Lihat dan unduh hasil penilaian akhir kerja praktik Anda"
        />
        <Card>
          <div className="text-center py-10">
            <div className="text-4xl mb-3">⏳</div>
            <p className="text-[14px] font-semibold mb-1">
              Menunggu Penilaian
            </p>
            <p className="text-[12px] text-ink-soft max-w-sm mx-auto">
              Nilai akhir kamu akan muncul di sini setelah dosen pembimbing
              menyelesaikan penilaian.
            </p>
          </div>
        </Card>
      </>
    );
  }

  const rec = penilaian as unknown as Record<string, number | string | null>;
  const grade = letterGrade(penilaian.nilai_akhir);
  const status = lulus(penilaian.nilai_akhir) ? "LULUS" : "TIDAK LULUS";

  const rows = CRITERIA.map((c) => {
    const skor = (rec[`skor_${c.key}`] as number | null) ?? 0;
    const bobotNilai = Math.round(skor * c.weight * 100) / 100;
    return {
      label: c.label,
      bobotPct: `${Math.round(c.weight * 100)}%`,
      skor,
      bobotNilai,
    };
  });

  return (
    <>
      <PageTitle
        title="Nilai Mahasiswa"
        subtitle="Lihat dan unduh hasil penilaian akhir kerja praktik Anda"
      />

      {/* 3 hero cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
        <div
          className="rounded-2xl p-6 text-white text-center"
          style={{
            background: "linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)",
          }}
        >
          <div className="text-[12px] opacity-90 mb-2">Total Bobot Nilai</div>
          <div className="text-[40px] font-bold leading-none">
            {penilaian.nilai_akhir.toFixed(0)}
          </div>
        </div>
        <div
          className="rounded-2xl p-6 text-white text-center"
          style={{
            background: "linear-gradient(135deg, #FFB366 0%, #F87171 100%)",
          }}
        >
          <div className="text-[12px] opacity-90 mb-2">Huruf Mutu</div>
          <div className="text-[40px] font-bold leading-none">{grade}</div>
        </div>
        <div
          className="rounded-2xl p-6 text-white text-center"
          style={{
            background: "linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)",
          }}
        >
          <div className="text-[12px] opacity-90 mb-2">Status Akhir</div>
          <div className="text-[28px] font-bold leading-none">{status}</div>
        </div>
      </div>

      {/* Tabel Rekap Nilai */}
      <Card className="mb-5">
        <h3 className="text-[14px] font-semibold mb-4">Tabel Rekap Nilai</h3>
        <div className="rounded-xl border border-line overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-identity text-white">
              <tr>
                <th className="py-3 px-4 text-left font-semibold">
                  Komponen Penilaian
                </th>
                <th className="py-3 px-4 text-left font-semibold">Bobot</th>
                <th className="py-3 px-4 text-left font-semibold">
                  Nilai 1 - 100
                </th>
                <th className="py-3 px-4 text-left font-semibold">
                  Bobot x Nilai
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.label}
                  className={i % 2 === 0 ? "bg-surface" : "bg-card"}
                >
                  <td className="py-3 px-4">{r.label}</td>
                  <td className="py-3 px-4">{r.bobotPct}</td>
                  <td className="py-3 px-4">{r.skor}</td>
                  <td className="py-3 px-4 font-semibold">{r.bobotNilai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Actions */}
      <StudentNilaiActions
        canBA={!!penilaian.nilai_akhir}
        studentName={user.name}
        studentNim={user.nim ?? null}
        studentSemester={user.semester ?? null}
        nilaiAkhir={penilaian.nilai_akhir}
        dosenName={
          (penilaian as { dosen?: { name?: string } }).dosen?.name ?? null
        }
        komentar={penilaian.komentar_tambahan ?? null}
      />
    </>
  );
}

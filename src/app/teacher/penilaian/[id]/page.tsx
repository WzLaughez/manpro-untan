import Link from "next/link";
import { notFound } from "next/navigation";
import FlashToast from "@/components/FlashToast";
import { Card, PageTitle } from "@/components/ui";
import { kirimPenilaian } from "@/lib/actions/penilaian";
import { getCurrentUser } from "@/lib/currentUser";
import {
  getPenilaianDetailForTeacher,
  getTeacherBerkasByKP,
} from "@/lib/data/penilaian";
import { CRITERIA, SKOR_OPTIONS } from "@/lib/penilaianConstants";
import BeritaAcaraModal from "../BeritaAcaraModal";
import BerkasUploadRow from "./BerkasUploadRow";

const SAMPLE_BERKAS = [
  { label: "Rubrik Penilaian.pdf", href: "#" },
  { label: "Template Form Penilaian.xlsx", href: "#" },
  { label: "Panduan Penilaian KP.pdf", href: "#" },
  { label: "Template Berita Acara.docx", href: "#" },
];

export default async function PenilaianDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ba?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const user = await getCurrentUser();

  const detail = await getPenilaianDetailForTeacher(id);
  if (!detail) notFound();

  const berkasSlots = await getTeacherBerkasByKP(detail.seminar.kp_id);

  const dosenPembimbingId = (
    detail.seminar.kp as unknown as { dosen_pembimbing_id: string }
  )?.dosen_pembimbing_id;
  if (dosenPembimbingId !== user.id) notFound();

  const existing = detail.penilaian;
  const hasNilai = !!existing?.nilai_akhir;
  const showBA = sp.ba === "1" && hasNilai;

  const student = detail.seminar.student as unknown as {
    id: string;
    name: string;
    nim: string | null;
    semester: number | null;
  };
  const kp = detail.seminar.kp as unknown as {
    judul: string;
    dosen_pa: string | null;
  };

  const rec = (existing ?? {}) as Record<string, unknown>;

  return (
    <>
      <FlashToast message="Nilai berhasil dikirim!" param="submitted" />
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <PageTitle title="Form Penilaian KP" />
        <Link
          href="/teacher/penilaian"
          className="text-[13px] text-primary hover:underline"
        >
          ← Kembali ke Daftar Penilaian
        </Link>
      </div>

      <form action={kirimPenilaian} className="space-y-5">
        <input type="hidden" name="seminar_id" value={detail.seminar.id} />
        <input type="hidden" name="kp_id" value={detail.seminar.kp_id} />
        <input type="hidden" name="student_id" value={student.id} />

        {/* Student meta */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 text-[13px]">
            <div>
              <p className="text-[11px] text-ink-soft">Nama Mahasiswa</p>
              <p className="font-semibold">{student.name}</p>
            </div>
            <div>
              <p className="text-[11px] text-ink-soft">NIM</p>
              <p className="font-semibold">{student.nim ?? "-"}</p>
            </div>
            <div>
              <p className="text-[11px] text-ink-soft">Periode Semester</p>
              <p className="font-semibold">
                {student.semester ?? "-"} (Ganjil)
              </p>
            </div>
            <div className="md:col-span-3">
              <p className="text-[11px] text-ink-soft">Judul KP</p>
              <p className="font-semibold">{kp.judul}</p>
            </div>
          </div>
        </Card>

        {/* a. Penilaian */}
        <Card className="!p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-line">
            <h3 className="text-[14px] font-semibold">Penilaian</h3>
            <p className="text-[11px] text-ink-soft">
              Berikan skor dan feedback untuk setiap kriteria.
            </p>
          </div>
          <div className="grid grid-cols-[1fr_160px_1fr] bg-identity text-white text-[12px] font-semibold">
            <div className="py-3 px-4">Kriteria Penilaian</div>
            <div className="py-3 px-4">Skor Nilai</div>
            <div className="py-3 px-4">Feedback (Opsional)</div>
          </div>
          {CRITERIA.map((c) => {
            const defScore = (rec[`skor_${c.key}`] as number | null) ?? "";
            const defFb = (rec[`feedback_${c.key}`] as string | null) ?? "";
            return (
              <div
                key={c.key}
                className="grid grid-cols-[1fr_160px_1fr] bg-card border-t border-line"
              >
                <div className="py-4 px-4">
                  <p className="font-semibold text-[13px] mb-0.5">
                    <span className="mr-2">{c.icon}</span>
                    {c.label}
                  </p>
                  <p className="text-[11px] text-ink-soft leading-snug">
                    {c.description}
                  </p>
                </div>
                <div className="py-4 px-4">
                  <select
                    name={`skor_${c.key}`}
                    defaultValue={String(defScore)}
                    required
                    className="w-full h-9 px-2 rounded-md border border-line bg-card text-[13px]"
                  >
                    <option value="">Pilih Nilai</option>
                    {SKOR_OPTIONS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="py-4 px-4">
                  <textarea
                    name={`feedback_${c.key}`}
                    defaultValue={defFb}
                    placeholder="Berikan umpan balik kepada mahasiswa..."
                    className="w-full min-h-[64px] p-2 rounded-md border border-line bg-card text-[12px]"
                  />
                </div>
              </div>
            );
          })}
        </Card>

        {/* b. Sample Berkas (template untuk dosen) */}
        <Card>
          <h3 className="text-[14px] font-semibold pb-3 mb-3 border-b border-line">
            Unduh Berkas Sample
          </h3>
          <p className="text-[11px] text-ink-soft mb-3">
            Template & referensi untuk proses penilaian.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {SAMPLE_BERKAS.map((b) => (
              <li key={b.label}>
                <a
                  href={b.href}
                  aria-disabled="true"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md border border-line bg-surface hover:border-primary/40 text-[13px]"
                >
                  <span className="text-lg">📎</span>
                  <span className="text-primary hover:underline font-medium">
                    {b.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Card>

        {/* c. Upload Berkas Terisi — dosen uploads filled templates from section b */}
        <Card>
          <h3 className="text-[14px] font-semibold pb-3 mb-3 border-b border-line">
            Unggah Berkas Terisi
          </h3>
          <p className="text-[11px] text-ink-soft mb-3">
            Unggah berkas yang sudah diisi dan/atau ditandatangani dari
            template di atas.
          </p>
          <ul className="divide-y divide-line">
            {berkasSlots.map((s) => (
              <BerkasUploadRow
                key={s.doc_key}
                kpId={detail.seminar.kp_id}
                slot={s}
              />
            ))}
          </ul>
        </Card>

        {/* d. Comment */}
        <Card>
          <label className="block text-[14px] font-semibold pb-3 mb-3 border-b border-line">
            Tambahkan Komentar (Opsional)
          </label>
          <textarea
            name="komentar_tambahan"
            defaultValue={existing?.komentar_tambahan ?? ""}
            placeholder="Tulis komentar umum untuk mahasiswa..."
            className="w-full min-h-[100px] p-3 rounded-md border border-line bg-card text-[13px]"
          />
        </Card>

        {/* e. Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          {hasNilai && (
            <Link
              href={`/teacher/penilaian/${id}?ba=1`}
              className="inline-flex items-center justify-center h-11 px-6 rounded-md bg-secondary/30 hover:bg-secondary/50 text-ink text-[13px] font-semibold"
            >
              📄 Berita Acara
            </Link>
          )}
          <button
            type="submit"
            className="h-11 px-6 rounded-md text-white text-[14px] font-semibold"
            style={{
              background:
                "linear-gradient(135deg, #5BC0F0 0%, #1E88E5 100%)",
            }}
          >
            ▶ {hasNilai ? "Update Nilai" : "Kirim Nilai"}
          </button>
        </div>
      </form>

      {showBA && existing && (
        <BeritaAcaraModal
          student={{
            name: student.name,
            nim: student.nim,
            semester: student.semester,
          }}
          kp={{ judul: kp.judul }}
          tanggalSeminar={detail.seminar.tanggal_seminar}
          ruang={detail.seminar.ruang_seminar}
          pembimbingLapangan={detail.seminar.pembimbing_lapangan}
          nilaiAkhir={existing.nilai_akhir}
          dosenName={user.name}
          onBackHref={`/teacher/penilaian/${id}`}
        />
      )}
    </>
  );
}

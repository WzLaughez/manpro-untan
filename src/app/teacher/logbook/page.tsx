import Link from "next/link";
import DataTable from "@/components/DataTable";
import FlashToast from "@/components/FlashToast";
import { Card, PageTitle } from "@/components/ui";
import { getCurrentUser } from "@/lib/currentUser";
import {
  getLogbookDetailForTeacher,
  getTeacherLogbookList,
} from "@/lib/data/teacherLogbook";
import LogbookReviewModal from "./LogbookReviewModal";

function fmtDate(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const STATUS_BADGE: Record<string, string> = {
  diajukan: "bg-primary/15 text-primary",
  disetujui: "bg-success/15 text-success",
  revisi: "bg-alert/15 text-alert",
};

export default async function TeacherLogbookPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const user = await getCurrentUser();
  const items = await getTeacherLogbookList(user.id);

  const sp = await searchParams;
  const previewId = sp.preview ?? null;
  const raw = previewId ? await getLogbookDetailForTeacher(previewId) : null;

  // Guard: only this teacher's own students
  const preview =
    raw &&
    (raw.kp as unknown as { dosen_pembimbing_id: string })
      ?.dosen_pembimbing_id === user.id
      ? {
          id: raw.id,
          tanggal: raw.tanggal,
          aktivitas: raw.aktivitas,
          kendala: raw.kendala,
          hasil: raw.hasil,
          status: raw.status,
          file_name: raw.file_name,
          file_url: raw.file_url,
          catatan_dosen: raw.catatan_dosen,
          created_at: raw.created_at,
          student: raw.student as unknown as {
            name: string;
            nim: string | null;
          } | null,
          kp: raw.kp as unknown as { judul: string } | null,
        }
      : null;

  return (
    <>
      <FlashToast message="Tanggapan berhasil dikirim!" param="sent" />
      <PageTitle
        title="Logbook Mahasiswa"
        subtitle="Tinjau dan verifikasi logbook harian mahasiswa bimbingan Anda"
      />

      <Card>
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <h3 className="text-[14px] font-semibold">Daftar Logbook Masuk</h3>
          <div className="flex items-center gap-3">
            <input
              type="search"
              placeholder="🔍 Search"
              className="h-9 px-3 rounded-md border border-line bg-surface text-[12px] w-[220px]"
            />
            <input
              type="date"
              className="h-9 px-3 rounded-md border border-line bg-surface text-[12px]"
            />
          </div>
        </div>

        {items.length === 0 ? (
          <div className="py-12 text-center text-[13px] text-ink-soft">
            Belum ada logbook dari mahasiswa bimbingan Anda.
          </div>
        ) : (
          <DataTable
            columns={[
              { key: "no", label: "No" },
              { key: "nama", label: "Nama Mahasiswa" },
              { key: "tanggal", label: "Tanggal" },
              { key: "aktivitas", label: "Aktivitas", className: "max-w-[340px]" },
              { key: "status", label: "Status" },
              { key: "aksi", label: "Aksi" },
            ]}
            rows={items.map((l, i) => {
              const stu = l.student as unknown as { name: string } | null;
              const cls = STATUS_BADGE[l.status] ?? "bg-secondary/20 text-ink";
              return {
                no: i + 1,
                nama: stu?.name ?? "-",
                tanggal: fmtDate(l.tanggal),
                aktivitas: (
                  <p className="text-[12px] leading-snug line-clamp-3">
                    {l.aktivitas}
                  </p>
                ),
                status: (
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium ${cls}`}
                  >
                    {l.status}
                  </span>
                ),
                aksi: (
                  <Link
                    href={`/teacher/logbook?preview=${l.id}`}
                    className="text-primary hover:underline"
                  >
                    ✏️
                  </Link>
                ),
              };
            })}
          />
        )}
      </Card>

      {preview && <LogbookReviewModal item={preview} />}
    </>
  );
}

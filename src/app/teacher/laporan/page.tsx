import Link from "next/link";
import DataTable from "@/components/DataTable";
import FlashToast from "@/components/FlashToast";
import { Card, PageTitle } from "@/components/ui";
import { getCurrentUser } from "@/lib/currentUser";
import {
  getLaporanDetailForTeacher,
  getTeacherLaporanList,
} from "@/lib/data/teacherLaporan";
import LaporanReviewModal from "./LaporanReviewModal";

function fmtDate(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const STATUS_BADGE: Record<string, string> = {
  diajukan: "bg-primary/15 text-primary",
  diterima: "bg-success/15 text-success",
  revisi: "bg-alert/15 text-alert",
};

export default async function TeacherLaporanPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const user = await getCurrentUser();
  const items = await getTeacherLaporanList(user.id);

  const sp = await searchParams;
  const previewId = sp.preview ?? null;
  const raw = previewId ? await getLaporanDetailForTeacher(previewId) : null;

  // Guard: only this teacher's own students
  const preview =
    raw &&
    (raw.kp as unknown as { dosen_pembimbing_id: string })
      ?.dosen_pembimbing_id === user.id
      ? {
          id: raw.id,
          file_name: raw.file_name,
          file_url: raw.file_url,
          lampiran_name: raw.lampiran_name,
          lampiran_url: raw.lampiran_url,
          catatan_mahasiswa: raw.catatan_mahasiswa,
          catatan_dosen: raw.catatan_dosen,
          status: raw.status,
          updated_at: raw.updated_at,
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
        title="Laporan KP"
        subtitle="Periksa laporan dan beri masukan pada laporan mahasiswa"
      />

      <Card>
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <input
            type="search"
            placeholder="Cari Mahasiswa/NIM"
            className="h-9 px-3 rounded-md border border-line bg-surface text-[12px] w-[220px]"
          />
          <div className="flex items-center gap-3">
            <select className="h-9 px-3 rounded-md border border-line bg-surface text-[12px]">
              <option value="">Angkatan</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
            </select>
            <input
              type="date"
              className="h-9 px-3 rounded-md border border-line bg-surface text-[12px]"
            />
          </div>
        </div>

        {items.length === 0 ? (
          <div className="py-12 text-center text-[13px] text-ink-soft">
            Belum ada laporan dari mahasiswa bimbingan Anda.
          </div>
        ) : (
          <DataTable
            columns={[
              { key: "nama", label: "Nama Mahasiswa" },
              { key: "nim", label: "NIM" },
              { key: "tanggal", label: "Tanggal Upload" },
              { key: "status", label: "Status" },
              { key: "aksi", label: "Aksi" },
            ]}
            rows={items.map((l) => {
              const stu = l.student as unknown as {
                name: string;
                nim: string | null;
              } | null;
              const cls =
                STATUS_BADGE[l.status] ?? "bg-secondary/20 text-ink";
              return {
                nama: stu?.name ?? "-",
                nim: stu?.nim ?? "-",
                tanggal: fmtDate(l.updated_at ?? l.created_at),
                status: (
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium ${cls}`}
                  >
                    {l.status}
                  </span>
                ),
                aksi: (
                  <Link
                    href={`/teacher/laporan?preview=${l.id}`}
                    className="text-primary hover:underline"
                    title="Tinjau"
                  >
                    ✏️
                  </Link>
                ),
              };
            })}
          />
        )}
      </Card>

      {preview && <LaporanReviewModal item={preview} />}
    </>
  );
}

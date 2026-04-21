import Link from "next/link";
import DataTable from "@/components/DataTable";
import FlashToast from "@/components/FlashToast";
import { Card, PageTitle } from "@/components/ui";
import { getCurrentUser } from "@/lib/currentUser";
import {
  getTeacherSeminarDetail,
  getTeacherSeminarList,
} from "@/lib/data/teacherSeminar";
import ConfirmModal from "./ConfirmModal";
import DetailModal from "./DetailModal";
import RejectModal from "./RejectModal";
import SuccessModal from "./SuccessModal";

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
  disetujui: "bg-success/15 text-success",
  revisi: "bg-notification/15 text-notification",
  ditolak: "bg-alert/15 text-alert",
  selesai: "bg-success/15 text-success",
};

export default async function TeacherSeminarPage({
  searchParams,
}: {
  searchParams: Promise<{
    preview?: string;
    confirm?: string;
    reject?: string;
    confirmed?: string;
    rejected?: string;
  }>;
}) {
  const user = await getCurrentUser();
  const items = await getTeacherSeminarList(user.id);

  const sp = await searchParams;
  const previewId = sp.preview ?? null;
  const confirmId = sp.confirm ?? null;
  const rejectId = sp.reject ?? null;

  const activeId = previewId ?? confirmId ?? rejectId;
  const detail = activeId
    ? await getTeacherSeminarDetail(activeId)
    : null;

  // Guard: only this teacher's students
  const safeDetail =
    detail &&
    (detail.seminar.kp as unknown as { dosen_pembimbing_id: string })
      ?.dosen_pembimbing_id === user.id
      ? detail
      : null;

  return (
    <>
      <FlashToast message="Jadwal Seminar Dikonfirmasi!" param="confirmed" />
      <FlashToast message="Usulan jadwal baru terkirim" param="rejected" />

      <PageTitle
        title="Jadwal Seminar KP"
        subtitle="Tinjau dan konfirmasi pengajuan jadwal seminar"
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
              <option>2020</option>
              <option>2021</option>
              <option>2022</option>
            </select>
            <input
              type="date"
              className="h-9 px-3 rounded-md border border-line bg-surface text-[12px]"
            />
          </div>
        </div>

        {items.length === 0 ? (
          <div className="py-12 text-center text-[13px] text-ink-soft">
            Belum ada pengajuan seminar dari mahasiswa bimbingan Anda.
          </div>
        ) : (
          <DataTable
            columns={[
              { key: "nama", label: "Nama Mahasiswa" },
              { key: "nim", label: "NIM" },
              { key: "tanggal", label: "Tanggal Pengajuan" },
              { key: "status", label: "Status" },
              { key: "aksi", label: "Aksi" },
            ]}
            rows={items.map((s) => {
              const stu = s.student as unknown as {
                name: string;
                nim: string | null;
              } | null;
              const cls =
                STATUS_BADGE[s.status] ?? "bg-secondary/20 text-ink";
              return {
                nama: stu?.name ?? "-",
                nim: stu?.nim ?? "-",
                tanggal: fmtDate(s.tanggal_pengajuan ?? s.created_at),
                status: (
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium ${cls}`}
                  >
                    {s.status}
                  </span>
                ),
                aksi: (
                  <Link
                    href={`/teacher/seminar?preview=${s.id}`}
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

      {/* Frame 351 — Detail modal */}
      {previewId && safeDetail && (
        <DetailModal
          seminar={{
            id: safeDetail.seminar.id,
            tanggal_pengajuan: safeDetail.seminar.tanggal_pengajuan,
            tanggal_seminar: safeDetail.seminar.tanggal_seminar,
            waktu_mulai: safeDetail.seminar.waktu_mulai,
            waktu_selesai: safeDetail.seminar.waktu_selesai,
            lokasi: safeDetail.seminar.lokasi,
            ruang_seminar: safeDetail.seminar.ruang_seminar,
            pembimbing_lapangan: safeDetail.seminar.pembimbing_lapangan,
            status: safeDetail.seminar.status,
            student: safeDetail.seminar.student as unknown as {
              name: string;
              nim: string | null;
            } | null,
            kp: safeDetail.seminar.kp as unknown as {
              judul: string;
              dosen_pa: string | null;
            } | null,
          }}
          documents={safeDetail.documents.map((d) => ({
            doc_key: d.doc_key,
            label: d.label,
            file_name: d.file_name,
            file_url: d.file_url,
          }))}
        />
      )}

      {/* Frame 408 — Confirm modal */}
      {confirmId && safeDetail && (
        <ConfirmModal
          id={safeDetail.seminar.id}
          tanggal={fmtDate(
            safeDetail.seminar.tanggal_seminar ?? safeDetail.seminar.tanggal_pengajuan,
          )}
          pukul="09.00 - 11.00 WIB"
          lokasi={
            safeDetail.seminar.ruang_seminar ??
            safeDetail.seminar.lokasi ??
            "Ruang Sidang Utama Informatika"
          }
        />
      )}

      {/* Frame 340 — Reject modal */}
      {rejectId && safeDetail && <RejectModal id={safeDetail.seminar.id} />}

      {/* Frame 409 — Success modal after approval */}
      {sp.confirmed === "1" && <SuccessModal />}
    </>
  );
}

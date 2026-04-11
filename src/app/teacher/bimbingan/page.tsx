import Link from "next/link";
import DataTable from "@/components/DataTable";
import FlashToast from "@/components/FlashToast";
import { Card, PageTitle } from "@/components/ui";
import { getCurrentUser } from "@/lib/currentUser";
import { getTeacherBimbinganList } from "@/lib/data/teacherBimbingan";

function fmtDate(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function TeacherBimbinganPage() {
  const user = await getCurrentUser();
  const items = await getTeacherBimbinganList(user.id);

  return (
    <>
      <FlashToast message="Tanggapan berhasil dikirim!" param="sent" />
      <PageTitle
        title="Bimbingan"
        subtitle="Tinjau Progres dan Kelola Semua Mahasiswa Bimbingan Anda"
      />

      <Card>
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <h3 className="text-[14px] font-semibold">
            Daftar Mahasiswa Bimbingan Anda
          </h3>
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
            Belum ada bimbingan dari mahasiswa.
          </div>
        ) : (
          <DataTable
            columns={[
              { key: "no", label: "No" },
              { key: "nama", label: "Nama Mahasiswa" },
              { key: "judul", label: "Judul KP" },
              { key: "tanggal", label: "Tanggal Bimbingan" },
              { key: "aksi", label: "Aksi" },
            ]}
            rows={items.map((b, i) => {
              const stu = b.student as unknown as { name: string } | null;
              const kp = b.kp as unknown as { judul: string } | null;
              return {
                no: i + 1,
                nama: stu?.name ?? "-",
                judul: kp?.judul ?? "-",
                tanggal: fmtDate(b.tanggal),
                aksi: (
                  <Link
                    href={`/teacher/bimbingan/${b.id}`}
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
    </>
  );
}

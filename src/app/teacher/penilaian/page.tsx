import Link from "next/link";
import DataTable from "@/components/DataTable";
import FlashToast from "@/components/FlashToast";
import { Card, PageTitle } from "@/components/ui";
import { getCurrentUser } from "@/lib/currentUser";
import { getTeacherPenilaianList } from "@/lib/data/penilaian";

function fmtDate(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function TeacherPenilaianPage() {
  const user = await getCurrentUser();
  const items = await getTeacherPenilaianList(user.id);

  return (
    <>
      <FlashToast message="Nilai berhasil dikirim!" param="submitted" />
      <PageTitle
        title="Penilaian Dosen"
        subtitle="Lakukan Penilaian terhadap Mahasiswa Anda yang telah melaksanakan Seminar Kerja Praktik"
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
            Belum ada mahasiswa yang menyelesaikan seminar.
          </div>
        ) : (
          <DataTable
            columns={[
              { key: "nama", label: "Nama Mahasiswa" },
              { key: "nim", label: "NIM" },
              { key: "tanggal", label: "Tanggal Seminar" },
              { key: "nilai", label: "Nilai Akhir" },
              { key: "aksi", label: "Aksi" },
            ]}
            rows={items.map((s) => {
              const stu = s.student as unknown as {
                name: string;
                nim: string | null;
              } | null;
              return {
                nama: stu?.name ?? "-",
                nim: stu?.nim ?? "-",
                tanggal: fmtDate(s.tanggal_seminar),
                nilai: s.penilaian?.nilai_akhir ? (
                  <span className="font-semibold text-success">
                    {s.penilaian.nilai_akhir}
                  </span>
                ) : (
                  <span className="text-ink-soft">Belum dinilai</span>
                ),
                aksi: (
                  <Link
                    href={`/teacher/penilaian/${s.id}`}
                    className="text-primary hover:underline"
                    title={s.penilaian ? "Edit Nilai" : "Input Nilai"}
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

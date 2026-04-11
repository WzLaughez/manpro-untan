import Link from "next/link";
import { Card, PageTitle } from "@/components/ui";
import DataTable from "@/components/DataTable";
import { getAllPendingProposals } from "@/lib/data/teacher";

function fmtDate(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function VerifikasiListPage() {
  const pending = await getAllPendingProposals();

  return (
    <>
      <PageTitle
        title="Verifikasi Proposal"
        subtitle="Lakukan verifikasi proposal dari mahasiswa bimbingan Anda"
      />

      <Card>
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <h3 className="text-[14px] font-semibold">
            Daftar Proposal Menunggu Verifikasi
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

        {pending.length === 0 ? (
          <div className="py-12 text-center text-[13px] text-ink-soft">
            Tidak ada proposal yang menunggu verifikasi.
          </div>
        ) : (
          <DataTable
            columns={[
              { key: "no", label: "No" },
              { key: "nama", label: "Nama Mahasiswa" },
              { key: "judul", label: "Judul KP", className: "max-w-[320px]" },
              { key: "tanggal", label: "Tanggal Pengajuan" },
              { key: "aksi", label: "Aksi" },
            ]}
            rows={pending.map((kp, i) => ({
              no: i + 1,
              nama: kp.student?.name ?? "-",
              judul: kp.judul,
              tanggal: fmtDate(kp.tanggal_pengajuan ?? kp.created_at),
              aksi: (
                <Link
                  href={`/teacher/verifikasi/${kp.id}`}
                  className="text-primary hover:underline"
                  title="Verifikasi"
                >
                  ✏️
                </Link>
              ),
            }))}
          />
        )}
      </Card>
    </>
  );
}

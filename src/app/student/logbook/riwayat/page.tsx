import DataTable from "@/components/DataTable";
import FlashToast from "@/components/FlashToast";
import { Card, PageTitle } from "@/components/ui";
import { getCurrentUser } from "@/lib/currentUser";
import { getLogbookByStudent } from "@/lib/data/logbook";
import EditLogbookModal from "./EditLogbookModal";

function fmtDate(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function RiwayatLogbookPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const user = await getCurrentUser();
  const items = await getLogbookByStudent(user.id);

  const sp = await searchParams;
  const editId = sp.edit ?? null;
  const editItem = editId ? items.find((l) => l.id === editId) : null;

  return (
    <>
      <FlashToast message="Logbook berhasil disimpan!" param="updated" />
      <FlashToast message="Logbook berhasil dikirim!" param="submitted" />
      <PageTitle
        title="Riwayat Logbook"
        subtitle="Lihat dan kelola riwayat logbook yang telah kamu isi selama kerja praktik."
      />

      <Card>
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <h3 className="text-[14px] font-semibold">Daftar Riwayat Logbook</h3>
          <input
            type="date"
            className="h-9 px-3 rounded-md border border-line bg-surface text-[12px]"
          />
        </div>

        {items.length === 0 ? (
          <div className="py-12 text-center text-[13px] text-ink-soft">
            Belum ada logbook.
          </div>
        ) : (
          <DataTable
            columns={[
              { key: "no", label: "No" },
              { key: "tanggal", label: "Tanggal" },
              { key: "kegiatan", label: "Kegiatan", className: "max-w-[380px]" },
              { key: "aksi", label: "Aksi" },
            ]}
            rows={items.map((l, i) => ({
              no: i + 1,
              tanggal: fmtDate(l.tanggal),
              kegiatan: (
                <p className="text-[12px] leading-snug line-clamp-3">
                  {l.aktivitas}
                </p>
              ),
              aksi: (
                <a
                  href={`/student/logbook/riwayat?edit=${l.id}`}
                  className="text-primary hover:underline"
                >
                  ✏️
                </a>
              ),
            }))}
          />
        )}
      </Card>

      {editItem && <EditLogbookModal item={editItem} />}
    </>
  );
}

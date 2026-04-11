import FlashToast from "@/components/FlashToast";
import { Card, PageTitle } from "@/components/ui";
import DataTable from "@/components/DataTable";
import { getCurrentUser } from "@/lib/currentUser";
import { getBimbinganStats } from "@/lib/data/bimbingan";
import EditModal from "./EditModal";
import StatusPengajuan from "./StatusPengajuan";

function fmtDate(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function RiwayatBimbinganPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const user = await getCurrentUser();
  const { total, disetujui, revisi, items } = await getBimbinganStats(user.id);
  const sp = await searchParams;
  const editId = sp.edit ?? null;
  const editItem = editId ? items.find((b) => b.id === editId) : null;

  return (
    <>
      <FlashToast message="Bimbingan berhasil diperbarui!" param="updated" />
      <PageTitle
        title="Riwayat Bimbingan"
        subtitle="Lihat semua riwayat bimbingan Anda"
      />

      <Card>
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <h3 className="text-[14px] font-semibold">Daftar Pengajuan</h3>
          <input
            type="date"
            className="h-9 px-3 rounded-md border border-line bg-surface text-[12px]"
          />
        </div>

        {items.length === 0 ? (
          <div className="py-12 text-center text-[13px] text-ink-soft">
            Belum ada riwayat bimbingan.
          </div>
        ) : (
          <DataTable
            columns={[
              { key: "no", label: "No" },
              { key: "tanggal", label: "Tanggal" },
              { key: "jenis", label: "Jenis Bimbingan" },
              { key: "aksi", label: "Aksi" },
            ]}
            rows={items.map((b, i) => ({
              no: i + 1,
              tanggal: fmtDate(b.tanggal),
              jenis: b.jenis,
              aksi: (
                <a
                  href={`/student/bimbingan/riwayat?edit=${b.id}`}
                  className="text-primary hover:underline"
                >
                  ✏️
                </a>
              ),
            }))}
          />
        )}
      </Card>

      {/* Status Pengajuan — expandable, same data as status page */}
      <StatusPengajuan
        total={total}
        disetujui={disetujui}
        revisi={revisi}
        items={items.filter((b) => !!b.catatan_dosen).map((b) => ({
          id: b.id,
          jenis: b.jenis,
          tanggal: b.tanggal,
          status: b.status,
          catatan_dosen: b.catatan_dosen!,
        }))}
      />

      {/* Edit modal */}
      {editItem && <EditModal item={editItem} />}
    </>
  );
}

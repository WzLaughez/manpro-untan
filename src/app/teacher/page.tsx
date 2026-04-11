import Link from "next/link";
import { Card, PageTitle } from "@/components/ui";
import DataTable from "@/components/DataTable";
import { getCurrentUser } from "@/lib/currentUser";
import { getTeacherDashboard } from "@/lib/data/teacher";

function StatCard({
  icon,
  iconBg,
  iconColor,
  value,
  label,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  value: number;
  label: string;
}) {
  return (
    <Card className="flex flex-col items-center text-center">
      <div
        className={`size-12 rounded-lg grid place-items-center text-2xl mb-2 ${iconBg}`}
        style={{ color: iconColor }}
      >
        {icon}
      </div>
      <div className="text-[36px] font-bold text-ink leading-none mb-2">
        {value}
      </div>
      <div className="text-[12px] text-ink-soft">{label}</div>
    </Card>
  );
}

function ActionCard({
  title,
  description,
  cta,
  href,
  enabled,
  emptyMessage,
}: {
  title: string;
  description: string;
  cta: string;
  href: string;
  enabled: boolean;
  emptyMessage?: string;
}) {
  return (
    <Card>
      <h3 className="text-[14px] font-semibold mb-1">{title}</h3>
      <p className="text-[12px] text-ink-soft mb-4 leading-relaxed">
        {description}
      </p>
      {enabled ? (
        <Link
          href={href}
          className="grid w-full h-10 rounded-md text-white text-[13px] font-semibold place-items-center"
          style={{
            background: "linear-gradient(135deg, #5BC0F0 0%, #1E88E5 100%)",
          }}
        >
          {cta}
        </Link>
      ) : emptyMessage ? (
        <div className="rounded-md bg-surface border border-line px-3 py-2.5 text-[11px] text-ink-soft leading-snug">
          <span className="font-semibold text-ink">Belum ada data.</span>{" "}
          {emptyMessage}
        </div>
      ) : (
        <button
          disabled
          className="w-full h-10 rounded-md bg-secondary/40 text-white/70 text-[13px] font-medium cursor-not-allowed"
        >
          {cta}
        </button>
      )}
    </Card>
  );
}

function fmtDate(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function TeacherDashboard() {
  const user = await getCurrentUser();
  const { kps, stats } = await getTeacherDashboard(user.id);
  const hasBimbingan = kps.length > 0;

  return (
    <>
      <PageTitle title={`Hai, ${user.name}`} subtitle="Dashboard" />

      {/* 4 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        <StatCard
          icon="📄"
          iconBg="bg-primary/10"
          iconColor="#1E88E5"
          value={stats.proposalsBelumVerif}
          label="Proposal Belum Diverifikasi"
        />
        <StatCard
          icon="👥"
          iconBg="bg-alert/10"
          iconColor="#E53935"
          value={stats.mahasiswaBimbingan}
          label="Mahasiswa Bimbingan"
        />
        <StatCard
          icon="✅"
          iconBg="bg-notification/10"
          iconColor="#FF9800"
          value={stats.logbookMasuk}
          label="Jumlah Logbook Masuk"
        />
        <StatCard
          icon="📈"
          iconBg="bg-primary/10"
          iconColor="#1E88E5"
          value={stats.mahasiswaBelumDinilai}
          label="Mahasiswa Belum Dinilai"
        />
      </div>

      {/* 3 action cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        <ActionCard
          title="Verifikasi Proposal KP"
          description="Tinjau dan verifikasi proposal yang diajukan oleh mahasiswa."
          cta="Verifikasi Proposal"
          href="/teacher/verifikasi"
          enabled={stats.proposalsBelumVerif > 0}
        />
        <ActionCard
          title="Logbook Mahasiswa"
          description="Periksa dan berikan feedback pada catatan harian mahasiswa"
          cta="Lihat Logbook"
          href="/teacher/logbook"
          enabled={stats.logbookMasuk > 0}
          emptyMessage="Logbook akan muncul otomatis setelah mahasiswa bimbingan mengajukan"
        />
        <ActionCard
          title="Penilaian KP"
          description="Segera lakukan input penilaian hasil KP Mahasiswa anda"
          cta="Input Nilai"
          href="/teacher/scoring"
          enabled={stats.mahasiswaBelumDinilai > 0}
          emptyMessage="Penilaian dapat dilakukan setelah seminar dan berkas dinyatakan lengkap."
        />
      </div>

      {/* Bimbingan table — only when teacher has at least one student */}
      {hasBimbingan && (
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
          <DataTable
            columns={[
              { key: "no", label: "No" },
              { key: "nama", label: "Nama Mahasiswa" },
              { key: "judul", label: "Judul KP", className: "max-w-[280px]" },
              { key: "tanggal", label: "Tanggal Pengajuan" },
              { key: "aksi", label: "Aksi" },
            ]}
            rows={kps.map((kp, i) => ({
              no: i + 1,
              nama: kp.student?.name ?? "-",
              judul: kp.judul,
              tanggal: fmtDate(kp.tanggal_pengajuan ?? kp.created_at),
              aksi: (
                <Link
                  href={`/teacher/verifikasi/${kp.id}`}
                  className="text-primary hover:underline"
                  title="Lihat detail"
                >
                  ✏️
                </Link>
              ),
            }))}
          />
        </Card>
      )}
    </>
  );
}

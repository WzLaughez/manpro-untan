import { Card, PageTitle } from "@/components/ui";
import { getCurrentUser } from "@/lib/currentUser";
import { getLogbookStats } from "@/lib/data/logbook";

const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const DAYS_ID = ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu", "Minggu"];

type DayStatus = "none" | "diajukan" | "disetujui" | "revisi";

function statusColor(s: DayStatus) {
  if (s === "disetujui")
    return "bg-gradient-to-br from-[#56E8A0] to-[#1AAF6B] text-white";
  if (s === "revisi")
    return "bg-gradient-to-br from-[#F87171] to-[#DC2626] text-white";
  if (s === "diajukan")
    return "bg-gradient-to-br from-[#5BC0F0] to-[#1E88E5] text-white";
  return "bg-surface text-ink-soft";
}

export default async function StatusVerifikasiLogbookPage() {
  const user = await getCurrentUser();
  const { total, disetujui, revisi, items } = await getLogbookStats(user.id);

  // Build a map: dateString → worst status (prioritize revisi > diajukan > disetujui)
  const priority: Record<string, number> = {
    revisi: 3,
    diajukan: 2,
    draft: 1,
    disetujui: 0,
  };
  const dayStatus: Record<string, DayStatus> = {};
  for (const l of items) {
    const current = dayStatus[l.tanggal] ?? "none";
    const curRank = current === "none" ? -1 : (priority[current] ?? -1);
    const newRank = priority[l.status] ?? -1;
    if (newRank >= curRank) {
      dayStatus[l.tanggal] = l.status as DayStatus;
    }
  }

  // Current month calendar (Senin-Minggu)
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthName = MONTHS_ID[month];

  // First day of month, shift so Monday = 0
  const firstDayRaw = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon,..
  const firstDayMon = (firstDayRaw + 6) % 7; // Monday-first: Mon=0, Tue=1, .., Sun=6
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  type Cell = { day: number; iso: string; muted: boolean };
  const cells: Cell[] = [];

  // Leading days from previous month
  for (let i = firstDayMon - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const prev = new Date(year, month - 1, d);
    cells.push({
      day: d,
      iso: prev.toISOString().split("T")[0],
      muted: true,
    });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, month, d);
    cells.push({
      day: d,
      iso: dt.toISOString().split("T")[0],
      muted: false,
    });
  }
  // Trailing to complete the grid (6 rows × 7 = 42 max, or fewer)
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    const nxt = new Date(year, month + 1, nextDay++);
    cells.push({
      day: nxt.getDate(),
      iso: nxt.toISOString().split("T")[0],
      muted: true,
    });
  }

  return (
    <>
      <PageTitle
        title="Status Verifikasi Logbook"
        subtitle="Periksa status persetujuan logbook dan tindak lanjut dari dosen pembimbing."
      />

      {/* 3 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
        <div
          className="rounded-2xl p-5 text-white text-center"
          style={{
            background: "linear-gradient(135deg, #5BC0F0 0%, #1E88E5 100%)",
          }}
        >
          <div className="text-[12px] opacity-90 mb-1">Total diisi</div>
          <div className="text-[36px] font-bold leading-none">{total}</div>
          <div className="text-[11px] opacity-80 mt-1">Hari</div>
        </div>
        <div
          className="rounded-2xl p-5 text-white text-center"
          style={{
            background: "linear-gradient(135deg, #56E8A0 0%, #1AAF6B 100%)",
          }}
        >
          <div className="text-[12px] opacity-90 mb-1">Disetujui Dosen</div>
          <div className="text-[36px] font-bold leading-none">{disetujui}</div>
          <div className="text-[11px] opacity-80 mt-1">Hari</div>
        </div>
        <div
          className="rounded-2xl p-5 text-white text-center"
          style={{
            background: "linear-gradient(135deg, #F87171 0%, #DC2626 100%)",
          }}
        >
          <div className="text-[12px] opacity-90 mb-1">Revisi</div>
          <div className="text-[36px] font-bold leading-none">{revisi}</div>
          <div className="text-[11px] opacity-80 mt-1">Hari</div>
        </div>
      </div>

      {/* Progres calendar */}
      <Card>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-line">
          <h3 className="text-[14px] font-semibold">
            Progres {monthName} {year}
          </h3>
          <div className="flex items-center gap-4 text-[11px] text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-primary" />
              Total diisi
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-success" />
              Disetujui
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-alert" />
              Revisi
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-[12px]">
          {DAYS_ID.map((d) => (
            <div
              key={d}
              className="text-center py-2 text-[11px] font-medium text-ink-soft"
            >
              {d}
            </div>
          ))}
          {cells.map((c, i) => {
            const status: DayStatus = c.muted
              ? "none"
              : dayStatus[c.iso] ?? "none";
            return (
              <div
                key={i}
                className={`h-14 rounded-md border border-line/40 p-1.5 text-right font-medium ${statusColor(
                  status,
                )} ${c.muted ? "opacity-40" : ""}`}
              >
                {c.day}
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

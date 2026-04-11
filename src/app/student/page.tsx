import { Card, PageTitle } from "@/components/ui";
import { getCurrentUser } from "@/lib/currentUser";
import { getKPByStudent } from "@/lib/data/kp";

const MONTHS = [
  "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI",
  "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER",
];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function MockCalendar() {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const first = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: { day: number; muted: boolean }[] = [];
  for (let i = first - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, muted: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, muted: false });
  }
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: nextDay++, muted: true });
  }

  return (
    <Card className="!p-0 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-[16px] font-semibold tracking-wide">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex gap-2 text-ink-soft">
          <button aria-label="Prev" className="size-7 grid place-items-center rounded hover:bg-surface">‹</button>
          <button aria-label="Next" className="size-7 grid place-items-center rounded hover:bg-surface">›</button>
        </div>
      </div>
      <div className="grid grid-cols-7 px-2 pb-4">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[12px] text-ink-soft py-2 font-medium">
            {d}
          </div>
        ))}
        {cells.map((c, i) => (
          <div
            key={i}
            className={`h-14 border border-line/60 text-right p-1.5 text-[12px] ${
              c.muted ? "text-ink-soft/40" : "text-ink"
            }`}
          >
            {c.day}
          </div>
        ))}
      </div>
    </Card>
  );
}

export default async function StudentDashboard() {
  const user = await getCurrentUser();
  const kp = await getKPByStudent(user.id);
  const isApproved =
    !!kp &&
    ["disetujui", "berjalan", "selesai"].includes(kp.status);
  const isPending =
    !!kp && ["diajukan", "verifikasi", "revisi"].includes(kp.status);

  return (
    <>
      <PageTitle title={`Hai, ${user.name}`} subtitle="Dashboard" />

      {isApproved ? (
        <div
          className="rounded-xl p-5 text-white shadow-sm mb-6"
          style={{
            background:
              "linear-gradient(135deg, #56E8A0 0%, #2DC781 55%, #1AAF6B 100%)",
          }}
        >
          <p className="text-[15px] font-semibold">Proposal Kamu Disetujui</p>
          <p className="text-[13px] opacity-95">
            Lakukan Bimbingan dengan Dosen Pembimbing
          </p>
          <p className="text-[11px] opacity-80 mt-1">
            Disetujui pada:{" "}
            {kp.updated_at
              ? new Date(kp.updated_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "-"}
          </p>
        </div>
      ) : isPending ? (
        <div className="rounded-xl p-5 text-white bg-gradient-to-r from-notification to-[#ffb84d] shadow-sm mb-6">
          <p className="text-[15px] font-semibold">Peninjauan Proposal</p>
          <p className="text-[13px] opacity-95">
            Proposal kamu sedang ditinjau oleh Dosen Pembimbing
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Blue CTA card */}
          <div
            className="rounded-2xl p-6 text-white shadow-sm min-h-[120px] flex flex-col justify-between"
            style={{
              background:
                "linear-gradient(135deg, #5BC0F0 0%, #2E9CE5 55%, #1E88E5 100%)",
            }}
          >
            <p className="text-[14px] leading-snug">
              Lakukan Pendaftaran Kerja Praktikmu Sekarang
            </p>
            <a
              href="/student/pendaftaran/form"
              className="inline-flex items-center justify-center self-start h-10 px-5 rounded-lg bg-white text-primary text-[13px] font-semibold shadow-sm hover:shadow-md transition-shadow"
            >
              Daftar Sekarang
            </a>
          </div>

          {/* Orange status card */}
          <div
            className="rounded-2xl p-6 text-white shadow-sm min-h-[120px] flex flex-col justify-center"
            style={{
              background:
                "linear-gradient(135deg, #FFB366 0%, #FF8C2E 55%, #F57C1A 100%)",
            }}
          >
            <p className="text-[16px] font-semibold mb-1">Belum ada progres</p>
            <p className="text-[13px] opacity-95 leading-snug">
              Saat ini kamu belum melakukan tahapan apapun pada KP
            </p>
          </div>
        </div>
      )}

      <MockCalendar />
    </>
  );
}

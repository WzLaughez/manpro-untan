import { logout } from "@/lib/actions/auth";
import { getMahasiswaBelumDinilaiCount } from "@/lib/data/penilaian";
import { getPendingLaporanCount } from "@/lib/data/teacherLaporan";
import { getPendingSeminarCount } from "@/lib/data/teacherSeminar";
import NotificationBell from "./NotificationBell";
import RoleSwitcher from "./RoleSwitcher";

type Props = {
  user: { id: string; name: string; role: string };
};

export default async function Header({ user }: Props) {
  // Teacher-only: pending reviews
  const [laporanCount, seminarCount, penilaianCount] =
    user.role === "teacher"
      ? await Promise.all([
          getPendingLaporanCount(user.id),
          getPendingSeminarCount(user.id),
          getMahasiswaBelumDinilaiCount(user.id),
        ])
      : [0, 0, 0];

  const items: {
    title: string;
    description: string;
    href: string;
  }[] = [];
  if (laporanCount > 0) {
    items.push({
      title: "Laporan Baru Diajukan!",
      description: `Kamu memiliki ${laporanCount} laporan yang menunggu verifikasi.`,
      href: "/teacher/laporan",
    });
  }
  if (seminarCount > 0) {
    items.push({
      title: "Pengajuan Seminar Baru!",
      description: `Kamu memiliki ${seminarCount} pengajuan seminar yang menunggu konfirmasi.`,
      href: "/teacher/seminar",
    });
  }
  if (penilaianCount > 0) {
    items.push({
      title: "Lakukan Penilaian!",
      description: `Segera lakukan input penilaian hasil KP Mahasiswa Anda!`,
      href: "/teacher/penilaian",
    });
  }
  const totalCount = laporanCount + seminarCount + penilaianCount;

  return (
    <header className="h-16 bg-card border-b border-line flex items-center justify-end gap-4 px-6">
      <RoleSwitcher currentId={user.id} />
      <NotificationBell count={totalCount} items={items} />
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-full bg-surface grid place-items-center">
          👤
        </div>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold">{user.name}</div>
          <div className="text-[11px] text-ink-soft capitalize">{user.role}</div>
        </div>
      </div>
      <form action={logout}>
        <button
          type="submit"
          className="h-8 px-3 rounded-md text-[12px] text-ink-soft hover:text-alert hover:bg-alert/5 transition-colors"
        >
          Logout
        </button>
      </form>
    </header>
  );
}

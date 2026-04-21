import DashboardShell from "@/components/DashboardShell";
import type { NavItem } from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/currentUser";

const nav: NavItem[] = [
  { href: "/teacher", label: "Dashboard", icon: "🏠" },
  { href: "/teacher/verifikasi", label: "Verifikasi Proposal", icon: "📝" },
  { href: "/teacher/logbook", label: "Logbook", icon: "📒" },
  { href: "/teacher/bimbingan", label: "Bimbingan", icon: "💬" },
  { href: "/teacher/laporan", label: "Laporan Akhir", icon: "📄" },
  { href: "/teacher/seminar", label: "Seminar", icon: "🎤" },
  { href: "/teacher/penilaian", label: "Penilaian", icon: "📊" },
  { href: "/teacher/bantuan", label: "Bantuan & Panduan", icon: "❓" },
];

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <DashboardShell user={user} brand="MANPRO UNTAN" nav={nav}>
      {children}
    </DashboardShell>
  );
}

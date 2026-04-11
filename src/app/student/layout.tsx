import DashboardShell from "@/components/DashboardShell";
import type { NavItem } from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/currentUser";

const nav: NavItem[] = [
  { href: "/student", label: "Dashboard", icon: "🏠" },
  {
    href: "/student/pendaftaran",
    label: "Pendaftaran KP",
    icon: "📝",
    children: [
      { href: "/student/pendaftaran/form", label: "Form Pendaftaran" },
      { href: "/student/pendaftaran/upload", label: "Upload Dokumen" },
      { href: "/student/pendaftaran/status", label: "Status Verifikasi" },
    ],
  },
  { href: "/student/logbook", label: "Logbook", icon: "📒" },
  {
    href: "/student/bimbingan",
    label: "Bimbingan",
    icon: "💬",
    children: [
      { href: "/student/bimbingan/ajukan", label: "Ajukan Bimbingan" },
      { href: "/student/bimbingan/riwayat", label: "Riwayat" },
      { href: "/student/bimbingan/status", label: "Status Verifikasi" },
    ],
  },
  { href: "/student/laporan", label: "Laporan Akhir", icon: "📄" },
  { href: "/student/seminar", label: "Seminar", icon: "🎤" },
  { href: "/student/status", label: "Status & Nilai", icon: "📊" },
  { href: "/student/bantuan", label: "Bantuan & Panduan", icon: "❓" },
];

export default async function StudentLayout({
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

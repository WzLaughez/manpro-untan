import { supabaseAdmin } from "@/lib/supabase";
import { getMahasiswaBelumDinilaiCount } from "./penilaian";
import { getPendingLaporanCount } from "./teacherLaporan";
import { getPendingSeminarCount } from "./teacherSeminar";

export type TeacherNotification = {
  key: "proposal" | "logbook" | "laporan" | "seminar" | "penilaian";
  count: number;
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  buttonBg: string;
};

async function getPendingProposalCount(teacherId: string) {
  // Global pool — any teacher can pick up.
  // Count matches what /teacher/verifikasi shows.
  const { count } = await supabaseAdmin
    .from("kp_registrations")
    .select("id", { count: "exact", head: true })
    .in("status", ["diajukan", "verifikasi"]);
  // teacherId is accepted for symmetry; returned count is not scoped.
  void teacherId;
  return count ?? 0;
}

async function getPendingLogbookCount(teacherId: string) {
  const { data: kps } = await supabaseAdmin
    .from("kp_registrations")
    .select("id")
    .eq("dosen_pembimbing_id", teacherId);
  if (!kps || kps.length === 0) return 0;
  const kpIds = kps.map((k) => k.id);

  const { count } = await supabaseAdmin
    .from("logbook")
    .select("id", { count: "exact", head: true })
    .in("kp_id", kpIds)
    .eq("status", "diajukan");
  return count ?? 0;
}

const BLUE = "linear-gradient(135deg, #5BC0F0 0%, #1E88E5 100%)";
const ORANGE = "linear-gradient(135deg, #FFB366 0%, #F57C1A 100%)";

export async function getTeacherNotifications(
  teacherId: string,
): Promise<TeacherNotification[]> {
  const [proposal, logbook, laporan, seminar, penilaian] = await Promise.all([
    getPendingProposalCount(teacherId),
    getPendingLogbookCount(teacherId),
    getPendingLaporanCount(teacherId),
    getPendingSeminarCount(teacherId),
    getMahasiswaBelumDinilaiCount(teacherId),
  ]);

  const all: TeacherNotification[] = [
    {
      key: "proposal",
      count: proposal,
      title: "Proposal Baru Telah Diajukan!",
      description: "Silakan lakukan review atau verifikasi secepatnya.",
      cta: "Verifikasi Proposal",
      href: "/teacher/verifikasi",
      icon: "📄",
      iconBg: "bg-primary/10",
      iconColor: "#1E88E5",
      buttonBg: BLUE,
    },
    {
      key: "logbook",
      count: logbook,
      title: "Logbook Baru Diajukan",
      description: "Silakan lakukan review atau verifikasi secepatnya.",
      cta: "Lihat Logbook",
      href: "/teacher/logbook",
      icon: "📒",
      iconBg: "bg-notification/10",
      iconColor: "#F57C1A",
      buttonBg: ORANGE,
    },
    {
      key: "seminar",
      count: seminar,
      title: "Pengajuan Jadwal Seminar",
      description: "Mohon segera tinjau dan berikan persetujuan Anda.",
      cta: "Lihat Detail",
      href: "/teacher/seminar",
      icon: "🎤",
      iconBg: "bg-primary/10",
      iconColor: "#1E88E5",
      buttonBg: BLUE,
    },
    {
      key: "laporan",
      count: laporan,
      title: "Laporan Baru Diajukan",
      description: "Silakan lakukan review atau verifikasi secepatnya.",
      cta: "Lihat Laporan",
      href: "/teacher/laporan",
      icon: "📧",
      iconBg: "bg-primary/10",
      iconColor: "#1E88E5",
      buttonBg: BLUE,
    },
    {
      key: "penilaian",
      count: penilaian,
      title: "Lakukan Penilaian!",
      description: "Segera lakukan input penilaian hasil KP Mahasiswa Anda!",
      cta: "Lihat Detail",
      href: "/teacher/penilaian",
      icon: "📈",
      iconBg: "bg-primary/10",
      iconColor: "#1E88E5",
      buttonBg: BLUE,
    },
  ];

  return all.filter((n) => n.count > 0);
}

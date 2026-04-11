import type {
  Bimbingan,
  KPRegistration,
  LaporanAkhir,
  LogbookEntry,
  Score,
  Seminar,
  User,
} from "./types";

export const currentStudent: User = {
  id: "stu-1",
  name: "Muhammad Ifdal",
  nim: "H1101201001",
  role: "student",
  email: "ifdal@student.untan.ac.id",
};

export const currentTeacher: User = {
  id: "tch-1",
  name: "Dr. Budi Santoso, S.Kom., M.T.",
  nip: "198001012010011001",
  role: "teacher",
  email: "budi@untan.ac.id",
};

export const kpRegistrations: KPRegistration[] = [
  {
    id: "kp-1",
    studentId: "stu-1",
    nama: "Muhammad Ifdal",
    judul: "Pengembangan Sistem Monitoring Internal",
    nim: "H1101201001",
    dosenPA: "Anggi Sri Murdianti Sukamto, S.T., M.T",
    semester: 7,
    jumlahSKS: 124,
    ipk: 3.62,
    kelompokKeahlian: "Rekayasa Perangkat Lunak",
    ringkasan:
      "Membangun sistem monitoring internal berbasis web untuk memantau status layanan dan log aktivitas tim engineering.",
    namaInstansi: "PT Solusi Digital Khatulistiwa",
    alamatInstansi: "Jl. Ahmad Yani, Pontianak",
    namaNarahubung: "Rudi Hartono",
    noHpNarahubung: "0812-3456-7890",
    mulai: "2026-05-01",
    selesai: "2026-07-30",
    documents: [
      { key: "proposal", label: "Proposal Kerja Praktik", fileName: "proposal.pdf", uploadedAt: "07 Oktober 2025" },
      { key: "kp_if_00", label: "KP_IF_00" },
      { key: "kp_if_01", label: "KP_IF_01" },
      { key: "ktm", label: "Kartu Tanda Mahasiswa" },
      { key: "lirs", label: "Lembar Isian Rencana Studi" },
      { key: "transkrip", label: "Transkrip Nilai" },
    ],
    status: "diajukan",
    tanggalPengajuan: "7 Oktober 2025",
    catatanDosen:
      "Proposal kamu sedang diperiksa oleh dosen pembimbing akademik.",
    activity: [
      { title: "Upload Proposal", time: "07 Oktober 2025, 11:21 WIB" },
    ],
  },
];

export const kelompokKeahlianOptions = [
  "Rekayasa Perangkat Lunak",
  "Sistem Cerdas",
  "Jaringan & Keamanan",
  "Multimedia & Visi Komputer",
  "Sistem Informasi",
];

export const logbooks: LogbookEntry[] = [
  {
    id: "lb-1",
    studentId: "stu-1",
    tanggal: "2026-05-02",
    kegiatan: "Onboarding & pengenalan tim engineering",
    jamMulai: "08:00",
    jamSelesai: "16:00",
    status: "disetujui",
  },
  {
    id: "lb-2",
    studentId: "stu-1",
    tanggal: "2026-05-03",
    kegiatan: "Setup environment dan repo internal",
    jamMulai: "08:00",
    jamSelesai: "16:00",
    status: "diajukan",
  },
];

export const bimbingans: Bimbingan[] = [
  {
    id: "bm-1",
    studentId: "stu-1",
    dosenId: "tch-1",
    tanggal: "2026-05-10",
    topik: "Diskusi BAB 1 — Latar Belakang",
    status: "disetujui",
  },
];

export const laporanAkhir: LaporanAkhir[] = [
  {
    id: "lap-1",
    studentId: "stu-1",
    judul: "Laporan Akhir KP — Sistem Monitoring",
    fileUrl: "#",
    status: "diajukan",
  },
];

export const seminars: Seminar[] = [
  {
    id: "sem-1",
    studentId: "stu-1",
    jadwal: "2026-08-12 09:00",
    ruangan: "Ruang Sidang Informatika",
    status: "dijadwalkan",
  },
];

export const scores: Score[] = [];

// Teacher views: list of student submissions
export const allStudents: User[] = [
  currentStudent,
  {
    id: "stu-2",
    name: "Aulia Rahma",
    nim: "H1101201020",
    role: "student",
    email: "aulia@student.untan.ac.id",
  },
  {
    id: "stu-3",
    name: "Dimas Pratama",
    nim: "H1101201044",
    role: "student",
    email: "dimas@student.untan.ac.id",
  },
];

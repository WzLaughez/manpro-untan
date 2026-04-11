export type Role = "student" | "teacher";

export type User = {
  id: string;
  name: string;
  nim?: string;
  nip?: string;
  role: Role;
  email: string;
};

export type KPStatus =
  | "draft"
  | "diajukan"
  | "disetujui"
  | "ditolak"
  | "berjalan"
  | "selesai";

export type RequiredDoc =
  | "proposal"
  | "kp_if_00"
  | "kp_if_01"
  | "ktm"
  | "lirs"
  | "transkrip";

export type KPDocument = {
  key: RequiredDoc;
  label: string;
  fileName?: string;
  uploadedAt?: string;
};

export type ActivityLog = {
  title: string;
  time: string;
};

export type KPRegistration = {
  id: string;
  studentId: string;
  // Form Pendaftaran
  nama: string;
  judul: string;
  nim: string;
  dosenPA: string;
  semester: number;
  jumlahSKS: number;
  ipk: number;
  kelompokKeahlian: string;
  ringkasan: string;
  namaInstansi: string;
  alamatInstansi: string;
  namaNarahubung: string;
  noHpNarahubung: string;
  ttdUrl?: string;
  // Tanggal
  mulai?: string;
  selesai?: string;
  // Dokumen
  documents: KPDocument[];
  // Verifikasi
  status: KPStatus;
  tanggalPengajuan?: string;
  catatanDosen?: string;
  activity: ActivityLog[];
};

export type LogbookEntry = {
  id: string;
  studentId: string;
  tanggal: string;
  kegiatan: string;
  jamMulai: string;
  jamSelesai: string;
  status: "draft" | "diajukan" | "disetujui" | "ditolak";
};

export type Bimbingan = {
  id: string;
  studentId: string;
  dosenId: string;
  tanggal: string;
  topik: string;
  catatan?: string;
  status: "diajukan" | "disetujui" | "selesai" | "ditolak";
};

export type LaporanAkhir = {
  id: string;
  studentId: string;
  judul: string;
  fileUrl: string;
  status: "diajukan" | "revisi" | "disetujui";
};

export type Seminar = {
  id: string;
  studentId: string;
  jadwal: string;
  ruangan: string;
  status: "diajukan" | "dijadwalkan" | "selesai";
  hadirDosen?: boolean;
};

export type Score = {
  id: string;
  studentId: string;
  nilaiAngka: number;
  nilaiHuruf: "A" | "B" | "C" | "D" | "E";
  catatan?: string;
};

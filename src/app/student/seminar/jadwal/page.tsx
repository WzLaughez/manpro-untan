import Link from "next/link";
import { Card, PageTitle } from "@/components/ui";
import { getCurrentUser } from "@/lib/currentUser";
import { getKPByStudent } from "@/lib/data/kp";
import { getSeminarByStudent } from "@/lib/data/seminar";
import KonfirmasiModal from "./KonfirmasiModal";
import PresensiModal from "./PresensiModal";
import SuccessModal from "./SuccessModal";

function fmtDate(iso: string | null | undefined) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function fmtTime(t: string | null | undefined) {
  if (!t) return "-";
  return t.slice(0, 5);
}

export default async function JadwalSeminarPage({
  searchParams,
}: {
  searchParams: Promise<{
    confirm?: string;
    confirmed?: string;
    presensi?: string;
    presensiModal?: string;
  }>;
}) {
  const user = await getCurrentUser();
  const [seminar, kp] = await Promise.all([
    getSeminarByStudent(user.id),
    getKPByStudent(user.id),
  ]);

  const sp = await searchParams;
  const showConfirm = sp.confirm === "1";
  const showConfirmed = sp.confirmed === "1";
  const showPresensi = sp.presensiModal === "1";
  const showPresensiSuccess = sp.presensi === "1";

  if (!seminar) {
    return (
      <>
        <PageTitle
          title="Jadwal Seminar"
          subtitle="Pantau jadwal seminar KP Anda"
        />
        <Card>
          <p className="text-[14px] text-ink-soft">
            Kamu belum mengajukan seminar. Silakan ajukan lewat menu{" "}
            <Link
              href="/student/seminar/daftar"
              className="text-primary font-medium"
            >
              Daftar Seminar
            </Link>
            .
          </p>
        </Card>
      </>
    );
  }

  const scheduled =
    seminar.status === "disetujui" || seminar.status === "selesai";

  const confirmed = !!seminar.kehadiran_konfirmasi;
  const attended = !!seminar.kehadiran_hadir;

  return (
    <>
      <PageTitle
        title="Jadwal Seminar"
        subtitle="Pantau jadwal seminar KP Anda"
      />

      {/* Status banner */}
      {!scheduled ? (
        <div
          className="rounded-xl p-4 text-white shadow-sm mb-5"
          style={{
            background: "linear-gradient(135deg, #FFB366 0%, #F57C1A 100%)",
          }}
        >
          <p className="text-[13px] font-semibold">
            Menunggu Persetujuan Jadwal Seminar
          </p>
          <p className="text-[12px] opacity-95">
            Pengajuan kamu sedang ditinjau oleh Dosen Pembimbing.
          </p>
        </div>
      ) : !confirmed ? (
        <div
          className="rounded-xl p-4 text-white shadow-sm mb-5"
          style={{
            background: "linear-gradient(135deg, #FFB366 0%, #F57C1A 100%)",
          }}
        >
          <p className="text-[13px] font-semibold">Penting:</p>
          <p className="text-[12px] opacity-95">
            Harap lakukan Konfirmasi Kehadiran Seminar
          </p>
        </div>
      ) : (
        <div
          className="rounded-xl p-4 text-white shadow-sm mb-5"
          style={{
            background: "linear-gradient(135deg, #56E8A0 0%, #1AAF6B 100%)",
          }}
        >
          <p className="text-[13px] font-semibold">Konfirmasi Berhasil!</p>
          <p className="text-[12px] opacity-95">
            Periksa Kembali dan Unduh Jadwal Seminar Kamu!
          </p>
        </div>
      )}

      <Card>
        <h3 className="text-[14px] font-semibold pb-3 mb-4 border-b border-line">
          Ringkasan Informasi Seminar
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px] mb-5">
          <div className="rounded-lg border border-line px-4 py-3">
            <p className="text-[11px] text-ink-soft mb-1">Tanggal & Waktu</p>
            <p className="font-semibold">
              {scheduled && seminar.tanggal_seminar
                ? `${fmtDate(seminar.tanggal_seminar)} (${fmtTime(seminar.waktu_mulai)} - ${fmtTime(seminar.waktu_selesai)} WIB)`
                : "Menunggu penjadwalan oleh dosen"}
            </p>
          </div>
          <div className="rounded-lg border border-line px-4 py-3">
            <p className="text-[11px] text-ink-soft mb-1">Lokasi Seminar</p>
            <p className="font-semibold">
              {seminar.ruang_seminar ?? seminar.lokasi ?? "Belum ditentukan"}
            </p>
          </div>
          <div className="rounded-lg border border-line px-4 py-3">
            <p className="text-[11px] text-ink-soft mb-1">Dosen Pembimbing KP</p>
            <p className="font-semibold">{kp?.dosen_pa ?? "-"}</p>
          </div>
          <div className="rounded-lg border border-line px-4 py-3">
            <p className="text-[11px] text-ink-soft mb-1">Pembimbing Lapangan</p>
            <p className="font-semibold">
              {seminar.pembimbing_lapangan ?? "-"}
            </p>
          </div>
          <div className="rounded-lg border border-line px-4 py-3 md:col-span-2">
            <p className="text-[11px] text-ink-soft mb-1">Topik KP</p>
            <p className="font-semibold">{kp?.judul ?? "-"}</p>
          </div>
        </div>

        {/* Action buttons */}
        {scheduled && (
          <div className="space-y-2">
            <Link
              href="/student/seminar/jadwal?confirm=1"
              aria-disabled={confirmed}
              className={`block w-full h-11 rounded-md text-white text-[13px] font-semibold grid place-items-center ${
                confirmed ? "pointer-events-none opacity-60" : ""
              }`}
              style={{
                background: "linear-gradient(135deg, #5BC0F0 0%, #1E88E5 100%)",
              }}
            >
              {confirmed
                ? "✓ Kehadiran Sudah Dikonfirmasi"
                : "Konfirmasi Kehadiran Seminar"}
            </Link>
            <button
              type="button"
              disabled
              className="block w-full h-11 rounded-md bg-secondary/30 text-ink-soft text-[13px] font-medium cursor-not-allowed"
            >
              Unduh Jadwal Seminar (PDF)
            </button>
            {confirmed && !attended && (
              <Link
                href="/student/seminar/jadwal?presensiModal=1"
                className="block w-full h-11 rounded-md text-white text-[13px] font-semibold grid place-items-center"
                style={{
                  background:
                    "linear-gradient(135deg, #56E8A0 0%, #1AAF6B 100%)",
                }}
              >
                📱 Presensi Kehadiran
              </Link>
            )}
            {attended && (
              <div
                className="block w-full h-11 rounded-md text-white text-[13px] font-semibold grid place-items-center"
                style={{
                  background:
                    "linear-gradient(135deg, #56E8A0 0%, #1AAF6B 100%)",
                }}
              >
                ✓ Kehadiran Tercatat
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Overlays */}
      {showConfirm && scheduled && !confirmed && (
        <KonfirmasiModal
          tanggal={fmtDate(seminar.tanggal_seminar)}
          pukul={`${fmtTime(seminar.waktu_mulai)} - ${fmtTime(seminar.waktu_selesai)} WIB`}
          lokasi={seminar.ruang_seminar ?? seminar.lokasi ?? "-"}
        />
      )}

      {showConfirmed && <SuccessModal />}

      {showPresensi && confirmed && !attended && (
        <PresensiModal kodePresensi={seminar.kode_presensi ?? ""} />
      )}

      {showPresensiSuccess && (
        <SuccessModal message="Presensi Kehadiran Berhasil!" />
      )}
    </>
  );
}

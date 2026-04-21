"use client";

import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { submitPresensi } from "@/lib/actions/seminar";

export default function PresensiModal({
  kodePresensi,
}: {
  kodePresensi: string;
}) {
  const router = useRouter();
  const close = () => router.push("/student/seminar/jadwal");
  const [state, formAction, pending] = useActionState<
    { error?: string } | null,
    FormData
  >(async (_prev, fd) => submitPresensi(fd), null);

  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(kodePresensi);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(
    `MANPRO-UNTAN:${kodePresensi}`,
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl shadow-xl overflow-hidden relative"
        style={{ backgroundColor: "#0F2A47" }}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 size-7 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white text-[12px]"
        >
          ✕
        </button>

        <div className="bg-card m-4 rounded-xl p-6 text-center">
          <h3 className="text-[15px] font-semibold">Presensi Kehadiran</h3>
          <p className="text-[11px] text-ink-soft mt-1 mb-4">
            Scan QR Code dibawah ini untuk kehadiran peserta seminar!
          </p>

          <div className="mx-auto w-[220px] h-[220px] rounded-lg border border-line p-2 bg-white mb-4 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt="QR Presensi"
              width={220}
              height={220}
              className="w-full h-full"
            />
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-primary/30" />
            </div>
            <span className="relative bg-card px-2 text-[11px] text-primary">
              Atau masukkan kode dibawah ini
            </span>
          </div>

          <form action={formAction} className="space-y-3">
            <div className="flex gap-2">
              <input
                name="kode"
                type="text"
                required
                autoComplete="off"
                placeholder="Ketik kode…"
                className="flex-1 h-10 px-3 rounded-md border border-line bg-surface text-[14px] text-ink text-center tracking-[0.25em] uppercase focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={copy}
                aria-label="Copy code"
                className="size-10 grid place-items-center rounded-md border border-line bg-surface hover:bg-card text-ink-soft"
                title={copied ? "Disalin" : "Salin kode demo"}
              >
                {copied ? "✓" : "📋"}
              </button>
            </div>
            <p className="text-[10px] text-ink-soft">
              Demo kode:{" "}
              <span className="font-mono font-semibold tracking-[0.2em] text-ink">
                {kodePresensi}
              </span>
            </p>

            {state?.error && (
              <p className="text-[11px] text-alert font-medium">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full h-11 rounded-md text-white text-[14px] font-semibold disabled:opacity-60"
              style={{
                background:
                  "linear-gradient(135deg, #5BC0F0 0%, #1E88E5 100%)",
              }}
            >
              {pending ? "Memproses..." : "Submit Kehadiran"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";

export default function NotificationBell({
  count,
  items,
}: {
  count: number;
  items: { title: string; description: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Notifikasi"
        onClick={() => setOpen(true)}
        className="relative size-9 grid place-items-center rounded-full hover:bg-surface"
      >
        🔔
        {count > 0 && (
          <span className="absolute top-1.5 right-1.5 size-2.5 rounded-full bg-alert ring-2 ring-card" />
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/30 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-card rounded-2xl shadow-xl p-6 text-center relative"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 size-7 grid place-items-center rounded-full hover:bg-surface text-ink-soft"
            >
              ✕
            </button>

            {count === 0 ? (
              <>
                <div className="mx-auto size-14 rounded-full bg-surface grid place-items-center text-2xl mb-3">
                  📭
                </div>
                <h3 className="text-[15px] font-semibold mb-1">
                  Tidak Ada Notifikasi
                </h3>
                <p className="text-[12px] text-ink-soft">
                  Belum ada aktivitas baru dari mahasiswa bimbingan Anda.
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto size-14 rounded-2xl bg-primary/10 grid place-items-center text-primary text-2xl mb-3">
                  ✉️
                </div>

                {items.map((n, i) => (
                  <div key={i} className={i > 0 ? "mt-4" : ""}>
                    <h3 className="text-[15px] font-semibold mb-1">
                      {n.title}
                    </h3>
                    <p className="text-[12px] text-ink-soft mb-4 leading-relaxed">
                      {n.description}
                    </p>
                    <Link
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center justify-center h-10 px-6 rounded-lg text-white text-[13px] font-semibold"
                      style={{
                        background:
                          "linear-gradient(135deg, #5BC0F0 0%, #1E88E5 100%)",
                      }}
                    >
                      {n.title.toLowerCase().includes("laporan")
                        ? "Lihat Laporan"
                        : "Lihat Detail"}
                    </Link>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

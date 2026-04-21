"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type NotificationCard = {
  key: string;
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

const SEEN_KEY = "mp-teacher-notif-seen";

export default function NotificationBell({
  notifications,
}: {
  notifications: NotificationCard[];
}) {
  const [open, setOpen] = useState(false);
  const totalCount = notifications.reduce((s, n) => s + n.count, 0);
  // Fingerprint of current state so we re-open only when counts actually change
  const fingerprint = notifications
    .map((n) => `${n.key}:${n.count}`)
    .join(",");

  useEffect(() => {
    if (notifications.length === 0) return;
    const seen = sessionStorage.getItem(SEEN_KEY);
    if (seen !== fingerprint) {
      setOpen(true);
    }
  }, [fingerprint, notifications.length]);

  const close = () => {
    try {
      sessionStorage.setItem(SEEN_KEY, fingerprint);
    } catch {
      // ignore
    }
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Notifikasi"
        onClick={() => setOpen(true)}
        className="relative size-9 grid place-items-center rounded-full hover:bg-surface"
      >
        🔔
        {totalCount > 0 && (
          <span className="absolute top-1.5 right-1.5 size-2.5 rounded-full bg-alert ring-2 ring-card" />
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4 py-6 overflow-y-auto"
          onClick={close}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm space-y-3"
          >
            {notifications.length === 0 ? (
              <div className="bg-card rounded-2xl shadow-xl p-6 text-center relative">
                <button
                  type="button"
                  aria-label="Close"
                  onClick={close}
                  className="absolute top-3 right-3 size-7 grid place-items-center rounded-full hover:bg-surface text-ink-soft"
                >
                  ✕
                </button>
                <div className="mx-auto size-14 rounded-full bg-surface grid place-items-center text-2xl mb-3">
                  📭
                </div>
                <h3 className="text-[15px] font-semibold mb-1">
                  Tidak Ada Notifikasi
                </h3>
                <p className="text-[12px] text-ink-soft">
                  Belum ada aktivitas baru dari mahasiswa bimbingan Anda.
                </p>
              </div>
            ) : (
              notifications.map((n, i) => (
                <NotificationCardItem
                  key={n.key}
                  notif={n}
                  onClose={close}
                  showClose={i === 0}
                />
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}

function NotificationCardItem({
  notif,
  onClose,
  showClose,
}: {
  notif: NotificationCard;
  onClose: () => void;
  showClose: boolean;
}) {
  return (
    <div className="bg-card rounded-2xl shadow-xl p-6 text-center relative">
      {showClose && (
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-3 right-3 size-7 grid place-items-center rounded-full hover:bg-surface text-ink-soft"
        >
          ✕
        </button>
      )}

      <div
        className={`mx-auto size-16 rounded-2xl grid place-items-center text-3xl mb-4 ${notif.iconBg}`}
        style={{ color: notif.iconColor }}
      >
        {notif.icon}
      </div>

      <h3 className="text-[16px] font-semibold mb-1">{notif.title}</h3>
      <p className="text-[12px] text-ink-soft mb-5 leading-relaxed">
        {notif.description}
      </p>

      <Link
        href={notif.href}
        onClick={onClose}
        className="inline-flex items-center justify-center w-full h-11 rounded-lg text-white text-[14px] font-semibold"
        style={{ background: notif.buttonBg }}
      >
        {notif.cta}
      </Link>
    </div>
  );
}

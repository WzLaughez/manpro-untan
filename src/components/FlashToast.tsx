"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Toast } from "./ui";

export default function FlashToast({
  param = "saved",
  message,
}: {
  param?: string;
  message: string;
}) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!sp.get(param)) return;
    setShow(true);
    const t = setTimeout(() => {
      setShow(false);
      router.replace(pathname);
    }, 2800);
    return () => clearTimeout(t);
  }, [sp, param, router, pathname]);

  if (!show) return null;
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4">
      <Toast message={message} />
    </div>
  );
}

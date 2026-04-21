"use client";

import { useTransition } from "react";
import { uploadPenilaianBerkas } from "@/lib/actions/penilaianBerkas";

type Slot = {
  doc_key: string;
  label: string;
  file_name: string | null;
  file_url: string | null;
};

export default function BerkasUploadRow({
  kpId,
  slot,
}: {
  kpId: string;
  slot: Slot;
}) {
  const [pending, start] = useTransition();
  const uploaded = !!slot.file_name;

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.set("kp_id", kpId);
    fd.set("doc_key", slot.doc_key);
    fd.set("file", file);
    start(async () => {
      await uploadPenilaianBerkas(fd);
    });
    // Reset the input so selecting the same file twice still fires onChange
    e.target.value = "";
  };

  return (
    <li className="py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="size-10 rounded-lg bg-surface grid place-items-center text-lg shrink-0">
          📄
        </div>
        <div className="min-w-0">
          <div className="font-medium text-[13px]">{slot.label}</div>
          <div className="text-[11px] text-ink-soft truncate">
            {pending
              ? "Mengunggah…"
              : uploaded
                ? slot.file_name
                : "Belum diunggah · Max. 10 MB"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {uploaded && slot.file_url && (
          <a
            href={slot.file_url}
            target="_blank"
            rel="noreferrer"
            className="text-[12px] text-primary hover:underline"
          >
            Lihat
          </a>
        )}
        <label
          className={`inline-flex items-center justify-center h-9 min-w-[90px] px-3 rounded-md border border-primary text-primary text-[12px] font-medium cursor-pointer hover:bg-primary/5 ${
            pending ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          {pending ? "..." : uploaded ? "Ganti" : "Upload"}
          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,image/*"
            onChange={onPick}
            disabled={pending}
          />
        </label>
      </div>
    </li>
  );
}

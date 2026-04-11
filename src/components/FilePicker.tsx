"use client";

import { useState } from "react";

export default function FilePicker({
  name,
  accept,
  currentName,
}: {
  name: string;
  accept?: string;
  currentName?: string | null;
}) {
  const [fname, setFname] = useState<string>(currentName ?? "");

  return (
    <div className="flex items-center gap-3">
      <label className="inline-flex items-center justify-center h-9 min-w-[100px] px-4 rounded-md border border-primary text-primary text-[13px] font-medium cursor-pointer hover:bg-primary/5">
        Pilih File
        <input
          type="file"
          name={name}
          accept={accept}
          className="hidden"
          onChange={(e) => setFname(e.target.files?.[0]?.name ?? "")}
        />
      </label>
      <span
        className={`text-[12px] ${fname ? "text-ink" : "text-ink-soft"} truncate max-w-[260px]`}
        title={fname}
      >
        {fname || "Tidak ada file yang dipilih"}
      </span>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function LaporanFilePicker({
  currentName,
}: {
  currentName?: string | null;
}) {
  const [fname, setFname] = useState(currentName ?? "");

  return (
    <label className="flex flex-col items-center justify-center gap-2 min-h-[160px] rounded-lg border-2 border-dashed border-primary/30 bg-surface/50 cursor-pointer hover:border-primary/60 transition-colors px-6 py-8">
      <span className="text-3xl text-ink-soft">☁️</span>
      <span className="text-[12px] text-center">
        {fname ? (
          <span className="text-ink font-medium">{fname}</span>
        ) : (
          <>
            <span className="text-primary font-medium underline">
              Unggah File
            </span>{" "}
            <span className="text-ink-soft">
              (Draft Laporan/Screenshot) komputer atau Google Drive
            </span>
          </>
        )}
      </span>
      <input
        type="file"
        name="file"
        className="hidden"
        accept=".pdf"
        onChange={(e) => setFname(e.target.files?.[0]?.name ?? "")}
      />
    </label>
  );
}

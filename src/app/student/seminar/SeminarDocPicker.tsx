"use client";

import { useState } from "react";

type Doc = {
  doc_key: string;
  label: string;
  file_name: string | null;
  file_url: string | null;
};

export default function SeminarDocPicker({ doc }: { doc: Doc }) {
  const [fname, setFname] = useState(doc.file_name ?? "");
  const uploaded = !!doc.file_name;

  return (
    <li className="py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className="size-11 rounded-lg bg-surface grid place-items-center text-xl shrink-0">
          📄
        </div>
        <div className="min-w-0">
          <div className="font-medium text-[14px]">{doc.label}</div>
          <div className="text-[12px] text-ink-soft truncate">
            {fname ? fname : "Max. 10 MB"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {uploaded && doc.file_url && (
          <a
            href={doc.file_url}
            target="_blank"
            rel="noreferrer"
            className="text-[12px] text-primary hover:underline"
          >
            Lihat
          </a>
        )}
        <label className="inline-flex items-center justify-center h-9 min-w-[100px] px-4 rounded-md border border-primary text-primary text-[13px] font-medium cursor-pointer hover:bg-primary/5">
          {fname ? "Ganti" : "Upload"}
          <input
            type="file"
            name={`file_${doc.doc_key}`}
            className="hidden"
            accept=".pdf,image/*"
            onChange={(e) => setFname(e.target.files?.[0]?.name ?? "")}
          />
        </label>
      </div>
    </li>
  );
}

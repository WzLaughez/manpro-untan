"use client";

import { useRef, useTransition } from "react";
import { uploadKPDocument } from "@/lib/actions/kpDocs";

type Doc = {
  id: string;
  doc_key: string;
  label: string;
  file_name: string | null;
  file_url: string | null;
};

export default function UploadDocRow({ doc }: { doc: Doc }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, start] = useTransition();
  const uploaded = !!doc.file_name;

  return (
    <li className="py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="size-11 rounded-lg bg-surface grid place-items-center text-xl">
          📄
        </div>
        <div>
          <div className="font-medium text-[14px]">{doc.label}</div>
          <div className="text-[12px] text-ink-soft">
            {pending
              ? "Mengunggah…"
              : uploaded
                ? doc.file_name
                : "Max. 10 MB"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
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
        <form
          ref={formRef}
          action={(fd) => start(() => uploadKPDocument(fd))}
        >
          <input type="hidden" name="doc_key" value={doc.doc_key} />
          <label
            className={`inline-flex items-center justify-center h-9 min-w-[100px] px-4 rounded-md border border-primary text-primary text-[13px] font-medium cursor-pointer hover:bg-primary/5 ${
              pending ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            {pending ? "..." : uploaded ? "Ganti" : "Upload"}
            <input
              type="file"
              name="file"
              className="hidden"
              accept=".pdf,image/*"
              onChange={() => formRef.current?.requestSubmit()}
            />
          </label>
        </form>
      </div>
    </li>
  );
}

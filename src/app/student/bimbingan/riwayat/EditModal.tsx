"use client";

import { useRouter } from "next/navigation";
import { Button, Card, Field, Input, Textarea } from "@/components/ui";
import { updateBimbingan } from "@/lib/actions/bimbingan";
import BimbinganFilePicker from "../BimbinganFilePicker";

type Item = {
  id: string;
  tanggal: string;
  jenis: string;
  ringkasan: string | null;
  file_name: string | null;
};

export default function EditModal({ item }: { item: Item }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <Card className="w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
        <button
          type="button"
          onClick={() => router.push("/student/bimbingan/riwayat")}
          className="absolute top-4 right-4 size-8 grid place-items-center rounded-full hover:bg-surface text-ink-soft"
        >
          ✕
        </button>

        <h3 className="text-[14px] font-semibold pb-3 mb-4 border-b border-line">
          Form Bimbingan
        </h3>

        <form action={updateBimbingan} className="space-y-4">
          <input type="hidden" name="id" value={item.id} />
          <Field label="Tanggal">
            <Input
              name="tanggal"
              type="date"
              required
              defaultValue={item.tanggal}
            />
          </Field>
          <Field label="Jenis Bimbingan">
            <Input name="jenis" required defaultValue={item.jenis} />
          </Field>
          <Field label="Ringkasan">
            <Textarea
              name="ringkasan"
              defaultValue={item.ringkasan ?? ""}
              placeholder="Jelaskan secara singkat perkembangan yang telah dicapai atau permasalahan yang ingin didiskusikan dengan dosen..."
            />
          </Field>

          <BimbinganFilePicker currentName={item.file_name} />

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary">
              ✅ Submit Bimbingan
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

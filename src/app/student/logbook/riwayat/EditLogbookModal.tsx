"use client";

import { useRouter } from "next/navigation";
import { Button, Card, Field, Input, Textarea } from "@/components/ui";
import { updateLogbookDraft, updateLogbookSubmit } from "@/lib/actions/logbook";
import LogbookFilePicker from "../LogbookFilePicker";

type Item = {
  id: string;
  tanggal: string;
  aktivitas: string;
  kendala: string | null;
  hasil: string | null;
  file_name: string | null;
};

export default function EditLogbookModal({ item }: { item: Item }) {
  const router = useRouter();
  const close = () => router.push("/student/logbook/riwayat");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 overflow-y-auto">
      <Card className="w-full max-w-3xl max-h-[95vh] overflow-y-auto relative">
        <button
          type="button"
          onClick={close}
          className="absolute top-4 right-4 size-8 grid place-items-center rounded-full hover:bg-surface text-ink-soft"
        >
          ✕
        </button>

        <h3 className="text-[14px] font-semibold pb-3 mb-4 border-b border-line">
          Formulir Pengisian Logbook Harian
        </h3>

        <form className="space-y-4">
          <input type="hidden" name="id" value={item.id} />

          <div className="max-w-sm">
            <Field label="Tanggal">
              <Input
                name="tanggal"
                type="date"
                required
                defaultValue={item.tanggal}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Aktivitas">
              <Textarea
                name="aktivitas"
                required
                defaultValue={item.aktivitas}
                placeholder="Melakukan pemasangan jaringan p..."
              />
            </Field>
            <Field label="Kendala (Opsional)">
              <Textarea
                name="kendala"
                defaultValue={item.kendala ?? ""}
                placeholder="Jelaskan kendala yang kamu alami..."
              />
            </Field>
          </div>

          <Field label="Hasil Pekerjaan">
            <Textarea
              name="hasil"
              defaultValue={item.hasil ?? ""}
              placeholder="Sebutkan atau jelaskan hasil pekerjaan..."
            />
          </Field>

          <LogbookFilePicker currentName={item.file_name} />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="submit"
              formAction={updateLogbookDraft}
              variant="secondary"
              size="second"
            >
              💾 Simpan
            </Button>
            <Button
              type="submit"
              formAction={updateLogbookSubmit}
              variant="primary"
              size="second"
            >
              📤 Submit
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

import UploadDocRow from "@/components/UploadDocRow";
import { Button, Card, PageTitle } from "@/components/ui";
import { submitKP } from "@/lib/actions/kp";
import { getCurrentUser } from "@/lib/currentUser";
import { getKPWithRelations } from "@/lib/data/kp";

export default async function UploadDokumenPage() {
  const user = await getCurrentUser();
  const data = await getKPWithRelations(user.id);

  if (!data) {
    return (
      <>
        <PageTitle title="Unggah Dokumen" />
        <Card>
          <p className="text-[14px] text-ink-soft">
            Belum ada pendaftaran. Silakan isi{" "}
            <a className="text-primary font-medium" href="/student/pendaftaran/form">
              Form Pendaftaran
            </a>{" "}
            terlebih dahulu.
          </p>
        </Card>
      </>
    );
  }

  const { documents } = data;
  const alreadySubmitted = data.kp.status !== "draft";

  return (
    <>
      <PageTitle
        title="Unggah Dokumen"
        subtitle="Isi Formulir dengan Data yang Valid"
      />

      <Card>
        <ul className="divide-y divide-line">
          {documents.map((doc) => (
            <UploadDocRow key={doc.id} doc={doc} />
          ))}
        </ul>

        <form action={submitKP}>
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-line">
            <p className="text-[12px] text-ink-soft">
              {alreadySubmitted
                ? "Proposal sudah disubmit. Menunggu verifikasi dosen."
                : "Pastikan data yang kamu inputkan sudah benar"}
            </p>
            <div className="flex gap-3">
              <Button
                type="submit"
                variant="primary"
                disabled={alreadySubmitted}
              >
                📤 Submit Pendaftaran
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </>
  );
}

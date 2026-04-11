import { Card, PageTitle } from "@/components/ui";

export default function BantuanPage() {
  const faqs = [
    {
      q: "Bagaimana cara mendaftar KP?",
      a: "Buka menu Pendaftaran KP, isi form, dan unggah dokumen proposal.",
    },
    {
      q: "Kapan saya bisa mendaftar seminar?",
      a: "Setelah laporan akhir disetujui oleh dosen pembimbing.",
    },
    {
      q: "Bagaimana cara mengisi logbook?",
      a: "Buka menu Logbook, isi tanggal, jam, dan deskripsi kegiatan harian.",
    },
  ];
  return (
    <>
      <PageTitle title="Bantuan & Panduan" subtitle="FAQ seputar Manajemen KP" />
      <Card>
        <ul className="divide-y divide-line">
          {faqs.map((f) => (
            <li key={f.q} className="py-4">
              <div className="font-semibold text-[14px]">{f.q}</div>
              <div className="text-[13px] text-ink-soft mt-1">{f.a}</div>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

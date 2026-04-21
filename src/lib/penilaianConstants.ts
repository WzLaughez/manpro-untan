// Pure constants + helpers — safe to import from client components.
// Don't put DB access here.

export const CRITERIA = [
  {
    key: "kerajinan",
    label: "Kerajinan dan aktivitas di lapangan",
    description:
      "Kehadiran, ketepatan waktu, dan partisipasi aktif selama pelaksanaan KP.",
    weight: 0.1,
    icon: "🛠️",
  },
  {
    key: "ide",
    label: "Kemampuan Mengemukakan Ide",
    description:
      "Orisinalitas gagasan, artikulasi ide, dan kontribusi dalam diskusi.",
    weight: 0.1,
    icon: "💡",
  },
  {
    key: "analisa",
    label: "Kemampuan Menganalisa Persoalan",
    description:
      "Identifikasi masalah, dekomposisi persoalan, dan kedalaman analisis.",
    weight: 0.15,
    icon: "🔍",
  },
  {
    key: "solusi",
    label: "Kemampuan Memberikan Solusi",
    description:
      "Rancangan solusi, kelayakan implementasi, dan mitigasi risiko.",
    weight: 0.15,
    icon: "🧩",
  },
  {
    key: "penugasan",
    label: "Hasil Penugasan",
    description:
      "Output final, kualitas dokumentasi, serta dampak terhadap instansi.",
    weight: 0.5,
    icon: "🎯",
  },
] as const;

export const SKOR_OPTIONS = [60, 65, 70, 75, 80, 85, 90, 95, 100];

export type ScoreInput = {
  kerajinan: number | null;
  ide: number | null;
  analisa: number | null;
  solusi: number | null;
  penugasan: number | null;
};

export function computeNilaiAkhir(scores: ScoreInput): number | null {
  const values = CRITERIA.map((c) => scores[c.key as keyof ScoreInput]);
  if (values.some((v) => v == null)) return null;
  const raw = CRITERIA.reduce(
    (acc, c) => acc + (scores[c.key as keyof ScoreInput] ?? 0) * c.weight,
    0,
  );
  return Math.round(raw * 100) / 100;
}

export function letterGrade(score: number | null | undefined): string {
  if (score == null) return "-";
  if (score >= 85) return "A";
  if (score >= 80) return "AB";
  if (score >= 75) return "B";
  if (score >= 70) return "BC";
  if (score >= 65) return "C";
  if (score >= 60) return "D";
  return "E";
}

export function lulus(score: number | null | undefined): boolean {
  return (score ?? 0) >= 60;
}

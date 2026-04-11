"use client";

type Profile = { id: string; name: string; role: string };

export default function RoleSelect({
  currentId,
  profiles,
}: {
  currentId: string;
  profiles: Profile[];
}) {
  return (
    <select
      name="uid"
      defaultValue={currentId}
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
      className="h-8 px-2 rounded-md border border-line bg-card text-[12px] text-ink"
      title="Switch user (mock auth)"
    >
      {profiles.map((p) => (
        <option key={p.id} value={p.id}>
          {p.role === "student" ? "🎓" : "👨‍🏫"} {p.name}
        </option>
      ))}
    </select>
  );
}

import { listProfiles } from "@/lib/currentUser";
import { switchUser } from "@/lib/actions/switchUser";
import RoleSelect from "./RoleSelect";

export default async function RoleSwitcher({
  currentId,
}: {
  currentId: string;
}) {
  const profiles = await listProfiles();
  return (
    <form action={switchUser} className="flex items-center gap-2">
      <RoleSelect
        currentId={currentId}
        profiles={profiles.map((p) => ({
          id: p.id,
          name: p.name,
          role: p.role,
        }))}
      />
    </form>
  );
}

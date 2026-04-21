import { logout } from "@/lib/actions/auth";
import { getTeacherNotifications } from "@/lib/data/teacherNotifications";
import NotificationBell from "./NotificationBell";
import RoleSwitcher from "./RoleSwitcher";

type Props = {
  user: { id: string; name: string; role: string };
};

export default async function Header({ user }: Props) {
  const notifications =
    user.role === "teacher" ? await getTeacherNotifications(user.id) : [];

  return (
    <header className="h-16 bg-card border-b border-line flex items-center justify-end gap-4 px-6">
      <RoleSwitcher currentId={user.id} />
      <NotificationBell notifications={notifications} />
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-full bg-surface grid place-items-center">
          👤
        </div>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold">{user.name}</div>
          <div className="text-[11px] text-ink-soft capitalize">{user.role}</div>
        </div>
      </div>
      <form action={logout}>
        <button
          type="submit"
          className="h-8 px-3 rounded-md text-[12px] text-ink-soft hover:text-alert hover:bg-alert/5 transition-colors"
        >
          Logout
        </button>
      </form>
    </header>
  );
}

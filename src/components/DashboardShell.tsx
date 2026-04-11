import Header from "./Header";
import Sidebar, { type NavItem } from "./Sidebar";

type Props = {
  user: { id: string; name: string; role: string };
  brand: string;
  nav: NavItem[];
  children: React.ReactNode;
};

export default function DashboardShell({ user, brand, nav, children }: Props) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar brand={brand} items={nav} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto px-8 py-6">{children}</main>
        <footer className="h-12 bg-card border-t border-line px-8 flex items-center text-xs text-ink-soft">
          Copyright © Informatika UNTAN 2026
        </footer>
      </div>
    </div>
  );
}

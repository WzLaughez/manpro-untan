"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export type NavItem = {
  href: string;
  label: string;
  icon: string;
  children?: { href: string; label: string }[];
};

type Props = {
  brand: string;
  items: NavItem[];
};

export default function Sidebar({ brand, items }: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] shrink-0 bg-identity text-white flex flex-col">
      <div className="px-5 py-5 flex items-center gap-3 border-b border-white/10">
        <div className="size-10 rounded-full bg-white/10 grid place-items-center text-xl">
          🎓
        </div>
        <div className="font-semibold tracking-wide">{brand}</div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((item) =>
          item.children ? (
            <NavGroup key={item.href} item={item} pathname={pathname} />
          ) : (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={
                pathname === item.href || pathname.startsWith(item.href + "/")
              }
            />
          ),
        )}
      </nav>

      <div className="px-5 py-4 text-xs text-white/50 border-t border-white/10">
        v0.1 · mock
      </div>
    </aside>
  );
}

function NavLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon?: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] transition-colors",
        active
          ? "bg-white text-primary font-semibold shadow-sm"
          : "text-white/85 hover:bg-white/10",
      ].join(" ")}
    >
      {icon && <span className="text-base w-6 text-center">{icon}</span>}
      <span>{label}</span>
    </Link>
  );
}

function NavGroup({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const groupActive = pathname.startsWith(item.href);
  const [open, setOpen] = useState(groupActive);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] transition-colors",
          groupActive
            ? "text-white font-semibold"
            : "text-white/85 hover:bg-white/10",
        ].join(" ")}
      >
        <span className="text-base w-6 text-center">{item.icon}</span>
        <span className="flex-1 text-left">{item.label}</span>
        <span
          className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>
      {open && (
        <div className="mt-1 ml-6 pl-3 border-l border-white/15 space-y-0.5">
          {item.children!.map((c) => {
            const active = pathname === c.href;
            return (
              <Link
                key={c.href}
                href={c.href}
                className={[
                  "block rounded-md px-3 py-2 text-[13px] transition-colors",
                  active
                    ? "bg-white text-primary font-semibold shadow-sm"
                    : "text-white/75 hover:bg-white/10",
                ].join(" ")}
              >
                {c.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

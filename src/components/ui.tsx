import Link from "next/link";

export function PageTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-[20px] font-semibold text-ink">{title}</h1>
      {subtitle && (
        <p className="text-[14px] text-ink-soft mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-card rounded-xl border border-line shadow-sm p-6 ${className}`}
    >
      {children}
    </div>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "notification" | "success" | "alert";
  size?: "main" | "second";
  asChild?: boolean;
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-primary hover:bg-primary-dark text-white",
  secondary: "bg-secondary hover:bg-secondary/80 text-white",
  notification: "bg-notification hover:brightness-95 text-white",
  success: "bg-success hover:brightness-95 text-white",
  alert: "bg-alert hover:brightness-95 text-white",
};

export function Button({
  variant = "primary",
  size = "main",
  className = "",
  ...props
}: ButtonProps) {
  const sizeCls =
    size === "main"
      ? "h-11 min-w-[120px] px-5 text-[14px]"
      : "h-9 min-w-[100px] px-4 text-[13px]";
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:opacity-50 ${variantClasses[variant]} ${sizeCls} ${className}`}
    />
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  size = "main",
}: {
  href: string;
  children: React.ReactNode;
  variant?: NonNullable<ButtonProps["variant"]>;
  size?: NonNullable<ButtonProps["size"]>;
}) {
  const sizeCls =
    size === "main"
      ? "h-11 min-w-[120px] px-5 text-[14px]"
      : "h-9 min-w-[100px] px-4 text-[13px]";
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors ${variantClasses[variant]} ${sizeCls}`}
    >
      {children}
    </Link>
  );
}

const statusStyles: Record<string, string> = {
  draft: "bg-secondary/20 text-ink-soft",
  diajukan: "bg-primary/15 text-primary",
  disetujui: "bg-success/15 text-success",
  selesai: "bg-success/15 text-success",
  ditolak: "bg-alert/15 text-alert",
  revisi: "bg-notification/15 text-notification",
  berjalan: "bg-primary/15 text-primary",
  dijadwalkan: "bg-primary/15 text-primary",
};

export function StatusBadge({ status }: { status: string }) {
  const cls = statusStyles[status] ?? "bg-secondary/20 text-ink-soft";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium capitalize ${cls}`}
    >
      {status}
    </span>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-ink-soft mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full h-10 px-3 rounded-md border border-line bg-card text-[14px] text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
    />
  );
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className="w-full min-h-[96px] p-3 rounded-md border border-line bg-card text-[14px] text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
    />
  );
}

export function Select({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full h-10 px-3 rounded-md border border-line bg-card text-[14px] text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
    >
      {children}
    </select>
  );
}

export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number; // 1-indexed
}) {
  return (
    <div className="flex items-start w-full">
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = idx < current;
        const active = idx === current;

        const circleCls = done
          ? "bg-success text-white"
          : active
            ? "bg-primary text-white"
            : "bg-[#E8EEF7] text-[#9FB4D1]";

        return (
          <div key={label} className="flex-1 flex items-start last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`size-10 rounded-full grid place-items-center text-[14px] font-semibold ${circleCls}`}
              >
                {done ? "✓" : idx}
              </div>
              <div
                className={[
                  "mt-3 text-[13px] text-center max-w-[120px]",
                  active
                    ? "text-ink font-medium"
                    : done
                      ? "text-ink"
                      : "text-ink-soft",
                ].join(" ")}
              >
                {label}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mt-5 rounded ${
                  idx < current ? "bg-success/60" : "bg-[#E8EEF7]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Timeline({
  items,
}: {
  items: { title: string; time: string }[];
}) {
  return (
    <ul className="space-y-4">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span className="size-3 rounded-full bg-primary mt-1.5 ring-2 ring-primary/20" />
            {i < items.length - 1 && (
              <span className="flex-1 w-px bg-line mt-1" />
            )}
          </div>
          <div className="pb-1">
            <div className="text-[13px] font-semibold text-primary">
              {it.title}
            </div>
            <div className="text-[11px] text-ink-soft mt-0.5">{it.time}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Toast({
  message,
  variant = "success",
}: {
  message: string;
  variant?: "success" | "alert" | "notification";
}) {
  const iconBg = {
    success: "bg-success",
    alert: "bg-alert",
    notification: "bg-notification",
  }[variant];
  return (
    <div className="inline-flex items-center gap-3 pl-2 pr-5 py-2 rounded-full bg-[#2b2b2b] text-white shadow-lg text-[13px] font-medium">
      <span
        className={`size-7 rounded-full grid place-items-center text-white text-[12px] ${iconBg}`}
      >
        ✓
      </span>
      <span className="leading-tight">{message}</span>
    </div>
  );
}

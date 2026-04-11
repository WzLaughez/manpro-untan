"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions/auth";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-[12px] font-medium text-ink mb-1.5">
          NIM / NIP
        </label>
        <input
          name="identifier"
          type="text"
          required
          placeholder="Masukkan NIM atau NIP"
          className="w-full h-11 px-4 rounded-lg border border-line bg-surface text-[14px] text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label className="block text-[12px] font-medium text-ink mb-1.5">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          placeholder="Masukkan password"
          className="w-full h-11 px-4 rounded-lg border border-line bg-surface text-[14px] text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {state?.error && (
        <div className="rounded-lg bg-alert/10 border border-alert/20 px-4 py-2.5 text-[12px] text-alert font-medium">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full h-11 rounded-lg text-white text-[14px] font-semibold disabled:opacity-60 transition-opacity"
        style={{
          background: "linear-gradient(135deg, #5BC0F0 0%, #1E88E5 100%)",
        }}
      >
        {pending ? "Memproses…" : "Masuk"}
      </button>

      <p className="text-[11px] text-ink-soft text-center mt-3">
        Demo: NIM <span className="font-mono">H1101201001</span> / password{" "}
        <span className="font-mono">123456</span>
      </p>
    </form>
  );
}

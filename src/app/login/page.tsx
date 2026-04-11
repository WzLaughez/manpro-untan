import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-identity text-white text-3xl mb-4">
            🎓
          </div>
          <h1 className="text-[22px] font-bold text-identity tracking-wide">
            MANPRO UNTAN
          </h1>
          <p className="text-[13px] text-ink-soft mt-1">
            Sistem Manajemen Kerja Praktik
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl shadow-sm border border-line p-8">
          <h2 className="text-[18px] font-semibold text-ink text-center mb-6">
            Masuk ke Akun Anda
          </h2>
          <LoginForm />
        </div>

        {/* Footer hint */}
        <p className="text-center text-[11px] text-ink-soft mt-6">
          © Informatika UNTAN 2026
        </p>
      </div>
    </div>
  );
}

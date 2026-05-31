import { LoginForm } from "@/components/login";

export default function Login() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-[#0b1120] dark:via-[#0a1628] dark:to-[#0b1120] flex items-center justify-center p-4 transition-colors overflow-hidden">
      {/* Glow blobs — brighter in dark mode */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-pulse opacity-25 dark:opacity-40"
        style={{ background: "oklch(0.62 0.1 214)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-pulse opacity-22 dark:opacity-30"
        style={{ background: "oklch(0.71 0.09 158)", animationDelay: "1.5s" }} />
      <div className="absolute top-2/3 left-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none animate-pulse opacity-18 dark:opacity-25"
        style={{ background: "oklch(0.47 0.09 214)", animationDelay: "3s" }} />

      <div className="relative z-10 w-full flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
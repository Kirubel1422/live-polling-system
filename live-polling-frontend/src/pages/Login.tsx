import { LoginForm } from "@/components/login";
import {
  Activity,
  BarChart2,
  LockKeyhole,
  Radio,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type FloatingBadgeProps = {
  icon: LucideIcon;
  children: ReactNode;
  delay?: string;
};

function FloatingBadge({
  icon: Icon,
  children,
  delay = "0s",
}: FloatingBadgeProps): ReactNode {
  return (
    <div
      className="hidden items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-xl lg:flex dark:border-white/10 dark:bg-slate-900/55 dark:text-slate-300"
      style={{
        animation: "float 6s ease-in-out infinite",
        animationDelay: delay,
      }}
    >
      <Icon className="size-4 text-primary" />
      <span>{children}</span>
    </div>
  );
}

export default function Login(): ReactNode {
  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 text-slate-900 transition-colors dark:bg-[#07111f] dark:text-white">


      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.18),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.12),transparent_34%)]" />
      <div className="premium-grid absolute inset-0 -z-10 opacity-75" />

      <div className="absolute left-1/2 top-1/2 -z-10 size-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
      <div className="absolute left-[18%] top-[18%] -z-10 size-72 rounded-full bg-primary/14 blur-3xl dark:bg-primary/10" />
      <div className="absolute bottom-[14%] right-[12%] -z-10 size-80 rounded-full bg-secondary/16 blur-3xl dark:bg-secondary/10" />

      <div className="absolute left-10 top-16">
        <FloatingBadge icon={ShieldCheck}>Secure Login</FloatingBadge>
      </div>

      <div className="absolute right-10 top-24">
        <FloatingBadge icon={Zap} delay=".6s">
          Fast Access
        </FloatingBadge>
      </div>

      <div className="absolute bottom-20 left-8">
        <FloatingBadge icon={BarChart2} delay="1.1s">
          Dashboard Ready
        </FloatingBadge>
      </div>

      <div className="fade-up relative z-10 w-full max-w-6xl">
        <div className="relative rounded-[2.25rem] border border-slate-200/70 bg-white/45 p-3 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.035] dark:shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />

          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.25rem]">
            <div
              className="absolute top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-40"
              style={{ animation: "shimmer 8s ease-in-out infinite" }}
            />
          </div>

          <div className="relative grid overflow-hidden rounded-[1.8rem] border border-slate-200/70 bg-transparent backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr] dark:border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f4fbff] to-[#eef9ff] dark:from-[#06111f] dark:via-[#07192a] dark:to-[#08111f]" />

            <div className="premium-grid absolute inset-0 opacity-55 dark:opacity-25" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.18),transparent_36%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.34),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.18),transparent_40%)]" />

            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] bg-gradient-to-r from-transparent via-white/[0.12] to-white/[0.22] lg:block dark:via-white/[0.018] dark:to-white/[0.035]" />

            <div className="absolute -left-24 top-20 size-80 rounded-full bg-primary/16 blur-3xl dark:bg-primary/25" />
            <div className="absolute -bottom-24 right-0 size-96 rounded-full bg-secondary/18 blur-3xl dark:bg-secondary/20" />

            <section className="relative hidden min-h-[640px] flex-col justify-between overflow-hidden p-10 text-slate-950 lg:flex dark:text-white">
              <div>
                <div className="mb-8 inline-flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/55 px-4 py-2.5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.08]">
                  <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-sm">
                    <Activity className="size-5 text-white" />
                    <span className="absolute -right-1 -top-1 size-3 rounded-full bg-secondary ring-4 ring-white dark:ring-[#06111f]" />
                  </div>

                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.26em] text-primary dark:text-secondary">
                      Live Polling System
                    </p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-300">
                      Presenter access portal
                    </p>
                  </div>
                </div>

                <h1 className="max-w-lg bg-gradient-to-r from-slate-950 to-primary bg-clip-text text-5xl font-black leading-[0.96] tracking-[-0.055em] text-transparent dark:from-white dark:to-[#33C3FF]">
                  Sign in and start engaging your audience.
                </h1>

                <p className="mt-5 max-w-md text-base leading-8 text-slate-600 dark:text-slate-300">
                  Access your presenter dashboard, manage sessions, launch polls,
                  and view real-time audience insights.
                </p>
              </div>

              <div className="grid gap-3">
                <div className="rounded-3xl border border-slate-200/70 bg-white/55 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.08]">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/12 text-primary dark:bg-primary/20 dark:text-secondary">
                      <Radio className="size-5" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Live sessions
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Host interactive polls instantly.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200/70 bg-white/55 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.08]">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary/14 text-primary dark:bg-secondary/20 dark:text-secondary">
                      <LockKeyhole className="size-5" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Secure account access
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        OAuth and email login supported.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <Sparkles className="size-4 text-primary dark:text-secondary" />
                Professional tools for real-time audience interaction
              </div>
            </section>

            <section className="relative flex min-h-[640px] items-center justify-center px-5 py-8 sm:px-8">
              <LoginForm />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
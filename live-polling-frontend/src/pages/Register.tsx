import { RegisterForm } from "@/components/register";
import {
  Activity,
  BarChart2,
  CheckCircle2,
  Radio,
  ShieldCheck,
  Sparkles,
  UserPlus,
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
      <Icon className="size-4 text-[#0598CE]" />
      <span>{children}</span>
    </div>
  );
}

export default function Register(): ReactNode {
  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 text-slate-900 transition-colors dark:bg-[#07111f] dark:text-white">

      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.18),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.12),transparent_34%)]" />
      <div className="premium-grid absolute inset-0 -z-10 opacity-75" />

      <div className="absolute left-1/2 top-1/2 -z-10 size-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0598CE]/8 blur-3xl dark:bg-[#0598CE]/8" />
      <div className="absolute left-[18%] top-[18%] -z-10 size-72 rounded-full bg-[#0598CE]/14 blur-3xl dark:bg-[#0598CE]/10" />
      <div className="absolute bottom-[14%] right-[12%] -z-10 size-80 rounded-full bg-[#33C3FF]/16 blur-3xl dark:bg-[#33C3FF]/10" />

      <div className="absolute left-10 top-16">
        <FloatingBadge icon={ShieldCheck}>Secure Signup</FloatingBadge>
      </div>

      <div className="absolute right-10 top-24">
        <FloatingBadge icon={Zap} delay=".6s">
          Fast Setup
        </FloatingBadge>
      </div>

      <div className="absolute bottom-20 left-8">
        <FloatingBadge icon={BarChart2} delay="1.1s">
          Dashboard Ready
        </FloatingBadge>
      </div>

      <div className="fade-up relative z-10 w-full max-w-6xl">
        <div className="relative rounded-[2.25rem] border border-slate-200/70 bg-white/55 p-3 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.035] dark:shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#33C3FF]/60 to-transparent" />

          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.25rem]">
            <div
              className="absolute top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-40"
              style={{ animation: "shimmer 8s ease-in-out infinite" }}
            />
          </div>

          <div className="relative grid overflow-hidden rounded-[1.8rem] border border-slate-200/70 bg-white/70 backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr] dark:border-white/10 dark:bg-white/[0.045]">
            <section className="flex min-h-[640px] items-center justify-center px-5 py-8 sm:px-8">
              <RegisterForm />
            </section>

            <section className="relative hidden min-h-[640px] flex-col justify-between overflow-hidden bg-gradient-to-br from-white via-[#f4fbff] to-[#eef9ff] p-10 text-slate-950 lg:flex dark:from-slate-950 dark:via-[#071a2a] dark:to-[#08111f] dark:text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.22),transparent_36%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.36),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.22),transparent_38%)]" />
              <div className="premium-grid absolute inset-0 opacity-55 dark:opacity-30" />
              <div className="absolute -left-24 top-20 size-80 rounded-full bg-[#0598CE]/16 blur-3xl dark:bg-[#0598CE]/25" />
              <div className="absolute -bottom-24 right-0 size-96 rounded-full bg-[#33C3FF]/18 blur-3xl dark:bg-[#33C3FF]/20" />

              <div className="relative">
                <div className="mb-8 inline-flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/65 px-4 py-2.5 backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
                  <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0598CE] to-[#33C3FF] shadow-sm">
                    <Activity className="size-5 text-white" />
                    <span className="absolute -right-1 -top-1 size-3 rounded-full bg-[#33C3FF] ring-4 ring-white dark:ring-slate-950" />
                  </div>

                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#0598CE] dark:text-[#33C3FF]">
                      Live Polling System
                    </p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-300">
                      Presenter onboarding portal
                    </p>
                  </div>
                </div>

                <h1 className="max-w-lg text-5xl font-black leading-[0.96] tracking-[-0.055em]">
                  Create your account and start engaging your audience.
                </h1>

                <p className="mt-5 max-w-md text-base leading-8 text-slate-600 dark:text-slate-300">
                  Build your presenter workspace, create live sessions, launch
                  polls, and collect real-time audience insights from one clean
                  dashboard.
                </p>
              </div>

              <div className="relative grid gap-3">
                <div className="rounded-3xl border border-slate-200/70 bg-white/65 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-[#0598CE]/12 text-[#0598CE] dark:bg-[#0598CE]/20 dark:text-[#33C3FF]">
                      <UserPlus className="size-5" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Quick onboarding
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Create your account and set up your workspace fast.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200/70 bg-white/65 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-[#33C3FF]/14 text-[#0598CE] dark:bg-[#33C3FF]/20 dark:text-[#33C3FF]">
                      <Radio className="size-5" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Live sessions
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Host interactive polls and engage audiences instantly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <Sparkles className="size-4 text-[#0598CE] dark:text-[#33C3FF]" />
                Professional tools for real-time audience interaction
              </div>

              <div className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 opacity-10 xl:block">
                <CheckCircle2 className="size-56 text-[#0598CE] dark:text-[#33C3FF]" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
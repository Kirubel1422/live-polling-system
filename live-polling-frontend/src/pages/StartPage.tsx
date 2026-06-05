import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  BarChart2,
  CheckCircle2,
  LockKeyhole,
  MousePointerClick,
  Presentation,
  Radio,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

type FloatingBadgeProps = {
  icon: LucideIcon;
  children: ReactNode;
  delay?: string;
  className?: string;
};

function FloatingBadge({
  icon: Icon,
  children,
  delay = "0s",
  className = "",
}: FloatingBadgeProps): ReactNode {
  return (
    <div
      className={`hidden items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-xl lg:flex dark:border-white/10 dark:bg-slate-900/55 dark:text-slate-300 ${className}`}
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

function BrandMark(): ReactNode {
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-2.5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
      <div className="relative flex size-10 items-center justify-center rounded-xl bg-primary">
        <Activity className="size-5 text-white dark:text-black" />
        <span className="absolute -right-1 -top-1 size-3 rounded-full bg-secondary ring-4 ring-white dark:ring-[#07111f]" />
      </div>

      <div className="text-left">
        <p className="text-[11px] font-black uppercase tracking-[0.26em] text-primary">
          Live Polling System
        </p>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Interactive sessions made simple
        </p>
      </div>
    </div>
  );
}

function FeatureLine({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}): ReactNode {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
      <Icon className="size-4 text-primary" />
      {label}
    </span>
  );
}

function ProductPreview(): ReactNode {
  return (
    <div className="relative">
      <div className="absolute -inset-10 rounded-full bg-primary/10 blur-3xl dark:bg-primary/12" />
      <div className="absolute -right-10 bottom-0 size-72 rounded-full bg-[#33C3FF]/14 blur-3xl dark:bg-[#33C3FF]/10" />

      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/[0.68] p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
              Live session
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Audience responses update instantly.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1.5 text-xs font-black text-primary dark:text-secondary">
          <span className="size-2 rounded-full bg-secondary" />
          Online
        </div>
        </div>

        <div className="rounded-[1.5rem] bg-gradient-to-br from-[#f4fbff] to-white p-5 dark:from-[#06111f] dark:to-[#07192a]">
          <div className="mb-6">
            <div className="mb-3 h-3 w-32 rounded-full bg-primary/20" />
            <div className="h-4 w-4/5 rounded-full bg-slate-300/70 dark:bg-white/15" />
            <div className="mt-2 h-4 w-2/3 rounded-full bg-slate-200/80 dark:bg-white/10" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-3 dark:bg-white/[0.055]">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="h-3 w-28 rounded-full bg-slate-300/80 dark:bg-white/15" />
                <div className="mt-2 h-2 w-20 rounded-full bg-slate-200/90 dark:bg-white/10" />
              </div>
              <div className="text-sm font-black text-primary">68%</div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/60 p-3 dark:bg-white/[0.04]">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#33C3FF]/10 text-[#33C3FF]">
                <Radio className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="h-3 w-24 rounded-full bg-slate-300/80 dark:bg-white/15" />
                <div className="mt-2 h-2 w-16 rounded-full bg-slate-200/90 dark:bg-white/10" />
              </div>
              <div className="text-sm font-black text-[#33C3FF]">24%</div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/45 p-3 dark:bg-white/[0.03]">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BarChart2 className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="h-3 w-20 rounded-full bg-slate-300/80 dark:bg-white/15" />
                <div className="mt-2 h-2 w-14 rounded-full bg-slate-200/90 dark:bg-white/10" />
              </div>
              <div className="text-sm font-black text-primary">8%</div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="size-4 text-primary" />
            Real-time results
          </span>

          <span className="inline-flex items-center gap-2">
            <Sparkles className="size-4 text-[#33C3FF]" />
            AI-ready workflow
          </span>
        </div>
      </div>
    </div>
  );
}

export default function StartPage(): ReactNode {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-slate-50 px-4 py-8 text-slate-900 transition-colors dark:bg-[#07111f] dark:text-white">
      <div className="absolute right-6 top-6 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.18),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.12),transparent_34%)]" />
      <div className="premium-grid absolute inset-0 -z-10 opacity-75" />

      <div className="absolute left-1/2 top-1/2 -z-10 size-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
      <div className="absolute left-[18%] top-[18%] -z-10 size-72 rounded-full bg-primary/14 blur-3xl dark:bg-primary/10" />
      <div className="absolute bottom-[14%] right-[12%] -z-10 size-80 rounded-full bg-[#33C3FF]/16 blur-3xl dark:bg-[#33C3FF]/10" />

      <div className="absolute left-10 top-16">
        <FloatingBadge icon={Radio}>Live Now</FloatingBadge>
      </div>

      <div className="absolute right-10 top-24">
        <FloatingBadge icon={Zap} delay=".6s">
          Instant Polls
        </FloatingBadge>
      </div>

      <div className="absolute bottom-20 left-8">
        <FloatingBadge icon={BarChart2} delay="1.1s">
          Real-time Results
        </FloatingBadge>
      </div>

      <main className="fade-up relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="max-w-3xl">
            <BrandMark />

            <h1 className="mt-8 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.065em] text-slate-950 sm:text-6xl md:text-7xl">
              <span className="dark:text-white">Engage your </span>
              <span className="bg-gradient-to-r from-primary via-[#33C3FF] to-[#0598CE] bg-clip-text text-transparent dark:via-[#7DD8F8]">
                audience, live.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
              Create interactive sessions, collect responses instantly, and give
              every participant a clean real-time experience from any device.
            </p>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
              <FeatureLine icon={MousePointerClick} label="No friction" />
              <FeatureLine icon={Radio} label="Real-time sync" />
              <FeatureLine icon={LockKeyhole} label="Secure presenter access" />
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-2xl bg-primary px-6 font-black text-white shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
              >
                <Link to="/login">
                  Presenter Login
                  <ArrowRight className="size-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-2xl border-2 border-primary bg-white/70 px-6 font-black text-primary shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/5 dark:border-primary/30 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
              >
                <Link to="/start/participant">
                  Join as Participant
                  <Users className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid max-w-2xl gap-4 border-t border-slate-200/70 pt-6 dark:border-white/10 sm:grid-cols-3">
              <div>
                <p className="text-2xl font-black text-secondary">Live</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  audience interaction
                </p>
              </div>

              <div>
                <p className="text-2xl font-black text-slate-950 dark:text-white">
                  Fast
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  session access
                </p>
              </div>

              <div>
                <p className="text-2xl font-black text-slate-950 dark:text-white">
                  Simple
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  presenter workflow
                </p>
              </div>
            </div>
          </section>

          <section className="hidden lg:block">
            <ProductPreview />
          </section>
        </div>
      </main>

      <footer className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-slate-200/70 py-5 text-xs font-medium text-slate-500 dark:border-white/10 dark:text-slate-400 sm:flex-row">
        <span className="inline-flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary" />
          No account needed to participate
        </span>

        <span className="inline-flex items-center gap-2">
          <Presentation className="size-4 text-[#33C3FF]" />
          Built for professional presenters
        </span>
      </footer>
    </div>
  );
}
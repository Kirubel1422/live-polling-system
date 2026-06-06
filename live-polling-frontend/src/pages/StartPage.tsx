import { Button } from "@/components/ui";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart2,
  LockKeyhole,
  MousePointerClick,
  Presentation,
  Radio,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { FloatingBadge, BrandMark, FeatureLine, ProductPreview } from "@/components/start-page";

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
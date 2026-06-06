import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart2,
  CheckCircle2,
  Radio,
  Sparkles,
  Users,
} from "lucide-react";

export type FloatingBadgeProps = {
  icon: LucideIcon;
  children: ReactNode;
  delay?: string;
  className?: string;
};

export function FloatingBadge({
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

export function BrandMark(): ReactNode {
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

export function FeatureLine({
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

export function ProductPreview(): ReactNode {
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

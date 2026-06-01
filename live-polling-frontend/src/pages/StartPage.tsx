import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  LockKeyhole,
  MousePointerClick,
  PlayCircle,
  Presentation,
  Radio,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const BLUE = "#0598CE";
const BLUE_BRIGHT = "#33C3FF";

type FloatingBadgeProps = {
  icon: LucideIcon;
  children: ReactNode;
  delay?: string;
  positionClassName: string;
};

type RoleCardProps = {
  to: string;
  title: string;
  description: string;
  button: string;
  icon: LucideIcon;
  variant: "participant" | "presenter";
  illustration: ReactNode;
  features: string[];
};

function FloatingBadge({
  icon: Icon,
  children,
  delay = "0s",
  positionClassName,
}: FloatingBadgeProps): ReactNode {
  return (
    <div
      className={`start-float absolute z-20 hidden items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-2.5 text-xs font-bold text-slate-600 backdrop-blur-xl lg:flex dark:border-[#33C3FF]/15 dark:bg-[#061827]/70 dark:text-slate-300 ${positionClassName}`}
      style={{ animationDelay: delay }}
    >
      <Icon className="size-4 text-primary dark:text-[#33C3FF]" />
      <span>{children}</span>
    </div>
  );
}

function ParticipantIllustration(): ReactNode {
  return (
    <svg
      viewBox="0 0 260 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-32 w-full"
      aria-hidden="true"
    >
      <rect x="24" y="20" width="212" height="110" rx="28" fill={BLUE} fillOpacity="0.1" />
      <rect x="25" y="21" width="210" height="108" rx="27" stroke={BLUE} strokeOpacity="0.25" strokeWidth="2" />

      <rect x="58" y="84" width="18" height="28" rx="7" fill={BLUE} fillOpacity="0.55" />
      <rect x="88" y="62" width="18" height="50" rx="7" fill={BLUE} />
      <rect x="118" y="74" width="18" height="38" rx="7" fill={BLUE_BRIGHT} fillOpacity="0.8" />

      <circle cx="178" cy="84" r="11" fill={BLUE} fillOpacity="0.25" />
      <circle cx="204" cy="78" r="11" fill={BLUE_BRIGHT} fillOpacity="0.3" />
      <circle cx="190" cy="53" r="11" fill={BLUE} fillOpacity="0.25" />

      <circle cx="178" cy="84" r="5" fill={BLUE} />
      <circle cx="204" cy="78" r="5" fill={BLUE_BRIGHT} />
      <circle cx="190" cy="53" r="5" fill={BLUE} />

      <path d="M171 37C181 29 198 29 208 37" stroke={BLUE_BRIGHT} strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      <path d="M160 25C176 11 204 11 220 25" stroke={BLUE_BRIGHT} strokeWidth="2.2" strokeLinecap="round" opacity="0.28" />
      <line x1="56" y1="113" x2="145" y2="113" stroke={BLUE} strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function PresenterIllustration(): ReactNode {
  return (
    <svg
      viewBox="0 0 260 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-32 w-full"
      aria-hidden="true"
    >
      <rect x="34" y="24" width="158" height="92" rx="24" fill={BLUE_BRIGHT} fillOpacity="0.1" />
      <rect x="35" y="25" width="156" height="90" rx="23" stroke={BLUE_BRIGHT} strokeOpacity="0.25" strokeWidth="2" />

      <rect x="60" y="79" width="16" height="24" rx="6" fill={BLUE_BRIGHT} fillOpacity="0.55" />
      <rect x="86" y="58" width="16" height="45" rx="6" fill={BLUE_BRIGHT} />
      <rect x="112" y="68" width="16" height="35" rx="6" fill={BLUE} fillOpacity="0.7" />
      <rect x="138" y="48" width="16" height="55" rx="6" fill={BLUE} />

      <circle cx="214" cy="56" r="14" fill={BLUE_BRIGHT} fillOpacity="0.2" stroke={BLUE_BRIGHT} strokeOpacity="0.4" strokeWidth="2" />
      <circle cx="214" cy="56" r="6" fill={BLUE_BRIGHT} />

      <rect x="198" y="80" width="34" height="34" rx="10" fill={BLUE_BRIGHT} fillOpacity="0.15" stroke={BLUE_BRIGHT} strokeOpacity="0.3" />
      <path d="M198 82L154 68" stroke={BLUE_BRIGHT} strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" opacity="0.65" />
      <circle cx="154" cy="68" r="4" fill={BLUE_BRIGHT} />

      <rect x="105" y="118" width="20" height="8" rx="3" fill={BLUE_BRIGHT} fillOpacity="0.3" />
      <rect x="86" y="130" width="58" height="6" rx="3" fill={BLUE_BRIGHT} fillOpacity="0.25" />
    </svg>
  );
}

function RoleCard({
  to,
  title,
  description,
  button,
  icon: Icon,
  variant,
  illustration,
  features,
}: RoleCardProps): ReactNode {
  const isPresenter = variant === "presenter";
  const accent = isPresenter ? BLUE_BRIGHT : BLUE;

  return (
    <Link to={to} className="group block h-full outline-none">
      <div className="relative flex h-full min-h-[430px] flex-col overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/[0.68] p-5 text-left backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-[#0598CE]/35 hover:bg-white/[0.82] dark:border-[#33C3FF]/15 dark:bg-[#071a2a]/70 dark:hover:bg-[#082033]/80">
        <div
          className="absolute inset-x-0 top-0 h-1 opacity-90"
          style={{ backgroundColor: accent }}
        />

        <div
          className="absolute -right-20 -top-20 size-56 rounded-full blur-3xl transition-opacity duration-500"
          style={{ backgroundColor: `${accent}1A` }}
        />

        <div className="absolute bottom-0 left-0 h-36 w-full bg-gradient-to-t from-white/70 to-transparent dark:from-[#06111f]/60" />

        <div className="relative">
          <div className="mb-4 overflow-hidden rounded-[1.6rem] border border-slate-200/70 bg-slate-50/70 p-4 backdrop-blur dark:border-[#33C3FF]/12 dark:bg-[#061423]/80">
            {illustration}
          </div>

          <div className="mb-5 flex items-center justify-between gap-4">
            <div
              className="flex size-14 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-110"
              style={{
                borderColor: `${accent}40`,
                backgroundColor: `${accent}17`,
                color: accent,
              }}
            >
              <Icon className="size-7" />
            </div>

            <div
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em]"
              style={{
                borderColor: `${accent}40`,
                backgroundColor: `${accent}17`,
                color: accent,
              }}
            >
              <Sparkles className="size-3.5" />
              Live
            </div>
          </div>

          <h2 className="text-3xl font-black tracking-[-0.045em] text-slate-950 dark:text-white">
            {title}
          </h2>

          <p className="mt-3 min-h-[56px] text-sm leading-7 text-slate-500 dark:text-slate-400">
            {description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {features.map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/70 bg-slate-50/70 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:border-[#33C3FF]/12 dark:bg-[#071827]/80 dark:text-slate-400"
              >
                <CheckCircle2 className="size-3.5" style={{ color: accent }} />
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mt-auto pt-7">
          <div
            className="flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-sm font-black transition-all duration-300 group-hover:translate-x-0.5"
            style={{
              borderColor: `${accent}40`,
              backgroundColor: `${accent}14`,
              color: accent,
            }}
          >
            <span>{button}</span>
            <span
              className="flex size-9 items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:translate-x-1"
              style={{ backgroundColor: accent }}
            >
              <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function StartPage(): ReactNode {
  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 font-sans text-slate-900 transition-colors dark:bg-[#06111f] dark:text-white">
      <div className="absolute right-6 top-6 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.18),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.25),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.18),transparent_34%),linear-gradient(135deg,#06111f,#071827_48%,#06111f)]" />
      <div className="start-premium-grid absolute inset-0 -z-20 opacity-75 dark:opacity-55" />

      <div className="absolute left-1/2 top-1/2 -z-10 size-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl dark:bg-[#0598CE]/10" />
      <div className="absolute left-[14%] top-[18%] -z-10 size-80 rounded-full bg-primary/14 blur-3xl dark:bg-[#0598CE]/16" />
      <div className="absolute bottom-[12%] right-[10%] -z-10 size-96 rounded-full bg-[#33C3FF]/16 blur-3xl dark:bg-[#33C3FF]/12" />

      <FloatingBadge icon={Radio} positionClassName="left-8 top-20">
        Live Now
      </FloatingBadge>

      <FloatingBadge icon={Zap} delay=".6s" positionClassName="right-10 top-28">
        Instant Polls
      </FloatingBadge>

      <FloatingBadge icon={BarChart3} delay="1.1s" positionClassName="bottom-20 left-10">
        Real-time Results
      </FloatingBadge>

      <div className="relative z-10 w-full max-w-6xl">
        <section className="start-fade-up mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/[0.78] px-4 py-2.5 backdrop-blur-xl dark:border-[#33C3FF]/15 dark:bg-[#071a2a]/75">
            <div className="relative flex size-11 items-center justify-center rounded-xl bg-primary">
              <Activity className="size-5 text-white dark:text-gray-500" />
              <span className="absolute -right-1 -top-1 size-3 rounded-full bg-[#33C3FF] ring-4 ring-white dark:ring-[#06111f]" />
            </div>

            <div className="text-left">
              <p className="text-[11px] font-black uppercase tracking-[0.26em] text-primary dark:text-[#33C3FF]">
                Live Polling System
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Interactive sessions made simple
              </p>
            </div>
          </div>

          <h1 className="text-5xl font-black leading-[0.92] tracking-[-0.065em] sm:text-6xl md:text-7xl">
            <span className="block text-slate-950 dark:text-white">
              Engage Your
            </span>
            <span className="block text-primary dark:text-[#33C3FF]">
              Audience, Live.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-500 dark:text-slate-400 sm:text-lg">
            Run beautiful live sessions with instant answers, real-time
            feedback, and a clean experience for both presenters and
            participants.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/65 px-3 py-2 backdrop-blur dark:border-[#33C3FF]/12 dark:bg-[#071a2a]/70">
              <MousePointerClick className="size-4 text-primary" />
              No friction
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/65 px-3 py-2 backdrop-blur dark:border-[#33C3FF]/12 dark:bg-[#071a2a]/70">
              <Radio className="size-4 text-[#33C3FF]" />
              Real-time sync
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/65 px-3 py-2 backdrop-blur dark:border-[#33C3FF]/12 dark:bg-[#071a2a]/70">
              <LockKeyhole className="size-4 text-primary" />
              Secure access
            </span>
          </div>
        </section>

        <section
          className="start-fade-up relative mx-auto mt-11 max-w-5xl rounded-[2.5rem] border border-slate-200/70 bg-white/45 p-3 backdrop-blur-2xl dark:border-[#33C3FF]/12 dark:bg-[#071827]/55"
          style={{ animationDelay: ".14s" }}
        >
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#33C3FF]/70 to-transparent" />

          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.5rem]">
            <div className="start-shimmer absolute top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-40" />
          </div>

          <div className="absolute -left-20 top-20 size-72 rounded-full bg-primary/10 blur-3xl dark:bg-[#0598CE]/12" />
          <div className="absolute -bottom-24 right-8 size-80 rounded-full bg-[#33C3FF]/12 blur-3xl dark:bg-[#33C3FF]/10" />

          <div className="relative grid gap-4 md:grid-cols-2">
            <RoleCard
              to="/start/participant"
              title="Participant"
              description="Join a live session and respond to polls instantly from any device."
              button="Join Session"
              icon={Users}
              variant="participant"
              illustration={<ParticipantIllustration />}
              features={["No account", "Fast access", "Live answers"]}
            />

            <RoleCard
              to="/login"
              title="Presenter"
              description="Create, manage, and host interactive presentations with real-time insights."
              button="Log In"
              icon={Presentation}
              variant="presenter"
              illustration={<PresenterIllustration />}
              features={["Dashboard", "AI ready", "Secure"]}
            />
          </div>
        </section>

        <section
          className="start-fade-up mx-auto mt-7 flex max-w-4xl flex-col items-center justify-center gap-3 text-center text-xs font-medium text-slate-400 sm:flex-row dark:text-slate-500"
          style={{ animationDelay: ".25s" }}
        >
          <span className="inline-flex items-center gap-2">
            <PlayCircle className="size-4 text-primary dark:text-[#33C3FF]" />
            Powered by real-time technology
          </span>

          <span className="hidden size-1 rounded-full bg-slate-300 sm:block dark:bg-slate-700" />

          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary dark:text-[#33C3FF]" />
            Secure presenter access
          </span>

          <span className="hidden size-1 rounded-full bg-slate-300 sm:block dark:bg-slate-700" />

          <span>No account needed to participate</span>
        </section>
      </div>
    </div>
  );
}
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  ArrowRight,
  BarChart2,
  CheckCircle2,
  LockKeyhole,
  MousePointerClick,
  Presentation,
  Radio,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';

type FeaturePillProps = {
  icon: LucideIcon;
  children: ReactNode;
  delay?: string;
};

type RoleCardProps = {
  to: string;
  title: string;
  description: string;
  button: string;
  accent: string;
  icon: LucideIcon;
  illustration: ReactNode;
  glowClass: string;
};

function ParticipantIllustration(): ReactNode {
  return (
    <svg
      viewBox="0 0 220 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-28 w-full opacity-95"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="participantGradient" x1="20" y1="20" x2="180" y2="115">
          <stop stopColor="#0598CE" stopOpacity="0.95" />
          <stop offset="1" stopColor="#33C3FF" stopOpacity="0.75" />
        </linearGradient>
      </defs>

      <rect x="22" y="18" width="176" height="94" rx="22" fill="#0598CE" fillOpacity="0.06" />
      <rect
        x="22.75"
        y="18.75"
        width="174.5"
        height="92.5"
        rx="21.25"
        stroke="#0598CE"
        strokeOpacity="0.18"
        strokeWidth="1.5"
      />

      <rect x="45" y="68" width="18" height="26" rx="6" fill="url(#participantGradient)" fillOpacity="0.55" />
      <rect x="73" y="51" width="18" height="43" rx="6" fill="url(#participantGradient)" />
      <rect x="101" y="61" width="18" height="33" rx="6" fill="url(#participantGradient)" fillOpacity="0.68" />

      <circle cx="151" cy="73" r="10" fill="#0598CE" fillOpacity="0.18" />
      <circle cx="174" cy="70" r="10" fill="#0598CE" fillOpacity="0.28" />
      <circle cx="162" cy="48" r="10" fill="#33C3FF" fillOpacity="0.28" />

      <circle cx="151" cy="73" r="5" fill="#0598CE" />
      <circle cx="174" cy="70" r="5" fill="#33C3FF" />
      <circle cx="162" cy="48" r="5" fill="#0598CE" />

      <path
        d="M146 35C154 28 170 28 178 35"
        stroke="#33C3FF"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M138 25C151 14 174 14 187 25"
        stroke="#33C3FF"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.28"
      />

      <line
        x1="42"
        y1="94"
        x2="125"
        y2="94"
        stroke="#0598CE"
        strokeOpacity="0.25"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PresenterIllustration(): ReactNode {
  return (
    <svg
      viewBox="0 0 220 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-28 w-full opacity-95"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="presenterGradient" x1="35" y1="18" x2="165" y2="110">
          <stop stopColor="#33C3FF" stopOpacity="0.95" />
          <stop offset="1" stopColor="#0598CE" stopOpacity="0.75" />
        </linearGradient>
      </defs>

      <rect x="28" y="20" width="132" height="78" rx="18" fill="#33C3FF" fillOpacity="0.06" />
      <rect
        x="28.75"
        y="20.75"
        width="130.5"
        height="76.5"
        rx="17.25"
        stroke="#33C3FF"
        strokeOpacity="0.2"
        strokeWidth="1.5"
      />

      <rect x="49" y="65" width="13" height="20" rx="4" fill="url(#presenterGradient)" fillOpacity="0.48" />
      <rect x="70" y="49" width="13" height="36" rx="4" fill="url(#presenterGradient)" fillOpacity="0.75" />
      <rect x="91" y="57" width="13" height="28" rx="4" fill="url(#presenterGradient)" fillOpacity="0.58" />
      <rect x="112" y="40" width="13" height="45" rx="4" fill="url(#presenterGradient)" />

      <circle
        cx="180"
        cy="49"
        r="12"
        fill="#33C3FF"
        fillOpacity="0.2"
        stroke="#33C3FF"
        strokeOpacity="0.38"
        strokeWidth="1.5"
      />
      <circle cx="180" cy="49" r="6" fill="#33C3FF" />

      <rect
        x="166"
        y="68"
        width="28"
        height="28"
        rx="8"
        fill="#33C3FF"
        fillOpacity="0.12"
        stroke="#33C3FF"
        strokeOpacity="0.26"
      />
      <path
        d="M166 70L127 58"
        stroke="#33C3FF"
        strokeWidth="1.8"
        strokeDasharray="4 4"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="127" cy="58" r="3.5" fill="#33C3FF" />

      <rect x="87" y="99" width="16" height="7" rx="2" fill="#33C3FF" fillOpacity="0.25" />
      <rect x="72" y="108" width="46" height="5" rx="2.5" fill="#33C3FF" fillOpacity="0.25" />
    </svg>
  );
}

function FeaturePill({ icon: Icon, children, delay = '0s' }: FeaturePillProps): ReactNode {
  return (
    <div
      className="hidden items-center gap-2 rounded-2xl border border-white/50 bg-white/70 px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-xl shadow-slate-900/5 backdrop-blur-xl lg:flex dark:border-white/10 dark:bg-slate-900/55 dark:text-slate-300 animate-[float_6s_ease-in-out_infinite]"
      style={{ animationDelay: delay }}
    >
      <Icon className="size-4 text-[#0598CE]" />
      <span>{children}</span>
    </div>
  );
}

function RoleCard({
  to,
  title,
  description,
  button,
  accent,
  icon: Icon,
  illustration,
  glowClass,
}: RoleCardProps): ReactNode {
  return (
    <Link to={to} className="group block h-full outline-none">
      <div
        className={`relative flex h-full min-h-[365px] flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 p-6 text-left shadow-2xl shadow-slate-900/8 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 dark:border-white/10 dark:bg-white/[0.055] ${glowClass}`}
      >
        <div
          className="absolute inset-x-0 top-0 h-1 opacity-80 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, ${accent}, #33C3FF)`,
          }}
        />

        <div
          className="absolute -right-16 -top-16 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
          style={{ backgroundColor: accent }}
        />

        <div className="absolute bottom-0 left-0 h-28 w-full bg-gradient-to-t from-slate-50/80 to-transparent dark:from-slate-950/30" />

        <div className="relative">
          <div className="mb-3 rounded-3xl border border-slate-200/70 bg-slate-50/70 p-3 dark:border-white/10 dark:bg-slate-950/25">
            {illustration}
          </div>

          <div className="mb-5 flex items-center justify-between gap-4">
            <div
              className="flex size-[60px] items-center justify-center rounded-3xl border shadow-lg transition-transform duration-300 group-hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${accent}22, ${accent}08)`,
                borderColor: `${accent}33`,
                boxShadow: `0 18px 45px ${accent}18`,
              }}
            >
              <Icon className="size-8" style={{ color: accent }} />
            </div>

            <div
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{
                borderColor: `${accent}2f`,
                color: accent,
                backgroundColor: `${accent}0f`,
              }}
            >
              <Sparkles className="size-3.5" />
              Live
            </div>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{title}</h2>

          <p className="mt-2 min-h-[44px] text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500 dark:bg-white/8 dark:text-slate-400">
              <CheckCircle2 className="size-3.5" style={{ color: accent }} />
              Fast access
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500 dark:bg-white/8 dark:text-slate-400">
              <LockKeyhole className="size-3.5" style={{ color: accent }} />
              Secure
            </span>
          </div>
        </div>

        <div className="relative mt-auto pt-6">
          <div
            className="flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-sm font-bold transition-all duration-300 group-hover:translate-x-0.5"
            style={{
              color: accent,
              borderColor: `${accent}38`,
              background: `linear-gradient(135deg, ${accent}14, ${accent}08)`,
            }}
          >
            <span>{button}</span>
            <span
              className="flex size-8 items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:translate-x-1"
              style={{
                background: `linear-gradient(135deg, ${accent}, #33C3FF)`,
              }}
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
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 text-slate-900 transition-colors dark:bg-[#07111f] dark:text-white">

      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.22),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.12),transparent_34%)]" />
      <div className="premium-grid absolute inset-0 -z-10 opacity-80" />

      <div className="absolute left-1/2 top-1/2 -z-10 size-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0598CE]/10 blur-3xl dark:bg-[#0598CE]/8" />
      <div className="absolute left-[18%] top-[18%] -z-10 size-72 rounded-full bg-[#0598CE]/20 blur-3xl dark:bg-[#0598CE]/10" />
      <div className="absolute bottom-[14%] right-[12%] -z-10 size-80 rounded-full bg-[#33C3FF]/25 blur-3xl dark:bg-[#33C3FF]/10" />

      <div className="absolute left-10 top-16">
        <FeaturePill icon={Radio}>Live Now</FeaturePill>
      </div>

      <div className="absolute right-10 top-24">
        <FeaturePill icon={Zap} delay=".6s">
          Instant Polls
        </FeaturePill>
      </div>

      <div className="absolute bottom-20 left-8">
        <FeaturePill icon={BarChart2} delay="1.1s">
          Real-time Results
        </FeaturePill>
      </div>

      <div className="w-full max-w-5xl">
        <div className="fade-up mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-3 rounded-2xl border border-[#0598CE]/20 bg-white/75 px-4 py-2.5 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
            <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0598CE] to-[#33C3FF] shadow-lg shadow-[#0598CE]/25">
              <Activity className="size-5 text-white" />
              <span className="absolute -right-1 -top-1 size-3 rounded-full bg-[#33C3FF] ring-4 ring-white dark:ring-[#07111f]" />
            </div>

            <div className="text-left">
              <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#0598CE]">
                Live Polling System
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Interactive sessions made simple
              </p>
            </div>
          </div>

          <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.055em] sm:text-6xl md:text-7xl">
            <span className="block text-slate-950 dark:text-white">Engage Your</span>
            <span className="block bg-gradient-to-r from-[#0598CE] via-[#33C3FF] to-[#0598CE] bg-clip-text text-transparent">
              Audience, Live.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-500 dark:text-slate-400 sm:text-lg">
            Run beautiful live sessions with instant answers, real-time feedback,
            and a clean experience for both presenters and participants.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/65 px-3 py-2 backdrop-blur dark:border-white/10 dark:bg-white/[0.055]">
              <MousePointerClick className="size-4 text-[#0598CE]" />
              No friction
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/65 px-3 py-2 backdrop-blur dark:border-white/10 dark:bg-white/[0.055]">
              <Radio className="size-4 text-[#33C3FF]" />
              Real-time sync
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/65 px-3 py-2 backdrop-blur dark:border-white/10 dark:bg-white/[0.055]">
              <LockKeyhole className="size-4 text-[#0598CE]" />
              Secure access
            </span>
          </div>
        </div>

        <div
          className="fade-up relative mt-10 rounded-[2.5rem] border border-white/70 bg-white/45 p-3 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.035]"
          style={{ animationDelay: '.14s' }}
        >
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#33C3FF]/70 to-transparent" />

          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.5rem]">
            <div
              className="absolute top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-40 animate-[shimmer_7s_ease-in-out_infinite]"
            />
          </div>

          <div className="relative grid gap-4 md:grid-cols-2">
            <RoleCard
              to="/start/participant"
              title="Participant"
              description="Join a live session and respond to polls instantly from any device."
              button="Join Session"
              accent="#0598CE"
              icon={Users}
              illustration={<ParticipantIllustration />}
              glowClass="participant-glow"
            />

            <RoleCard
              to="/login"
              title="Presenter"
              description="Create, manage, and host interactive presentations with real-time insights."
              button="Log In"
              accent="#33C3FF"
              icon={Presentation}
              illustration={<PresenterIllustration />}
              glowClass="presenter-glow"
            />
          </div>
        </div>

        <div
          className="fade-up mt-7 flex flex-col items-center justify-center gap-3 text-center text-xs text-slate-400 sm:flex-row dark:text-slate-500"
          style={{ animationDelay: '.25s' }}
        >
          <span>Powered by real-time technology</span>
          <span className="hidden size-1 rounded-full bg-slate-300 sm:block dark:bg-slate-700" />
          <span>Secure</span>
          <span className="hidden size-1 rounded-full bg-slate-300 sm:block dark:bg-slate-700" />
          <span>No account needed to participate</span>
        </div>
      </div>
    </div>
  );
}
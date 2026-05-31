import { Link } from 'react-router-dom';
import { Activity, Presentation, Users, Zap, BarChart2, Radio } from 'lucide-react';

// Inline SVG illustration for participant card
function ParticipantIllustration() {
  return (
    <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24 mb-2 opacity-80">
      {/* Poll bar chart */}
      <rect x="18" y="55" width="18" height="32" rx="4" fill="#0598CE" fillOpacity="0.25"/>
      <rect x="18" y="63" width="18" height="24" rx="4" fill="#0598CE" fillOpacity="0.6"/>
      <rect x="44" y="40" width="18" height="47" rx="4" fill="#0598CE" fillOpacity="0.25"/>
      <rect x="44" y="48" width="18" height="39" rx="4" fill="#0598CE" fillOpacity="0.85"/>
      <rect x="70" y="50" width="18" height="37" rx="4" fill="#0598CE" fillOpacity="0.25"/>
      <rect x="70" y="58" width="18" height="29" rx="4" fill="#0598CE" fillOpacity="0.5"/>
      {/* Audience dots */}
      <circle cx="112" cy="72" r="7" fill="#0598CE" fillOpacity="0.3"/>
      <circle cx="130" cy="68" r="7" fill="#0598CE" fillOpacity="0.5"/>
      <circle cx="148" cy="72" r="7" fill="#0598CE" fillOpacity="0.3"/>
      <circle cx="112" cy="72" r="4" fill="#0598CE" fillOpacity="0.7"/>
      <circle cx="130" cy="68" r="4" fill="#0598CE"/>
      <circle cx="148" cy="72" r="4" fill="#0598CE" fillOpacity="0.7"/>
      {/* Signal waves */}
      <path d="M121 52 Q130 44 139 52" stroke="#0598CE" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
      <path d="M116 46 Q130 36 144 46" stroke="#0598CE" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3"/>
      {/* Baseline */}
      <line x1="12" y1="87" x2="155" y2="87" stroke="#0598CE" strokeWidth="1.5" strokeLinecap="round" opacity="0.2"/>
    </svg>
  );
}

// Inline SVG illustration for presenter card
function PresenterIllustration() {
  return (
    <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24 mb-2 opacity-80">
      {/* Screen */}
      <rect x="20" y="15" width="100" height="62" rx="8" fill="#33C3FF" fillOpacity="0.08" stroke="#33C3FF" strokeWidth="1.5" strokeOpacity="0.3"/>
      {/* Chart inside screen */}
      <rect x="32" y="52" width="10" height="18" rx="2" fill="#33C3FF" fillOpacity="0.5"/>
      <rect x="47" y="40" width="10" height="30" rx="2" fill="#33C3FF" fillOpacity="0.8"/>
      <rect x="62" y="46" width="10" height="24" rx="2" fill="#33C3FF" fillOpacity="0.5"/>
      <rect x="77" y="35" width="10" height="35" rx="2" fill="#33C3FF"/>
      {/* Presenter podium */}
      <rect x="130" y="55" width="24" height="22" rx="4" fill="#33C3FF" fillOpacity="0.15" stroke="#33C3FF" strokeWidth="1" strokeOpacity="0.3"/>
      {/* Presenter head */}
      <circle cx="142" cy="44" r="9" fill="#33C3FF" fillOpacity="0.2" stroke="#33C3FF" strokeWidth="1.5" strokeOpacity="0.5"/>
      <circle cx="142" cy="44" r="5" fill="#33C3FF" fillOpacity="0.6"/>
      {/* Laser pointer line */}
      <line x1="128" y1="58" x2="90" y2="48" stroke="#33C3FF" strokeWidth="1" strokeDasharray="3 2" opacity="0.5"/>
      <circle cx="90" cy="48" r="2.5" fill="#33C3FF" opacity="0.8"/>
      {/* Stand */}
      <rect x="65" y="77" width="10" height="6" rx="1" fill="#33C3FF" fillOpacity="0.2"/>
      <rect x="55" y="83" width="30" height="3" rx="1.5" fill="#33C3FF" fillOpacity="0.2"/>
    </svg>
  );
}

export default function StartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-[#0a1628] dark:to-slate-900 flex items-center justify-center p-4 transition-colors overflow-hidden relative">

      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0598CE]/30 dark:bg-[#0598CE]/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{animationDuration:'6s'}} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#33C3FF]/30 dark:bg-[#33C3FF]/8 rounded-full blur-3xl pointer-events-none animate-pulse" style={{animationDuration:'8s', animationDelay:'2s'}} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#0598CE]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Decorative grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(#0598CE 1px, transparent 1px), linear-gradient(90deg, #0598CE 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      {/* Floating stat badges */}
      <div className="absolute top-16 left-10 hidden lg:flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-[#0598CE]/20 rounded-2xl px-4 py-2 shadow-lg animate-bounce" style={{animationDuration:'4s'}}>
        <Radio className="size-4 text-[#0598CE]" />
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Live Now</span>
        <span className="size-2 rounded-full bg-[#0598CE] animate-ping inline-block" />
      </div>
      <div className="absolute bottom-20 left-8 hidden lg:flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-[#33C3FF]/20 rounded-2xl px-4 py-2 shadow-lg" style={{animation:'float 5s ease-in-out infinite', animationDelay:'1s'}}>
        <BarChart2 className="size-4 text-[#33C3FF]" />
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Real-time Results</span>
      </div>
      <div className="absolute top-24 right-10 hidden lg:flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-[#0598CE]/20 rounded-2xl px-4 py-2 shadow-lg" style={{animation:'float 6s ease-in-out infinite', animationDelay:'0.5s'}}>
        <Zap className="size-4 text-[#0598CE]" />
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Instant Polls</span>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadein {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fadein { animation: fadein 0.7s cubic-bezier(.22,1,.36,1) both; }
        .fadein-2 { animation: fadein 0.7s cubic-bezier(.22,1,.36,1) 0.15s both; }
        .fadein-3 { animation: fadein 0.7s cubic-bezier(.22,1,.36,1) 0.3s both; }
        .card-glow-blue:hover { box-shadow: 0 8px 48px 0 #0598CE33, 0 2px 16px 0 #0598CE18; }
        .card-glow-cyan:hover { box-shadow: 0 8px 48px 0 #33C3FF33, 0 2px 16px 0 #33C3FF18; }
      `}</style>

      <div className="w-full max-w-2xl relative z-10 text-center">

        {/* Logo badge */}
        <div className="fadein flex flex-col items-center mb-6">
          <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-800/90 backdrop-blur rounded-2xl shadow-lg border border-[#0598CE]/20 px-5 py-3 mb-5">
            <div className="p-1.5 bg-gradient-to-br from-[#0598CE] to-[#33C3FF] rounded-xl">
              <Activity className="size-5 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase">Live Polling System</span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight leading-tight bg-gradient-to-br from-slate-800 via-[#0598CE] to-[#33C3FF] dark:from-white dark:via-[#7dd8f8] dark:to-[#33C3FF] bg-clip-text text-transparent pb-1">
            Engage Your<br/>Audience, Live.
          </h1>
          <p className="mt-4 text-slate-500 dark:text-slate-400 text-base max-w-sm mx-auto leading-relaxed">
            Real-time polls, instant feedback, and seamless interaction — all in one place.
          </p>
        </div>

        {/* Cards */}
        <div className="fadein-2 grid md:grid-cols-2 gap-5 mt-8">

          {/* Participant Card */}
          <Link to="/start/participant" className="group">
            <div className="card-glow-blue relative bg-white/80 dark:bg-white/[0.05] backdrop-blur-xl border border-slate-200/80 dark:border-white/10 p-7 rounded-3xl shadow-lg hover:border-[#0598CE]/50 transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-start overflow-hidden">
              {/* Card top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r from-[#0598CE] to-[#33C3FF] opacity-70 group-hover:opacity-100 transition-opacity" />
              
              <ParticipantIllustration />

              <div className="p-3.5 bg-gradient-to-br from-[#0598CE]/15 to-[#0598CE]/5 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 border border-[#0598CE]/20">
                <Users className="size-8 text-[#0598CE]" />
              </div>

              <h2 className="text-xl font-bold mb-1.5 text-slate-800 dark:text-white">Participant</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
                Join a live session and respond to polls in real time.
              </p>

              <button className="w-full mt-auto py-2.5 rounded-xl bg-gradient-to-r from-[#0598CE]/10 to-[#33C3FF]/10 border border-[#0598CE]/25 text-[#0598CE] font-semibold text-sm group-hover:from-[#0598CE]/20 group-hover:to-[#33C3FF]/20 group-hover:border-[#0598CE]/50 transition-all duration-300 flex items-center justify-center gap-2">
                Join Session
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </button>
            </div>
          </Link>

          {/* Presenter Card */}
          <Link to="/login" className="group">
            <div className="card-glow-cyan relative bg-white/80 dark:bg-white/[0.05] backdrop-blur-xl border border-slate-200/80 dark:border-white/10 p-7 rounded-3xl shadow-lg hover:border-[#33C3FF]/50 transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-start overflow-hidden">
              {/* Card top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r from-[#33C3FF] to-[#0598CE] opacity-70 group-hover:opacity-100 transition-opacity" />

              <PresenterIllustration />

              <div className="p-3.5 bg-gradient-to-br from-[#33C3FF]/15 to-[#33C3FF]/5 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 border border-[#33C3FF]/20">
                <Presentation className="size-8 text-[#33C3FF]" />
              </div>

              <h2 className="text-xl font-bold mb-1.5 text-slate-800 dark:text-white">Presenter</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
                Create, manage, and host live interactive presentations.
              </p>

              <button className="w-full mt-auto py-2.5 rounded-xl bg-gradient-to-r from-[#33C3FF]/10 to-[#0598CE]/10 border border-[#33C3FF]/25 text-[#33C3FF] font-semibold text-sm group-hover:from-[#33C3FF]/20 group-hover:to-[#0598CE]/20 group-hover:border-[#33C3FF]/50 transition-all duration-300 flex items-center justify-center gap-2">
                Log In
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </button>
            </div>
          </Link>
        </div>

        {/* Footer note */}
        <p className="fadein-3 mt-7 text-xs text-slate-400 dark:text-slate-600">
          Powered by real-time technology · Secure · No account needed to participate
        </p>
      </div>
    </div>
  );
}
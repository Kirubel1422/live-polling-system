import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Activity, KeyRound, Loader2, ArrowLeft, Users, Radio } from 'lucide-react';
import { toast } from 'sonner';
import { useJoinSessionMutation } from '@/api/participant.api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

// Same illustration from StartPage participant card — continuity cue
function ParticipantIllustration() {
  return (
    <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-20 opacity-75">
      <rect x="18" y="55" width="18" height="32" rx="4" fill="#0598CE" fillOpacity="0.25"/>
      <rect x="18" y="63" width="18" height="24" rx="4" fill="#0598CE" fillOpacity="0.6"/>
      <rect x="44" y="40" width="18" height="47" rx="4" fill="#0598CE" fillOpacity="0.25"/>
      <rect x="44" y="48" width="18" height="39" rx="4" fill="#0598CE" fillOpacity="0.85"/>
      <rect x="70" y="50" width="18" height="37" rx="4" fill="#0598CE" fillOpacity="0.25"/>
      <rect x="70" y="58" width="18" height="29" rx="4" fill="#0598CE" fillOpacity="0.5"/>
      <circle cx="112" cy="72" r="7" fill="#0598CE" fillOpacity="0.3"/>
      <circle cx="130" cy="68" r="7" fill="#0598CE" fillOpacity="0.5"/>
      <circle cx="148" cy="72" r="7" fill="#0598CE" fillOpacity="0.3"/>
      <circle cx="112" cy="72" r="4" fill="#0598CE" fillOpacity="0.7"/>
      <circle cx="130" cy="68" r="4" fill="#0598CE"/>
      <circle cx="148" cy="72" r="4" fill="#0598CE" fillOpacity="0.7"/>
      <path d="M121 52 Q130 44 139 52" stroke="#0598CE" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
      <path d="M116 46 Q130 36 144 46" stroke="#0598CE" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3"/>
      <line x1="12" y1="87" x2="155" y2="87" stroke="#0598CE" strokeWidth="1.5" strokeLinecap="round" opacity="0.2"/>
    </svg>
  );
}

export default function JoinPage() {
  const navigate = useNavigate();
  const [joinSession, { isLoading }] = useJoinSessionMutation();
  const [joinCode, setJoinCode] = useState('');
  const [name, setName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return toast.error('Please enter a join code');
    setIsDialogOpen(true);
  };

  const handleJoin = async () => {
    if (!name.trim()) return toast.error('Please enter your name');
    try {
      const response = await joinSession({ joinCode: joinCode.trim().toUpperCase(), name: name.trim() }).unwrap();
      toast.success("Joined session successfully!");
      localStorage.setItem(`participant_${response.presentationId}`, response.participantId);
      setIsDialogOpen(false);
      navigate(`/participant/presentation/${response.presentationId}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to join session');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-[#0a1628] dark:to-slate-900 flex items-center justify-center p-4 transition-colors overflow-hidden relative">

      {/* Background orbs — identical to StartPage */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0598CE]/30 dark:bg-[#0598CE]/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#33C3FF]/30 dark:bg-[#33C3FF]/8 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(#0598CE 1px, transparent 1px), linear-gradient(90deg, #0598CE 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      {/* Floating live badge */}
      <div className="absolute top-16 left-10 hidden lg:flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-[#0598CE]/20 rounded-2xl px-4 py-2 shadow-lg animate-bounce" style={{ animationDuration: '4s' }}>
        <Radio className="size-4 text-[#0598CE]" />
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Live Now</span>
        <span className="size-2 rounded-full bg-[#0598CE] animate-ping inline-block" />
      </div>


      <div className="w-full max-w-md relative z-10">

        {/* Header */}
        <div className="fi text-center mb-6">
          {/* Brand badge — same as StartPage */}
          <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-800/90 backdrop-blur rounded-2xl shadow-lg border border-[#0598CE]/20 px-5 py-3 mb-5">
            <div className="p-1.5 bg-gradient-to-br from-[#0598CE] to-[#33C3FF] rounded-xl">
              <Activity className="size-5 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase">Live Polling System</span>
          </div>

          {/* Breadcrumb trail — shows continuity from StartPage */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-xs text-slate-400 dark:text-slate-500">Start</span>
            <span className="text-xs text-slate-300 dark:text-slate-600">›</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0598CE] bg-[#0598CE]/10 border border-[#0598CE]/20 rounded-full px-3 py-1">
              <Users className="size-3" /> Participant
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-slate-800 via-[#0598CE] to-[#33C3FF] dark:from-white dark:via-[#7dd8f8] dark:to-[#33C3FF] bg-clip-text text-transparent pb-1">
            Join a Session
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
            Enter the join code provided by your presenter to get started.
          </p>
        </div>

        {/* Card */}
        <div className="fi fi-2 relative bg-white/80 dark:bg-white/[0.05] backdrop-blur-xl border border-slate-200/80 dark:border-white/10 p-8 rounded-3xl shadow-xl overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r from-[#0598CE] to-[#33C3FF]" />

          {/* Illustration */}
          <ParticipantIllustration />

          <form onSubmit={handleVerifyCode} className="space-y-5 mt-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Join Code</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1 bg-[#0598CE]/10 rounded-lg">
                  <KeyRound className="size-4 text-[#0598CE]" />
                </div>
                <Input
                  type="text"
                  placeholder="e.g. ABC123"
                  className="pl-11 h-12 bg-white/60 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 uppercase text-lg tracking-widest rounded-xl focus-visible:ring-[#0598CE]/40 focus-visible:border-[#0598CE]/50 transition-colors"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={8}
                />
              </div>
              {/* Character hint dots */}
              <div className="flex gap-1.5 justify-center mt-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-7 rounded-full transition-all duration-200 ${
                      i < joinCode.length
                        ? 'bg-[#0598CE]'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#0598CE] to-[#33C3FF] text-white font-semibold text-base shadow-md hover:shadow-[#0598CE]/30 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
            >
              Continue
              <span className="text-lg leading-none">→</span>
            </button>

            <div className="text-center pt-1">
              <Link
                to="/start"
                className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#0598CE] transition-colors duration-200 group"
              >
                <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Back to start
              </Link>
            </div>
          </form>
        </div>

        <p className="fi fi-3 mt-5 text-xs text-center text-slate-400 dark:text-slate-600">
          No account needed · Just enter your code and name
        </p>
      </div>

      {/* Name dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r from-[#0598CE] to-[#33C3FF]" />
          <DialogHeader className="pt-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-[#0598CE]/10 rounded-xl border border-[#0598CE]/20">
                <Users className="size-5 text-[#0598CE]" />
              </div>
              <DialogTitle className="text-xl font-bold">Almost there!</DialogTitle>
            </div>
            <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
              What should the presenter call you? This name will be visible to everyone in the session.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Your Name</Label>
            <Input
              id="name"
              placeholder="e.g. Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              className="h-11 rounded-xl border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-800/60 focus-visible:ring-[#0598CE]/40 focus-visible:border-[#0598CE]/50"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="rounded-xl border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
            >
              Cancel
            </Button>
            <button
              onClick={handleJoin}
              disabled={isLoading}
              className="flex-1 h-10 rounded-xl bg-gradient-to-r from-[#0598CE] to-[#33C3FF] text-white font-semibold text-sm shadow hover:shadow-[#0598CE]/25 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <><Loader2 className="size-4 animate-spin" /> Joining…</>
              ) : (
                <>Join Session →</>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
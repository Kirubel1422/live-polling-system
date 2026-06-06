import { Button, Input, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Label } from "@/components/ui";
import {
  Activity,
  KeyRound,
  Loader2,
  ArrowLeft,
  Users,
  ArrowRight,
} from 'lucide-react';
import { useJoinPage } from '@/components/join-page';
import { Link } from "react-router-dom";

export default function JoinPage() {
  const {
    joinCode,
    setJoinCode,
    name,
    setName,
    isDialogOpen,
    setIsDialogOpen,
    isLoading,
    handleVerifyCode,
    handleJoin,
  } = useJoinPage();

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 text-slate-900 transition-colors dark:bg-[#07111f] dark:text-white">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,oklch(0.62_0.1_214_/_0.18),transparent_34%),radial-gradient(circle_at_bottom_right,oklch(0.71_0.09_158_/_0.18),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_left,oklch(0.62_0.1_214_/_0.18),transparent_34%),radial-gradient(circle_at_bottom_right,oklch(0.71_0.09_158_/_0.12),transparent_34%)]" />

      <div className="premium-grid absolute inset-0 -z-10 opacity-75" />

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-3xl dark:opacity-10"
        style={{ background: 'oklch(0.62 0.1 214)' }}
      />

      <div
        className="pointer-events-none absolute left-[18%] top-[18%] -z-10 size-72 rounded-full opacity-15 blur-3xl dark:opacity-10"
        style={{ background: 'oklch(0.62 0.1 214)' }}
      />

      <div
        className="pointer-events-none absolute bottom-[14%] right-[12%] -z-10 size-80 rounded-full opacity-15 blur-3xl dark:opacity-10"
        style={{ background: 'oklch(0.71 0.09 158)' }}
      />

      <div className="fade-up relative z-10 w-full max-w-md rounded-2xl bg-white/[0.88] px-8 py-9 backdrop-blur-xl dark:bg-white/[0.06]">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <Activity className="size-7 text-primary" />
          </div>

          <h1 className="text-3xl font-black tracking-[-0.035em] text-slate-950 dark:text-white">
            Join a session
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Enter the join code provided by your presenter to get started.
          </p>
        </div>

        <form onSubmit={handleVerifyCode} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Join Code
            </Label>

            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

              <Input
                type="text"
                placeholder="e.g. ABC123"
                className="h-12 rounded-2xl border-slate-200/80 bg-white/70 pl-10 text-center text-lg font-black uppercase tracking-[0.22em] shadow-none transition-all duration-300 placeholder:text-left placeholder:text-sm placeholder:font-medium placeholder:normal-case placeholder:tracking-normal focus-visible:border-primary focus-visible:ring-primary/20 dark:border-white/10 dark:bg-white/[0.055]"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={8}
              />
            </div>

            <div className="flex justify-center gap-1.5 pt-1">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className={`h-1 w-7 rounded-full transition-all duration-200 ${
                    index < joinCode.length
                      ? 'bg-primary'
                      : 'bg-slate-200 dark:bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-2xl bg-primary font-black text-white shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
          >
            Continue
            <ArrowRight className="ml-2 size-4" />
          </Button>

          <div className="text-center">
            <Link
              to="/start"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 transition-colors duration-200 hover:text-primary"
            >
              <ArrowLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back to start
            </Link>
          </div>
        </form>

        <div className="mt-6 rounded-2xl bg-slate-50/70 px-4 py-3 text-center text-sm dark:bg-white/[0.04]">
          <span className="text-slate-500 dark:text-slate-400">
            No account needed. Just enter your code and name.
          </span>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-[2rem] border border-slate-200/70 bg-white/[0.95] p-8 shadow-2xl backdrop-blur-xl sm:max-w-md dark:border-white/10 dark:bg-[#0a1628]/60">
          <DialogHeader>
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
              <Users className="size-7 text-primary" />
            </div>

            <DialogTitle className="text-2xl font-black tracking-[-0.035em] text-slate-950 dark:text-white">
              Almost there
            </DialogTitle>

            <DialogDescription className="text-sm leading-6 text-slate-500 dark:text-slate-400">
              What should the presenter call you? This name will be visible in
              the session.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label
              htmlFor="name"
              className="text-sm font-bold text-slate-700 dark:text-slate-200"
            >
              Your Name
            </Label>

            <Input
              id="name"
              placeholder="e.g. Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              className="h-12 rounded-2xl border-slate-200/80 bg-white/70 font-medium shadow-none transition-all duration-300 focus-visible:border-primary focus-visible:ring-primary/20 dark:border-white/10 dark:bg-white/[0.055]"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="h-11 rounded-2xl border-slate-200/80 bg-white/70 font-bold text-slate-600 shadow-none transition-all duration-300 hover:bg-primary/5 hover:text-primary dark:border-white/10 dark:bg-white/[0.055] dark:text-slate-300"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleJoin}
              disabled={isLoading}
              className="h-11 flex-1 rounded-2xl bg-primary font-black text-white shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  Join Session
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
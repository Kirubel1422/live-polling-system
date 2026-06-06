import { Activity } from 'lucide-react';
import { useResetPassword, InvalidResetLink, ResetPasswordForm } from '@/components/reset-password';

export default function ResetPassword() {
  const { token, form, isLoading, onSubmit } = useResetPassword();

  if (!token) {
    return <InvalidResetLink />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-[#0a1628] dark:to-slate-900 flex items-center justify-center p-4 transition-colors">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0598CE]/30 dark:bg-[#0598CE]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#33C3FF]/30 dark:bg-[#33C3FF]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-border/50 mb-4">
            <Activity className="size-8 text-[#0598CE]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Set new password</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Your new password must be different to previously used passwords.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-white/[0.06] backdrop-blur-xl border border-border/50 p-8 rounded-3xl shadow-xl">
          <ResetPasswordForm form={form} onSubmit={onSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

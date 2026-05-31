import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Activity, CheckCircle2, XCircle } from 'lucide-react';
import { useVerifyEmailMutation } from '@/api/auth.api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email address...');
  const hasAttempted = useRef(false);

  const [verifyEmail] = useVerifyEmailMutation();

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    if (hasAttempted.current) return;
    hasAttempted.current = true;

    const verify = async () => {
      try {
        const response = await verifyEmail(token).unwrap();
        
        setStatus('success');
        setMessage(response.message || 'Your email has been verified!');
        setTimeout(() => navigate('/dashboard'), 3000);
      } catch (err: any) {
        setStatus('error');
        setMessage(err?.data?.message || err?.message || 'Verification failed. The link might be expired.');
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-[#0a1628] dark:to-slate-900 flex items-center justify-center p-4 transition-colors">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0598CE]/30 dark:bg-[#0598CE]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#33C3FF]/30 dark:bg-[#33C3FF]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-border/50 mb-4">
            <Activity className="size-8 text-[#0598CE]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Email Verification</h1>
        </div>

        <div className="bg-white/80 dark:bg-white/[0.06] backdrop-blur-xl border border-border/50 p-8 rounded-3xl shadow-xl text-center">
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-4">
              <div className="size-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-muted-foreground">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle2 className="size-16 text-emerald-500" />
              <p className="text-foreground font-medium">{message}</p>
              <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <XCircle className="size-16 text-rose-500" />
              <p className="text-foreground font-medium">{message}</p>
              <Button asChild className="mt-4">
                <Link to="/login">Go to Login</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

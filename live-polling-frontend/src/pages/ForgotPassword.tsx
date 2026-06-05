import { Button, Input } from "@/components/ui";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ForgotPasswordSchema, type ForgotPasswordDto } from '@/validators/auth.validator';
import { useForgotPasswordMutation } from '@/api/auth.api';

export default function ForgotPassword() {
  const [isSent, setIsSent] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordDto>({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordDto) => {
    try {
      const response = await forgotPassword(data).unwrap();
      setIsSent(true);
      toast.success(response.message || 'Password reset email sent');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset link');
    }
  };

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
            {isSent ? (
              <CheckCircle2 className="size-7 text-primary" />
            ) : (
              <Activity className="size-7 text-primary" />
            )}
          </div>

          <h1 className="text-3xl font-black tracking-[-0.035em] text-slate-950 dark:text-white">
            {isSent ? 'Check your email' : 'Forgot password?'}
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {isSent
              ? 'We sent password reset instructions to your email.'
              : "No worries, we'll send you reset instructions."}
          </p>
        </div>

        {isSent ? (
          <div className="space-y-6 text-center">
            <div className="rounded-2xl bg-slate-50/70 px-4 py-5 text-center text-sm dark:bg-white/[0.04]">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10">
                <Mail className="size-6 text-primary" />
              </div>

              <p className="leading-6 text-slate-500 dark:text-slate-400">
                We sent a password reset link to{' '}
                <span className="font-black text-slate-900 dark:text-white">
                  {form.getValues('email')}
                </span>
                .
              </p>
            </div>

            <Button
              asChild
              className="h-12 w-full rounded-2xl bg-primary font-black text-white shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
            >
              <Link to="/login">
                Return to log in
                <ArrowRight className="ml-2 size-4" />
              </Link>
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
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      Email
                    </FormLabel>

                    <FormControl>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                        <Input
                          type="email"
                          placeholder="name@example.com"
                          className="h-12 rounded-2xl border-slate-200/80 bg-white/70 pl-10 font-medium shadow-none transition-all duration-300 focus-visible:border-primary focus-visible:ring-primary/20 dark:border-white/10 dark:bg-white/[0.055]"
                          {...field}
                        />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="h-12 w-full rounded-2xl bg-primary font-black text-white shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                {isLoading ? 'Sending...' : 'Reset password'}
                {!isLoading ? <ArrowRight className="ml-2 size-4" /> : null}
              </Button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 transition-colors duration-200 hover:text-primary"
                >
                  <ArrowLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                  Back to log in
                </Link>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
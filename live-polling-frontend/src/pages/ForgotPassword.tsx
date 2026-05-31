import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Activity, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ForgotPasswordSchema, type ForgotPasswordDto } from '@/validators/auth.validator';
import { useForgotPasswordMutation } from '@/api/auth.api';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export default function ForgotPassword() {
  const [isSent, setIsSent] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordDto>({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordDto) => {
    try {
      const response = await forgotPassword(data).unwrap();
      setIsSent(true);
      toast.success(response.message || "Password reset email sent");
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset link');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-[#0a1628] dark:to-slate-900 flex items-center justify-center p-4 transition-colors">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0598CE]/30 dark:bg-[#0598CE]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#33C3FF]/30 dark:bg-[#33C3FF]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-border/50 mb-4">
            <Activity className="size-8 text-[#0598CE]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Forgot password?</h1>
          <p className="text-sm text-muted-foreground mt-2">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-white/[0.06] backdrop-blur-xl border border-border/50 p-8 rounded-3xl shadow-xl">
          {isSent ? (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full">
                <Mail className="size-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                We sent a password reset link to <span className="font-medium text-foreground">{form.getValues('email')}</span>.
              </p>
              <Button asChild className="w-full h-11 text-base rounded-xl">
                <Link to="/login">Return to log in</Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="name@example.com"
                            className="pl-9 h-11 bg-white/50 dark:bg-slate-900/50"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full h-11 text-base rounded-xl" disabled={isLoading}>
                  {isLoading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                  {isLoading ? 'Sending...' : 'Reset password'}
                </Button>
                
                <div className="text-center">
                  <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="size-4" />
                    Back to log in
                  </Link>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}

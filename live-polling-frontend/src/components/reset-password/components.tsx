import { Button, Input } from "@/components/ui";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft, Loader2 } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { ResetPasswordDto } from '@/validators/auth.validator';

export function InvalidResetLink() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Invalid Reset Link</h2>
        <Button asChild><Link to="/forgot-password">Request new link</Link></Button>
      </div>
    </div>
  );
}

export function ResetPasswordForm({
  form,
  onSubmit,
  isLoading
}: {
  form: UseFormReturn<ResetPasswordDto>;
  onSubmit: (data: ResetPasswordDto) => Promise<any>;
  isLoading: boolean;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-9 h-11 bg-white/50 dark:bg-slate-900/50"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
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
          {isLoading ? 'Resetting...' : 'Reset password'}
        </Button>
        
        <div className="text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="size-4" />
            Back to log in
          </Link>
        </div>
      </form>
    </Form>
  );
}

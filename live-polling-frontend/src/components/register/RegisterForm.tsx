import { Button, Input } from "@/components/ui";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRegister } from "./useRegister";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Github,
  Loader2,
  LockKeyhole,
  Mail,
  UserPlus,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisterSchema, type RegisterDto } from "@/validators/auth.validator";
import { ENV } from "@/config/env";

function GoogleIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function RegisterForm(): ReactNode {
  const { isLoading, onSubmit } = useRegister();

  const form = useForm<RegisterDto>({
    resolver: yupResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const apiBase = ENV.API_URL;

  return (
    <div className="w-full max-w-md rounded-2xl bg-white/[0.88] px-8 py-9 backdrop-blur-xl dark:bg-white/[0.045]">      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
          <UserPlus className="size-7 text-primary" />
        </div>

        <h1 className="text-3xl font-black tracking-[-0.035em] text-slate-950 dark:text-white">
          Create an account
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Enter your details below to create your presenter account.
        </p>
      </div>

      <div className="mb-6 grid gap-3">
        <a href={`${apiBase}/auth/google`} className="block">
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full cursor-pointer gap-3 rounded-2xl border-slate-200/80 bg-white/70 font-bold text-slate-700 shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/5 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200 dark:hover:bg-white/[0.08]"
          >
            <GoogleIcon />
            Continue with Google
          </Button>
        </a>

        <a href={`${apiBase}/auth/github`} className="block">
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full cursor-pointer gap-3 rounded-2xl border-slate-200/80 bg-white/70 font-bold text-slate-700 shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/5 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200 dark:hover:bg-white/[0.08]"
          >
            <Github className="size-5" />
            Continue with GitHub
          </Button>
        </a>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200 dark:border-white/10" />
        </div>

        <div className="relative flex justify-center text-xs uppercase tracking-[0.18em]">
          <span className="bg-white/[0.88] px-3 font-bold text-slate-400 dark:bg-transparent dark:text-slate-500">
            or continue with email
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Name
                </FormLabel>

                <FormControl>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                    <Input
                      placeholder="John Doe"
                      className="h-12 rounded-2xl border-slate-200/80 bg-white/70 pl-10 font-medium shadow-none transition-all duration-300 focus-visible:border-primary focus-visible:ring-primary/20 dark:border-white/10 dark:bg-white/[0.055]"
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Password
                </FormLabel>

                <FormControl>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                    <Input
                      type="password"
                      placeholder="••••••••"
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
            className="mt-2 h-12 w-full rounded-2xl bg-[#0598CE] font-black text-white shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0598CE]/80"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            Create account
            {!isLoading ? <ArrowRight className="ml-2 size-4" /> : null}
          </Button>
        </form>
      </Form>

      <div className="mt-6 rounded-2xl bg-slate-50/70 px-4 py-3 text-center text-sm dark:bg-white/[0.04]">
        <span className="text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
        </span>

        <Link
          to="/login"
          className="font-black text-[#0598CE] hover:text-[#33C3FF] transition-colors duration-200 hover:underline"
        >
          Sign in
        </Link>
      </div>

      <div className="mt-5 text-center">
        <Link
          to="/start"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 transition-colors duration-200 hover:text-primary"
        >
          <ArrowLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to start
        </Link>
      </div>
    </div>
  );
}
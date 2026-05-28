import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "./useLogin";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginSchema, LoginDto } from "@/validators/auth.validator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function LoginForm() {
  const { isLoading, onSubmit } = useLogin();

  const form = useForm<LoginDto>({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
      <div className="w-full max-w-md px-8 py-9 rounded-2xl"
        style={{
          background: "oklch(1 0 0 / 0.88)",
          backdropFilter: "blur(16px)",
          border: "1px solid oklch(0.62 0.1 214 / 0.18)",
          boxShadow: "0 2px 32px oklch(0.47 0.09 214 / 0.10)"
        }}>

        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your credentials to access your account
          </p>
        </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="name@example.com" {...field} />
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
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link to="#" className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
            Sign In
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link to="/register" className="font-medium text-blue-600 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}

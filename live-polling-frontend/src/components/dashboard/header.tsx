import {
  BadgeCheckIcon,
  LogOutIcon,
  Moon,
  Search,
  Sun,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useTheme } from '@/lib/useTheme';
import { useLogoutMutation, useGetMeQuery } from '@/api/auth.api';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import authApi from '@/api/auth.api';
import { getInitials } from '@/lib/utils';

export default function DashboardHeader({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}) {
  const { theme, toggleTheme } = useTheme();
  const { data: user } = useGetMeQuery();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await logout().unwrap();
      dispatch(authApi.util.resetApiState());
      toast.success('Successfully signed out!');
      navigate('/start');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to sign out. Please try again.');
    }
  };

  return (
    <header className="relative z-20 px-4 pt-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between rounded-[1.75rem] border border-slate-200/70 bg-white/[0.88] px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-white/70 dark:bg-white/[0.06]">
              <img
                src="/main-logo.png"
                alt="Live Polling System logo"
                className="h-10 w-10 object-contain"
              />
            </div>

            <div className="hidden sm:block">
              <p className="text-base font-black tracking-[-0.02em] text-slate-950 dark:text-white">
                Live Polling System
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Presentation dashboard
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="relative hidden w-72 md:block lg:w-96">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

              <Input
                placeholder="Search presentations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 rounded-2xl border-slate-200/80 bg-slate-50/80 pl-10 text-sm font-medium shadow-none transition-all duration-300 placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-primary/20 dark:border-white/10 dark:bg-white/[0.055] dark:placeholder:text-slate-500"
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="size-11 rounded-2xl bg-slate-50/80 text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/10 hover:text-primary dark:bg-white/[0.055] dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-secondary"
            >
              {theme === 'dark' ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </Button>

           <DropdownMenu>
  <DropdownMenuTrigger>
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-11 rounded-2xl bg-slate-50/80 p-0 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/10 dark:bg-white/[0.055] dark:hover:bg-white/[0.08]"
    >
      <Avatar className="size-9">
        <AvatarImage
          src={user?.avatarUrl || ''}
          alt={user?.displayName || 'User'}
        />
        <AvatarFallback className="bg-primary/10 text-sm font-black text-primary">
          {getInitials(user?.displayName)}
        </AvatarFallback>
      </Avatar>
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent
    align="end"
    className="z-50 mt-2 w-56 rounded-2xl border border-slate-200/70 bg-white/[0.95] p-2 shadow-none backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95"
  >
    <div className="mb-2 rounded-xl bg-slate-50/80 px-3 py-2 dark:bg-white/[0.05]">
      <p className="truncate text-sm font-black text-slate-900 dark:text-white">
        {user?.displayName || 'User'}
      </p>
      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
        Presenter account
      </p>
    </div>

    <DropdownMenuGroup>
      <DropdownMenuItem asChild>
        <Link
          to="/account"
          className="cursor-pointer rounded-xl font-medium text-slate-600 focus:bg-primary/10 focus:text-primary dark:text-slate-300 dark:focus:bg-white/[0.08] dark:focus:text-secondary"
        >
          <BadgeCheckIcon className="size-4" />
          Account
        </Link>
      </DropdownMenuItem>

      <DropdownMenuItem
        onClick={toggleTheme}
        className="cursor-pointer rounded-xl font-medium text-slate-600 focus:bg-primary/10 focus:text-primary dark:text-slate-300 dark:focus:bg-white/[0.08] dark:focus:text-secondary"
      >
        {theme === 'dark' ? (
          <Sun className="size-4" />
        ) : (
          <Moon className="size-4" />
        )}
        {theme === 'dark' ? 'Light mode' : 'Dark mode'}
      </DropdownMenuItem>
    </DropdownMenuGroup>

    <DropdownMenuSeparator className="my-2 bg-slate-200/70 dark:bg-white/10" />

    <DropdownMenuItem
      onClick={handleSignOut}
      disabled={isLoggingOut}
                  className="cursor-pointer rounded-xl font-medium text-slate-600 focus:bg-primary/10 focus:text-primary disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-300 dark:focus:bg-white/[0.08] dark:focus:text-secondary"
                >
                  <LogOutIcon className="size-4" />
                  {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="relative mt-3 block md:hidden">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

          <Input
            placeholder="Search presentations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 rounded-2xl border-slate-200/80 bg-white/[0.88] pl-10 text-sm font-medium shadow-none backdrop-blur-xl transition-all duration-300 placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-primary/20 dark:border-white/10 dark:bg-white/[0.06] dark:placeholder:text-slate-500"
          />
        </div>
      </div>
    </header>
  );
}
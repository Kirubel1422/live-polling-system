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
      // Reset the auth API state to immediately clear cached user profiles/auth state
      dispatch(authApi.util.resetApiState());
      toast.success('Successfully signed out!');
      navigate('/start');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to sign out. Please try again.');
    }
  };

  return (
    <header className="bg-background/95 mt-4 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex size-20 items-center justify-center rounded-xl">
            <img src="/main-logo.png" alt="logo" />
          </div>
          <span className="text-xl text-gray-600 dark:text-neutral-100 font-semibold">
            Live Polling System
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search presentations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-200 rounded-xl border-none py-4 dark:bg-neutral-700 placeholder:text-gray-600 placeholder:text-[13px] dark:placeholder:text-neutral-100"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={user?.avatarUrl || ""} alt={user?.displayName || "User"} />
                  <AvatarFallback className="text-sm bg-primary/10 text-primary dark:hover:!text-black dark:active:!text-black">
                    {getInitials(user?.displayName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50 w-48">
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/account" className="dark:hover:!text-black">
                    <BadgeCheckIcon />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme} className="dark:hover:!text-black">
                  {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
                  {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="dark:hover:!text-black" onClick={handleSignOut} disabled={isLoggingOut}>
                <LogOutIcon />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
